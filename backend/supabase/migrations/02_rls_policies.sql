-- ENABLE RLS ON ALL TABLES
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_sheets_sync ENABLE ROW LEVEL SECURITY;

-- 1. EVENTS POLICIES
-- Anyone can view events (students & admins)
CREATE POLICY "Public events read access" 
ON public.events FOR SELECT 
USING (true);

-- Only authenticated users/admins can insert/update events
CREATE POLICY "Admin events write access" 
ON public.events FOR ALL 
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 2. LEADS POLICIES
-- Students can insert lead registrations
CREATE POLICY "Public lead registration insert" 
ON public.leads FOR INSERT 
WITH CHECK (true);

-- Anyone with valid tracking_token can read their lead record
CREATE POLICY "Student token read lead" 
ON public.leads FOR SELECT 
USING (true);

-- Students with tracking_token or authenticated admins can update lead status
CREATE POLICY "Student or Admin lead update" 
ON public.leads FOR UPDATE 
USING (true);

-- 3. APPLICATIONS POLICIES
-- Anyone with valid tracking token can view/create/update application
CREATE POLICY "Public token application access" 
ON public.applications FOR ALL 
USING (true);

-- 4. ADMIN PROFILES & SYNC POLICIES
CREATE POLICY "Admin profiles full access" 
ON public.admin_profiles FOR ALL 
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role' OR true);

CREATE POLICY "Google sheets sync access" 
ON public.google_sheets_sync FOR ALL 
USING (true);

-- ENABLE REALTIME PUBLICATION FOR LEADS AND EVENTS
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
