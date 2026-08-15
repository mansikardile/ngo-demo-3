-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    target_year VARCHAR(50) NOT NULL,
    field_of_study VARCHAR(100) NOT NULL,
    max_capacity INTEGER DEFAULT 100,
    status VARCHAR(30) DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Ongoing', 'Completed', 'Archived')),
    registered_count INTEGER DEFAULT 0,
    started_count INTEGER DEFAULT 0,
    completed_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    event_code VARCHAR(50) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    field_of_study VARCHAR(100) NOT NULL,
    tracking_token VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(30) DEFAULT 'Registered' CHECK (status IN ('Registered', 'Started', 'Completed')),
    consent_given BOOLEAN DEFAULT FALSE,
    signature_data_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID UNIQUE REFERENCES public.leads(id) ON DELETE CASCADE,
    tracking_token VARCHAR(100) NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    step_completed INTEGER DEFAULT 1,
    stem_interest VARCHAR(255),
    gpa_score NUMERIC(4,2),
    family_income_bracket VARCHAR(100),
    essay_response TEXT,
    documents_status VARCHAR(50) DEFAULT 'Pending',
    submitted_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(30) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Under Review', 'Accepted', 'Rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ADMIN PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE, -- REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Outreach Manager',
    department VARCHAR(100) DEFAULT 'Katalyst STEM Initiative',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. GOOGLE SHEETS SYNC CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.google_sheets_sync (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spreadsheet_name VARCHAR(255) DEFAULT 'Katalyst_Leads_2026',
    spreadsheet_url TEXT DEFAULT 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    auto_sync_interval VARCHAR(50) DEFAULT 'Hourly',
    is_connected BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sync_status VARCHAR(50) DEFAULT 'Idle',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR HIGH PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_events_code ON public.events(event_code);
CREATE INDEX IF NOT EXISTS idx_leads_event_id ON public.leads(event_id);
CREATE INDEX IF NOT EXISTS idx_leads_tracking_token ON public.leads(tracking_token);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_applications_lead_id ON public.applications(lead_id);
CREATE INDEX IF NOT EXISTS idx_applications_tracking_token ON public.applications(tracking_token);

-- FUNCTION TO AUTO UPDATE COUNTS IN EVENTS TABLE WHEN LEADS CHANGED
CREATE OR REPLACE FUNCTION update_event_lead_counts()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.events
    SET 
        registered_count = (SELECT COUNT(*) FROM public.leads WHERE event_id = NEW.event_id),
        started_count = (SELECT COUNT(*) FROM public.leads WHERE event_id = NEW.event_id AND status IN ('Started', 'Completed')),
        completed_count = (SELECT COUNT(*) FROM public.leads WHERE event_id = NEW.event_id AND status = 'Completed'),
        updated_at = NOW()
    WHERE id = NEW.event_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_event_lead_counts
AFTER INSERT OR UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION update_event_lead_counts();
