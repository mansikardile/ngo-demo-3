-- SEED DEFAULT ADMIN AUTHENTICATION USER & PROFILE
-- Note: When running in Supabase SQL Editor, inserting into auth.users creates the default admin user.
DO $$
DECLARE
    admin_uid UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
BEGIN
    -- Check if user exists in auth.users
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@katalystindia.org') THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            role
        ) VALUES (
            admin_uid,
            '00000000-0000-0000-0000-000000000000',
            'admin@katalystindia.org',
            crypt('KatalystAdmin2026!', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Katalyst Senior Admin"}',
            NOW(),
            NOW(),
            'authenticated'
        );
    END IF;
END $$;

-- SEED ADMIN PROFILE
INSERT INTO public.admin_profiles (email, full_name, role, department)
VALUES (
    'admin@katalystindia.org',
    'Katalyst Senior Administrator',
    'National Outreach Lead',
    'Katalyst STEM Initiative'
) ON CONFLICT (email) DO NOTHING;

-- SEED INITIAL KATALYST STEM OUTREACH EVENTS
INSERT INTO public.events (id, event_code, title, college_name, event_date, location, description, target_year, field_of_study, max_capacity, status)
VALUES 
(
    'e1111111-1111-1111-1111-111111111111',
    'EVT-COEP-2026',
    'COEP Engineering Outreach & Women in Tech Summit',
    'College of Engineering Pune (COEP)',
    NOW() + INTERVAL '5 days',
    'Auditorium B, COEP Campus, Pune',
    'Interactive session introducing high-potential female engineering students to Katalyst corporate mentorship and skill development.',
    '2nd & 3rd Year B.Tech',
    'Engineering & Technology',
    150,
    'Upcoming'
),
(
    'e2222222-2222-2222-2222-222222222222',
    'EVT-VJTI-2026',
    'VJTI STEM Leadership Drive & Scholarship Forum',
    'Veermata Jijabai Technological Institute (VJTI)',
    NOW() + INTERVAL '12 days',
    'Main Hall, VJTI Mumbai',
    'On-campus recruitment and awareness drive empowering low-income young women to excel in STEM careers.',
    '1st & 2nd Year B.E.',
    'Computer Science & Electronics',
    200,
    'Upcoming'
),
(
    'e3333333-3333-3333-3333-333333333333',
    'EVT-VNIT-2026',
    'VNIT Nagpur Women in STEM Excellence Conclave',
    'Visvesvaraya National Institute of Technology',
    NOW() - INTERVAL '2 days',
    'Convention Center, VNIT Nagpur',
    'Centralized registration drive for annual scholarship batch enrolment with corporate partner interactions.',
    '3rd Year B.Tech',
    'Electrical & Mechanical Engineering',
    120,
    'Ongoing'
)
ON CONFLICT (event_code) DO NOTHING;

-- SEED INITIAL SAMPLE LEADS
INSERT INTO public.leads (id, event_id, event_code, full_name, email, phone, college_name, academic_year, field_of_study, tracking_token, status, consent_given)
VALUES 
(
    'l1111111-1111-1111-1111-111111111111',
    'e1111111-1111-1111-1111-111111111111',
    'EVT-COEP-2026',
    'Priya Sharma',
    'priya.sharma@coep.ac.in',
    '+91 98230 11223',
    'College of Engineering Pune (COEP)',
    '2nd Year B.Tech',
    'Computer Engineering',
    'KAT-COEP-88219',
    'Completed',
    true
),
(
    'l2222222-2222-2222-2222-222222222222',
    'e1111111-1111-1111-1111-111111111111',
    'EVT-COEP-2026',
    'Ananya Deshmukh',
    'ananya.d@coep.ac.in',
    '+91 97654 33211',
    'College of Engineering Pune (COEP)',
    '3rd Year B.Tech',
    'Information Technology',
    'KAT-COEP-94102',
    'Started',
    true
),
(
    'l3333333-3333-3333-3333-333333333333',
    'e2222222-2222-2222-2222-222222222222',
    'EVT-VJTI-2026',
    'Sneha Kulkarni',
    'sneha.k@vjti.ac.in',
    '+91 99123 44556',
    'Veermata Jijabai Technological Institute (VJTI)',
    '1st Year B.E.',
    'Electronics Engineering',
    'KAT-VJTI-10293',
    'Registered',
    true
)
ON CONFLICT (tracking_token) DO NOTHING;

-- SEED INITIAL APPLICATIONS
INSERT INTO public.applications (lead_id, tracking_token, event_id, step_completed, stem_interest, gpa_score, family_income_bracket, essay_response, status)
VALUES 
(
    'l1111111-1111-1111-1111-111111111111',
    'KAT-COEP-88219',
    'e1111111-1111-1111-1111-111111111111',
    4,
    'Machine Learning & Artificial Intelligence',
    8.95,
    '< ₹2,00,000 / annum',
    'I aspire to lead innovative AI research while mentoring young women from my village to pursue higher education.',
    'Under Review'
)
ON CONFLICT (lead_id) DO NOTHING;

-- SEED GOOGLE SHEETS CONFIG
INSERT INTO public.google_sheets_sync (spreadsheet_name, spreadsheet_url, auto_sync_interval, is_connected)
VALUES ('Katalyst_Live_Outreach_Leads_2026', 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit', 'Hourly', true);
