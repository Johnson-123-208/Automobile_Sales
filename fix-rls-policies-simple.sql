-- ============================================
-- SIMPLE FIX: Update RLS Policies for Users Table
-- Run this if you get "policy already exists" error
-- ============================================

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Service role can insert users" ON users;
DROP POLICY IF EXISTS "Allow user creation" ON users;

-- Now create the policies fresh
-- Allow users to view their own data
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

-- Allow admins to view all users (using EXISTS to avoid circular dependency)
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Allow authenticated users to insert their own record
CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

-- Allow users to update their own record
CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Verify policies were created
SELECT 
  policyname,
  cmd as operation,
  CASE 
    WHEN cmd = 'SELECT' THEN '✅ Can read'
    WHEN cmd = 'INSERT' THEN '✅ Can create'
    WHEN cmd = 'UPDATE' THEN '✅ Can update'
    ELSE cmd
  END as permission
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;