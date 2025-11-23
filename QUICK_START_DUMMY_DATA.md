# Quick Start: Load Dummy Data

## ✅ You've Created Users - Now Load Data!

Since you've already created users in Supabase Auth, follow these simple steps:

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Production Data Script
1. Open the file: `dummy-data-production.sql`
2. Copy **ALL** the contents
3. Paste into Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Wait for Completion
The script will:
- ✅ Update user names and roles automatically
- ✅ Insert 40+ vehicles (cars, bikes, autos, scooties)
- ✅ Insert 50+ spare parts
- ✅ Generate 120 days of attendance records
- ✅ Generate 8 months of sales records
- ✅ Generate 4 months of client interactions

**Expected time**: 30-60 seconds

### Step 4: Verify Data
After running, scroll to the bottom of the results. You should see:
- Verification queries showing counts
- Revenue summaries
- Employee performance data

## 📊 What You'll Get

### Vehicles (40+ models)
- **15 Cars**: Swift, i20, Nexon, XUV700, City, Innova, etc.
- **12 Bikes**: Splendor, Shine, Pulsar, MT-15, Classic 350, etc.
- **5 Autos**: RE Compact, Ape Xtra, Alfa Plus, etc.
- **8 Scooties**: Activa, Jupiter, Access 125, Fascino, etc.

**Price Range**: ₹68,000 - ₹25,00,000 (all in INR)

### Spare Parts (50+ items)
- **10 Engine Parts**: Filters, spark plugs, pumps, belts
- **10 Brake Parts**: Pads, discs, shoes, fluid, cylinders
- **10 Electrical Parts**: Batteries, bulbs, alternators, starters
- **10 Body Parts**: Bumpers, mirrors, windshields, handles
- **10 Suspension Parts**: Shock absorbers, springs, struts

**Price Range**: ₹250 - ₹12,000 (all in INR)
**Stock**: 12-200 units per item

### Attendance (~800+ records)
- **120 days** per employee
- **~82% attendance rate**
- Multiple cities (Hyderabad, Mumbai, Delhi, etc.)
- Realistic login/logout times
- Calculated total hours

### Sales Records (~400-560 records)
- **50-70 sales per employee**
- **8 months** of history
- **65% vehicles, 35% spare parts**
- Realistic profit margins
- Client contact numbers

### Client Interactions (~800-960 records)
- **80-120 interactions per employee**
- **4 months** of history
- Status: 45% contacted, 35% accepted, 20% rejected
- Visit counts for accepted clients

## 🎯 Expected Dashboard Stats

After loading, your dashboards will show:

**Admin Dashboard:**
- Total Employees: 8+
- Total Sales: 400-560
- Total Revenue: ₹1-2 Crores
- Total Vehicles: 40+
- Total Spare Parts: 50+

**Per Employee:**
- Monthly Sales: ₹3-20 Lakhs
- Weekly Sales: ₹75K-4 Lakhs
- Client Visits: 80-120
- Acceptance Rate: 50-60%

## ⚠️ Important Notes

1. **All prices are in INR** (Indian Rupees) ✅
2. **Script finds your users automatically** - no manual UUID replacement needed
3. **Uses ON CONFLICT DO NOTHING** - safe to run multiple times
4. **Dates are relative** - based on current date
5. **Images use Unsplash** - placeholder URLs

## 🔧 Troubleshooting

### Error: "relation does not exist"
- Make sure you ran `database-schema.sql` first
- Check that all tables are created

### Error: "foreign key constraint"
- Verify users exist in the `users` table
- Check that user IDs match between auth.users and users table

### No data inserted
- Check RLS policies are set correctly
- Verify you're running as a user with proper permissions
- Check the verification queries at the end

### Want to start fresh?
Run this first (WARNING: Deletes all data):
```sql
TRUNCATE TABLE sales_records CASCADE;
TRUNCATE TABLE client_interactions CASCADE;
TRUNCATE TABLE attendance CASCADE;
TRUNCATE TABLE spare_parts CASCADE;
TRUNCATE TABLE vehicle_products CASCADE;
```

## ✅ Success Indicators

After running, you should see:
- ✅ All verification queries return counts > 0
- ✅ Revenue summary shows total revenue in crores
- ✅ Employee performance shows data for all employees
- ✅ Sample queries return actual records

## 🚀 Next Steps

1. Test your admin dashboard - should show all stats
2. Test employee dashboards - should show personal KPIs
3. Test public pages - should show vehicles and spare parts
4. Test filters and search - should work with the data

Your platform is now production-ready with comprehensive data! 🎉

