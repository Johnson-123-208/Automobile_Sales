# JEN Automobiles - Automobile Sales & Spare Parts Platform

A modern, full-stack Next.js application for managing automobile sales, spare parts inventory, employee attendance, sales tracking, and analytics.

## 🚗 Features

### Admin Features
- **Dashboard**: Overview of sales, employees, and performance metrics
- **Employee Management**: View all employees with detailed stats (attendance, sales, profit)
- **Product Management**: Add, edit, and delete vehicles and spare parts
- **Analytics**: Comprehensive charts and graphs for sales trends, revenue breakdown, top-selling products, and employee performance

### Employee Features
- **Dashboard**: Personal KPIs, sales goals, and performance tracking
- **Attendance System**: Daily login/logout with geolocation tracking
- **Product Catalog**: Manage vehicles and spare parts inventory
- **Sales Tracking**: View personal sales records and statistics

### Public Features
- **Automobiles Page**: Browse vehicles with search and filters (price, brand, type, engine)
- **Spare Parts Page**: Browse spare parts with filters (price, vehicle type, compatibility)
- **Favorites**: Save favorite vehicles and spare parts for quick access

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Johnson-123-208/Automobile_Sales.git
cd Automobile_Sales
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run `database-schema.sql` to create all tables
4. Run `dummy-data-production.sql` to populate with sample data (optional)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Automobile_Sales/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages (dashboard, employees, products, analytics)
│   ├── employee/          # Employee pages (dashboard, attendance, products)
│   ├── automobiles/       # Public vehicles page
│   ├── spare-parts/       # Public spare parts page
│   ├── favorites/         # User favorites page
│   └── login/             # Authentication page
├── components/            # React components
├── lib/                   # Utility functions
│   ├── supabaseClient.ts  # Supabase client configuration
│   ├── auth.ts            # Authentication utilities
│   ├── favorites.ts       # Favorites management
│   └── imageUtils.ts     # Image URL generation
├── database-schema.sql    # Database schema
└── dummy-data-production.sql # Sample data
```

## 🔐 Default Credentials

After running the dummy data script:

- **Admin**: 
  - Email: `admin@test.com`
  - Password: (set in Supabase Auth)

- **Employee**: 
  - Email: `rajesh.reddy@autosalespro.com` (or any employee email from dummy data)
  - Password: (set in Supabase Auth)

## 📊 Database Tables

- `users` - User accounts (admin/employee)
- `attendance` - Employee attendance records
- `vehicle_products` - Vehicle inventory
- `spare_parts` - Spare parts inventory
- `sales_records` - Sales transactions
- `client_interactions` - Client visit tracking
- `favorites` - User favorite products

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Set **Root Directory** to `.` (root)
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions.

## 📝 Documentation

- `VERCEL_DEPLOYMENT_GUIDE.md` - Complete Vercel deployment guide
- `QUICK_DEPLOY.md` - Quick deployment steps
- `DUMMY_DATA_SETUP.md` - How to set up sample data
- `database-schema.sql` - Database schema with RLS policies

## 🎨 Features Highlights

- ✅ Role-based authentication (Admin/Employee)
- ✅ Real-time attendance tracking with geolocation
- ✅ Comprehensive analytics dashboard
- ✅ Product catalog management
- ✅ Sales tracking and reporting
- ✅ Favorites system
- ✅ Responsive design
- ✅ Modern UI with smooth animations

## 📄 License

MIT License

## 👤 Author

Johnson-123-208

---

**Built with ❤️ using Next.js and Supabase**
