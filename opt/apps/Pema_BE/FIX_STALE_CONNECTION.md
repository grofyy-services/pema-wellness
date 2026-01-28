# Fix: "column bookings.estimate_details does not exist" Error

## Problem
Even though the `estimate_details` column exists in the database (as verified in your database client), the application is still throwing the error:
```
column bookings.estimate_details does not exist
```

## Root Cause
This is typically caused by:
1. **Stale Connection Pool**: SQLAlchemy connection pool has cached connections that were established before the column was added
2. **Metadata Cache**: SQLAlchemy's table metadata might be cached in memory
3. **Different Database**: The application might be connecting to a different database than the one you're viewing

## Solution

### Quick Fix (Recommended)
**Restart the API container** to clear the connection pool:

```bash
# If using docker-compose
docker-compose restart api

# Or if using docker directly
docker restart <api-container-name>

# Or use the automated script
./fix_stale_connection.sh
```

This will:
- Close all existing database connections
- Clear the connection pool
- Force SQLAlchemy to reconnect and see the updated schema

### Verify the Fix
After restarting, test the endpoint:
```bash
curl http://localhost:8000/api/v1/bookings/search?q=test
```

### Diagnostic Script
Run the diagnostic script to verify the column exists:
```bash
# Inside the container
docker-compose exec api python check_estimate_details_column.py

# Or from host
docker exec <api-container> python /app/check_estimate_details_column.py
```

## Why This Happens

SQLAlchemy maintains a connection pool to improve performance. When you add a column to the database:
1. The database schema is updated ✅
2. But existing connections in the pool still have the old schema cached ❌
3. New queries use these stale connections and fail ❌

Restarting the container forces all connections to be re-established, so SQLAlchemy sees the updated schema.

## Prevention

The connection pool is configured with:
- `pool_pre_ping=True` - Tests connections before using them
- `pool_recycle=300` - Recycles connections after 5 minutes

However, if a column is added while the app is running, you still need to restart to see it immediately.

## Alternative: Verify Database Connection

If restarting doesn't work, verify the application is connecting to the correct database:

1. Check the DATABASE_URL in your `.env` or `docker-compose.yml`
2. Compare it with the database you're viewing in your client
3. Ensure they match (same host, port, database name)

```bash
# Check what database the app is using
docker-compose exec api env | grep DATABASE_URL
```
