#!/usr/bin/env python3
"""
Check IDS sync status in production database
"""

import subprocess
import sys
import os
from datetime import datetime

def run_ssh_command(command):
    """Run a command on the production server via SSH"""
    ssh_cmd = [
        "ssh",
        "-i", "~/.ssh/pema_ci",
        "-o", "StrictHostKeyChecking=no",
        "-o", "ConnectTimeout=10",
        "root@82.25.104.195",
        command
    ]

    try:
        result = subprocess.run(ssh_cmd, capture_output=True, text=True, timeout=30)
        return result.returncode == 0, result.stdout.strip(), result.stderr.strip()
    except subprocess.TimeoutExpired:
        return False, "", "SSH command timed out"
    except Exception as e:
        return False, "", f"SSH error: {e}"

def check_prod_ids_sync():
    """Check IDS sync status in production database"""

    print("🔍 Checking Production Database for IDS Sync")
    print("=" * 60)
    print(f"⏰ Check started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📍 Production Server: 82.25.104.195")
    print()

    # First check if we can connect to the server
    print("🔗 Testing SSH connection...")
    success, output, error = run_ssh_command("echo 'SSH connection successful'")
    if not success:
        print(f" Cannot connect to production server: {error}")
        print("   Make sure SSH key is configured and server is accessible")
        return False

    print(" SSH connection successful")
    print()

    # Check if Docker containers are running
    print("🐳 Checking Docker containers...")
    success, output, error = run_ssh_command("cd /opt/apps/Pema_BE && docker compose ps --format 'table {{.Name}}\\t{{.Status}}\\t{{.Ports}}'")
    if success:
        print("Container Status:")
        print(output)
    else:
        print(f" Cannot check containers: {error}")
    print()

    # Check database connectivity
    print("💾 Checking Database Connection...")
    db_check_cmd = """
    cd /opt/apps/Pema_BE && docker exec pema-db psql -h localhost -U pema_user -d pema_wellness -c "SELECT version();" 2>/dev/null | head -1
    """
    success, output, error = run_ssh_command(db_check_cmd)
    if success and output:
        print(" Database connection successful")
        print(f"   {output}")
    else:
        print(f" Database connection failed: {error}")
        return False
    print()

    # Check room availability table for IDS sync records
    print("📊 Checking Room Availability for IDS Sync Records...")
    sql_query = """
    SELECT
        COUNT(*) as total_records,
        COUNT(CASE WHEN source = 'ids_sync' THEN 1 END) as ids_sync_records,
        COUNT(DISTINCT CASE WHEN source = 'ids_sync' THEN room_code END) as ids_sync_rooms,
        MAX(CASE WHEN source = 'ids_sync' THEN updated_at END) as last_ids_sync,
        MAX(updated_at) as last_any_update
    FROM room_availability;
    """

    db_query_cmd = f"""
    cd /opt/apps/Pema_BE && docker exec pema-db psql -h localhost -U pema_user -d pema_wellness -c "{sql_query}" --no-align --field-separator='|' -t
    """

    success, output, error = run_ssh_command(db_query_cmd)
    if success and output.strip():
        try:
            parts = output.strip().split('|')
            if len(parts) >= 5:
                total_records = int(parts[0])
                ids_sync_records = int(parts[1])
                ids_sync_rooms = int(parts[2])
                last_ids_sync = parts[3] if parts[3] != '' else None
                last_any_update = parts[4] if parts[4] != '' else None

                print(f"📈 Total Records: {total_records}")
                print(f"🔄 IDS Sync Records: {ids_sync_records}")
                print(f"🏨 IDS Sync Rooms: {ids_sync_rooms}")

                if last_ids_sync:
                    sync_time = datetime.fromisoformat(last_ids_sync.replace(' ', 'T').split('+')[0])
                    now = datetime.now()
                    time_diff = now - sync_time.replace(tzinfo=None)
                    days_ago = time_diff.days
                    hours_ago = time_diff.seconds // 3600

                    print(f"📅 Last IDS Sync: {sync_time}")
                    print(f"⏰ Time Since: {days_ago} days, {hours_ago} hours ago")

                    if days_ago == 0:
                        print("🟢 STATUS: Synced today")
                    elif days_ago <= 1:
                        print("🟡 STATUS: Synced recently (within 24 hours)")
                    elif days_ago <= 7:
                        print("🟠 STATUS: Synced this week")
                    else:
                        print("🔴 STATUS: Sync overdue")
                else:
                    print(" Last IDS Sync: NEVER")

                if last_any_update:
                    update_time = datetime.fromisoformat(last_any_update.replace(' ', 'T').split('+')[0])
                    print(f"📅 Last Any Update: {update_time}")

                return ids_sync_records > 0
            else:
                print(f" Unexpected query result format: {output}")
                return False

        except Exception as e:
            print(f" Error parsing query result: {e}")
            print(f"   Raw output: {output}")
            return False
    else:
        print(f" Database query failed: {error}")
        print(f"   Raw output: {output}")
        return False

