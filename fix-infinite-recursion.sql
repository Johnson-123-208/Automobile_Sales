-- ============================================
-- FIX: Infinite Recursion in RLS Policies
-- Error: 42P17 - infinite recursion detected in policy
-- ============================================

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Create a helper function to check if user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin_user(user_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id::text = user_id 
    AND role = 'admin'
  );
END;
$$;

-- Now create the admin policy using the function (no recursion)
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (is_admin_user(auth.uid()::text));

-- Alternative simpler approach (if function doesn't work):
-- Just allow users to see their own data, and handle admin access in application code
-- DROP POLICY IF EXISTS "Admins can view all users" ON users;
-- CREATE POLICY "Admins can view all users"
--   ON users FOR SELECT
--   USING (true);  -- This allows all authenticated users to see all users
--   -- Note: You'll need to handle admin-only access in your application code

-- Verify the fix
SELECT 
  policyname,
  cmd as operation,
  qual as using_expression
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

