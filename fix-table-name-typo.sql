-- URGENT: Fix table name typo in Supabase database
-- Run this SQL script in your Supabase SQL Editor to fix the table name issue

-- Step 1: Check if the typo table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public' 
        AND tablename = 'bauty_leads'
    ) THEN
        -- Step 2: Rename the table from 'bauty_leads' to 'beauty_leads'
        ALTER TABLE public.bauty_leads RENAME TO beauty_leads;
        RAISE NOTICE 'Table renamed from bauty_leads to beauty_leads';
        
        -- Step 3: Update any indexes that reference the old table name
        -- (indexes are automatically renamed by PostgreSQL when table is renamed)
        
    ELSE
        RAISE NOTICE 'Table bauty_leads does not exist. No action needed.';
    END IF;
END $$;

-- Verify the table now exists with correct name
SELECT 'beauty_leads table exists' AS status 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'beauty_leads';

-- Show the table structure to confirm
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'beauty_leads'
ORDER BY ordinal_position;
