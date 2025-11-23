-- ============================================
-- SIMPLIFIED DUMMY DATA SCRIPT
-- Use this after creating users via Supabase Auth
-- Replace USER_IDs with actual IDs from auth.users
-- ============================================

-- ============================================
-- STEP 1: Update Users Table
-- Replace the UUIDs below with actual user IDs from Supabase Auth
-- ============================================

-- First, get your actual user IDs from auth.users:
-- SELECT id, email FROM auth.users;

-- Then update the users table (example - replace with your actual IDs):
/*
UPDATE users SET name = 'Admin User', role = 'admin', experience_years = 10 
WHERE email = 'admin@autosalespro.com';

UPDATE users SET name = 'Rajesh Kumar', role = 'employee', experience_years = 5 
WHERE email = 'rajesh.kumar@autosalespro.com';

UPDATE users SET name = 'Priya Sharma', role = 'employee', experience_years = 3 
WHERE email = 'priya.sharma@autosalespro.com';

UPDATE users SET name = 'Amit Patel', role = 'employee', experience_years = 7 
WHERE email = 'amit.patel@autosalespro.com';

UPDATE users SET name = 'Sneha Reddy', role = 'employee', experience_years = 2 
WHERE email = 'sneha.reddy@autosalespro.com';

UPDATE users SET name = 'Vikram Singh', role = 'employee', experience_years = 4 
WHERE email = 'vikram.singh@autosalespro.com';

UPDATE users SET name = 'Anjali Mehta', role = 'employee', experience_years = 6 
WHERE email = 'anjali.mehta@autosalespro.com';

UPDATE users SET name = 'Rohit Verma', role = 'employee', experience_years = 1 
WHERE email = 'rohit.verma@autosalespro.com';

UPDATE users SET name = 'Kavita Nair', role = 'employee', experience_years = 8 
WHERE email = 'kavita.nair@autosalespro.com';
*/

-- ============================================
-- STEP 2: Insert Vehicle Products
-- ============================================

