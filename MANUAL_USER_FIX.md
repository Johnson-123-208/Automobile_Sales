# Manual Fix: Create User Record

Since the auto-create is failing, let's manually create the user record.

## Step 1: Get Your User ID

Run this in **Supabase SQL Editor**:

```sql
-- Get your user ID from auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'charan.reddy@autosalespro.com';
```

Copy the `id` (UUID) from the result.

## Step 2: Create User Record

Replace `YOUR_USER_ID_HERE` with the ID from Step 1:

```sql
INSERT INTO users (id, email, name, role, experience_years)
VALUES (
  'YOUR_USER_ID_HERE',  -- Replace with actual ID
  'charan.reddy@autosalespro.com',
  'Charan Reddy',
  'employee',  -- or 'admin' if this is an admin user
  0
)
ON CONFLICT (id) DO UPDATE 
SET 
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role;
```

## Step 3: Verify

```sql
SELECT * FROM users WHERE email = 'charan.reddy@autosalespro.com';
```

## Step 4: Try Login Again

After creating the user record, try logging in again. It should work now!

## Alternative: Check All Auth Users

If you want to create records for all auth users:

```sql
-- See all auth users
SELECT id, email, created_at FROM auth.users;

-- Create user records for all auth users that don't exist
INSERT INTO users (id, email, name, role, experience_years)
SELECT 
  au.id,
  au.email,
  SPLIT_PART(au.email, '@', 1) as name,
  'employee' as role,
  0 as experience_years
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.id = au.id
)
ON CONFLICT (id) DO NOTHING;
```

This will automatically create user records for all auth users that don't have a corresponding record in the users table.

