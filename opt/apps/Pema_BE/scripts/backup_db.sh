#!/bin/sh

set -eu

# Settings
DB_HOST="db"
DB_PORT="5432"
DB_NAME="pema_wellness"
DB_USER="pema_user"
DB_PASSWORD="pema_password"

BACKUP_DIR="/backups"
TIMESTAMP="$(date +%Y-%m-%d_%H-%M-%S)"
FILENAME="${BACKUP_DIR}/pema_wellness_${TIMESTAMP}.sql.gz"

export PGPASSWORD="${DB_PASSWORD}"

mkdir -p "${BACKUP_DIR}"

pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" \
  --format=plain --no-owner --no-privileges \
  | gzip -9 > "${FILENAME}"

echo "Backup completed: ${FILENAME}"

# Optional: clean backups older than 14 days
find "${BACKUP_DIR}" -type f -name 'pema_wellness_*.sql.gz' -mtime +14 -exec rm -f {} \; || true