-- Get admin user ID first
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM users WHERE role = 'admin' LIMIT 1;
  
  -- Cars
  INSERT INTO vehicle_products (type, brand, model, specs, features, price_in_inr, image_url, created_by, created_at)
  VALUES 
    ('car', 'Maruti Suzuki', 'Swift', 
     '{"engine": "1.2L Petrol", "mileage": "23.2 kmpl", "seating": 5, "transmission": "Manual", "fuel_type": "Petrol"}'::jsonb,
     '["Power Steering", "Air Conditioning", "Music System", "Central Locking", "ABS"]'::jsonb,
     650000, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800', 
     admin_id, NOW() - INTERVAL '6 months'),
    
    ('car', 'Hyundai', 'i20', 
     '{"engine": "1.2L Petrol", "mileage": "20.35 kmpl", "seating": 5, "transmission": "Manual", "fuel_type": "Petrol"}'::jsonb,
     '["Touchscreen Infotainment", "Rear Camera", "Push Start", "Auto AC", "Alloy Wheels"]'::jsonb,
     750000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '5 months'),
    
    ('car', 'Tata', 'Nexon', 
     '{"engine": "1.5L Diesel", "mileage": "21.5 kmpl", "seating": 5, "transmission": "Manual", "fuel_type": "Diesel"}'::jsonb,
     '["Sunroof", "Touchscreen", "Cruise Control", "6 Airbags", "Connected Car Tech"]'::jsonb,
     850000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '4 months'),
    
    ('car', 'Mahindra', 'XUV700', 
     '{"engine": "2.0L Diesel", "mileage": "15 kmpl", "seating": 7, "transmission": "Automatic", "fuel_type": "Diesel"}'::jsonb,
     '["ADAS", "Panoramic Sunroof", "Wireless Charging", "360 Camera", "Premium Sound System"]'::jsonb,
     2500000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '3 months'),
    
    ('car', 'Honda', 'City', 
     '{"engine": "1.5L Petrol", "mileage": "17.8 kmpl", "seating": 5, "transmission": "CVT", "fuel_type": "Petrol"}'::jsonb,
     '["Honda Sensing", "Lane Watch", "Sunroof", "Wireless Charging", "8 Speaker System"]'::jsonb,
     1200000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '2 months'),
    
    ('car', 'Toyota', 'Innova Crysta', 
     '{"engine": "2.4L Diesel", "mileage": "13.68 kmpl", "seating": 7, "transmission": "Manual", "fuel_type": "Diesel"}'::jsonb,
     '["Touchscreen", "Rear AC", "Captain Seats", "ABS", "Hill Assist"]'::jsonb,
     1800000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '1 month'),
    
    ('car', 'Maruti Suzuki', 'Baleno', 
     '{"engine": "1.2L Petrol", "mileage": "22.35 kmpl", "seating": 5, "transmission": "Manual", "fuel_type": "Petrol"}'::jsonb,
     '["Smart Hybrid", "Touchscreen", "Auto AC", "Keyless Entry", "ABS"]'::jsonb,
     700000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '15 days');

  -- Bikes
  INSERT INTO vehicle_products (type, brand, model, specs, features, price_in_inr, image_url, created_by, created_at)
  VALUES 
    ('bike', 'Hero', 'Splendor Plus', 
     '{"engine": "97.2cc", "mileage": "80 kmpl", "fuel_tank": "9.8L", "fuel_type": "Petrol"}'::jsonb,
     '["i3S Technology", "Side Stand Indicator", "LED Tail Lamp", "Digital Speedometer"]'::jsonb,
     75000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     admin_id, NOW() - INTERVAL '5 months'),
    
    ('bike', 'Honda', 'Shine', 
     '{"engine": "124cc", "mileage": "65 kmpl", "fuel_tank": "10.5L", "fuel_type": "Petrol"}'::jsonb,
     '["HET Engine", "Combi Brake System", "LED Headlight", "Digital Meter"]'::jsonb,
     85000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     admin_id, NOW() - INTERVAL '4 months'),
    
    ('bike', 'Bajaj', 'Pulsar 150', 
     '{"engine": "149.5cc", "mileage": "50 kmpl", "fuel_tank": "15L", "fuel_type": "Petrol"}'::jsonb,
     '["DTS-i Engine", "Nitrox Suspension", "Digital Console", "LED Tail Lamp"]'::jsonb,
     120000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     admin_id, NOW() - INTERVAL '3 months'),
    
    ('bike', 'Yamaha', 'MT-15', 
     '{"engine": "155cc", "mileage": "45 kmpl", "fuel_tank": "10L", "fuel_type": "Petrol"}'::jsonb,
     '["LED Headlight", "Digital Instrument Cluster", "ABS", "Liquid Cooling"]'::jsonb,
     165000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     admin_id, NOW() - INTERVAL '2 months'),
    
    ('bike', 'Royal Enfield', 'Classic 350', 
     '{"engine": "349cc", "mileage": "35 kmpl", "fuel_tank": "13.5L", "fuel_type": "Petrol"}'::jsonb,
     '["Tripper Navigation", "LED Lighting", "USB Charging", "ABS"]'::jsonb,
     195000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     admin_id, NOW() - INTERVAL '1 month'),
    
    ('bike', 'TVS', 'Apache RTR 160', 
     '{"engine": "159.7cc", "mileage": "55 kmpl", "fuel_tank": "12L", "fuel_type": "Petrol"}'::jsonb,
     '["Race Tuned Engine", "Digital Console", "ABS", "LED Headlight"]'::jsonb,
     130000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     admin_id, NOW() - INTERVAL '20 days');

  -- Autos
  INSERT INTO vehicle_products (type, brand, model, specs, features, price_in_inr, image_url, created_by, created_at)
  VALUES 
    ('auto', 'Bajaj', 'RE Compact', 
     '{"engine": "145.45cc", "mileage": "35 kmpl", "seating": 3, "fuel_type": "CNG"}'::jsonb,
     '["CNG Kit", "Digital Meter", "LED Tail Lamp", "Comfortable Seating"]'::jsonb,
     250000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '4 months'),
    
    ('auto', 'Piaggio', 'Ape Xtra', 
     '{"engine": "395cc", "mileage": "30 kmpl", "seating": 3, "fuel_type": "Diesel"}'::jsonb,
     '["Power Steering", "Digital Console", "Comfortable Cabin", "High Ground Clearance"]'::jsonb,
     320000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '3 months'),
    
    ('auto', 'Mahindra', 'Alfa Plus', 
     '{"engine": "909cc", "mileage": "22 kmpl", "seating": 4, "fuel_type": "Diesel"}'::jsonb,
     '["Power Steering", "Digital Meter", "Music System", "Comfort Seats"]'::jsonb,
     380000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '2 months');

  -- Scooties
  INSERT INTO vehicle_products (type, brand, model, specs, features, price_in_inr, image_url, created_by, created_at)
  VALUES 
    ('scooty', 'Honda', 'Activa 6G', 
     '{"engine": "109.51cc", "mileage": "60 kmpl", "fuel_tank": "5.3L", "fuel_type": "Petrol"}'::jsonb,
     '["HET Engine", "External Fuel Filler", "LED Headlight", "Digital Meter"]'::jsonb,
     75000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     admin_id, NOW() - INTERVAL '5 months'),
    
    ('scooty', 'TVS', 'Jupiter', 
     '{"engine": "109.7cc", "mileage": "62 kmpl", "fuel_tank": "5.5L", "fuel_type": "Petrol"}'::jsonb,
     '["External Fuel Filler", "LED Tail Lamp", "Digital Console", "USB Charging"]'::jsonb,
     72000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     admin_id, NOW() - INTERVAL '4 months'),
    
    ('scooty', 'Suzuki', 'Access 125', 
     '{"engine": "124cc", "mileage": "58 kmpl", "fuel_tank": "5.6L", "fuel_type": "Petrol"}'::jsonb,
     '["SEP Engine", "LED Headlight", "Digital Meter", "Side Stand Engine Cut-off"]'::jsonb,
     85000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     admin_id, NOW() - INTERVAL '3 months'),
    
    ('scooty', 'Yamaha', 'Fascino 125', 
     '{"engine": "125cc", "mileage": "55 kmpl", "fuel_tank": "5.2L", "fuel_type": "Petrol"}'::jsonb,
     '["Blue Core Engine", "LED Headlight", "Digital Meter", "Smart Key System"]'::jsonb,
     95000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     admin_id, NOW() - INTERVAL '2 months'),
    
    ('scooty', 'Hero', 'Pleasure Plus', 
     '{"engine": "110.9cc", "mileage": "58 kmpl", "fuel_tank": "5.5L", "fuel_type": "Petrol"}'::jsonb,
     '["i3S Technology", "LED Tail Lamp", "Digital Speedometer", "External Fuel Filler"]'::jsonb,
     68000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     admin_id, NOW() - INTERVAL '1 month');

