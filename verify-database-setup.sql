-- Quick diagnostic query to check beauty_leads table status
-- Run this in your Supabase SQL Editor to verify everything is correct

-- 1. Check if beauty_leads table exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'beauty_leads'
        ) 
        THEN '✅ beauty_leads table EXISTS' 
        ELSE '❌ beauty_leads table DOES NOT EXIST' 
    END AS table_status;

-- 2. Check if the typo table (bauty_leads) exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'bauty_leads'
        ) 
        THEN '⚠️  TYPO FOUND: bauty_leads table exists (should be beauty_leads)' 
        ELSE '✅ No typo table found' 
    END AS typo_check;

-- 3. List all tables with 'beauty' or 'bauty' in the name
SELECT 
    schemaname, 
    tablename,
    CASE 
        WHEN tablename = 'beauty_leads' THEN '✅ Correct name'
        WHEN tablename = 'bauty_leads' THEN '❌ TYPO - needs to be renamed'
        ELSE '⚠️  Unexpected table'
    END AS status
FROM pg_tables 
WHERE schemaname = 'public' 
AND (tablename LIKE '%beauty%' OR tablename LIKE '%bauty%')
ORDER BY tablename;

-- 4. If beauty_leads exists, show its structure
SELECT 
    column_name, 
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'beauty_leads'
ORDER BY ordinal_position;

-- 5. If beauty_leads exists, show record count
SELECT 
    COUNT(*) as total_leads,
    COUNT(DISTINCT email) as unique_emails,
    MIN(created_at) as first_lead,
    MAX(created_at) as latest_lead
FROM beauty_leads;
