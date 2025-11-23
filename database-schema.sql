-- ============================================
-- AUTOMOBILE SALES & SPARE PARTS PLATFORM
-- Database Schema for Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'employee')) DEFAULT 'employee',
  experience_years NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text OR (SELECT role FROM users WHERE id::text = auth.uid()::text) = 'admin');

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING ((SELECT role FROM users WHERE id::text = auth.uid()::text) = 'admin');

-- ============================================
-- 2. ATTENDANCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  login_time TIMESTAMPTZ,
  logout_time TIMESTAMPTZ,
  latitude NUMERIC,
  longitude NUMERIC,
  city TEXT,
  total_hours NUMERIC,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for attendance
CREATE POLICY "Employees can view their own attendance"
  ON attendance FOR SELECT
  USING (auth.uid()::text = user_id::text OR (SELECT role FROM users WHERE id::text = auth.uid()::text) = 'admin');

CREATE POLICY "Employees can insert their own attendance"
  ON attendance FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Employees can update their own attendance"
  ON attendance FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- ============================================
-- 3. VEHICLE_PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS vehicle_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT,
  brand TEXT,
  model TEXT,
  specs JSONB,
  features JSONB,
  price_in_inr NUMERIC,
  image_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE vehicle_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vehicle_products
CREATE POLICY "Anyone can view vehicle products"
  ON vehicle_products FOR SELECT
  USING (true);

CREATE POLICY "Admins and employees can insert vehicles"
  ON vehicle_products FOR INSERT
  WITH CHECK (
    (SELECT role FROM users WHERE id::text = auth.uid()::text) IN ('admin', 'employee')
  );

CREATE POLICY "Admins and employees can update vehicles"
  ON vehicle_products FOR UPDATE
  USING (
    (SELECT role FROM users WHERE id::text = auth.uid()::text) IN ('admin', 'employee')
  );

CREATE POLICY "Admins can delete vehicles"
  ON vehicle_products FOR DELETE
  USING (
    (SELECT role FROM users WHERE id::text = auth.uid()::text) = 'admin'
  );

-- ============================================
-- 4. SPARE_PARTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS spare_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  type TEXT,
  compatible_models JSONB,
  price_in_inr NUMERIC,
  image_url TEXT,
  stock INT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE spare_parts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for spare_parts
CREATE POLICY "Anyone can view spare parts"
  ON spare_parts FOR SELECT
  USING (true);

CREATE POLICY "Admins and employees can insert spare parts"
  ON spare_parts FOR INSERT
  WITH CHECK (
    (SELECT role FROM users WHERE id::text = auth.uid()::text) IN ('admin', 'employee')
  );

CREATE POLICY "Admins and employees can update spare parts"
  ON spare_parts FOR UPDATE
  USING (
    (SELECT role FROM users WHERE id::text = auth.uid()::text) IN ('admin', 'employee')
  );

CREATE POLICY "Admins can delete spare parts"
  ON spare_parts FOR DELETE
  USING (
    (SELECT role FROM users WHERE id::text = auth.uid()::text) = 'admin'
  );

-- ============================================
-- 5. SALES_RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sales_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID,
  type TEXT CHECK(type IN ('vehicle', 'spare_part')),
  client_contact TEXT,
  sale_date DATE DEFAULT NOW(),
  price NUMERIC,
  profit NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE sales_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sales_records
CREATE POLICY "Employees can view their own sales"
  ON sales_records FOR SELECT
  USING (
    auth.uid()::text = employee_id::text OR 
    (SELECT role FROM users WHERE id::text = auth.uid()::text) = 'admin'
  );

CREATE POLICY "Employees can insert their own sales"
  ON sales_records FOR INSERT
  WITH CHECK (auth.uid()::text = employee_id::text);

CREATE POLICY "Admins can view all sales"
  ON sales_records FOR SELECT
  USING ((SELECT role FROM users WHERE id::text = auth.uid()::text) = 'admin');

-- ============================================
-- 6. CLIENT_INTERACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS client_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('contacted', 'accepted', 'rejected')),
  visits INT DEFAULT 0,
  date DATE DEFAULT NOW()
);

ALTER TABLE client_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_interactions
CREATE POLICY "Employees can view their own interactions"
  ON client_interactions FOR SELECT
  USING (
    auth.uid()::text = employee_id::text OR 
    (SELECT role FROM users WHERE id::text = auth.uid()::text) = 'admin'
  );

CREATE POLICY "Employees can insert their own interactions"
  ON client_interactions FOR INSERT
  WITH CHECK (auth.uid()::text = employee_id::text);

CREATE POLICY "Employees can update their own interactions"
  ON client_interactions FOR UPDATE
  USING (auth.uid()::text = employee_id::text);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX IF NOT EXISTS idx_sales_employee_date ON sales_records(employee_id, sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_type ON sales_records(type);
CREATE INDEX IF NOT EXISTS idx_vehicle_brand ON vehicle_products(brand);
CREATE INDEX IF NOT EXISTS idx_vehicle_type ON vehicle_products(type);
CREATE INDEX IF NOT EXISTS idx_spare_part_type ON spare_parts(type);
CREATE INDEX IF NOT EXISTS idx_client_interactions_employee ON client_interactions(employee_id, date);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to calculate total hours
CREATE OR REPLACE FUNCTION calculate_total_hours()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.logout_time IS NOT NULL AND NEW.login_time IS NOT NULL THEN
    NEW.total_hours := EXTRACT(EPOCH FROM (NEW.logout_time - NEW.login_time)) / 3600;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate total hours
CREATE TRIGGER update_total_hours
  BEFORE UPDATE ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION calculate_total_hours();