END $$;

-- ============================================
-- STEP 3: Insert Spare Parts (using employee IDs)
-- ============================================

DO $$
DECLARE
  emp_id UUID;
BEGIN
  -- Get first employee ID
  SELECT id INTO emp_id FROM users WHERE role = 'employee' LIMIT 1;
  
  -- Engine Parts
  INSERT INTO spare_parts (name, type, compatible_models, price_in_inr, image_url, stock, created_by, created_at)
  VALUES 
    ('Engine Oil Filter', 'engine', '["Swift", "i20", "City", "Nexon"]'::jsonb, 450, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 150, emp_id, NOW() - INTERVAL '6 months'),
    ('Air Filter Element', 'engine', '["Swift", "i20", "Pulsar 150", "Activa 6G"]'::jsonb, 350, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 200, emp_id, NOW() - INTERVAL '5 months'),
    ('Spark Plug Set', 'engine', '["Splendor Plus", "Shine", "Pulsar 150", "MT-15"]'::jsonb, 280, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 180, emp_id, NOW() - INTERVAL '4 months'),
    ('Radiator Cap', 'engine', '["Swift", "i20", "City", "Nexon", "XUV700"]'::jsonb, 250, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 120, emp_id, NOW() - INTERVAL '3 months'),
    ('Timing Belt', 'engine', '["City", "Innova Crysta", "XUV700"]'::jsonb, 3500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 45, emp_id, NOW() - INTERVAL '2 months'),
    ('Fuel Pump', 'engine', '["Swift", "i20", "City", "Nexon"]'::jsonb, 4500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 35, emp_id, NOW() - INTERVAL '1 month');

  -- Brake Parts
  INSERT INTO spare_parts (name, type, compatible_models, price_in_inr, image_url, stock, created_by, created_at)
  VALUES 
    ('Brake Pad Set (Front)', 'brake', '["Swift", "i20", "City", "Nexon"]'::jsonb, 1200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 80, emp_id, NOW() - INTERVAL '5 months'),
    ('Brake Pad Set (Rear)', 'brake', '["Swift", "i20", "City", "Nexon"]'::jsonb, 950, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 85, emp_id, NOW() - INTERVAL '4 months'),
    ('Brake Disc (Front)', 'brake', '["Pulsar 150", "MT-15", "Classic 350"]'::jsonb, 1800, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 60, emp_id, NOW() - INTERVAL '3 months'),
    ('Brake Shoe Set', 'brake', '["Splendor Plus", "Shine", "Activa 6G", "Jupiter"]'::jsonb, 450, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 100, emp_id, NOW() - INTERVAL '2 months'),
    ('Brake Fluid', 'brake', '["All Models"]'::jsonb, 350, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 200, emp_id, NOW() - INTERVAL '1 month'),
    ('Brake Master Cylinder', 'brake', '["Swift", "i20", "City", "Nexon"]'::jsonb, 2800, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 40, emp_id, NOW() - INTERVAL '15 days');

  -- Electrical Parts
  INSERT INTO spare_parts (name, type, compatible_models, price_in_inr, image_url, stock, created_by, created_at)
  VALUES 
    ('Battery (12V)', 'electrical', '["Swift", "i20", "City", "Nexon"]'::jsonb, 4500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 50, emp_id, NOW() - INTERVAL '5 months'),
    ('Headlight Bulb (LED)', 'electrical', '["All Models"]'::jsonb, 850, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 120, emp_id, NOW() - INTERVAL '4 months'),
    ('Tail Light Assembly', 'electrical', '["Swift", "i20", "Pulsar 150"]'::jsonb, 1800, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 40, emp_id, NOW() - INTERVAL '3 months'),
    ('Alternator', 'electrical', '["City", "Innova Crysta", "XUV700"]'::jsonb, 8500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 25, emp_id, NOW() - INTERVAL '2 months'),
    ('Starter Motor', 'electrical', '["Swift", "i20", "City", "Nexon"]'::jsonb, 5500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 30, emp_id, NOW() - INTERVAL '1 month'),
    ('Fuse Box', 'electrical', '["All Models"]'::jsonb, 1200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 55, emp_id, NOW() - INTERVAL '20 days');

  -- Body Parts
  INSERT INTO spare_parts (name, type, compatible_models, price_in_inr, image_url, stock, created_by, created_at)
  VALUES 
    ('Front Bumper', 'body', '["Swift", "i20"]'::jsonb, 8500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 15, emp_id, NOW() - INTERVAL '4 months'),
    ('Side Mirror (Left)', 'body', '["Swift", "i20", "City", "Nexon"]'::jsonb, 1200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 35, emp_id, NOW() - INTERVAL '3 months'),
    ('Side Mirror (Right)', 'body', '["Swift", "i20", "City", "Nexon"]'::jsonb, 1200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 35, emp_id, NOW() - INTERVAL '3 months'),
    ('Windshield Glass', 'body', '["Swift", "i20", "City"]'::jsonb, 6500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 20, emp_id, NOW() - INTERVAL '2 months'),
    ('Door Handle', 'body', '["Swift", "i20", "City", "Nexon"]'::jsonb, 850, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 50, emp_id, NOW() - INTERVAL '1 month'),
    ('Rear Bumper', 'body', '["Swift", "i20", "City"]'::jsonb, 7500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 18, emp_id, NOW() - INTERVAL '15 days');

  -- Suspension Parts
  INSERT INTO spare_parts (name, type, compatible_models, price_in_inr, image_url, stock, created_by, created_at)
  VALUES 
    ('Shock Absorber (Front)', 'suspension', '["Swift", "i20", "Pulsar 150", "MT-15"]'::jsonb, 2500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 40, emp_id, NOW() - INTERVAL '3 months'),
    ('Shock Absorber (Rear)', 'suspension', '["Swift", "i20", "Pulsar 150", "MT-15"]'::jsonb, 2200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 45, emp_id, NOW() - INTERVAL '2 months'),
    ('Coil Spring', 'suspension', '["City", "Nexon", "XUV700"]'::jsonb, 3500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 30, emp_id, NOW() - INTERVAL '1 month'),
    ('Strut Assembly', 'suspension', '["City", "Innova Crysta", "XUV700"]'::jsonb, 5500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 25, emp_id, NOW() - INTERVAL '20 days');

