# Fix: 500 Errors from Supabase API

## Problem
Console shows 500 errors when trying to fetch user data:
- `Failed to load resource: the server responded with a status of 500`
- Errors on `/v1/users?select=*` endpoint

## Root Cause
The RLS (Row Level Security) policies on the `users` table are likely blocking the queries. The existing policies might have circular dependencies or incorrect conditions.

## Solution

### Step 1: Fix RLS Policies

Run this SQL in **Supabase SQL Editor**:

```sql
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Create improved SELECT policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Add INSERT policy (if missing)
CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);
```

**File:** `craft-haven/fix-rls-policies.sql` (ready to run)

### Step 2: Verify User ID Match

Ensure the user ID in `auth.users` matches the ID in `users` table:

```sql
-- Check for mismatches
SELECT 
  au.id as auth_id,
  au.email as auth_email,
  u.id as user_table_id,
  u.email as user_table_email,
  CASE 
    WHEN au.id = u.id THEN '✅ Match'
    ELSE '❌ Mismatch - FIX THIS'
  END as status
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE au.email = 'charan.reddy@autosalespro.com';
```

If there's a mismatch, update the `users` table:

```sql
-- Get correct ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'charan.reddy@autosalespro.com';

-- Update users table with correct ID (replace OLD_ID and NEW_ID)
UPDATE users 
SET id = 'NEW_ID_FROM_AUTH_USERS'
WHERE email = 'charan.reddy@autosalespro.com';
```

### Step 3: Test Again

After fixing the policies:
1. Clear browser cache
2. Try logging in again
3. Check console - 500 errors should be gone

## Alternative: Temporarily Disable RLS (Testing Only)

⚠️ **Only for testing - NOT for production!**

```sql
-- Temporarily disable RLS to test
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Test login

-- Re-enable RLS after testing
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

## Common Issues

1. **Circular dependency in policies** - Fixed by using EXISTS subquery
2. **User ID mismatch** - IDs in auth.users don't match users table
3. **Missing INSERT policy** - Blocks auto-creation of user records

## Expected Result

After fixing:
- ✅ No 500 errors in console
- ✅ User data loads successfully
- ✅ Login works properly
- ✅ User can access dashboard

Try the fix and let me know if the errors persist!

