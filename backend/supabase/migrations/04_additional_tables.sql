-- 04: Additional tables and columns for full real-time integration
-- Run this in your Supabase SQL Editor after 01, 02, 03 migrations

-- Add notes JSONB column to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS notes JSONB DEFAULT '[]'::jsonb;

-- NOTIFICATIONS TABLE for admin portal
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL DEFAULT 'system',
    title VARCHAR(255) NOT NULL,
    message TEXT,
    read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notifications full access"
ON public.notifications FOR ALL
USING (true);

-- Add notifications to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
