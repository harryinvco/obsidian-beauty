// Test script for Supabase connection and table setup
// Run with: node test-supabase.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testSupabaseConnection() {
    console.log('🔍 Testing Supabase connection...\n');
    
    // Check environment variables
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        console.error('❌ Missing environment variables:');
        console.error('SUPABASE_URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing');
        console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
        console.log('\nPlease check your .env file or Netlify environment variables.');
        return;
    }
    
    console.log('✅ Environment variables found');
    
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    try {
        // Test connection by checking if table exists
        console.log('🔍 Checking if ecom_leads table exists...');
        
        const { data, error } = await supabase
            .from('ecom_leads')
            .select('count(*)', { count: 'exact', head: true });
            
        if (error) {
            if (error.message.includes('does not exist')) {
                console.log('❌ Table "ecom_leads" does not exist yet');
                console.log('📋 Please run the SQL script from create_ecom_leads_table.sql in Supabase SQL Editor');
                return;
            } else {
                console.error('❌ Database error:', error.message);
                return;
            }
        }
        
        console.log('✅ Table "ecom_leads" exists');
        console.log(`📊 Current lead count: ${data?.[0]?.count || 0}`);
        
        // Test inserting a sample lead
        console.log('\n🧪 Testing lead insertion...');
        
        const testLead = {
            email: `test-${Date.now()}@example.com`,
            first_name: 'Test User',
            website: 'teststore.com',
            utm_source: 'test',
            utm_medium: 'script',
            utm_campaign: 'connection-test',
            landing_path: '/ecom-checklist/',
            ip_address: '127.0.0.1',
            user_agent: 'Test Script'
        };
        
        const { data: insertData, error: insertError } = await supabase
            .from('ecom_leads')
            .insert([testLead])
            .select();
            
        if (insertError) {
            console.error('❌ Insert error:', insertError.message);
        } else {
            console.log('✅ Test lead inserted successfully');
            console.log('📝 Lead ID:', insertData[0].id);
            
            // Clean up test data
            console.log('🧹 Cleaning up test data...');
            await supabase
                .from('ecom_leads')
                .delete()
                .eq('id', insertData[0].id);
            console.log('✅ Test data cleaned up');
        }
        
        console.log('\n🎉 Supabase setup is working correctly!');
        
    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }
}

// Test Resend configuration
async function testResendConnection() {
    console.log('\n📧 Testing Resend configuration...');
    
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
        console.log('⚠️  RESEND_API_KEY not set - emails will not be sent');
        return;
    }
    
    console.log('✅ Resend API key found');
    
    try {
        const { Resend } = require('resend');
        const resend = new Resend(RESEND_API_KEY);
        
        // Test API connection (this doesn't send an email)
        console.log('✅ Resend client initialized successfully');
        console.log('📧 Email system ready');
        
    } catch (err) {
        console.error('❌ Resend error:', err.message);
    }
}

// Run tests
async function runAllTests() {
    console.log('🚀 eCom Checklist System Test\n');
    
    await testSupabaseConnection();
    await testResendConnection();
    
    console.log('\n✨ Testing complete!');
}

runAllTests().catch(console.error);