# 🔧 Quick Fix: "Failed to fetch user data" Error

## The Problem
Your user `charan.reddy@autosalespro.com` exists in Supabase Auth but **not in the `users` table**. The login code tries to fetch user details from the `users` table, but the record doesn't exist.

## ✅ Solution 1: Add Missing INSERT Policy (Recommended)

The `users` table is missing an INSERT policy, which prevents creating user records. Run this in **Supabase SQL Editor**:

```sql
-- Add INSERT policy for users table
CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);
```

**File:** `craft-haven/fix-users-insert-policy.sql` (ready to run)

## ✅ Solution 2: Manually Create User Record

Run this in **Supabase SQL Editor**:

```sql
-- Step 1: Get your user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'charan.reddy@autosalespro.com';

-- Step 2: Insert into users table (replace 'YOUR_USER_ID' with the ID from step 1)
INSERT INTO users (id, email, password_hash, name, role, experience_years)
VALUES (
  'YOUR_USER_ID',  -- Replace with actual ID from step 1
  'charan.reddy@autosalespro.com',
  'temp_hash_placeholder',  -- Not used with Supabase Auth
  'Charan Reddy',
  'employee',
  0
)
ON CONFLICT (id) DO NOTHING;
```

## ✅ Solution 3: Auto-Create Feature (Already Implemented)

I've updated the code to **automatically create** the user record if it doesn't exist. However, this will only work if the INSERT policy is added (Solution 1).

## 🚀 Quick Steps

1. **Open Supabase Dashboard** → SQL Editor
2. **Run the INSERT policy SQL** (from Solution 1)
3. **Try logging in again** - it should work now!

## 🔍 Verify It Works

After adding the policy, check:

```sql
-- Check if user exists
SELECT * FROM users WHERE email = 'charan.reddy@autosalespro.com';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'users';
```

## 📝 What I Changed

1. ✅ Updated `lib/auth.ts` to auto-create user records if missing
2. ✅ Added better error messages
3. ✅ Created SQL script to add missing INSERT policy

## ⚠️ Important

- The INSERT policy is **required** for the auto-create feature to work
- Without it, you'll need to manually create user records
- After adding the policy, the login should work automatically

Try Solution 1 first - it's the quickest fix! 🎯

