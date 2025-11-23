# Debug: User Creation Error

## Error
Console shows: `User creation error: {}` - Empty error object

## Possible Causes

### 1. Missing INSERT Policy (Most Likely)
The `users` table needs an INSERT policy to allow creating user records.

**Fix:** Run this in Supabase SQL Editor:

```sql
-- Check if INSERT policy exists
SELECT * FROM pg_policies WHERE tablename = 'users' AND policyname LIKE '%insert%';

-- If no results, add the policy:
CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);
```

### 2. RLS Blocking the Insert
Row Level Security might be blocking the operation.

**Check RLS:**
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'users';

-- Check all policies
SELECT * FROM pg_policies WHERE tablename = 'users';
```

### 3. Column Mismatch
The INSERT might be failing due to missing required columns.

**Check table structure:**
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

### 4. User Already Exists
The user might already exist, causing a conflict.

**Check:**
```sql
SELECT * FROM users WHERE email = 'charan.reddy@autosalespro.com';
```

## Quick Fix Steps

1. **Add INSERT Policy:**
   ```sql
   CREATE POLICY "Users can insert their own data"
     ON users FOR INSERT
     WITH CHECK (auth.uid()::text = id::text);
   ```

2. **Verify User Doesn't Exist:**
   ```sql
   -- Get user ID from auth.users
   SELECT id, email FROM auth.users WHERE email = 'charan.reddy@autosalespro.com';
   
   -- Check if exists in users table
   SELECT * FROM users WHERE id = 'user-id-from-above';
   ```

3. **Manually Create User (if needed):**
   ```sql
   INSERT INTO users (id, email, name, role, experience_years)
   VALUES (
     'user-id-from-auth-users',
     'charan.reddy@autosalespro.com',
     'Charan Reddy',
     'employee',
     0
   )
   ON CONFLICT (id) DO NOTHING;
   ```

## Enhanced Error Logging

I've updated the code to log more detailed error information. Check the browser console for:
- `errorCode` - Supabase error code
- `errorMessage` - Error message
- `errorDetails` - Additional details
- `errorHint` - Helpful hints
- `userId` and `userEmail` - For debugging

This will help identify the exact issue.

