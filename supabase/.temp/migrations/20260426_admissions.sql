CREATE TABLE IF NOT EXISTS public.admissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  child_name text NOT NULL,
  child_dob date NOT NULL,
  reason_for_admission text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

-- RLS
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone (even anonymous users) to insert an admission
CREATE POLICY "Anyone can insert admissions" ON public.admissions
  FOR INSERT
  WITH CHECK (true);

-- Allow admins to view and manage admissions
CREATE POLICY "Admins can view and manage admissions" ON public.admissions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
