const { createClient } = require('@supabase/supabase-js');

// REMOVED EXPOSED SECRETS - Use environment variables instead
const SUPABASE_URL = process.env.SUPABASE_URL || 'your-supabase-url';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-key';

async function testTableAccess() {
    console.log('🔍 Testing table access...');
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    try {
        // Try to select from table
        const { data, error } = await supabase
            .from('ecom_leads')
            .select('*')
            .limit(1);
        
        if (error) {
            if (error.message.includes('does not exist')) {
                console.log('❌ Table "ecom_leads" does not exist');
                console.log('📋 Please run the SQL script in Supabase SQL Editor');
                return false;
            } else {
                console.log('❌ Error accessing table:', error);
                return false;
            }
        }
        
        console.log('✅ Table "ecom_leads" exists and is accessible!');
        console.log('📊 Sample data count:', data?.length || 0);
        return true;
        
    } catch (err) {
        console.log('❌ Connection error:', err.message);
        return false;
    }
}

async function testInsert() {
    console.log('\n🧪 Testing lead insertion...');
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const testLead = {
        email: `test-${Date.now()}@example.com`,
        first_name: 'Test User',
        website: 'teststore.com',
        utm_source: 'test',
        landing_path: '/ecom-checklist/'
    };
    
    try {
        const { data, error } = await supabase
            .from('ecom_leads')
            .insert([testLead])
            .select();
        
        if (error) {
            console.log('❌ Insert error:', error);
            return false;
        }
        
        console.log('✅ Test lead inserted successfully!');
        console.log('📝 Lead data:', data[0]);
        
        // Clean up
        await supabase
            .from('ecom_leads')
            .delete()
            .eq('id', data[0].id);
        console.log('🧹 Test data cleaned up');
        
        return true;
        
    } catch (err) {
        console.log('❌ Insert error:', err.message);
        return false;
    }
}

async function runTests() {
    console.log('🚀 eCom Checklist Database Test\n');
    
    const tableExists = await testTableAccess();
    
    if (tableExists) {
        const insertWorks = await testInsert();
        
        if (insertWorks) {
            console.log('\n🎉 Your database is ready for lead capture!');
            console.log('✅ Table exists and working');
            console.log('✅ Insert/delete operations working');
            console.log('✅ Your form will now save leads to Supabase');
        }
    }
}

runTests();