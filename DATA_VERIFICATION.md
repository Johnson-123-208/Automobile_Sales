# Data Verification Guide

## Expected Record Counts

Based on the dummy data script, here are the expected counts for each table:

### 1. **Users Table**
- **Expected:** 9-20 records (1 admin + 8-19 employees)
- **3619?** ❌ No - too high

### 2. **Vehicle Products**
- **Expected:** 40+ records
- **3619?** ❌ No - too high

### 3. **Spare Parts**
- **Expected:** 50+ records
- **3619?** ❌ No - too high

### 4. **Attendance Records** ⚠️ **MOST LIKELY**
- **Expected:** ~800-1200 records
  - 8 employees × 120 days × ~85% attendance = ~816 records
  - But if script ran multiple times or more employees exist, could be higher
- **3619?** ✅ **Possible** - if:
  - Script ran multiple times
  - More than 8 employees exist
  - Higher attendance rate than expected

### 5. **Sales Records**
- **Expected:** 400-560 records
  - 8 employees × (40-70 sales each) = 320-560 records
- **3619?** ❌ No - too high (unless script ran multiple times)

### 6. **Client Interactions** ⚠️ **POSSIBLE**
- **Expected:** 800-960 records
  - 8 employees × (80-120 interactions each) = 640-960 records
- **3619?** ✅ **Possible** - if:
  - Script ran multiple times
  - More employees than expected
  - Loop generated more interactions than calculated

## How to Identify Which Table

Run these queries in Supabase SQL Editor to identify the table:

```sql
-- Check Attendance Records
SELECT 'Attendance Records' as table_name, COUNT(*) as count FROM attendance;

-- Check Client Interactions
SELECT 'Client Interactions' as table_name, COUNT(*) as count FROM client_interactions;

-- Check Sales Records
SELECT 'Sales Records' as table_name, COUNT(*) as count FROM sales_records;

-- Check All Tables at Once
SELECT 'Users' as table_name, COUNT(*) as count FROM users
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

## If Count is Too High

If you see 3619 records and it's more than expected:

1. **Check if script ran multiple times:**
   ```sql
   -- Check for duplicate dates in attendance
   SELECT date, COUNT(*) as records_per_date 
   FROM attendance 
   GROUP BY date 
   ORDER BY records_per_date DESC 
   LIMIT 10;
   ```

2. **Check number of employees:**
   ```sql
   SELECT COUNT(*) as total_employees FROM users WHERE role = 'employee';
   ```

3. **If duplicates exist, clean them:**
   ```sql
   -- Example: Remove duplicate attendance records (keep latest)
   DELETE FROM attendance a1
   USING attendance a2
   WHERE a1.id < a2.id
   AND a1.user_id = a2.user_id
   AND a1.date = a2.date;
   ```

## Normal Ranges

| Table | Expected Range | Your Count | Status |
|-------|---------------|------------|--------|
| Users | 9-20 | ? | ✅ |
| Vehicle Products | 40-50 | ? | ✅ |
| Spare Parts | 50-60 | ? | ✅ |
| Attendance | 800-1200 | 3619? | ⚠️ Check |
| Sales Records | 400-560 | ? | ✅ |
| Client Interactions | 800-960 | 3619? | ⚠️ Check |

## Most Likely: Attendance or Client Interactions

Based on the count of **3619**, this is most likely:
- **Attendance Records** (if script ran 3-4 times, or more employees exist)
- **Client Interactions** (if script ran multiple times)

Both tables use `ON CONFLICT DO NOTHING`, so duplicates shouldn't occur unless:
- Script was run multiple times with different date ranges
- More employees were added after initial run
- The loop generated more records than calculated

## Recommendation

Run the "Check All Tables" query above to see the exact count for each table and identify which one has 3619 records.