END $$;

-- ============================================
-- STEP 4: Generate Attendance Records (Last 90 days)
-- ============================================

DO $$
DECLARE
  emp_id UUID;
  attendance_date DATE;
  login_time TIMESTAMPTZ;
  logout_time TIMESTAMPTZ;
  total_hrs NUMERIC;
  emp_cursor CURSOR FOR SELECT id FROM users WHERE role = 'employee';
BEGIN
  FOR emp_rec IN emp_cursor LOOP
    emp_id := emp_rec.id;
    
    -- Generate attendance for last 90 days
    FOR i IN 0..89 LOOP
      attendance_date := CURRENT_DATE - (i || ' days')::INTERVAL;
      
      -- Skip weekends occasionally and some random days (sick leaves) - 20% chance
      IF (EXTRACT(DOW FROM attendance_date) NOT IN (0, 6)) AND (random() > 0.20) THEN
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
        ) ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- STEP 5: Generate Sales Records (Last 6 months)
-- ============================================

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
  emp_cursor CURSOR FOR SELECT id FROM users WHERE role = 'employee';
BEGIN
  FOR emp_rec IN emp_cursor LOOP
    emp_id := emp_rec.id;
    
    -- Generate 25-45 sales per employee over last 6 months
    FOR i IN 1..(35 + (random() * 20)::INTEGER) LOOP
      sale_date := CURRENT_DATE - ((random() * 180)::INTEGER || ' days')::INTERVAL;
      
      -- 70% vehicle sales, 30% spare parts
      IF random() < 0.7 THEN
        -- Vehicle sale
        SELECT id, price_in_inr INTO vehicle_id, sale_price 
        FROM vehicle_products 
        ORDER BY random() 
        LIMIT 1;
        
        sale_profit := sale_price * (0.05 + random() * 0.10); -- 5-15% profit
        sale_type := 'vehicle';
        product_id := vehicle_id;
      ELSE
        -- Spare part sale
        SELECT id, price_in_inr INTO spare_part_id, sale_price 
        FROM spare_parts 
        ORDER BY random() 
        LIMIT 1;
        
        sale_profit := sale_price * (0.15 + random() * 0.20); -- 15-35% profit
        sale_type := 'spare_part';
        product_id := spare_part_id;
      END IF;
      
      client_contact := '+91' || (9000000000 + (random() * 999999999)::BIGINT)::TEXT;
      
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
      ) ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- STEP 6: Generate Client Interactions (Last 3 months)
