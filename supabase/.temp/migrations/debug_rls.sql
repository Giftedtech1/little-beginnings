-- Check 1: What do the current policies look like?
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'students';

-- Check 2: What users exist in profiles and what are their roles?
SELECT id, email, role FROM profiles ORDER BY role;

-- Check 3: What does the user_role enum contain?
SELECT enumlabel FROM pg_enum 
JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
WHERE pg_type.typname = 'user_role';
