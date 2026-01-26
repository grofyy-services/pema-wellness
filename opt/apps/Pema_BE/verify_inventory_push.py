#!/usr/bin/env python3
"""
Verify latest inventory push from IDS to our endpoint

This script checks:
1. Server status and accessibility
2. Recent inventory push logs
3. Database inventory updates (if accessible)
4. Provides manual verification steps
"""

import asyncio
import httpx
import os
from datetime import datetime, timedelta
from pathlib import Path
import subprocess
import sys

async def check_server_status():
    """Check if the FastAPI server is running and accessible"""
    print("🔍 Checking Server Status")
    print("=" * 40)

    urls_to_check = [
        "http://localhost:8000/health",
        "https://dev.pemawellness.com/health",
        "https://pemawellness.com/health"
    ]

    server_running = False
    for url in urls_to_check:
        try:
            print(f"Testing: {url}")
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(url)

            if response.status_code == 200:
                print(f" Server accessible at {url}")
                server_running = True
                break
            else:
                print(f"⚠️ Server responded with status {response.status_code} at {url}")

        except Exception as e:
            print(f" Cannot reach {url}: {e}")

    if not server_running:
        print("\n No server found running. IDS cannot push inventory.")
        print("   Start with: docker-compose up -d")
        print("   Or locally: python3 -m uvicorn app.main:app --reload --port 8000")

    return server_running

async def test_inventory_endpoint(base_url: str):
    """Test the inventory push endpoint"""
    print("\n📡 Testing Inventory Push Endpoint")
    print("=" * 40)

    endpoint_url = f"{base_url}/api/v1/ids/inventory/receive"

    # Test with invalid auth (should fail gracefully)
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                endpoint_url,
                content="<test></test>",
                headers={"Content-Type": "application/xml"}
            )

        if response.status_code == 401:
            print(" Inventory endpoint accessible (auth required - good!)")
            return True
        elif response.status_code == 200:
            print(" Inventory endpoint responding")
            return True
        else:
            print(f"⚠️ Unexpected response: {response.status_code}")
            return False

    except Exception as e:
        print(f" Cannot reach inventory endpoint: {e}")
        return False

def check_recent_logs():
    """Check for recent inventory push logs"""
    print("\n📋 Checking Recent Logs")
    print("=" * 40)

    log_files = [
        "uvicorn_debug.log",
        "/var/log/pema/api.log",  # Production log location
        "logs/app.log",  # Alternative log location
    ]

    found_recent_activity = False

    for log_file in log_files:
        if os.path.exists(log_file):
            print(f"Checking {log_file}...")

            try:
                # Check file modification time
                file_stat = os.stat(log_file)
                modified_time = datetime.fromtimestamp(file_stat.st_mtime)
                days_old = (datetime.now() - modified_time).days

                print(f"  Last modified: {modified_time.strftime('%Y-%m-%d %H:%M:%S')} ({days_old} days ago)")

                # Search for inventory-related logs
                result = subprocess.run(
                    ["grep", "-i", "inventory.*notification.*IDS", log_file],
                    capture_output=True, text=True, timeout=10
                )

                if result.returncode == 0 and result.stdout.strip():
                    lines = result.stdout.strip().split('\n')
                    recent_lines = []
                    for line in lines[-5:]:  # Last 5 inventory log entries
                        recent_lines.append(f"    {line}")

                    print("  📥 Recent inventory pushes found:")
                    for line in recent_lines:
                        print(line)
                    found_recent_activity = True
                else:
                    print("  📭 No inventory push logs found")

            except Exception as e:
                print(f"  Error checking {log_file}: {e}")
        else:
            print(f"Log file {log_file} not found")

    if not found_recent_activity:
        print("\n No recent inventory push activity detected in logs")

    return found_recent_activity

