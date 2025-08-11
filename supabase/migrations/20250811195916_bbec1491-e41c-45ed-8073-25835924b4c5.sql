-- CRITICAL SECURITY FIX: Strengthen RLS policies for subscribers table
-- This fixes the vulnerability where customer emails and payment data could be accessed inappropriately

-- 1. Drop all existing insecure policies
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;

-- 2. Create secure SELECT policy - users can only see their own subscription data
CREATE POLICY "Users can view their own subscription" 
  ON public.subscribers 
  FOR SELECT 
  USING (
    -- User can see their own subscription by user_id or email
    (user_id = auth.uid()) 
    OR 
    (email = auth.email())
    OR
    -- Admins can view all subscriptions
    public.is_admin()
  );

-- 3. Create secure INSERT policy - strict validation for new subscriptions
CREATE POLICY "Secure subscription creation" 
  ON public.subscribers 
  FOR INSERT 
  WITH CHECK (
    -- For authenticated users: must set their own user_id and email
    (
      auth.uid() IS NOT NULL 
      AND user_id = auth.uid() 
      AND email = auth.email()
    )
    OR
    -- For service operations: allow admin-created subscriptions
    public.is_admin()
    OR
    -- For edge functions: allow service role to create subscriptions
    (current_setting('role') = 'service_role')
  );

-- 4. Create secure UPDATE policy - users can only update their own data
CREATE POLICY "Users can update their own subscription" 
  ON public.subscribers 
  FOR UPDATE 
  USING (
    -- User can update their own subscription
    (user_id = auth.uid()) 
    OR 
    (email = auth.email())
    OR
    -- Admins can update any subscription
    public.is_admin()
  )
  WITH CHECK (
    -- Prevent users from changing user_id or email to other users' data
    (
      user_id = auth.uid() 
      AND email = auth.email()
    )
    OR
    -- Allow admins to make any changes
    public.is_admin()
  );

-- 5. Create secure DELETE policy - only admins can delete subscriptions
CREATE POLICY "Admins can delete subscriptions" 
  ON public.subscribers 
  FOR DELETE 
  USING (public.is_admin());

-- 6. Add data integrity constraints to prevent data manipulation
ALTER TABLE public.subscribers 
DROP CONSTRAINT IF EXISTS check_email_format_subscribers;

ALTER TABLE public.subscribers 
ADD CONSTRAINT check_email_format_subscribers 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- 7. Add constraint to ensure user_id consistency for authenticated users
ALTER TABLE public.subscribers 
DROP CONSTRAINT IF EXISTS check_user_email_consistency;

ALTER TABLE public.subscribers 
ADD CONSTRAINT check_user_email_consistency 
CHECK (
  -- Either both user_id and email are set (authenticated user)
  (user_id IS NOT NULL AND email IS NOT NULL)
  OR
  -- Or only email is set (guest subscription)
  (user_id IS NULL AND email IS NOT NULL)
);

-- 8. Create audit function for subscription access monitoring
CREATE OR REPLACE FUNCTION public.audit_subscription_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log subscription access attempts for security monitoring
  RAISE LOG 'Subscription accessed: % by user: % (email: %)', 
    COALESCE(NEW.id, OLD.id), 
    COALESCE(auth.uid(), 'anonymous'),
    COALESCE(auth.email(), 'no-email');
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger
DROP TRIGGER IF EXISTS audit_subscribers ON public.subscribers;
CREATE TRIGGER audit_subscribers
  AFTER INSERT OR UPDATE OR DELETE ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION public.audit_subscription_access();