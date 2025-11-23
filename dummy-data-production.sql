-- ============================================
-- PRODUCTION-READY DUMMY DATA SCRIPT
-- Run this AFTER creating users in Supabase Auth
-- This script automatically finds your users and populates data
-- All prices are in INR (Indian Rupees)
-- ============================================

-- ============================================
-- STEP 1: Update Users Table with Names and Roles
-- This updates existing users created via Supabase Auth
-- ============================================

-- Update admin user (change email if different)
UPDATE users 
SET 
  name = 'Admin User',
  role = 'admin',
  experience_years = 10
WHERE id = (SELECT id FROM users WHERE email = 'admin@autosalespro.com' OR role = 'admin' LIMIT 1);

-- Update employee users with names and experience
-- If you have different emails, update these accordingly
UPDATE users 
SET name = 'Rajesh Kumar', experience_years = 5
WHERE id = (SELECT id FROM users WHERE (email LIKE '%rajesh%' OR email LIKE '%employee1%') AND role = 'employee' LIMIT 1);

UPDATE users 
SET name = 'Priya Sharma', experience_years = 3
WHERE id = (SELECT id FROM users WHERE (email LIKE '%priya%' OR email LIKE '%employee2%') AND role = 'employee' LIMIT 1);

UPDATE users 
SET name = 'Amit Patel', experience_years = 7
WHERE id = (SELECT id FROM users WHERE (email LIKE '%amit%' OR email LIKE '%employee3%') AND role = 'employee' LIMIT 1);

UPDATE users 
SET name = 'Sneha Reddy', experience_years = 2
WHERE id = (SELECT id FROM users WHERE (email LIKE '%sneha%' OR email LIKE '%employee4%') AND role = 'employee' LIMIT 1);

UPDATE users 
SET name = 'Vikram Singh', experience_years = 4
WHERE id = (SELECT id FROM users WHERE (email LIKE '%vikram%' OR email LIKE '%employee5%') AND role = 'employee' LIMIT 1);

UPDATE users 
SET name = 'Anjali Mehta', experience_years = 6
WHERE id = (SELECT id FROM users WHERE (email LIKE '%anjali%' OR email LIKE '%employee6%') AND role = 'employee' LIMIT 1);

UPDATE users 
SET name = 'Rohit Verma', experience_years = 1
WHERE id = (SELECT id FROM users WHERE (email LIKE '%rohit%' OR email LIKE '%employee7%') AND role = 'employee' LIMIT 1);

UPDATE users 
SET name = 'Kavita Nair', experience_years = 8
WHERE id = (SELECT id FROM users WHERE (email LIKE '%kavita%' OR email LIKE '%employee8%') AND role = 'employee' LIMIT 1);

-- For any remaining employees without names, assign default names
DO $$
DECLARE
  emp_count INT;
  emp_names TEXT[] := ARRAY['Ramesh Kumar', 'Sunita Devi', 'Manoj Singh', 'Deepa Sharma', 'Kiran Reddy', 'Pooja Patel', 'Suresh Nair', 'Meera Joshi'];
  emp_idx INT := 1;
  emp_id UUID;
  emp_exp INT[] := ARRAY[3, 4, 5, 2, 6, 3, 7, 4];
BEGIN
  FOR emp_id IN SELECT id FROM users WHERE role = 'employee' AND name IS NULL LOOP
    IF emp_idx <= array_length(emp_names, 1) THEN
      UPDATE users 
      SET name = emp_names[emp_idx], experience_years = emp_exp[emp_idx]
      WHERE id = emp_id;
      emp_idx := emp_idx + 1;
    END IF;
  END LOOP;
END $$;

-- ============================================
-- STEP 2: Insert VEHICLE PRODUCTS (40+ vehicles)
-- All prices in INR
-- ============================================

DO $$
DECLARE
  admin_id UUID;
  emp_id UUID;
