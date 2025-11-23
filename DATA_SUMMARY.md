# Dummy Data Summary

## 📊 Data Overview

This dummy data script will populate your database with production-ready sample data for testing and development.

## 📦 Data Breakdown

### 1. **Users** (9 total)
- **1 Admin**: admin@autosalespro.com
- **8 Employees**: Various names with different experience levels (1-8 years)

### 2. **Vehicle Products** (20 total)
- **7 Cars**: Swift, i20, Nexon, XUV700, City, Innova Crysta, Baleno
- **6 Bikes**: Splendor Plus, Shine, Pulsar 150, MT-15, Classic 350, Apache RTR 160
- **3 Autos**: RE Compact, Ape Xtra, Alfa Plus
- **5 Scooties**: Activa 6G, Jupiter, Access 125, Fascino 125, Pleasure Plus

**Price Range**: ₹68,000 - ₹25,00,000

### 3. **Spare Parts** (30+ total)
- **Engine Parts**: Oil filters, air filters, spark plugs, timing belts, fuel pumps (6 items)
- **Brake Parts**: Brake pads, discs, shoes, fluid, master cylinders (6 items)
- **Electrical Parts**: Batteries, bulbs, lights, alternators, starters, fuse boxes (6 items)
- **Body Parts**: Bumpers, mirrors, windshields, door handles (6 items)
- **Suspension Parts**: Shock absorbers, coil springs, struts (4 items)

**Price Range**: ₹250 - ₹8,500
**Stock Levels**: 15-200 units per item

### 4. **Attendance Records** (~600+ records)
- **90 days** of attendance data for each employee
- **~85% attendance rate** (skips weekends and some random days)
- **Login times**: 8 AM - 10 AM
- **Logout times**: 5 PM - 7 PM
- **Total hours**: 8-9 hours per day
- **Location**: Hyderabad area (with coordinates)

### 5. **Sales Records** (~280-360 records)
- **25-45 sales per employee** over last 6 months
- **70% vehicle sales**, **30% spare parts**
- **Profit margins**: 
  - Vehicles: 5-15%
  - Spare Parts: 15-35%
- **Total revenue**: Varies by employee performance
- **Client contacts**: Random Indian phone numbers

### 6. **Client Interactions** (~600-720 records)
- **60-90 interactions per employee** over last 3 months
- **Status distribution**:
  - 50% Contacted
  - 30% Accepted
  - 20% Rejected
- **Visit counts**: 
  - Contacted: 1 visit
  - Accepted: 2-5 visits
  - Rejected: 1 visit

## 🎯 Use Cases

This data is perfect for:
- ✅ Testing admin dashboards with real-looking statistics
- ✅ Demonstrating employee performance metrics
- ✅ Testing analytics and charts
- ✅ Showing attendance tracking functionality
- ✅ Testing product catalog filters and search
- ✅ Demonstrating sales tracking and reporting
- ✅ Testing client interaction workflows

## 📈 Expected Dashboard Metrics

After loading the data, you should see:

**Admin Dashboard:**
- Total Employees: 8
- Total Sales: ~280-360
- Total Revenue: ₹50-80 Lakhs (varies)
- Total Vehicles: 20
- Total Spare Parts: 30+

**Employee Dashboard (per employee):**
- Monthly Sales: ₹2-15 Lakhs
- Weekly Sales: ₹50K-3 Lakhs
- Client Visits: 60-90
- Clients Contacted: 30-45
- Clients Accepted: 18-27
- Acceptance Rate: 50-60%

## 🔧 Quick Setup

1. Create users in Supabase Auth
2. Run `dummy-data-simple.sql` in Supabase SQL Editor
3. Verify data with the verification queries at the end of the script

## 📝 Notes

- All dates are relative to current date
- Prices are in Indian Rupees (INR)
- Location data uses Hyderabad coordinates
- Phone numbers are randomly generated
- Images use Unsplash placeholder URLs

