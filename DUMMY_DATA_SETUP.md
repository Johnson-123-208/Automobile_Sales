# Dummy Data Setup Guide

## Important Notes

⚠️ **Before running dummy data SQL:**

1. **Users must be created via Supabase Auth first** - The SQL script references user IDs that need to exist in Supabase Auth
2. **Replace UUIDs** - You'll need to replace placeholder UUIDs with actual user IDs from your Supabase Auth

## Step-by-Step Setup

### Step 1: Create Users in Supabase Auth

1. Go to Supabase Dashboard → Authentication → Users
2. Create users manually or use the Auth API
3. Note down the User IDs (UUIDs) for each user

**Create these users:**
- 1 Admin: `admin@autosalespro.com`
- 8 Employees:
  - `rajesh.kumar@autosalespro.com`
  - `priya.sharma@autosalespro.com`
  - `amit.patel@autosalespro.com`
  - `sneha.reddy@autosalespro.com`
  - `vikram.singh@autosalespro.com`
  - `anjali.mehta@autosalespro.com`
  - `rohit.verma@autosalespro.com`
  - `kavita.nair@autosalespro.com`

### Step 2: Update User Records in Database

After creating users in Auth, run this SQL to update the users table:

```sql
-- Get the actual user IDs from auth.users and update
UPDATE users 
SET 
  name = 'Admin User',
  role = 'admin',
  experience_years = 10
WHERE email = 'admin@autosalespro.com';

UPDATE users 
SET 
  name = 'Rajesh Kumar',
  role = 'employee',
  experience_years = 5
WHERE email = 'rajesh.kumar@autosalespro.com';

-- Repeat for all other employees...
```

### Step 3: Run Dummy Data Script

1. Open Supabase Dashboard → SQL Editor
2. Copy the contents of `dummy-data.sql`
3. **IMPORTANT**: Replace all UUIDs in the script with actual user IDs from Step 1
4. Execute the script

### Step 4: Verify Data

Run this query to verify all data was inserted:

```sql
SELECT 
  'Users' as table_name, 
  COUNT(*) as record_count 
FROM users
UNION ALL
SELECT 'Vehicle Products', COUNT(*) FROM vehicle_products
UNION ALL
SELECT 'Spare Parts', COUNT(*) FROM spare_parts
UNION ALL
SELECT 'Attendance Records', COUNT(*) FROM attendance
UNION ALL
SELECT 'Sales Records', COUNT(*) FROM sales_records
UNION ALL
SELECT 'Client Interactions', COUNT(*) FROM client_interactions;
```

## Expected Data Counts

- **Users**: 9 (1 admin + 8 employees)
- **Vehicle Products**: 20 (7 cars + 5 bikes + 3 autos + 5 scooties)
- **Spare Parts**: 25+ (engine, brake, electrical, body, suspension parts)
- **Attendance Records**: ~600+ (90 days of attendance for 8 employees)
- **Sales Records**: ~240-400 (30-50 sales per employee over 6 months)
- **Client Interactions**: ~600-800 (75-100 interactions per employee over 3 months)

## Alternative: Automated Setup Script

If you prefer, you can create users programmatically using the Supabase Auth API in your application, then run the dummy data script.

## Troubleshooting

### Error: Foreign key constraint violation
- Make sure all user IDs exist in the users table
- Verify user IDs match between auth.users and users table

### Error: Duplicate key violation
- Clear existing data first (see comments in dummy-data.sql)
- Or modify the script to use INSERT ... ON CONFLICT DO NOTHING

### Missing data in dashboards
- Verify RLS policies allow reading the data
- Check that user roles are set correctly
- Ensure dates are within expected ranges

