
-- Allow inbound email replies to be saved when the sender is a brand UUID (not an auth user)
ALTER TABLE public.messages
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