def get_recent_ids_sync_details():
    """Get details of recent IDS sync records"""

    print("\n📋 Recent IDS Sync Details")
    print("=" * 40)

    sql_query = """
    SELECT
        ra.room_code,
        ra.date,
        ra.available_count,
        ra.source,
        ra.updated_at,
        ra.external_reference
    FROM room_availability ra
    WHERE ra.source = 'ids_sync'
    ORDER BY ra.updated_at DESC
    LIMIT 20;
    """

    db_query_cmd = f"""
    cd /opt/apps/Pema_BE && docker exec pema-db psql -h localhost -U pema_user -d pema_wellness -c "{sql_query}" --no-align --field-separator='|' -t
    """

    success, output, error = run_ssh_command(db_query_cmd)
    if success and output.strip():
        lines = output.strip().split('\n')
        if lines and lines[0].strip():
            print("Room Code | Date | Available | Source | Updated | Reference")
            print("-" * 80)
            for line in lines:
                if line.strip():
                    parts = line.split('|')
                    if len(parts) >= 6:
                        room_code, date, available, source, updated, reference = parts
                        print(f"{room_code[:8]:>8} | {date} | {available:>8} | {source} | {updated.split(' ')[0]} | {reference[:10] if reference else ''}")
        else:
            print("No IDS sync records found")
    else:
        print(f" Cannot get sync details: {error}")

def check_ids_integration_status():
    """Check IDS integration configuration"""

    print("\n🔧 IDS Integration Status")
    print("=" * 40)

    # Check if integrations table has IDS config
    sql_query = """
    SELECT COUNT(*) as integration_count FROM integrations
    WHERE type = 'ids' OR name LIKE '%IDS%';
    """

    db_query_cmd = f"""
    cd /opt/apps/Pema_BE && docker exec pema-db psql -h localhost -U pema_user -d pema_wellness -c "{sql_query}" --no-align -t
    """

    success, output, error = run_ssh_command(db_query_cmd)
    if success and output.strip():
        count = int(output.strip())
        print(f"🔗 IDS Integrations Configured: {count}")
        if count == 0:
            print("⚠️ No IDS integration configuration found in database")
        else:
            print(" IDS integration appears to be configured")
    else:
        print(f" Cannot check integration status: {error}")

def check_recent_inventory_logs():
    """Check recent inventory-related logs"""

    print("\n📝 Recent Inventory Logs")
    print("=" * 40)

    # Check application logs for inventory activity
    log_check_cmd = """
    cd /opt/apps/Pema_BE && docker compose logs api --tail=50 2>/dev/null | grep -i inventory | tail -10
    """

    success, output, error = run_ssh_command(log_check_cmd)
    if success and output.strip():
        lines = output.strip().split('\n')
        print(f" Found {len(lines)} recent inventory log entries:")
        for line in lines[-5:]:  # Show last 5
            print(f"   {line}")
    else:
        print("📭 No recent inventory logs found")
        if error:
            print(f"   Error: {error}")

def main():
    """Main function"""

    print("🔍 PRODUCTION IDS SYNC VERIFICATION")
    print("=" * 70)

    # Check IDS sync status
    has_ids_sync = check_prod_ids_sync()

    if has_ids_sync:
        # Get detailed sync information
        get_recent_ids_sync_details()

    # Check integration status
    check_ids_integration_status()

    # Check recent logs
    check_recent_inventory_logs()

    # Final summary
    print("\n🎯 PRODUCTION VERIFICATION SUMMARY")
    print("=" * 70)

    if has_ids_sync:
        print(" SUCCESS: IDS has successfully synced inventory to production!")
        print("   Inventory data from IDS is present in the production database.")
        print("   The integration is working correctly.")
    else:
        print(" FAILURE: No IDS sync records found in production database.")
        print("   IDS has never successfully synced inventory to production.")
        print("   Check server status, webhook configuration, and IDS settings.")

    print("\n📞 NEXT STEPS:")
    print("1. If sync is working: Monitor for regular updates")
    print("2. If sync is failing: Check webhook URL and credentials with IDS")
    print("3. Verify server uptime: Ensure FastAPI container is running")
    print("4. Test webhook: Send test inventory notification to endpoint")

if __name__ == "__main__":
    main()
