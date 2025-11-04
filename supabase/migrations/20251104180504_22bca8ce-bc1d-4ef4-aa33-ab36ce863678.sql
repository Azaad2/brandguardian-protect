-- Enable realtime for brand_reseller_allocations table
ALTER TABLE brand_reseller_allocations REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE brand_reseller_allocations;