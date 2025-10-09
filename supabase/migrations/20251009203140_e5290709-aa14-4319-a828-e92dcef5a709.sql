-- Enable UPDATE on messages table for users to mark messages as read
CREATE POLICY "Users can update their received messages"
ON messages
FOR UPDATE
TO authenticated
USING (recipient_id = auth.uid())
WITH CHECK (recipient_id = auth.uid());