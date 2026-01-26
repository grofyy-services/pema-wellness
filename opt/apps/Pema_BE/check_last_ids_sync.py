#!/usr/bin/env python3
"""
Check the last time IDS sync occurred by querying the database
"""

import os
import sys
import subprocess
from datetime import datetime, timedelta

def check_last_ids_sync():
    """Check when the last IDS sync occurred"""

    print("🔍 Checking Last IDS Sync Time")
    print("=" * 50)

    # Database connection details
    db_host = os.getenv("POSTGRES_SERVER", "localhost")
    db_port = os.getenv("POSTGRES_PORT", "5432")
    db_name = os.getenv("POSTGRES_DB", "pema_wellness")
    db_user = os.getenv("POSTGRES_USER", "pema_user")
    db_password = os.getenv("POSTGRES_PASSWORD", "pema_password")

    print(f"Database: {db_host}:{db_port}/{db_name}")
    print()

    # SQL query to find last IDS sync
    sql_query = """
    SELECT
        MAX(ra.updated_at) as last_sync_time,
        COUNT(*) as total_records,
        COUNT(DISTINCT ra.room_code) as unique_rooms,
        COUNT(DISTINCT DATE(ra.date)) as date_range
    FROM room_availability ra
    WHERE ra.source = 'ids_sync'
    AND ra.updated_at IS NOT NULL;
    """

    try:
        # Try to use psycopg2 if available
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
            cursor.execute(sql_query)
            result = cursor.fetchone()
            cursor.close()
            conn.close()

            if result and result[0]:
                last_sync_time = result[0]
                total_records = result[1] or 0
                unique_rooms = result[2] or 0
                date_range = result[3] or 0

                now = datetime.now()
                time_diff = now - last_sync_time.replace(tzinfo=None) if last_sync_time.tzinfo else now - last_sync_time
                days_ago = time_diff.days
                hours_ago = time_diff.seconds // 3600

                print(" Database Connection Successful")
                print(f"📅 Last IDS Sync: {last_sync_time}")
                print(f"⏰ Time Since: {days_ago} days, {hours_ago} hours ago")
                print(f"📊 Total Records: {total_records}")
                print(f"🏨 Unique Rooms: {unique_rooms}")
                print(f"📆 Date Range Coverage: {date_range} days")

                if days_ago == 0:
                    print("🟢 STATUS: Synced today")
                elif days_ago <= 1:
                    print("🟡 STATUS: Synced recently (within 24 hours)")
                elif days_ago <= 7:
                    print("🟠 STATUS: Synced this week")
                else:
                    print("🔴 STATUS: Sync overdue (last sync > 7 days ago)")

                return last_sync_time
            else:
                print(" No IDS sync records found in database")
                print("   This means IDS has never successfully synced inventory to your system")
                return None

        except ImportError:
            print("⚠️ psycopg2 not available, trying alternative methods...")
            raise

    except Exception as e:
        print(f" Cannot connect to database directly: {e}")
        print("\n🔄 Trying alternative: Docker container query...")

        # Try to query through docker if available
        try:
            docker_cmd = f"""
            docker exec pema-db psql -h localhost -U {db_user} -d {db_name} -c "{sql_query.replace(chr(10), ' ').replace(chr(9), ' ')}"
            """

            result = subprocess.run(docker_cmd, shell=True, capture_output=True, text=True, timeout=10)

            if result.returncode == 0 and result.stdout.strip():
                print(" Docker query successful")
                print("Raw output:")
                print(result.stdout)

                # Parse the output manually
                lines = result.stdout.strip().split('\n')
                for line in lines:
                    if '|' in line and not line.startswith('-'):
                        parts = [part.strip() for part in line.split('|')]
                        if len(parts) >= 1 and parts[0] and parts[0] != 'max':
                            try:
                                last_sync_time = datetime.fromisoformat(parts[0].replace(' ', 'T'))
                                print(f"\n📅 Last IDS Sync: {last_sync_time}")

                                now = datetime.now()
                                time_diff = now - last_sync_time
                                days_ago = time_diff.days
                                hours_ago = time_diff.seconds // 3600

                                print(f"⏰ Time Since: {days_ago} days, {hours_ago} hours ago")

                                if days_ago == 0:
                                    print("🟢 STATUS: Synced today")
                                elif days_ago <= 1:
                                    print("🟡 STATUS: Synced recently (within 24 hours)")
                                elif days_ago <= 7:
                                    print("🟠 STATUS: Synced this week")
                                else:
                                    print("🔴 STATUS: Sync overdue (last sync > 7 days ago)")

                                return last_sync_time
                            except:
                                continue

                print(" Could not parse sync time from Docker output")
                return None
            else:
                print(" Docker query failed")
                print(f"Error: {result.stderr}")
                return None

        except Exception as docker_e:
            print(f" Docker query also failed: {docker_e}")
            return None

