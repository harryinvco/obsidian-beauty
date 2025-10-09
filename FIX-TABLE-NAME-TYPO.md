# 🚨 URGENT FIX: Beauty Page Form Submission Error

## Problem
The beauty page form submission is failing with the error:
```
"code": "PGRST205",
"message": "Could not find the table 'public.beauty_leads' in the schema cache"
"hint": "Perhaps you meant the table 'public.bauty_leads'"
```

## Root Cause
There is a **typo in the Supabase database table name**. The table is currently named `bauty_leads` (missing an 'e') but the code is correctly trying to use `beauty_leads`.

## Solution

### Step 1: Fix the Database Table Name (REQUIRED)
You must run this SQL command in your Supabase SQL Editor:

```sql
ALTER TABLE public.bauty_leads RENAME TO beauty_leads;
```

**Detailed Steps:**
1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Paste the SQL command above
5. Click "Run" or press Ctrl+Enter
6. Verify success message

### Step 2: Verify the Fix
After renaming the table, run this query to confirm:

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE '%beauty%';
```

You should see `beauty_leads` in the results (not `bauty_leads`).

### Step 3: Test Form Submission
1. Go to `offers.theobsidianco.com/beauty`
2. Fill out the form with test data
3. Submit the form
4. You should be redirected to the thank-you page
5. Check your Supabase dashboard to verify the lead was captured in the `beauty_leads` table

## Alternative: Use the Automated Fix Script

If you prefer, you can run the complete fix script included in this repository:

```sql
-- Located in: fix-table-name-typo.sql
-- This script will:
-- 1. Check if the typo table exists
-- 2. Rename it if found
-- 3. Verify the new table name
-- 4. Show the table structure
```

## Why This Happened
The table was likely created manually with a typo, or there was an error during the initial database setup. The SQL setup file (`supabase-setup.sql`) correctly specifies `beauty_leads`, so this would only happen if:
- The table was created manually before running the setup script
- There was a typo when the table was first created
- A migration script had an error

## Prevention
Going forward, always use the provided `supabase-setup.sql` file to create database tables. This ensures consistency between the code and database schema.

## Files Reference
- **Fix Script**: `fix-table-name-typo.sql` - Automated fix for the table name
- **Setup Script**: `supabase-setup.sql` - Complete database schema (for new setups)
- **Function Code**: `netlify/functions/submit.js` - The working code that expects `beauty_leads`
- **Deployment Checklist**: `DEPLOYMENT-CHECKLIST.md` - Updated with fix instructions

## Status After Fix
Once you rename the table to `beauty_leads`:
- ✅ Beauty page form submissions will work
- ✅ Leads will be captured in the database
- ✅ Users will be redirected to the thank-you page
- ✅ Welcome emails will be sent (if Resend is configured)

## Need Help?
If you encounter any issues:
1. Check the Netlify function logs for detailed error messages
2. Verify environment variables are set correctly in Netlify
3. Confirm the table now exists with the correct name in Supabase
4. Test with the browser console open to see any client-side errors
