-- ============================================
-- DUMMY DATA FOR AUTOMOBILE SALES PLATFORM
-- Production-Ready Sample Data
-- ============================================

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE sales_records CASCADE;
-- TRUNCATE TABLE client_interactions CASCADE;
-- TRUNCATE TABLE attendance CASCADE;
-- TRUNCATE TABLE spare_parts CASCADE;
-- TRUNCATE TABLE vehicle_products CASCADE;
-- TRUNCATE TABLE users CASCADE;

-- ============================================
-- 1. USERS (Admin + Employees)
-- ============================================

-- Note: These users need to be created via Supabase Auth first
-- Then update their records in the users table
-- For now, we'll create user records with placeholder UUIDs
-- You'll need to replace these with actual auth user IDs

-- Admin User (replace UUID with actual admin user ID from Supabase Auth)
INSERT INTO users (id, name, email, password_hash, role, experience_years, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Admin User', 'admin@autosalespro.com', 'hashed_password_here', 'admin', 10, NOW() - INTERVAL '2 years');

-- Employee Users (replace UUIDs with actual employee user IDs)
INSERT INTO users (id, name, email, password_hash, role, experience_years, created_at)
VALUES 
  ('10000000-0000-0000-0000-000000000001', 'Rajesh Kumar', 'rajesh.kumar@autosalespro.com', 'hashed_password', 'employee', 5, NOW() - INTERVAL '1 year 6 months'),
  ('10000000-0000-0000-0000-000000000002', 'Priya Sharma', 'priya.sharma@autosalespro.com', 'hashed_password', 'employee', 3, NOW() - INTERVAL '1 year'),
  ('10000000-0000-0000-0000-000000000003', 'Amit Patel', 'amit.patel@autosalespro.com', 'hashed_password', 'employee', 7, NOW() - INTERVAL '2 years'),
  ('10000000-0000-0000-0000-000000000004', 'Sneha Reddy', 'sneha.reddy@autosalespro.com', 'hashed_password', 'employee', 2, NOW() - INTERVAL '8 months'),
  ('10000000-0000-0000-0000-000000000005', 'Vikram Singh', 'vikram.singh@autosalespro.com', 'hashed_password', 'employee', 4, NOW() - INTERVAL '1 year 3 months'),
  ('10000000-0000-0000-0000-000000000006', 'Anjali Mehta', 'anjali.mehta@autosalespro.com', 'hashed_password', 'employee', 6, NOW() - INTERVAL '1 year 9 months'),
  ('10000000-0000-0000-0000-000000000007', 'Rohit Verma', 'rohit.verma@autosalespro.com', 'hashed_password', 'employee', 1, NOW() - INTERVAL '4 months'),
  ('10000000-0000-0000-0000-000000000008', 'Kavita Nair', 'kavita.nair@autosalespro.com', 'hashed_password', 'employee', 8, NOW() - INTERVAL '2 years 6 months');

-- ============================================
-- 2. VEHICLE PRODUCTS (Cars, Bikes, Autos, Scooties)
-- ============================================

-- Cars
INSERT INTO vehicle_products (type, brand, model, specs, features, price_in_inr, image_url, created_by, created_at)
VALUES 
  ('car', 'Maruti Suzuki', 'Swift', 
   '{"engine": "1.2L Petrol", "mileage": "23.2 kmpl", "seating": 5, "transmission": "Manual", "fuel_type": "Petrol"}',
   '["Power Steering", "Air Conditioning", "Music System", "Central Locking", "ABS"]',
   650000, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800', 
   '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '6 months'),
  
  ('car', 'Hyundai', 'i20', 
   '{"engine": "1.2L Petrol", "mileage": "20.35 kmpl", "seating": 5, "transmission": "Manual", "fuel_type": "Petrol"}',
   '["Touchscreen Infotainment", "Rear Camera", "Push Start", "Auto AC", "Alloy Wheels"]',
   750000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
   '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '5 months'),
  
  ('car', 'Tata', 'Nexon', 
   '{"engine": "1.5L Diesel", "mileage": "21.5 kmpl", "seating": 5, "transmission": "Manual", "fuel_type": "Diesel"}',
   '["Sunroof", "Touchscreen", "Cruise Control", "6 Airbags", "Connected Car Tech"]',
   850000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
   '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '4 months'),
  
  ('car', 'Mahindra', 'XUV700', 
   '{"engine": "2.0L Diesel", "mileage": "15 kmpl", "seating": 7, "transmission": "Automatic", "fuel_type": "Diesel"}',
   '["ADAS", "Panoramic Sunroof", "Wireless Charging", "360 Camera", "Premium Sound System"]',
   2500000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
   '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 months'),
  
  ('car', 'Honda', 'City', 
   '{"engine": "1.5L Petrol", "mileage": "17.8 kmpl", "seating": 5, "transmission": "CVT", "fuel_type": "Petrol"}',
   '["Honda Sensing", "Lane Watch", "Sunroof", "Wireless Charging", "8 Speaker System"]',
   1200000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
   '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 months'),
  
  ('car', 'Toyota', 'Innova Crysta', 
   '{"engine": "2.4L Diesel", "mileage": "13.68 kmpl", "seating": 7, "transmission": "Manual", "fuel_type": "Diesel"}',
   '["Touchscreen", "Rear AC", "Captain Seats", "ABS", "Hill Assist"]',
   1800000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
   '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 month');

-- Bikes
INSERT INTO vehicle_products (type, brand, model, specs, features, price_in_inr, image_url, created_by, created_at)
VALUES 
  ('bike', 'Hero', 'Splendor Plus', 
   '{"engine": "97.2cc", "mileage": "80 kmpl", "fuel_tank": "9.8L", "fuel_type": "Petrol"}',
   '["i3S Technology", "Side Stand Indicator", "LED Tail Lamp", "Digital Speedometer"]',
   75000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
   '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '5 months'),
  
  ('bike', 'Honda', 'Shine', 
   '{"engine": "124cc", "mileage": "65 kmpl", "fuel_tank": "10.5L", "fuel_type": "Petrol"}',
   '["HET Engine", "Combi Brake System", "LED Headlight", "Digital Meter"]',
   85000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
   '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '4 months'),
  
  ('bike', 'Bajaj', 'Pulsar 150', 
   '{"engine": "149.5cc", "mileage": "50 kmpl", "fuel_tank": "15L", "fuel_type": "Petrol"}',
   '["DTS-i Engine", "Nitrox Suspension", "Digital Console", "LED Tail Lamp"]',
   120000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
   '10000000-0000-0000-0000-000000000002', NOW() - INTERVAL '3 months'),
  
  ('bike', 'Yamaha', 'MT-15', 
   '{"engine": "155cc", "mileage": "45 kmpl", "fuel_tank": "10L", "fuel_type": "Petrol"}',
   '["LED Headlight", "Digital Instrument Cluster", "ABS", "Liquid Cooling"]',
   165000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
   '10000000-0000-0000-0000-000000000002', NOW() - INTERVAL '2 months'),
  
  ('bike', 'Royal Enfield', 'Classic 350', 
   '{"engine": "349cc", "mileage": "35 kmpl", "fuel_tank": "13.5L", "fuel_type": "Petrol"}',
   '["Tripper Navigation", "LED Lighting", "USB Charging", "ABS"]',
   195000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
   '10000000-0000-0000-0000-000000000003', NOW() - INTERVAL '1 month');

-- Autos
INSERT INTO vehicle_products (type, brand, model, specs, features, price_in_inr, image_url, created_by, created_at)
VALUES 
  ('auto', 'Bajaj', 'RE Compact', 
   '{"engine": "145.45cc", "mileage": "35 kmpl", "seating": 3, "fuel_type": "CNG"}',
   '["CNG Kit", "Digital Meter", "LED Tail Lamp", "Comfortable Seating"]',
   250000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
   '10000000-0000-0000-0000-000000000003', NOW() - INTERVAL '4 months'),
  
  ('auto', 'Piaggio', 'Ape Xtra', 
   '{"engine": "395cc", "mileage": "30 kmpl", "seating": 3, "fuel_type": "Diesel"}',
   '["Power Steering", "Digital Console", "Comfortable Cabin", "High Ground Clearance"]',
   320000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
   '10000000-0000-0000-0000-000000000004', NOW() - INTERVAL '3 months'),
  
  ('auto', 'Mahindra', 'Alfa Plus', 
   '{"engine": "909cc", "mileage": "22 kmpl", "seating": 4, "fuel_type": "Diesel"}',
   '["Power Steering", "Digital Meter", "Music System", "Comfort Seats"]',
   380000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
   '10000000-0000-0000-0000-000000000004', NOW() - INTERVAL '2 months');

-- Scooties
INSERT INTO vehicle_products (type, brand, model, specs, features, price_in_inr, image_url, created_by, created_at)
VALUES 
  ('scooty', 'Honda', 'Activa 6G', 
   '{"engine": "109.51cc", "mileage": "60 kmpl", "fuel_tank": "5.3L", "fuel_type": "Petrol"}',
   '["HET Engine", "External Fuel Filler", "LED Headlight", "Digital Meter"]',
   75000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
   '10000000-0000-0000-0000-000000000005', NOW() - INTERVAL '5 months'),
  
  ('scooty', 'TVS', 'Jupiter', 
   '{"engine": "109.7cc", "mileage": "62 kmpl", "fuel_tank": "5.5L", "fuel_type": "Petrol"}',
   '["External Fuel Filler", "LED Tail Lamp", "Digital Console", "USB Charging"]',
   72000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
   '10000000-0000-0000-0000-000000000005', NOW() - INTERVAL '4 months'),
  
  ('scooty', 'Suzuki', 'Access 125', 
   '{"engine": "124cc", "mileage": "58 kmpl", "fuel_tank": "5.6L", "fuel_type": "Petrol"}',
   '["SEP Engine", "LED Headlight", "Digital Meter", "Side Stand Engine Cut-off"]',
   85000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
   '10000000-0000-0000-0000-000000000006', NOW() - INTERVAL '3 months'),
  
  ('scooty', 'Yamaha', 'Fascino 125', 
   '{"engine": "125cc", "mileage": "55 kmpl", "fuel_tank": "5.2L", "fuel_type": "Petrol"}',
   '["Blue Core Engine", "LED Headlight", "Digital Meter", "Smart Key System"]',
   95000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
   '10000000-0000-0000-0000-000000000006', NOW() - INTERVAL '2 months');

-- ============================================
-- 3. SPARE PARTS
-- ============================================

-- Engine Parts
INSERT INTO spare_parts (name, type, compatible_models, price_in_inr, image_url, stock, created_by, created_at)
VALUES 
  ('Engine Oil Filter', 'engine', '["Swift", "i20", "City", "Nexon"]', 450, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 150, '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '6 months'),
  
  ('Air Filter Element', 'engine', '["Swift", "i20", "Pulsar 150", "Activa 6G"]', 350, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 200, '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '5 months'),
  
  ('Spark Plug Set', 'engine', '["Splendor Plus", "Shine", "Pulsar 150", "MT-15"]', 280, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 180, '10000000-0000-0000-0000-000000000002', NOW() - INTERVAL '4 months'),
  
  ('Radiator Cap', 'engine', '["Swift", "i20", "City", "Nexon", "XUV700"]', 250, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 120, '10000000-0000-0000-0000-000000000002', NOW() - INTERVAL '3 months'),
  
  ('Timing Belt', 'engine', '["City", "Innova Crysta", "XUV700"]', 3500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 45, '10000000-0000-0000-0000-000000000003', NOW() - INTERVAL '2 months');

-- Brake Parts
INSERT INTO spare_parts (name, type, compatible_models, price_in_inr, image_url, stock, created_by, created_at)
VALUES 
  ('Brake Pad Set (Front)', 'brake', '["Swift", "i20", "City", "Nexon"]', 1200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 80, '10000000-0000-0000-0000-000000000003', NOW() - INTERVAL '5 months'),
  
  ('Brake Pad Set (Rear)', 'brake', '["Swift", "i20", "City", "Nexon"]', 950, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 85, '10000000-0000-0000-0000-000000000003', NOW() - INTERVAL '4 months'),
  
  ('Brake Disc (Front)', 'brake', '["Pulsar 150", "MT-15", "Classic 350"]', 1800, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 60, '10000000-0000-0000-0000-000000000004', NOW() - INTERVAL '3 months'),
  
  ('Brake Shoe Set', 'brake', '["Splendor Plus", "Shine", "Activa 6G", "Jupiter"]', 450, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 100, '10000000-0000-0000-0000-000000000004', NOW() - INTERVAL '2 months'),
  
  ('Brake Fluid', 'brake', '["All Models"]', 350, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 200, '10000000-0000-0000-0000-000000000005', NOW() - INTERVAL '1 month');

-- Electrical Parts
INSERT INTO spare_parts (name, type, compatible_models, price_in_inr, image_url, stock, created_by, created_at)
VALUES 
  ('Battery (12V)', 'electrical', '["Swift", "i20", "City", "Nexon"]', 4500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 50, '10000000-0000-0000-0000-000000000005', NOW() - INTERVAL '5 months'),
  
  ('Headlight Bulb (LED)', 'electrical', '["All Models"]', 850, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 120, '10000000-0000-0000-0000-000000000005', NOW() - INTERVAL '4 months'),
  
  ('Tail Light Assembly', 'electrical', '["Swift", "i20", "Pulsar 150"]', 1800, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 40, '10000000-0000-0000-0000-000000000006', NOW() - INTERVAL '3 months'),
  
  ('Alternator', 'electrical', '["City", "Innova Crysta", "XUV700"]', 8500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 25, '10000000-0000-0000-0000-000000000006', NOW() - INTERVAL '2 months'),
  
  ('Starter Motor', 'electrical', '["Swift", "i20", "City", "Nexon"]', 5500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 30, '10000000-0000-0000-0000-000000000007', NOW() - INTERVAL '1 month');

-- Body Parts
INSERT INTO spare_parts (name, type, compatible_models, price_in_inr, image_url, stock, created_by, created_at)
VALUES 
  ('Front Bumper', 'body', '["Swift", "i20"]', 8500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 15, '10000000-0000-0000-0000-000000000007', NOW() - INTERVAL '4 months'),
  
  ('Side Mirror (Left)', 'body', '["Swift", "i20", "City", "Nexon"]', 1200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 35, '10000000-0000-0000-0000-000000000007', NOW() - INTERVAL '3 months'),
  
  ('Windshield Glass', 'body', '["Swift", "i20", "City"]', 6500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 20, '10000000-0000-0000-0000-000000000008', NOW() - INTERVAL '2 months'),
  
  ('Door Handle', 'body', '["Swift", "i20", "City", "Nexon"]', 850, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 50, '10000000-0000-0000-0000-000000000008', NOW() - INTERVAL '1 month');

-- Suspension Parts
INSERT INTO spare_parts (name, type, compatible_models, price_in_inr, image_url, stock, created_by, created_at)
VALUES 
  ('Shock Absorber (Front)', 'suspension', '["Swift", "i20", "Pulsar 150", "MT-15"]', 2500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 40, '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 months'),
  
  ('Shock Absorber (Rear)', 'suspension', '["Swift", "i20", "Pulsar 150", "MT-15"]', 2200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 45, '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 months'),
  
  ('Coil Spring', 'suspension', '["City", "Nexon", "XUV700"]', 3500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 30, '10000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 month');

-- ============================================
-- 4. ATTENDANCE RECORDS (Last 90 days for all employees)
-- ============================================

-- Function to generate attendance for an employee
DO $$
DECLARE
  emp_id UUID;
  attendance_date DATE;
  login_time TIMESTAMPTZ;
  logout_time TIMESTAMPTZ;
  total_hrs NUMERIC;
BEGIN
  -- Loop through each employee
  FOR emp_id IN SELECT id FROM users WHERE role = 'employee' LOOP
    -- Generate attendance for last 90 days (excluding some weekends)
    FOR i IN 0..89 LOOP
      attendance_date := CURRENT_DATE - (i || ' days')::INTERVAL;
      
      -- Skip some random days (sick leaves, holidays) - 15% chance
      IF random() > 0.15 THEN
        -- Generate login time between 8 AM and 10 AM
        login_time := attendance_date + (8 + random() * 2)::INTEGER * INTERVAL '1 hour' + 
                      (random() * 60)::INTEGER * INTERVAL '1 minute';
        
        -- Generate logout time between 5 PM and 7 PM (8-9 hours later)
        logout_time := login_time + (8 + random() * 1)::NUMERIC * INTERVAL '1 hour';
        
        total_hrs := EXTRACT(EPOCH FROM (logout_time - login_time)) / 3600;
        
        INSERT INTO attendance (user_id, date, login_time, logout_time, latitude, longitude, city, total_hours, created_at)
        VALUES (
          emp_id,
          attendance_date,
          login_time,
          logout_time,
          17.3850 + (random() * 0.1), -- Hyderabad area coordinates
          78.4867 + (random() * 0.1),
          'Hyderabad',
          total_hrs,
          NOW() - (i || ' days')::INTERVAL
        );
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- 5. SALES RECORDS (Last 6 months)
-- ============================================

-- Get vehicle and spare part IDs for sales
DO $$
DECLARE
  emp_id UUID;
  vehicle_id UUID;
  spare_part_id UUID;
  sale_date DATE;
  sale_price NUMERIC;
  sale_profit NUMERIC;
  client_contact TEXT;
  sale_type TEXT;
  product_id UUID;
BEGIN
  -- Generate sales for each employee
  FOR emp_id IN SELECT id FROM users WHERE role = 'employee' LOOP
    -- Generate 20-50 sales per employee over last 6 months
    FOR i IN 1..(30 + (random() * 20)::INTEGER) LOOP
      sale_date := CURRENT_DATE - ((random() * 180)::INTEGER || ' days')::INTERVAL;
      
      -- 70% vehicle sales, 30% spare parts
      IF random() < 0.7 THEN
        -- Vehicle sale
        SELECT id INTO vehicle_id FROM vehicle_products ORDER BY random() LIMIT 1;
        SELECT price_in_inr INTO sale_price FROM vehicle_products WHERE id = vehicle_id;
        sale_profit := sale_price * (0.05 + random() * 0.10); -- 5-15% profit
        sale_type := 'vehicle';
        product_id := vehicle_id;
        client_contact := '+91' || (9000000000 + (random() * 999999999)::BIGINT)::TEXT;
      ELSE
        -- Spare part sale
        SELECT id INTO spare_part_id FROM spare_parts ORDER BY random() LIMIT 1;
        SELECT price_in_inr INTO sale_price FROM spare_parts WHERE id = spare_part_id;
        sale_profit := sale_price * (0.15 + random() * 0.20); -- 15-35% profit
        sale_type := 'spare_part';
        product_id := spare_part_id;
        client_contact := '+91' || (9000000000 + (random() * 999999999)::BIGINT)::TEXT;
      END IF;
      
      INSERT INTO sales_records (employee_id, product_id, type, client_contact, sale_date, price, profit, created_at)
      VALUES (
        emp_id,
        product_id,
        sale_type,
        client_contact,
        sale_date,
        sale_price,
        sale_profit,
        sale_date
      );
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- 6. CLIENT INTERACTIONS (Last 3 months)
-- ============================================

DO $$
DECLARE
  emp_id UUID;
  interaction_date DATE;
  interaction_status TEXT;
  visit_count INT;
BEGIN
  -- Generate interactions for each employee
  FOR emp_id IN SELECT id FROM users WHERE role = 'employee' LOOP
    -- Generate 50-100 interactions per employee
    FOR i IN 1..(75 + (random() * 25)::INTEGER) LOOP
      interaction_date := CURRENT_DATE - ((random() * 90)::INTEGER || ' days')::INTERVAL;
      
      -- Status distribution: 50% contacted, 30% accepted, 20% rejected
      IF random() < 0.5 THEN
        interaction_status := 'contacted';
        visit_count := 1;
      ELSIF random() < 0.8 THEN
        interaction_status := 'accepted';
        visit_count := 2 + (random() * 3)::INTEGER; -- 2-5 visits
      ELSE
        interaction_status := 'rejected';
        visit_count := 1;
      END IF;
      
      INSERT INTO client_interactions (employee_id, status, visits, date, created_at)
      VALUES (
        emp_id,
        interaction_status,
        visit_count,
        interaction_date,
        interaction_date
      );
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- SUMMARY
-- ============================================

-- Verify data insertion
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

-- Expected counts:
-- Users: 9 (1 admin + 8 employees)
-- Vehicle Products: 20 (7 cars + 5 bikes + 3 autos + 5 scooties)
-- Spare Parts: 25+ (various types)
-- Attendance Records: ~600+ (90 days * 8 employees * ~85% attendance)
-- Sales Records: ~240-400 (30-50 per employee * 8 employees)
-- Client Interactions: ~600-800 (75-100 per employee * 8 employees)

