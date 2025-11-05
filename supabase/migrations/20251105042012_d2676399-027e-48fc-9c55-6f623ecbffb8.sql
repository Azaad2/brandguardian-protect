-- Temporarily disable triggers that use net.http_post (causing 400 errors)
-- These triggers can be re-enabled once the pg_net extension is installed

-- Drop trigger that sends notifications when brands are allocated to resellers
DROP TRIGGER IF EXISTS notify_reseller_on_brand_allocation_trigger ON brand_reseller_allocations;

-- Drop trigger that sends notifications when brands reply to resellers
DROP TRIGGER IF EXISTS notify_reseller_on_brand_reply_trigger ON messages;

-- Drop trigger that sends notifications when application status changes
DROP TRIGGER IF EXISTS notify_reseller_on_application_status_change_trigger ON brand_applications;

-- Note: The trigger functions themselves are kept in case you want to re-enable them later
-- To re-enable after installing pg_net extension, run:
-- CREATE TRIGGER notify_reseller_on_brand_allocation_trigger
--   AFTER INSERT ON brand_reseller_allocations
--   FOR EACH ROW EXECUTE FUNCTION notify_reseller_on_brand_allocation();
-- 
-- CREATE TRIGGER notify_reseller_on_brand_reply_trigger
--   AFTER INSERT ON messages
--   FOR EACH ROW EXECUTE FUNCTION notify_reseller_on_brand_reply();
-- 
-- CREATE TRIGGER notify_reseller_on_application_status_change_trigger
--   AFTER UPDATE ON brand_applications
--   FOR EACH ROW EXECUTE FUNCTION notify_reseller_on_application_status_change();