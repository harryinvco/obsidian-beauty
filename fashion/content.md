# Fashion Leads Table Setup Instructions

## Quick Setup (Recommended)

1. **Go to Supabase SQL Editor**
   - Open: https://supabase.com/dashboard/project/legzoryphvodcovbzxpb/editor
   - Click on "SQL Editor" in the left sidebar
   - Click "+ New query"

2. **Copy and paste the entire contents** of `create_fashion_leads_table.sql` into the SQL editor

3. **Click "Run"** (or press Cmd/Ctrl + Enter)

4. **Verify** - You should see a success message and the table will be created with:
   - 16 columns (id, email, first_name, website, ad_spend, monthly_revenue, growth_challenge, UTM parameters, timestamps)
   - Unique index on email (case-insensitive)
   - Row Level Security enabled
   - Service role policies for insert/select/update
   - Auto-update trigger for updated_at column

## Alternative: Python Script

If you prefer to run it via script:

```bash
cd /workspaces/obsidian-beauty/fashion
python3 setup-supabase-table.py
```

You'll be prompted for your Supabase database password (found in Project Settings > Database).

## Verify Table Creation

After creating the table, verify it exists:

1. Go to: https://supabase.com/dashboard/project/legzoryphvodcovbzxpb/editor
2. Click "Table Editor" in the left sidebar
3. You should see "fashion_leads" in the list of tables

## Test Insert (Optional)

You can test the table by running this query in SQL Editor:

```sql
INSERT INTO fashion_leads (
    email,
    first_name,
    website,
    ad_spend,
    monthly_revenue,
    growth_challenge
) VALUES (
    'test@example.com',
    'Test',
    'https://example.com',
    '$5K – $15K',
    '$500K – $1M',
    'Scaling profitably'
);

SELECT * FROM fashion_leads WHERE email = 'test@example.com';
```

Then delete the test record:

```sql
DELETE FROM fashion_leads WHERE email = 'test@example.com';
```

## Next Steps

Once the table is created:
- The fashion lead capture form will automatically save leads to this table
- You can view/export leads from the Supabase Table Editor
- The Netlify function at `/.netlify/functions/submit-fashion` is already configured to use this table