def check_recent_inventory_notifications():
    """Check for recent inventory notification logs"""
    print("\n📋 Checking Recent Inventory Notification Logs")
    print("=" * 50)

    log_files = ["uvicorn_debug.log"]

    for log_file in log_files:
        if os.path.exists(log_file):
            print(f"Checking {log_file}...")

            try:
                # Use grep to find inventory notification logs
                result = subprocess.run(
                    ["grep", "-i", "inventory.*notification.*IDS", log_file],
                    capture_output=True, text=True, timeout=5
                )

                if result.returncode == 0 and result.stdout.strip():
                    lines = result.stdout.strip().split('\n')
                    print(f"📥 Found {len(lines)} inventory notification entries")

                    # Show the most recent ones
                    recent_lines = lines[-3:] if len(lines) > 3 else lines
                    for line in recent_lines:
                        print(f"  {line}")

                    # Extract timestamps from recent logs
                    for line in recent_lines[-1:]:  # Just the most recent
                        # Try to extract timestamp
                        if "INFO" in line and "-" in line[:20]:
                            try:
                                # Extract date from log line (format: 2025-10-29 10:44:34)
                                date_str = line.split()[0] + " " + line.split()[1]
                                log_time = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
                                print(f"📅 Most recent log entry: {log_time}")

                                now = datetime.now()
                                time_diff = now - log_time
                                days_ago = time_diff.days
                                hours_ago = time_diff.seconds // 3600

                                print(f"⏰ Log age: {days_ago} days, {hours_ago} hours ago")
                                break
                            except:
                                pass
                else:
                    print("📭 No inventory notification logs found")

            except Exception as e:
                print(f"Error checking {log_file}: {e}")

def main():
    """Main function"""
    print("🔍 IDS SYNC STATUS CHECK")
    print("=" * 60)
    print(f"⏰ Check started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()

    # Check database for last sync
    last_sync = check_last_ids_sync()

    # Check logs for recent activity
    check_recent_inventory_notifications()

    # Provide summary
    print("\n🎯 SUMMARY")
    print("=" * 50)

    if last_sync:
        days_since = (datetime.now() - last_sync.replace(tzinfo=None)).days

        if days_since == 0:
            print(" IDS last synced TODAY")
        elif days_since == 1:
            print(" IDS last synced YESTERDAY")
        elif days_since <= 7:
            print(f" IDS last synced {days_since} days ago")
        else:
            print(f"⚠️ IDS last synced {days_since} days ago (OUTDATED)")

        print(f"📅 Exact time: {last_sync}")
    else:
        print(" NO IDS SYNC RECORDS FOUND")
        print("   IDS has never successfully synced inventory to your system")
        print("   Contact IDS support to configure inventory notifications")

    print("\n📞 RECOMMENDATIONS:")
    print("1. Ensure your server is running: docker-compose up -d")
    print("2. Verify webhook URL with IDS: https://dev.pemawellness.com/api/v1/ids/inventory/receive")
    print("3. Request IDS to resend inventory data if sync is old")
    print("4. Monitor logs: docker-compose logs -f api | grep -i inventory")

if __name__ == "__main__":
    main()
