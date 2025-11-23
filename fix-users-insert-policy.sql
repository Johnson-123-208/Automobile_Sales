-- ============================================
-- FIX: Add INSERT Policy for Users Table
-- This allows users to be created during login
-- ============================================

-- Allow authenticated users to insert their own record
CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

-- Also allow service role to insert (for admin operations)
-- This is useful if you need to create users via admin panel
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- If the above policies conflict, you can use this single policy instead:
-- DROP POLICY IF EXISTS "Users can insert their own data" ON users;
-- DROP POLICY IF EXISTS "Service role can insert users" ON users;
-- 
-- CREATE POLICY "Allow user creation"
--   ON users FOR INSERT
--   WITH CHECK (auth.uid()::text = id::text OR auth.role() = 'service_role');