def check_database_inventory():
    """Check database for recent inventory updates"""
    print("\n💾 Checking Database Inventory Updates")
    print("=" * 40)

    # Try to get database connection details from environment
    db_host = os.getenv("POSTGRES_SERVER", "localhost")
    db_port = os.getenv("POSTGRES_PORT", "5432")
    db_name = os.getenv("POSTGRES_DB", "pema_wellness")
    db_user = os.getenv("POSTGRES_USER", "pema_user")
    db_password = os.getenv("POSTGRES_PASSWORD", "pema_password")

    print(f"Attempting to connect to: {db_host}:{db_port}/{db_name}")

    # Check if we can connect to database
    try:
        import psycopg2

        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            database=db_name,
            user=db_user,
            password=db_password,
            connect_timeout=5
        )

        cursor = conn.cursor()

        # Check recent inventory updates
        cursor.execute("""
            SELECT
                ra.room_id,
                r.name as room_name,
                r.code as room_code,
                ra.date,
                ra.available_count,
                ra.source,
                ra.updated_at
            FROM room_availability ra
            JOIN rooms r ON ra.room_id = r.id
            WHERE ra.updated_at > NOW() - INTERVAL '7 days'
            AND ra.source = 'ids_sync'
            ORDER BY ra.updated_at DESC
            LIMIT 10
        """)

        rows = cursor.fetchall()

        if rows:
            print(" Recent inventory updates found:")
            print("Room Name | Code | Date | Available | Source | Updated")
            print("-" * 60)
            for row in rows:
                room_id, room_name, room_code, date, available, source, updated = row
                print(f"{room_name[:12]} | {room_code} | {date} | {available:>3} | {source} | {updated.strftime('%m-%d %H:%M')}")
        else:
            print(" No recent inventory updates found in database")

        cursor.close()
        conn.close()

    except ImportError:
        print(" psycopg2 not available for database check")
        print("   Install with: pip install psycopg2-binary")
    except Exception as e:
        print(f" Cannot connect to database: {e}")
        print("   Database may not be running or credentials incorrect")

def provide_verification_steps():
    """Provide manual verification steps"""
    print("\n🔧 Manual Verification Steps")
    print("=" * 40)
    print("Since automated checks may not be available, verify manually:")
    print()
    print("1️⃣ Check Server Status:")
    print("   curl https://dev.pemawellness.com/health")
    print("   Should return: {\"status\":\"healthy\"}")
    print()
    print("2️⃣ Test Inventory Endpoint:")
    print("   curl -X POST https://dev.pemawellness.com/api/v1/ids/inventory/receive \\")
    print("        -H 'Content-Type: application/xml' \\")
    print("        -d '<test></test>'")
    print("   Should return: 401 Unauthorized (auth required)")
    print()
    print("3️⃣ Check Recent Logs:")
    print("   # If server is running, check logs:")
    print("   docker-compose logs api | grep -i 'inventory.*notification'")
    print("   # Look for: 'Received inventory notification XML from IDS'")
    print()
    print("4️⃣ Contact IDS Support:")
    print("   Ask: 'Have you sent inventory notifications to our webhook?'")
    print("   URL: https://dev.pemawellness.com/api/v1/ids/inventory/receive")
    print()
    print("5️⃣ Check Database (if accessible):")
    print("   SELECT * FROM room_availability")
    print("   WHERE source = 'ids_sync'")
    print("   AND updated_at > NOW() - INTERVAL '1 day'")
    print("   ORDER BY updated_at DESC;")

async def main():
    """Main verification function"""
    print("🔍 IDS INVENTORY PUSH VERIFICATION")
    print("=" * 50)
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()

    # Check server status
    server_running = await check_server_status()
    base_url = None

    if server_running:
        # Test inventory endpoint
        base_urls = ["http://localhost:8000", "https://dev.pemawellness.com", "https://pemawellness.com"]
        for url in base_urls:
            if await test_inventory_endpoint(url):
                base_url = url
                break

    # Check logs
    logs_found = check_recent_logs()

    # Check database
    check_database_inventory()

    # Provide manual steps
    provide_verification_steps()

    # Final verdict
    print("\n🎯 VERDICT")
    print("=" * 40)
    if server_running and logs_found:
        print(" EVIDENCE FOUND: IDS has pushed inventory recently!")
        print("   Server is running and inventory push logs detected.")
    elif server_running:
        print("⚠️ PARTIAL SUCCESS: Server is running but no recent inventory pushes detected.")
        print("   IDS may not have sent inventory notifications yet.")
    else:
        print(" NO ACTIVITY: Server is not running - IDS cannot push inventory.")
        print("   Start the server and contact IDS to verify webhook configuration.")

    print("\n📞 Next Steps:")
    print("1. Ensure FastAPI server is running: docker-compose up -d")
    print("2. Contact IDS support to confirm webhook URL configuration")
    print("3. Monitor logs for incoming inventory notifications")
    print("4. Test with sample XML if needed")

if __name__ == "__main__":
    asyncio.run(main())
