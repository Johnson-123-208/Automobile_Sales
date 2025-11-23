# Fix: "Failed to fetch user data" Error

## Problem
The error occurs when:
1. User successfully authenticates with Supabase Auth ✅
2. But the user record doesn't exist in the `users` table ❌

## Root Cause
When a user is created in Supabase Auth, they need a corresponding record in the `users` table. If the record doesn't exist, the login fails with "Failed to fetch user data".

## Solutions

### Solution 1: Auto-Create User Record (Implemented)
I've updated `lib/auth.ts` to automatically create a user record if it doesn't exist during login. This should fix the issue for most cases.

### Solution 2: Ensure User Exists in Database

**Option A: Create user via SQL**
Run this in Supabase SQL Editor:

```sql
-- Replace with your actual user ID from auth.users
INSERT INTO users (id, email, password_hash, name, role, experience_years)
VALUES (
  'your-user-id-from-auth-users',
  'charan.reddy@autosalespro.com',
  'hashed_password_here',
  'Charan Reddy',
  'employee',
  0
)
ON CONFLICT (id) DO NOTHING;
```

**Option B: Update via Dummy Data Script**
If you ran the dummy data script, it should have created user records. Check if your user email exists:

```sql
SELECT * FROM users WHERE email = 'charan.reddy@autosalespro.com';
```

### Solution 3: Check RLS Policies

The Row Level Security (RLS) policies might be blocking the query. Verify:

1. **Check if INSERT policy exists:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'users' AND policyname LIKE '%insert%';
```

2. **If missing, add INSERT policy:**
```sql
CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);
```

3. **Or allow service role to insert (for admin operations):**
```sql
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  WITH CHECK (true);
```

## Quick Fix Steps

1. **Check if user exists:**
   ```sql
   SELECT * FROM users WHERE email = 'charan.reddy@autosalespro.com';
   ```

2. **If not exists, create it:**
   ```sql
   -- Get user ID from auth.users first
   SELECT id, email FROM auth.users WHERE email = 'charan.reddy@autosalespro.com';
   
   -- Then insert into users table
   INSERT INTO users (id, email, password_hash, name, role)
   VALUES (
     'user-id-from-above',
     'charan.reddy@autosalespro.com',
     'temp_hash',
     'Charan Reddy',
     'employee'
   );
   ```

3. **Or use the auto-create feature** (already implemented in code)

## Testing

After fixing, try logging in again. The updated code will:
- ✅ Try to fetch user from `users` table
- ✅ If not found, automatically create the record
- ✅ Return helpful error messages if creation fails

## Common Issues

1. **RLS blocking insert:** Add INSERT policy (see Solution 3)
2. **User ID mismatch:** Ensure auth.users ID matches users table ID
3. **Missing password_hash:** The table requires it, but we can use a placeholder for Supabase Auth users

## Next Steps

1. Try logging in again - auto-create should work
2. If still failing, check browser console for detailed error
3. Verify RLS policies allow INSERT operations
4. Check Supabase logs for more details

