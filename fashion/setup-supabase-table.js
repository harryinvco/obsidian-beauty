const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupFashionLeadsTable() {
    console.log('🚀 Setting up fashion_leads table in Supabase...\n');

    try {
        // Read the SQL file
        const sqlFile = path.join(__dirname, 'create_fashion_leads_table.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        console.log('📄 SQL file loaded');
        console.log('🔧 Executing SQL commands...\n');

        // Split SQL into individual statements (handling multi-line statements)
        const statements = sql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i] + ';';

            // Skip comment-only lines
            if (statement.trim().startsWith('--')) continue;

            try {
                console.log(`Executing statement ${i + 1}/${statements.length}...`);

                const { data, error } = await supabase.rpc('exec_sql', {
                    sql_query: statement
                }).catch(async () => {
                    // Fallback: try direct query execution
                    return await supabase.from('_').select('*').limit(0);
                });

                if (error && !error.message.includes('already exists')) {
                    console.log(`⚠️  Statement ${i + 1}: ${error.message}`);
                    errorCount++;
                } else {
                    console.log(`✅ Statement ${i + 1}: Success`);
                    successCount++;
                }
            } catch (err) {
                // Check if it's an "already exists" error
                if (err.message && err.message.includes('already exists')) {
                    console.log(`ℹ️  Statement ${i + 1}: Already exists (skipping)`);
                    successCount++;
                } else {
                    console.log(`❌ Statement ${i + 1}: ${err.message}`);
                    errorCount++;
                }
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   ✅ Successful: ${successCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);

        // Verify table exists
        console.log('\n🔍 Verifying table exists...');
        const { data, error } = await supabase
            .from('fashion_leads')
            .select('*')
            .limit(1);

        if (error) {
            console.log('❌ Table verification failed:', error.message);
            console.log('\n⚠️  You may need to run the SQL manually in Supabase dashboard:');
            console.log('   1. Go to: https://supabase.com/dashboard/project/legzoryphvodcovbzxpb/editor');
            console.log('   2. Open SQL Editor');
            console.log('   3. Copy and paste the contents of create_fashion_leads_table.sql');
            console.log('   4. Run the query');
        } else {
            console.log('✅ Table "fashion_leads" verified successfully!');
            console.log('\n🎉 Setup complete! The fashion_leads table is ready to use.');
        }

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.log('\n💡 Alternative approach:');
        console.log('   Run the SQL manually in Supabase dashboard:');
        console.log('   1. Go to: https://supabase.com/dashboard/project/legzoryphvodcovbzxpb/editor');
        console.log('   2. Open SQL Editor');
        console.log('   3. Copy and paste the contents of create_fashion_leads_table.sql');
        console.log('   4. Run the query');
        process.exit(1);
    }
}

// Run the setup
setupFashionLeadsTable();