BEGIN
  -- Get admin ID
  SELECT id INTO admin_id FROM users WHERE role = 'admin' LIMIT 1;
  IF admin_id IS NULL THEN
    SELECT id INTO admin_id FROM users LIMIT 1;
  END IF;
  
  -- Get first employee ID for some products
  SELECT id INTO emp_id FROM users WHERE role = 'employee' LIMIT 1;
  
  -- ========== CARS (15 models) ==========
  INSERT INTO vehicle_products (type, brand, model, specs, features, price_in_inr, image_url, created_by, created_at)
  VALUES 
    -- Hatchbacks
    ('car', 'Maruti Suzuki', 'Swift', 
     '{"engine": "1.2L Petrol", "mileage": "23.2 kmpl", "seating": 5, "transmission": "Manual", "fuel_type": "Petrol", "power": "82 bhp", "torque": "113 Nm"}'::jsonb,
     '["Power Steering", "Air Conditioning", "Music System", "Central Locking", "ABS", "Dual Airbags", "Rear Parking Sensors"]'::jsonb,
     650000, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800', 
     admin_id, NOW() - INTERVAL '8 months'),
    
    ('car', 'Maruti Suzuki', 'Baleno', 
     '{"engine": "1.2L Petrol", "mileage": "22.35 kmpl", "seating": 5, "transmission": "Manual", "fuel_type": "Petrol", "power": "82 bhp", "torque": "113 Nm"}'::jsonb,
     '["Smart Hybrid", "Touchscreen", "Auto AC", "Keyless Entry", "ABS", "6 Airbags", "Rear Camera"]'::jsonb,
     700000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '7 months'),
    
    ('car', 'Hyundai', 'i20', 
     '{"engine": "1.2L Petrol", "mileage": "20.35 kmpl", "seating": 5, "transmission": "Manual", "fuel_type": "Petrol", "power": "82 bhp", "torque": "115 Nm"}'::jsonb,
     '["Touchscreen Infotainment", "Rear Camera", "Push Start", "Auto AC", "Alloy Wheels", "6 Airbags", "Wireless Charging"]'::jsonb,
     750000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '6 months'),
    
    ('car', 'Tata', 'Altroz', 
     '{"engine": "1.2L Petrol", "mileage": "19.05 kmpl", "seating": 5, "transmission": "Manual", "fuel_type": "Petrol", "power": "85 bhp", "torque": "113 Nm"}'::jsonb,
     '["Touchscreen", "JBL Sound System", "Cruise Control", "6 Airbags", "Connected Car Tech", "Rain Sensing Wipers"]'::jsonb,
     680000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '5 months'),
    
    -- Sedans
    ('car', 'Honda', 'City', 
     '{"engine": "1.5L Petrol", "mileage": "17.8 kmpl", "seating": 5, "transmission": "CVT", "fuel_type": "Petrol", "power": "121 bhp", "torque": "145 Nm"}'::jsonb,
     '["Honda Sensing", "Lane Watch", "Sunroof", "Wireless Charging", "8 Speaker System", "6 Airbags", "360 Camera"]'::jsonb,
     1200000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '4 months'),
    
    ('car', 'Hyundai', 'Verna', 
     '{"engine": "1.5L Petrol", "mileage": "18.6 kmpl", "seating": 5, "transmission": "CVT", "fuel_type": "Petrol", "power": "115 bhp", "torque": "144 Nm"}'::jsonb,
     '["Touchscreen", "Sunroof", "Ventilated Seats", "Wireless Charging", "Bose Sound System", "6 Airbags"]'::jsonb,
     1100000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '3 months'),
    
    ('car', 'Maruti Suzuki', 'Ciaz', 
     '{"engine": "1.5L Petrol", "mileage": "20.65 kmpl", "seating": 5, "transmission": "Manual", "fuel_type": "Petrol", "power": "103 bhp", "torque": "138 Nm"}'::jsonb,
     '["Touchscreen", "Auto AC", "Keyless Entry", "ABS", "Dual Airbags", "Rear AC Vents"]'::jsonb,
     950000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '2 months'),
    
    -- SUVs
    ('car', 'Tata', 'Nexon', 
     '{"engine": "1.5L Diesel", "mileage": "21.5 kmpl", "seating": 5, "transmission": "Manual", "fuel_type": "Diesel", "power": "110 bhp", "torque": "260 Nm"}'::jsonb,
     '["Sunroof", "Touchscreen", "Cruise Control", "6 Airbags", "Connected Car Tech", "360 Camera", "Wireless Charging"]'::jsonb,
     850000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '6 months'),
    
    ('car', 'Mahindra', 'XUV700', 
     '{"engine": "2.0L Diesel", "mileage": "15 kmpl", "seating": 7, "transmission": "Automatic", "fuel_type": "Diesel", "power": "182 bhp", "torque": "450 Nm"}'::jsonb,
     '["ADAS", "Panoramic Sunroof", "Wireless Charging", "360 Camera", "Premium Sound System", "7 Airbags", "Auto Parking"]'::jsonb,
     2500000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '5 months'),
    
    ('car', 'Tata', 'Harrier', 
     '{"engine": "2.0L Diesel", "mileage": "16.35 kmpl", "seating": 5, "transmission": "Automatic", "fuel_type": "Diesel", "power": "168 bhp", "torque": "350 Nm"}'::jsonb,
     '["JBL Sound System", "Sunroof", "360 Camera", "6 Airbags", "Connected Car Tech", "Terrain Response"]'::jsonb,
     1800000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '4 months'),
    
    ('car', 'Hyundai', 'Creta', 
     '{"engine": "1.5L Petrol", "mileage": "17.4 kmpl", "seating": 5, "transmission": "CVT", "fuel_type": "Petrol", "power": "113 bhp", "torque": "144 Nm"}'::jsonb,
     '["Touchscreen", "Sunroof", "Ventilated Seats", "Wireless Charging", "6 Airbags", "360 Camera", "Bose Sound"]'::jsonb,
     1400000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '3 months'),
    
    ('car', 'Kia', 'Seltos', 
     '{"engine": "1.5L Petrol", "mileage": "16.8 kmpl", "seating": 5, "transmission": "CVT", "fuel_type": "Petrol", "power": "113 bhp", "torque": "144 Nm"}'::jsonb,
     '["10.25 Touchscreen", "Sunroof", "Ventilated Seats", "Bose Sound", "6 Airbags", "360 Camera", "Smart Pure Air"]'::jsonb,
     1350000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '2 months'),
    
    ('car', 'Toyota', 'Innova Crysta', 
     '{"engine": "2.4L Diesel", "mileage": "13.68 kmpl", "seating": 7, "transmission": "Manual", "fuel_type": "Diesel", "power": "148 bhp", "torque": "343 Nm"}'::jsonb,
     '["Touchscreen", "Rear AC", "Captain Seats", "ABS", "Hill Assist", "6 Airbags", "Cruise Control"]'::jsonb,
     1800000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '1 month'),
    
    ('car', 'Mahindra', 'Scorpio', 
     '{"engine": "2.2L Diesel", "mileage": "15.2 kmpl", "seating": 7, "transmission": "Manual", "fuel_type": "Diesel", "power": "130 bhp", "torque": "300 Nm"}'::jsonb,
     '["Touchscreen", "Sunroof", "7 Airbags", "Hill Descent Control", "ABS", "Rear Camera", "Cruise Control"]'::jsonb,
     1600000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '20 days'),
    
    ('car', 'MG', 'Hector', 
     '{"engine": "1.5L Petrol", "mileage": "14.1 kmpl", "seating": 5, "transmission": "CVT", "fuel_type": "Petrol", "power": "141 bhp", "torque": "250 Nm"}'::jsonb,
     '["10.4 Touchscreen", "Panoramic Sunroof", "6 Airbags", "360 Camera", "Connected Car", "Wireless Charging", "Bose Sound"]'::jsonb,
     1900000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     admin_id, NOW() - INTERVAL '10 days');

  -- ========== BIKES (12 models) ==========
  INSERT INTO vehicle_products (type, brand, model, specs, features, price_in_inr, image_url, created_by, created_at)
  VALUES 
    ('bike', 'Hero', 'Splendor Plus', 
     '{"engine": "97.2cc", "mileage": "80 kmpl", "fuel_tank": "9.8L", "fuel_type": "Petrol", "power": "7.9 bhp", "torque": "8.05 Nm"}'::jsonb,
     '["i3S Technology", "Side Stand Indicator", "LED Tail Lamp", "Digital Speedometer", "Kick & Self Start"]'::jsonb,
     75000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '7 months'),
    
    ('bike', 'Hero', 'Passion Pro', 
     '{"engine": "110cc", "mileage": "75 kmpl", "fuel_tank": "9.5L", "fuel_type": "Petrol", "power": "9.1 bhp", "torque": "9.3 Nm"}'::jsonb,
     '["i3S Technology", "LED Tail Lamp", "Digital Console", "Kick & Self Start", "Side Stand Indicator"]'::jsonb,
     78000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '6 months'),
    
    ('bike', 'Honda', 'Shine', 
     '{"engine": "124cc", "mileage": "65 kmpl", "fuel_tank": "10.5L", "fuel_type": "Petrol", "power": "10.3 bhp", "torque": "10.3 Nm"}'::jsonb,
     '["HET Engine", "Combi Brake System", "LED Headlight", "Digital Meter", "Kick & Self Start"]'::jsonb,
     85000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '5 months'),
    
    ('bike', 'Honda', 'Unicorn', 
     '{"engine": "160cc", "mileage": "62 kmpl", "fuel_tank": "13L", "fuel_type": "Petrol", "power": "12.7 bhp", "torque": "14 Nm"}'::jsonb,
     '["HET Engine", "LED Headlight", "Digital Meter", "Disc Brake", "Monoshock Suspension"]'::jsonb,
     115000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '4 months'),
    
    ('bike', 'Bajaj', 'Pulsar 150', 
     '{"engine": "149.5cc", "mileage": "50 kmpl", "fuel_tank": "15L", "fuel_type": "Petrol", "power": "14 bhp", "torque": "13.4 Nm"}'::jsonb,
     '["DTS-i Engine", "Nitrox Suspension", "Digital Console", "LED Tail Lamp", "Disc Brake"]'::jsonb,
     120000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '3 months'),
    
    ('bike', 'Bajaj', 'Pulsar NS200', 
     '{"engine": "199.5cc", "mileage": "40 kmpl", "fuel_tank": "12L", "fuel_type": "Petrol", "power": "23.5 bhp", "torque": "18.3 Nm"}'::jsonb,
     '["Liquid Cooling", "ABS", "Digital Console", "LED Tail Lamp", "Tubeless Tyres"]'::jsonb,
     145000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '2 months'),
    
    ('bike', 'Yamaha', 'MT-15', 
     '{"engine": "155cc", "mileage": "45 kmpl", "fuel_tank": "10L", "fuel_type": "Petrol", "power": "18.6 bhp", "torque": "14.1 Nm"}'::jsonb,
     '["LED Headlight", "Digital Instrument Cluster", "ABS", "Liquid Cooling", "VVA Technology"]'::jsonb,
     165000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '1 month'),
    
    ('bike', 'Yamaha', 'R15 V4', 
     '{"engine": "155cc", "mileage": "50 kmpl", "fuel_tank": "11L", "fuel_type": "Petrol", "power": "18.1 bhp", "torque": "14.2 Nm"}'::jsonb,
     '["LED Headlight", "Digital TFT Display", "ABS", "Liquid Cooling", "Deltabox Frame", "Quick Shifter"]'::jsonb,
     195000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '20 days'),
    
    ('bike', 'Royal Enfield', 'Classic 350', 
     '{"engine": "349cc", "mileage": "35 kmpl", "fuel_tank": "13.5L", "fuel_type": "Petrol", "power": "20.2 bhp", "torque": "27 Nm"}'::jsonb,
     '["Tripper Navigation", "LED Lighting", "USB Charging", "ABS", "Digital Console", "Alloy Wheels"]'::jsonb,
     195000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '15 days'),
    
    ('bike', 'Royal Enfield', 'Hunter 350', 
     '{"engine": "349cc", "mileage": "36 kmpl", "fuel_tank": "13L", "fuel_type": "Petrol", "power": "20.2 bhp", "torque": "27 Nm"}'::jsonb,
     '["Tripper Navigation", "LED Headlight", "Digital Console", "ABS", "Alloy Wheels", "USB Charging"]'::jsonb,
     185000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '10 days'),
    
    ('bike', 'TVS', 'Apache RTR 160', 
     '{"engine": "159.7cc", "mileage": "55 kmpl", "fuel_tank": "12L", "fuel_type": "Petrol", "power": "16.5 bhp", "torque": "14.8 Nm"}'::jsonb,
     '["Race Tuned Engine", "Digital Console", "ABS", "LED Headlight", "Tubeless Tyres", "Glide Through Technology"]'::jsonb,
     130000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '5 days'),
    
    ('bike', 'KTM', 'Duke 200', 
     '{"engine": "199.5cc", "mileage": "35 kmpl", "fuel_tank": "13.5L", "fuel_type": "Petrol", "power": "25 bhp", "torque": "19.5 Nm"}'::jsonb,
     '["LED Headlight", "TFT Display", "ABS", "Liquid Cooling", "Traction Control", "Ride Modes"]'::jsonb,
     225000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '3 days');

  -- ========== AUTOS (5 models) ==========
  INSERT INTO vehicle_products (type, brand, model, specs, features, price_in_inr, image_url, created_by, created_at)
  VALUES 
    ('auto', 'Bajaj', 'RE Compact', 
     '{"engine": "145.45cc", "mileage": "35 kmpl", "seating": 3, "fuel_type": "CNG", "power": "8.2 bhp", "torque": "10.5 Nm"}'::jsonb,
     '["CNG Kit", "Digital Meter", "LED Tail Lamp", "Comfortable Seating", "Power Steering"]'::jsonb,
     250000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     emp_id, NOW() - INTERVAL '5 months'),
    
    ('auto', 'Piaggio', 'Ape Xtra', 
     '{"engine": "395cc", "mileage": "30 kmpl", "seating": 3, "fuel_type": "Diesel", "power": "8.5 bhp", "torque": "19.5 Nm"}'::jsonb,
     '["Power Steering", "Digital Console", "Comfortable Cabin", "High Ground Clearance", "Durable Build"]'::jsonb,
     320000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     emp_id, NOW() - INTERVAL '4 months'),
    
    ('auto', 'Mahindra', 'Alfa Plus', 
     '{"engine": "909cc", "mileage": "22 kmpl", "seating": 4, "fuel_type": "Diesel", "power": "20 bhp", "torque": "52 Nm"}'::jsonb,
     '["Power Steering", "Digital Meter", "Music System", "Comfort Seats", "Spacious Cabin"]'::jsonb,
     380000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     emp_id, NOW() - INTERVAL '3 months'),
    
    ('auto', 'TVS', 'King', 
     '{"engine": "198cc", "mileage": "28 kmpl", "seating": 3, "fuel_type": "Petrol", "power": "8.5 bhp", "torque": "16.5 Nm"}'::jsonb,
     '["Digital Meter", "LED Tail Lamp", "Comfortable Seating", "Durable Engine", "Easy Maintenance"]'::jsonb,
     280000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     emp_id, NOW() - INTERVAL '2 months'),
    
    ('auto', 'Atul', 'Gem', 
     '{"engine": "198cc", "mileage": "30 kmpl", "seating": 3, "fuel_type": "Petrol", "power": "8.2 bhp", "torque": "15.8 Nm"}'::jsonb,
     '["Digital Console", "LED Lights", "Comfortable Cabin", "Fuel Efficient", "Low Maintenance"]'::jsonb,
     270000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
     emp_id, NOW() - INTERVAL '1 month');

  -- ========== SCOOTIES (8 models) ==========
  INSERT INTO vehicle_products (type, brand, model, specs, features, price_in_inr, image_url, created_by, created_at)
  VALUES 
    ('scooty', 'Honda', 'Activa 6G', 
     '{"engine": "109.51cc", "mileage": "60 kmpl", "fuel_tank": "5.3L", "fuel_type": "Petrol", "power": "7.68 bhp", "torque": "8.84 Nm"}'::jsonb,
     '["HET Engine", "External Fuel Filler", "LED Headlight", "Digital Meter", "i-Map Technology"]'::jsonb,
     75000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '6 months'),
    
    ('scooty', 'Honda', 'Dio', 
     '{"engine": "109.51cc", "mileage": "58 kmpl", "fuel_tank": "5.3L", "fuel_type": "Petrol", "power": "7.68 bhp", "torque": "8.84 Nm"}'::jsonb,
     '["HET Engine", "LED Headlight", "Digital Meter", "External Fuel Filler", "Combi Brake"]'::jsonb,
     72000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '5 months'),
    
    ('scooty', 'TVS', 'Jupiter', 
     '{"engine": "109.7cc", "mileage": "62 kmpl", "fuel_tank": "5.5L", "fuel_type": "Petrol", "power": "7.88 bhp", "torque": "8.8 Nm"}'::jsonb,
     '["External Fuel Filler", "LED Tail Lamp", "Digital Console", "USB Charging", "Eco Thrust Engine"]'::jsonb,
     72000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '4 months'),
    
    ('scooty', 'TVS', 'Ntorq 125', 
     '{"engine": "124.8cc", "mileage": "45 kmpl", "fuel_tank": "5.8L", "fuel_type": "Petrol", "power": "9.25 bhp", "torque": "10.5 Nm"}'::jsonb,
     '["LED Headlight", "Digital TFT Display", "USB Charging", "Race Tuned Engine", "Tubeless Tyres"]'::jsonb,
     95000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '3 months'),
    
    ('scooty', 'Suzuki', 'Access 125', 
     '{"engine": "124cc", "mileage": "58 kmpl", "fuel_tank": "5.6L", "fuel_type": "Petrol", "power": "8.7 bhp", "torque": "10 Nm"}'::jsonb,
     '["SEP Engine", "LED Headlight", "Digital Meter", "Side Stand Engine Cut-off", "External Fuel Filler"]'::jsonb,
     85000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '2 months'),
    
    ('scooty', 'Yamaha', 'Fascino 125', 
     '{"engine": "125cc", "mileage": "55 kmpl", "fuel_tank": "5.2L", "fuel_type": "Petrol", "power": "8.2 bhp", "torque": "9.7 Nm"}'::jsonb,
     '["Blue Core Engine", "LED Headlight", "Digital Meter", "Smart Key System", "External Fuel Filler"]'::jsonb,
     95000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '1 month'),
    
    ('scooty', 'Hero', 'Pleasure Plus', 
     '{"engine": "110.9cc", "mileage": "58 kmpl", "fuel_tank": "5.5L", "fuel_type": "Petrol", "power": "7.8 bhp", "torque": "8.7 Nm"}'::jsonb,
     '["i3S Technology", "LED Tail Lamp", "Digital Speedometer", "External Fuel Filler", "Kick & Self Start"]'::jsonb,
     68000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '20 days'),
    
    ('scooty', 'Aprilia', 'SR 160', 
     '{"engine": "160cc", "mileage": "45 kmpl", "fuel_tank": "7L", "fuel_type": "Petrol", "power": "15.6 bhp", "torque": "11.4 Nm"}'::jsonb,
     '["LED Headlight", "Digital TFT Display", "ABS", "USB Charging", "Racing DNA", "Tubeless Tyres"]'::jsonb,
     135000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
     emp_id, NOW() - INTERVAL '10 days');

