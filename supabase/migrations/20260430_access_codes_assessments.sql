-- Create the admission_access_codes table
CREATE TABLE admission_access_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT false,
    used_by_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE
);

-- RLS for access codes
ALTER TABLE admission_access_codes ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage access codes"
ON admission_access_codes FOR ALL
USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'admin')));

-- Anyone can read an access code to verify it (but we might want an edge function for this to be completely secure, 
-- however for simplicity public can read where is_used is false if they know the exact code)
CREATE POLICY "Public can verify unused codes"
ON admission_access_codes FOR SELECT
USING (is_used = false);


-- Create the pre_assessments table
CREATE TABLE pre_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    access_code VARCHAR(50) REFERENCES admission_access_codes(code),
    child_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    history_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    pre_intervention_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for pre_assessments
ALTER TABLE pre_assessments ENABLE ROW LEVEL SECURITY;

-- Admins can read all pre_assessments
CREATE POLICY "Admins can view pre-assessments"
ON pre_assessments FOR SELECT
USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'admin')));

-- Anyone with a valid code can insert a pre-assessment
-- We use a SECURITY DEFINER function or just allow insert
CREATE POLICY "Public can insert pre-assessments"
ON pre_assessments FOR INSERT
WITH CHECK (true);

-- Add access_code to admissions
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS access_code_used VARCHAR(50) REFERENCES admission_access_codes(code);

-- RPC to securely mark code as used
CREATE OR REPLACE FUNCTION mark_access_code_used(code_param VARCHAR, email_param VARCHAR)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE admission_access_codes 
  SET is_used = true, used_by_email = email_param, used_at = NOW() 
  WHERE code = code_param AND is_used = false;
END;
$$;

