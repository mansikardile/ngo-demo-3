# Katalyst Backend & Database (Supabase)

Dedicated backend configuration, database schemas, Row Level Security (RLS) policies, and seed scripts for the Katalyst Student Outreach & Application Tracking System.

## Database Engine
- **Supabase PostgreSQL** with Supabase Auth, Realtime, and Row Level Security.

## Directory Structure
- `supabase/migrations/01_schema.sql` - Core database tables & indexes (`events`, `leads`, `applications`, `admin_profiles`, `google_sheets_sync`).
- `supabase/migrations/02_rls_policies.sql` - Row Level Security policies for secure access.
- `supabase/migrations/03_seed_data.sql` - Seed data (Initial STEM events & default admin authentication setup).

## Default Admin Credentials
- **Email**: `admin@katalystindia.org`
- **Password**: `KatalystAdmin2026!`

## Setting Up Supabase

1. Create a project at [Supabase](https://supabase.com).
2. Go to **SQL Editor** in your Supabase Dashboard.
3. Run `01_schema.sql`, `02_rls_policies.sql`, and `03_seed_data.sql` in order.
4. Copy your project's **URL** and **anon public key** from Project Settings -> API.
5. Paste them into `.env.local` inside `katalyst-admin-portal/` and `katalyst-student-portal/`:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```