END $$;

-- ============================================
-- STEP 3: Insert SPARE PARTS (50+ parts)
-- All prices in INR
-- ============================================

DO $$
DECLARE
  emp_id UUID;
  emp_ids UUID[];
  emp_idx INT := 1;
BEGIN
  -- Get all employee IDs
  SELECT ARRAY_AGG(id) INTO emp_ids FROM users WHERE role = 'employee';
  
  -- If no employees, use admin
  IF emp_ids IS NULL OR array_length(emp_ids, 1) = 0 THEN
    SELECT id INTO emp_id FROM users LIMIT 1;
    emp_ids := ARRAY[emp_id];
  END IF;
  
  -- ========== ENGINE PARTS (10 items) ==========
  INSERT INTO spare_parts (name, type, compatible_models, price_in_inr, image_url, stock, created_by, created_at)
  VALUES 
    ('Engine Oil Filter', 'engine', '["Swift", "i20", "City", "Nexon", "Baleno", "Altroz"]'::jsonb, 450, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 150, emp_ids[1], NOW() - INTERVAL '7 months'),
    ('Air Filter Element', 'engine', '["Swift", "i20", "Pulsar 150", "Activa 6G", "Splendor Plus", "Shine"]'::jsonb, 350, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 200, emp_ids[1], NOW() - INTERVAL '6 months'),
    ('Spark Plug Set (4 pcs)', 'engine', '["Splendor Plus", "Shine", "Pulsar 150", "MT-15", "Classic 350"]'::jsonb, 280, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 180, emp_ids[1], NOW() - INTERVAL '5 months'),
    ('Radiator Cap', 'engine', '["Swift", "i20", "City", "Nexon", "XUV700", "Creta"]'::jsonb, 250, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 120, emp_ids[1], NOW() - INTERVAL '4 months'),
    ('Timing Belt', 'engine', '["City", "Innova Crysta", "XUV700", "Harrier", "Scorpio"]'::jsonb, 3500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 45, emp_ids[1], NOW() - INTERVAL '3 months'),
    ('Fuel Pump', 'engine', '["Swift", "i20", "City", "Nexon", "Baleno", "Altroz"]'::jsonb, 4500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 35, emp_ids[1], NOW() - INTERVAL '2 months'),
    ('Water Pump', 'engine', '["City", "Verna", "Ciaz", "Nexon", "XUV700"]'::jsonb, 2800, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 40, emp_ids[1], NOW() - INTERVAL '1 month'),
    ('Thermostat', 'engine', '["Swift", "i20", "City", "Nexon", "All Cars"]'::jsonb, 450, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 80, emp_ids[1], NOW() - INTERVAL '20 days'),
    ('Radiator Hose', 'engine', '["Swift", "i20", "City", "Nexon", "XUV700"]'::jsonb, 650, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 60, emp_ids[1], NOW() - INTERVAL '15 days'),
    ('Engine Mount', 'engine', '["Swift", "i20", "City", "Nexon", "Baleno"]'::jsonb, 1800, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 50, emp_ids[1], NOW() - INTERVAL '10 days');

  -- ========== BRAKE PARTS (10 items) ==========
  INSERT INTO spare_parts (name, type, compatible_models, price_in_inr, image_url, stock, created_by, created_at)
  VALUES 
    ('Brake Pad Set (Front)', 'brake', '["Swift", "i20", "City", "Nexon", "Baleno", "Altroz"]'::jsonb, 1200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 80, emp_ids[1], NOW() - INTERVAL '6 months'),
    ('Brake Pad Set (Rear)', 'brake', '["Swift", "i20", "City", "Nexon", "Baleno", "Altroz"]'::jsonb, 950, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 85, emp_ids[1], NOW() - INTERVAL '5 months'),
    ('Brake Disc (Front)', 'brake', '["Pulsar 150", "MT-15", "Classic 350", "Apache RTR", "Duke 200"]'::jsonb, 1800, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 60, emp_ids[1], NOW() - INTERVAL '4 months'),
    ('Brake Disc (Rear)', 'brake', '["Pulsar 150", "MT-15", "Classic 350", "Apache RTR", "Duke 200"]'::jsonb, 1500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 65, emp_ids[1], NOW() - INTERVAL '3 months'),
    ('Brake Shoe Set', 'brake', '["Splendor Plus", "Shine", "Activa 6G", "Jupiter", "Dio", "Access 125"]'::jsonb, 450, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 100, emp_ids[1], NOW() - INTERVAL '2 months'),
    ('Brake Fluid (DOT 4)', 'brake', '["All Models"]'::jsonb, 350, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 200, emp_ids[1], NOW() - INTERVAL '1 month'),
    ('Brake Master Cylinder', 'brake', '["Swift", "i20", "City", "Nexon", "XUV700"]'::jsonb, 2800, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 40, emp_ids[1], NOW() - INTERVAL '20 days'),
    ('Brake Caliper', 'brake', '["Pulsar 150", "MT-15", "Apache RTR", "Duke 200"]'::jsonb, 3200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 35, emp_ids[1], NOW() - INTERVAL '15 days'),
    ('Brake Line (Front)', 'brake', '["Swift", "i20", "City", "Nexon", "All Cars"]'::jsonb, 850, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 55, emp_ids[1], NOW() - INTERVAL '10 days'),
    ('Brake Line (Rear)', 'brake', '["Swift", "i20", "City", "Nexon", "All Cars"]'::jsonb, 750, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 58, emp_ids[1], NOW() - INTERVAL '5 days');

  -- ========== ELECTRICAL PARTS (10 items) ==========
  INSERT INTO spare_parts (name, type, compatible_models, price_in_inr, image_url, stock, created_by, created_at)
  VALUES 
    ('Battery (12V 35Ah)', 'electrical', '["Swift", "i20", "City", "Nexon", "Baleno"]'::jsonb, 4500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 50, emp_ids[1], NOW() - INTERVAL '6 months'),
    ('Battery (12V 40Ah)', 'electrical', '["XUV700", "Harrier", "Innova Crysta", "Scorpio"]'::jsonb, 5500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 40, emp_ids[1], NOW() - INTERVAL '5 months'),
    ('Headlight Bulb (LED)', 'electrical', '["All Models"]'::jsonb, 850, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 120, emp_ids[1], NOW() - INTERVAL '4 months'),
    ('Headlight Bulb (Halogen)', 'electrical', '["All Models"]'::jsonb, 450, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 150, emp_ids[1], NOW() - INTERVAL '3 months'),
    ('Tail Light Assembly', 'electrical', '["Swift", "i20", "Pulsar 150", "MT-15", "Apache RTR"]'::jsonb, 1800, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 40, emp_ids[1], NOW() - INTERVAL '2 months'),
    ('Alternator', 'electrical', '["City", "Innova Crysta", "XUV700", "Harrier", "Scorpio"]'::jsonb, 8500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 25, emp_ids[1], NOW() - INTERVAL '1 month'),
    ('Starter Motor', 'electrical', '["Swift", "i20", "City", "Nexon", "Baleno", "Altroz"]'::jsonb, 5500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 30, emp_ids[1], NOW() - INTERVAL '20 days'),
    ('Fuse Box', 'electrical', '["All Models"]'::jsonb, 1200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 55, emp_ids[1], NOW() - INTERVAL '15 days'),
    ('Horn (Electric)', 'electrical', '["All Models"]'::jsonb, 350, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 100, emp_ids[1], NOW() - INTERVAL '10 days'),
    ('Wiring Harness', 'electrical', '["Swift", "i20", "City", "Nexon"]'::jsonb, 3500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 20, emp_ids[1], NOW() - INTERVAL '5 days');

  -- ========== BODY PARTS (10 items) ==========
  INSERT INTO spare_parts (name, type, compatible_models, price_in_inr, image_url, stock, created_by, created_at)
  VALUES 
    ('Front Bumper', 'body', '["Swift", "i20", "Baleno", "Altroz"]'::jsonb, 8500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 15, emp_ids[1], NOW() - INTERVAL '5 months'),
    ('Rear Bumper', 'body', '["Swift", "i20", "City", "Baleno"]'::jsonb, 7500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 18, emp_ids[1], NOW() - INTERVAL '4 months'),
    ('Side Mirror (Left)', 'body', '["Swift", "i20", "City", "Nexon", "All Cars"]'::jsonb, 1200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 35, emp_ids[1], NOW() - INTERVAL '3 months'),
    ('Side Mirror (Right)', 'body', '["Swift", "i20", "City", "Nexon", "All Cars"]'::jsonb, 1200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 35, emp_ids[1], NOW() - INTERVAL '3 months'),
    ('Windshield Glass', 'body', '["Swift", "i20", "City", "Baleno", "Altroz"]'::jsonb, 6500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 20, emp_ids[1], NOW() - INTERVAL '2 months'),
    ('Door Handle (Front)', 'body', '["Swift", "i20", "City", "Nexon", "All Cars"]'::jsonb, 850, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 50, emp_ids[1], NOW() - INTERVAL '1 month'),
    ('Door Handle (Rear)', 'body', '["Swift", "i20", "City", "Nexon", "All Cars"]'::jsonb, 750, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 52, emp_ids[1], NOW() - INTERVAL '20 days'),
    ('Bonnet (Hood)', 'body', '["Swift", "i20", "City", "Nexon"]'::jsonb, 12000, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 12, emp_ids[1], NOW() - INTERVAL '15 days'),
    ('Boot Lid', 'body', '["Swift", "i20", "City", "Baleno", "Altroz"]'::jsonb, 9500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 14, emp_ids[1], NOW() - INTERVAL '10 days'),
    ('Grille (Front)', 'body', '["Swift", "i20", "City", "Nexon", "XUV700"]'::jsonb, 3500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 25, emp_ids[1], NOW() - INTERVAL '5 days');

  -- ========== SUSPENSION PARTS (10 items) ==========
  INSERT INTO spare_parts (name, type, compatible_models, price_in_inr, image_url, stock, created_by, created_at)
  VALUES 
    ('Shock Absorber (Front)', 'suspension', '["Swift", "i20", "Pulsar 150", "MT-15", "Apache RTR"]'::jsonb, 2500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 40, emp_ids[1], NOW() - INTERVAL '4 months'),
    ('Shock Absorber (Rear)', 'suspension', '["Swift", "i20", "Pulsar 150", "MT-15", "Apache RTR"]'::jsonb, 2200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 45, emp_ids[1], NOW() - INTERVAL '3 months'),
    ('Coil Spring (Front)', 'suspension', '["City", "Nexon", "XUV700", "Harrier", "Scorpio"]'::jsonb, 3500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 30, emp_ids[1], NOW() - INTERVAL '2 months'),
    ('Coil Spring (Rear)', 'suspension', '["City", "Nexon", "XUV700", "Harrier", "Scorpio"]'::jsonb, 3200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 32, emp_ids[1], NOW() - INTERVAL '1 month'),
    ('Strut Assembly (Front)', 'suspension', '["City", "Innova Crysta", "XUV700", "Harrier"]'::jsonb, 5500, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 25, emp_ids[1], NOW() - INTERVAL '20 days'),
    ('Strut Assembly (Rear)', 'suspension', '["City", "Innova Crysta", "XUV700", "Harrier"]'::jsonb, 5200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 26, emp_ids[1], NOW() - INTERVAL '15 days'),
    ('Stabilizer Bar', 'suspension', '["Swift", "i20", "City", "Nexon", "All Cars"]'::jsonb, 1800, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 38, emp_ids[1], NOW() - INTERVAL '10 days'),
    ('Control Arm', 'suspension', '["City", "Nexon", "XUV700", "Harrier"]'::jsonb, 4200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 28, emp_ids[1], NOW() - INTERVAL '5 days'),
    ('Ball Joint', 'suspension', '["Swift", "i20", "City", "Nexon", "All Cars"]'::jsonb, 650, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 60, emp_ids[1], NOW() - INTERVAL '3 days'),
    ('Bush Kit', 'suspension', '["Swift", "i20", "City", "Nexon", "All Cars"]'::jsonb, 850, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 55, emp_ids[1], NOW() - INTERVAL '1 day');

