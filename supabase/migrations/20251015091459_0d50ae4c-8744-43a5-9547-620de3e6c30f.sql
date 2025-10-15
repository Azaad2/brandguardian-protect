-- Step 1: Update profiles status constraint and add index
UPDATE profiles 
SET status = 'active' 
WHERE status IS NULL;

ALTER TABLE profiles 
ALTER COLUMN status SET DEFAULT 'active';

ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_status_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_status_check 
CHECK (status IN ('active', 'suspended', 'deleted', 'email_only'));

CREATE INDEX IF NOT EXISTS idx_profiles_status 
ON profiles(status) 
WHERE status = 'email_only';

-- Step 2: Create function to generate deterministic UUID from email
CREATE OR REPLACE FUNCTION generate_uuid_from_email(email_address TEXT)
RETURNS UUID
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  email_hash TEXT;
BEGIN
  email_hash := md5(lower(trim(email_address)));
  
  RETURN (
    substring(email_hash from 1 for 8) || '-' ||
    substring(email_hash from 9 for 4) || '-' ||
    '5' || substring(email_hash from 14 for 3) || '-' ||
    substring(email_hash from 17 for 4) || '-' ||
    substring(email_hash from 21 for 12)
  )::UUID;
END;
$$;

GRANT EXECUTE ON FUNCTION generate_uuid_from_email TO authenticated;
GRANT EXECUTE ON FUNCTION generate_uuid_from_email TO anon;
GRANT EXECUTE ON FUNCTION generate_uuid_from_email TO service_role;

-- Step 3: Create function to get or create email-only profile
CREATE OR REPLACE FUNCTION get_or_create_email_only_profile(
  p_email TEXT,
  p_full_name TEXT DEFAULT NULL,
  p_company_name TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_existing_profile_id UUID;
BEGIN
  v_user_id := generate_uuid_from_email(p_email);
  
  SELECT id INTO v_existing_profile_id
  FROM profiles
  WHERE id = v_user_id;
  
  IF v_existing_profile_id IS NOT NULL THEN
    RETURN v_existing_profile_id;
  END IF;
  
  INSERT INTO profiles (
    id,
    email,
    full_name,
    company_name,
    user_role,
    status,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    p_email,
    COALESCE(p_full_name, split_part(p_email, '@', 1)),
    p_company_name,
    'brand',
    'email_only',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN v_user_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating email-only profile for %: %', p_email, SQLERRM;
    RETURN NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION get_or_create_email_only_profile TO authenticated;
GRANT EXECUTE ON FUNCTION get_or_create_email_only_profile TO service_role;

-- Step 4: Update RLS policies for messages table
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update their received messages" ON messages;

CREATE POLICY "Users can view their own messages"
ON messages
FOR SELECT
TO authenticated
USING (
  sender_id = auth.uid() 
  OR recipient_id = auth.uid()
);

CREATE POLICY "Users can send messages"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
);

CREATE POLICY "Users can update their received messages"
ON messages
FOR UPDATE
TO authenticated
USING (recipient_id = auth.uid())
WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "Service role can manage messages"
ON messages
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);