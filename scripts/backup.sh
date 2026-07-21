#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="${APP_NAME:-cafco}"
APP_ROOT="${APP_ROOT:-/var/www/cafco}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/cafco}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
SERVER_IP_FILE="${SERVER_IP_FILE:-infra/hetzner/.server-ip}"
SSH_USER="${SSH_USER:-deploy}"
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/cafco_hetzner}"

if [[ "${REMOTE_BACKUP:-0}" == "1" || -n "${SERVER_HOST:-}" ]]; then
  if [[ -z "${SERVER_HOST:-}" && -f "${SERVER_IP_FILE}" ]]; then
    SERVER_HOST="$(tr -d '[:space:]' < "${SERVER_IP_FILE}")"
  fi
  if [[ -z "${SERVER_HOST:-}" ]]; then
    echo "ERROR: SERVER_HOST is required for remote backup." >&2
    exit 1
  fi

  SSH_OPTS=(-o BatchMode=yes -o StrictHostKeyChecking=accept-new)
  if [[ -f "${SSH_KEY_PATH}" ]]; then
    SSH_OPTS+=(-i "${SSH_KEY_PATH}")
  fi

  ssh "${SSH_OPTS[@]}" "${SSH_USER}@${SERVER_HOST}" "sudo /usr/local/bin/cafco-backup"
  exit 0
fi

timestamp="$(date -u +%Y%m%d%H%M%S)"
current_release=""
if [[ -L "${APP_ROOT}/current" ]]; then
  current_release="$(readlink -f "${APP_ROOT}/current" || true)"
fi

if [[ -z "${current_release}" || ! -d "${current_release}" ]]; then
  echo "ERROR: No current release found at ${APP_ROOT}/current." >&2
  exit 1
fi

mkdir -p "${BACKUP_DIR}"
stage="$(mktemp -d)"
archive_tmp="${BACKUP_DIR}/${APP_NAME}-${timestamp}.tar.gz.tmp"
archive="${BACKUP_DIR}/${APP_NAME}-${timestamp}.tar.gz"
trap 'rm -rf "${stage}" "${archive_tmp}"' EXIT

mkdir -p "${stage}/release" "${stage}/shared"
rsync -a --delete \
  --exclude 'node_modules/' \
  --exclude '.next/cache/' \
  "${current_release}/" "${stage}/release/"

if [[ -d "${APP_ROOT}/shared" ]]; then
  rsync -a "${APP_ROOT}/shared/" "${stage}/shared/"
fi

cat > "${stage}/manifest.json" <<EOF
{
  "app": "${APP_NAME}",
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "source_release": "${current_release}",
  "hostname": "$(hostname -f 2>/dev/null || hostname)"
}
EOF

tar -C "${stage}" -czf "${archive_tmp}" .
mv "${archive_tmp}" "${archive}"
chmod 0640 "${archive}"

find "${BACKUP_DIR}" -maxdepth 1 -type f -name "${APP_NAME}-*.tar.gz" -mtime "+${RETENTION_DAYS}" -delete
echo "${archive}"
