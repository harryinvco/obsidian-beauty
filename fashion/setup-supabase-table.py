#!/usr/bin/env python3
"""
Setup script to create fashion_leads table in Supabase using direct PostgreSQL connection
"""

import os
import sys
from pathlib import Path

try:
    import psycopg2
    from dotenv import load_dotenv
except ImportError:
    print("❌ Missing required packages. Installing...")
    os.system("pip install psycopg2-binary python-dotenv")
    import psycopg2
    from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL:
    print("❌ Missing SUPABASE_URL in .env file")
    sys.exit(1)

# Extract database connection details from Supabase URL
# Format: https://PROJECT_ID.supabase.co
project_id = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')

# Supabase PostgreSQL connection string
# Default format: postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
DB_CONFIG = {
    'host': f'db.{project_id}.supabase.co',
    'port': 5432,
    'database': 'postgres',
    'user': 'postgres',
}

print("🚀 Setting up fashion_leads table in Supabase...\n")
print("⚠️  You'll need the database password from your Supabase dashboard:")
print("   Go to: Project Settings > Database > Connection string > Password\n")

# Ask for password
db_password = input("Enter your Supabase database password: ").strip()

if not db_password:
    print("❌ Password is required")
    sys.exit(1)

DB_CONFIG['password'] = db_password

try:
    # Connect to Supabase PostgreSQL
    print("\n🔌 Connecting to Supabase PostgreSQL...")
    conn = psycopg2.connect(**DB_CONFIG)
    conn.autocommit = True
    cursor = conn.cursor()
    print("✅ Connected successfully!\n")

    # Read SQL file
    sql_file = Path(__file__).parent / 'create_fashion_leads_table.sql'
    print(f"📄 Reading SQL file: {sql_file.name}")
    sql_content = sql_file.read_text()

    # Split into individual statements
    statements = [s.strip() for s in sql_content.split(';') if s.strip() and not s.strip().startswith('--')]

    print(f"🔧 Executing {len(statements)} SQL statements...\n")

    success_count = 0
    error_count = 0

    for i, statement in enumerate(statements, 1):
        try:
            print(f"Executing statement {i}/{len(statements)}...", end=' ')
            cursor.execute(statement)
            print("✅ Success")
            success_count += 1
        except psycopg2.Error as e:
            if 'already exists' in str(e).lower():
                print("ℹ️  Already exists (skipping)")
                success_count += 1
            else:
                print(f"❌ Error: {e}")
                error_count += 1

    print(f"\n📊 Summary:")
    print(f"   ✅ Successful: {success_count}")
    print(f"   ❌ Errors: {error_count}")

    # Verify table exists
    print("\n🔍 Verifying table exists...")
    cursor.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'fashion_leads'")
    table_exists = cursor.fetchone()[0] > 0

    if table_exists:
        print("✅ Table 'fashion_leads' verified successfully!")

        # Show table structure
        cursor.execute("""
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'fashion_leads'
            ORDER BY ordinal_position
        """)
        columns = cursor.fetchall()
        print("\n📋 Table structure:")
        for col_name, col_type in columns:
            print(f"   - {col_name}: {col_type}")

        print("\n🎉 Setup complete! The fashion_leads table is ready to use.")
    else:
        print("❌ Table verification failed")

    cursor.close()
    conn.close()

except psycopg2.Error as e:
    print(f"\n❌ Database error: {e}")
    print("\n💡 Alternative approach:")
    print("   Run the SQL manually in Supabase dashboard:")
    print(f"   1. Go to: https://supabase.com/dashboard/project/{project_id}/editor")
    print("   2. Open SQL Editor")
    print("   3. Copy and paste the contents of create_fashion_leads_table.sql")
    print("   4. Run the query")
    sys.exit(1)

except Exception as e:
    print(f"\n❌ Unexpected error: {e}")
    sys.exit(1)
