ALTER TABLE public.admissions
ADD COLUMN IF NOT EXISTS form_data jsonb DEFAULT '{}'::jsonb;
