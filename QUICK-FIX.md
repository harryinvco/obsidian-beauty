# Quick Start: Fix Beauty Page Form Submission

## ⚡ 3-Step Fix (Takes 2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New query"

### Step 2: Run This SQL Command
Copy and paste this into the SQL Editor:

```sql
ALTER TABLE public.bauty_leads RENAME TO beauty_leads;
```

Click **Run** (or press Ctrl+Enter)

✅ You should see: "Success. No rows returned"

### Step 3: Verify It Worked
Run this verification query:

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'beauty_leads';
```

✅ You should see: `beauty_leads` in the results

## 🎉 Done!

Your form should now work. Test it:
1. Visit https://offers.theobsidianco.com/beauty
2. Submit the form
3. You should be redirected to the thank-you page

## 🔍 Troubleshooting

### If the table doesn't exist at all:
Run the complete setup script from `supabase-setup.sql`

### If you still get errors after renaming:
1. Check Netlify environment variables are set:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Check Netlify function logs for detailed error messages
3. See `FIX-TABLE-NAME-TYPO.md` for comprehensive troubleshooting

### If you need to preserve existing data:
The `ALTER TABLE RENAME` command preserves all data - nothing is lost!

## 📖 More Information

- **Full Fix Guide**: See `FIX-TABLE-NAME-TYPO.md`
- **Verification Script**: See `verify-database-setup.sql`
- **Deployment Guide**: See `DEPLOYMENT-CHECKLIST.md`

## 💡 What This Fixes

**Error**: "Could not find the table 'public.beauty_leads'"

**Cause**: Database table is named `bauty_leads` (typo) instead of `beauty_leads`

**Solution**: Rename the table to match what the code expects

**Impact**: Form submissions will work immediately after the fix
