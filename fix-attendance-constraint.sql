-- ============================================
-- FIX: Add Unique Constraint to Attendance Table
-- Prevents duplicate attendance records per user per day
-- ============================================

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_user_date'
  ) THEN
    ALTER TABLE attendance 
    ADD CONSTRAINT unique_user_date UNIQUE (user_id, date);
  END IF;
END $$;

-- Verify constraint was added
SELECT 
  conname as constraint_name,
  contype as constraint_type
FROM pg_constraint 
WHERE conrelid = 'attendance'::regclass
AND conname = 'unique_user_date';

