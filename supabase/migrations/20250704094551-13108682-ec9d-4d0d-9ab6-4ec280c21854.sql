
-- Update subscribers table to support Razorpay
ALTER TABLE public.subscribers 
ADD COLUMN razorpay_customer_id TEXT,
ADD COLUMN razorpay_subscription_id TEXT,
ADD COLUMN razorpay_plan_id TEXT;

-- Update the stripe_customer_id column to be more generic (optional)
-- We'll keep both for migration purposes
ALTER TABLE public.subscribers 
ALTER COLUMN stripe_customer_id DROP NOT NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_razorpay_customer_id ON public.subscribers(razorpay_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_razorpay_subscription_id ON public.subscribers(razorpay_subscription_id);
