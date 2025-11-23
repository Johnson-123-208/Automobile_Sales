-- ============================================
-- SIMPLE FIX: Remove Infinite Recursion
-- This uses a simpler approach without functions
-- ============================================

-- Drop the problematic admin policy
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Option 1: Allow all authenticated users to view all users
-- (You'll handle admin-only access in your application code)
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (true);

-- Option 2: If you want to restrict, use a metadata check
-- (This requires storing role in auth.users metadata)
-- DROP POLICY IF EXISTS "Admins can view all users" ON users;
-- CREATE POLICY "Admins can view all users"
--   ON users FOR SELECT
--   USING (
--     (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
--   );

-- Verify policies
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN qual LIKE '%true%' THEN '✅ Allows all (handle in app)'
    ELSE qual
  END as policy_condition
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