-- ============================================

DO $$
DECLARE
  emp_id UUID;
  interaction_date DATE;
  interaction_status TEXT;
  visit_count INT;
  emp_cursor CURSOR FOR SELECT id FROM users WHERE role = 'employee';
BEGIN
  FOR emp_rec IN emp_cursor LOOP
    emp_id := emp_rec.id;
    
    -- Generate 60-90 interactions per employee
    FOR i IN 1..(75 + (random() * 15)::INTEGER) LOOP
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
      ) ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check data counts
SELECT 
  'Users' as table_name, 
  COUNT(*) as record_count,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
  COUNT(CASE WHEN role = 'employee' THEN 1 END) as employees
FROM users
UNION ALL
SELECT 'Vehicle Products', COUNT(*), COUNT(DISTINCT type), COUNT(DISTINCT brand) FROM vehicle_products
UNION ALL
SELECT 'Spare Parts', COUNT(*), COUNT(DISTINCT type), 0 FROM spare_parts
UNION ALL
SELECT 'Attendance Records', COUNT(*), COUNT(DISTINCT user_id), COUNT(DISTINCT date) FROM attendance
UNION ALL
SELECT 'Sales Records', COUNT(*), COUNT(DISTINCT employee_id), COUNT(DISTINCT type) FROM sales_records
UNION ALL
SELECT 'Client Interactions', COUNT(*), COUNT(DISTINCT employee_id), COUNT(DISTINCT status) FROM client_interactions;

-- Sample queries to verify data
SELECT 'Sample Vehicles' as info, brand, model, price_in_inr FROM vehicle_products LIMIT 5;
SELECT 'Sample Spare Parts' as info, name, type, price_in_inr, stock FROM spare_parts LIMIT 5;
SELECT 'Sample Sales' as info, COUNT(*) as total_sales, SUM(price) as total_revenue, SUM(profit) as total_profit FROM sales_records;
SELECT 'Sample Attendance' as info, COUNT(*) as total_records, AVG(total_hours) as avg_hours_per_day FROM attendance;

