-- Add RLS policies for tables that have RLS enabled but no policies

-- Add policies for the orders table
CREATE POLICY "Users can view their own orders"
ON orders
FOR SELECT
USING (reseller_id = auth.uid() OR brand_id = auth.uid());

CREATE POLICY "Users can create orders"
ON orders
FOR INSERT
WITH CHECK (reseller_id = auth.uid());

-- Add policies for the order_items table
CREATE POLICY "Users can view order items for their orders"
ON order_items
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.id = order_items.order_id 
  AND (orders.reseller_id = auth.uid() OR orders.brand_id = auth.uid())
));

CREATE POLICY "Users can create order items for their orders"
ON order_items
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.id = order_items.order_id 
  AND orders.reseller_id = auth.uid()
));

-- Add policies for the messages table
CREATE POLICY "Users can view their own messages"
ON messages
FOR SELECT
USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
ON messages
FOR INSERT
WITH CHECK (sender_id = auth.uid());

-- Add policies for the products table
CREATE POLICY "Users can view active products"
ON products
FOR SELECT
USING (approval_status = 'approved');

CREATE POLICY "Brands can manage their own products"
ON products
FOR ALL
USING (brand_id = auth.uid())
WITH CHECK (brand_id = auth.uid());