END $$;

-- ============================================
-- STEP 4: Generate ATTENDANCE RECORDS (Last 120 days)
-- More comprehensive attendance data
-- ============================================

DO $$
DECLARE
  emp_id UUID;
  attendance_date DATE;
  login_time TIMESTAMPTZ;
  logout_time TIMESTAMPTZ;
  total_hrs NUMERIC;
  -- Cities in Telangana and Andhra Pradesh only
  cities TEXT[] := ARRAY['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Ramagundam', 'Khammam', 'Mahbubnagar', 'Nalgonda', 'Suryapet', 'Vijayawada', 'Visakhapatnam', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kakinada', 'Kadapa'];
  city_idx INT;
  lat NUMERIC;
  lon NUMERIC;
  emp_cursor CURSOR FOR SELECT id FROM users WHERE role = 'employee';
BEGIN
  FOR emp_rec IN emp_cursor LOOP
    emp_id := emp_rec.id;
    city_idx := 1;
    
    -- Generate attendance for last 120 days
    FOR i IN 0..119 LOOP
      attendance_date := CURRENT_DATE - (i || ' days')::INTERVAL;
      
      -- Skip some weekends and random days (sick leaves) - 18% chance
      IF (EXTRACT(DOW FROM attendance_date) NOT IN (0, 6)) AND (random() > 0.18) THEN
        -- Generate login time between 8:00 AM and 9:30 AM
        login_time := attendance_date + (8 + random() * 1.5)::NUMERIC * INTERVAL '1 hour' + 
                      (random() * 30)::INTEGER * INTERVAL '1 minute';
        
        -- Generate logout time between 5:30 PM and 7:00 PM (8.5-10 hours later)
        logout_time := login_time + (8.5 + random() * 1.5)::NUMERIC * INTERVAL '1 hour';
        
        total_hrs := EXTRACT(EPOCH FROM (logout_time - login_time)) / 3600;
        
        -- Rotate through cities
        IF city_idx > array_length(cities, 1) THEN
          city_idx := 1;
        END IF;
        
        -- Generate coordinates based on city (Telangana & Andhra Pradesh only)
        CASE cities[city_idx]
          -- Telangana Cities
          WHEN 'Hyderabad' THEN lat := 17.3850 + (random() * 0.15); lon := 78.4867 + (random() * 0.15);
          WHEN 'Warangal' THEN lat := 18.0000 + (random() * 0.1); lon := 79.5833 + (random() * 0.1);
          WHEN 'Nizamabad' THEN lat := 18.6715 + (random() * 0.1); lon := 78.0988 + (random() * 0.1);
          WHEN 'Karimnagar' THEN lat := 18.4386 + (random() * 0.1); lon := 79.1288 + (random() * 0.1);
          WHEN 'Ramagundam' THEN lat := 18.8000 + (random() * 0.1); lon := 79.4500 + (random() * 0.1);
          WHEN 'Khammam' THEN lat := 17.2473 + (random() * 0.1); lon := 80.1514 + (random() * 0.1);
          WHEN 'Mahbubnagar' THEN lat := 16.7338 + (random() * 0.1); lon := 77.9982 + (random() * 0.1);
          WHEN 'Nalgonda' THEN lat := 17.0544 + (random() * 0.1); lon := 79.2673 + (random() * 0.1);
          WHEN 'Suryapet' THEN lat := 17.1406 + (random() * 0.1); lon := 79.6225 + (random() * 0.1);
          -- Andhra Pradesh Cities
          WHEN 'Vijayawada' THEN lat := 16.5062 + (random() * 0.1); lon := 80.6480 + (random() * 0.1);
          WHEN 'Visakhapatnam' THEN lat := 17.6868 + (random() * 0.1); lon := 83.2185 + (random() * 0.1);
          WHEN 'Guntur' THEN lat := 16.3067 + (random() * 0.1); lon := 80.4365 + (random() * 0.1);
          WHEN 'Nellore' THEN lat := 14.4426 + (random() * 0.1); lon := 79.9865 + (random() * 0.1);
          WHEN 'Kurnool' THEN lat := 15.8281 + (random() * 0.1); lon := 78.0373 + (random() * 0.1);
          WHEN 'Rajahmundry' THEN lat := 17.0005 + (random() * 0.1); lon := 81.8040 + (random() * 0.1);
          WHEN 'Tirupati' THEN lat := 13.6288 + (random() * 0.1); lon := 79.4192 + (random() * 0.1);
          WHEN 'Kakinada' THEN lat := 16.9333 + (random() * 0.1); lon := 82.2167 + (random() * 0.1);
          WHEN 'Kadapa' THEN lat := 14.4664 + (random() * 0.1); lon := 78.8239 + (random() * 0.1);
          ELSE lat := 17.3850 + (random() * 0.15); lon := 78.4867 + (random() * 0.15); -- Default to Hyderabad
        END CASE;
        
        INSERT INTO attendance (user_id, date, login_time, logout_time, latitude, longitude, city, total_hours, created_at)
        VALUES (
          emp_id,
          attendance_date,
          login_time,
          logout_time,
          lat,
          lon,
          cities[city_idx],
          total_hrs,
          NOW() - (i || ' days')::INTERVAL
        ) ON CONFLICT DO NOTHING;
        
        city_idx := city_idx + 1;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- STEP 5: Generate SALES RECORDS (Last 8 months)
-- Extensive sales data for analytics
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
  vehicle_count INT;
  spare_count INT;
  total_sales INT;
  emp_cursor CURSOR FOR SELECT id FROM users WHERE role = 'employee';
BEGIN
  FOR emp_rec IN emp_cursor LOOP
    emp_id := emp_rec.id;
    
    -- Get counts for distribution
    SELECT COUNT(*) INTO vehicle_count FROM vehicle_products;
    SELECT COUNT(*) INTO spare_count FROM spare_parts;
    
    -- Generate 40-70 sales per employee over last 8 months (240 days)
    total_sales := 50 + (random() * 30)::INTEGER;
    
    FOR i IN 1..total_sales LOOP
      sale_date := CURRENT_DATE - ((random() * 240)::INTEGER || ' days')::INTERVAL;
      
      -- 65% vehicle sales, 35% spare parts
      IF random() < 0.65 THEN
        -- Vehicle sale
        SELECT id, price_in_inr INTO vehicle_id, sale_price 
        FROM vehicle_products 
        ORDER BY random() 
        LIMIT 1;
        
        IF vehicle_id IS NOT NULL THEN
          sale_profit := sale_price * (0.05 + random() * 0.12); -- 5-17% profit
          sale_type := 'vehicle';
          product_id := vehicle_id;
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
        END IF;
      ELSE
        -- Spare part sale
        SELECT id, price_in_inr INTO spare_part_id, sale_price 
        FROM spare_parts 
        ORDER BY random() 
        LIMIT 1;
        
        IF spare_part_id IS NOT NULL THEN
          sale_profit := sale_price * (0.15 + random() * 0.25); -- 15-40% profit
          sale_type := 'spare_part';
          product_id := spare_part_id;
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
        END IF;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- STEP 6: Generate CLIENT INTERACTIONS (Last 4 months)
-- Comprehensive interaction data
-- ============================================

DO $$
DECLARE
  emp_id UUID;
  interaction_date DATE;
  interaction_status TEXT;
  visit_count INT;
  status_rand NUMERIC;
  emp_cursor CURSOR FOR SELECT id FROM users WHERE role = 'employee';
BEGIN
  FOR emp_rec IN emp_cursor LOOP
    emp_id := emp_rec.id;
    
    -- Generate 80-120 interactions per employee over last 4 months (120 days)
    FOR i IN 1..(100 + (random() * 40)::INTEGER) LOOP
      interaction_date := CURRENT_DATE - ((random() * 120)::INTEGER || ' days')::INTERVAL;
      
      status_rand := random();
      
      -- Status distribution: 45% contacted, 35% accepted, 20% rejected
      IF status_rand < 0.45 THEN
        interaction_status := 'contacted';
        visit_count := 1;
      ELSIF status_rand < 0.80 THEN
        interaction_status := 'accepted';
        visit_count := 2 + (random() * 4)::INTEGER; -- 2-6 visits
      ELSE
        interaction_status := 'rejected';
        visit_count := 1;
      END IF;
      
      INSERT INTO client_interactions (employee_id, status, visits, date)
      VALUES (
        emp_id,
        interaction_status,
        visit_count,
        interaction_date
      ) ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- VERIFICATION & SUMMARY
-- ============================================

-- Check data counts
SELECT 
  'Users' as table_name, 
  COUNT(*) as total_records,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
  COUNT(CASE WHEN role = 'employee' THEN 1 END) as employees
FROM users
UNION ALL
SELECT 
  'Vehicle Products', 
  COUNT(*), 
  COUNT(DISTINCT type), 
  COUNT(DISTINCT brand) 
FROM vehicle_products
UNION ALL
SELECT 
  'Spare Parts', 
  COUNT(*), 
  COUNT(DISTINCT type), 
  0 
FROM spare_parts
UNION ALL
SELECT 
  'Attendance Records', 
  COUNT(*), 
  COUNT(DISTINCT user_id), 
  COUNT(DISTINCT date) 
FROM attendance
UNION ALL
SELECT 
  'Sales Records', 
  COUNT(*), 
  COUNT(DISTINCT employee_id), 
  COUNT(DISTINCT type) 
FROM sales_records
UNION ALL
SELECT 
  'Client Interactions', 
  COUNT(*), 
  COUNT(DISTINCT employee_id), 
  COUNT(DISTINCT status) 
FROM client_interactions;

-- Revenue Summary
SELECT 
  'Total Revenue (INR)' as metric,
  SUM(price)::BIGINT as value
FROM sales_records
UNION ALL
SELECT 
  'Total Profit (INR)',
  SUM(profit)::BIGINT
FROM sales_records
UNION ALL
SELECT 
  'Average Sale Price (INR)',
  AVG(price)::BIGINT
FROM sales_records
UNION ALL
SELECT 
  'Total Vehicles Sold',
  COUNT(*)
FROM sales_records
WHERE type = 'vehicle'
UNION ALL
SELECT 
  'Total Spare Parts Sold',
  COUNT(*)
FROM sales_records
WHERE type = 'spare_part';

-- Employee Performance Summary
SELECT 
  u.name as employee_name,
  COUNT(DISTINCT sr.id) as total_sales,
  COALESCE(SUM(sr.price), 0)::BIGINT as total_revenue,
  COALESCE(SUM(sr.profit), 0)::BIGINT as total_profit,
  COUNT(DISTINCT ci.id) as client_interactions,
  COUNT(DISTINCT CASE WHEN ci.status = 'accepted' THEN ci.id END) as clients_accepted
FROM users u
LEFT JOIN sales_records sr ON u.id = sr.employee_id
LEFT JOIN client_interactions ci ON u.id = ci.employee_id
WHERE u.role = 'employee'
GROUP BY u.id, u.name
ORDER BY total_revenue DESC;

-- Sample data preview
SELECT 'Sample Vehicles' as preview, brand, model, price_in_inr::BIGINT as price_inr FROM vehicle_products ORDER BY created_at DESC LIMIT 5;
SELECT 'Sample Spare Parts' as preview, name, type, price_in_inr::BIGINT as price_inr, stock FROM spare_parts ORDER BY created_at DESC LIMIT 5;
SELECT 'Recent Sales' as preview, COUNT(*) as count, SUM(price)::BIGINT as revenue FROM sales_records WHERE sale_date >= CURRENT_DATE - INTERVAL '30 days';

