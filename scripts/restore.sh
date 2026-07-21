#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="${APP_NAME:-cafco}"
APP_ROOT="${APP_ROOT:-/var/www/cafco}"
RELEASES_PATH="${RELEASES_PATH:-${APP_ROOT}/releases}"
CURRENT_PATH="${CURRENT_PATH:-${APP_ROOT}/current}"
SHARED_PATH="${SHARED_PATH:-${APP_ROOT}/shared}"
HEALTH_PATH="${HEALTH_PATH:-/api/health}"
SERVER_IP_FILE="${SERVER_IP_FILE:-infra/hetzner/.server-ip}"
SSH_USER="${SSH_USER:-deploy}"
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/cafco_hetzner}"
BACKUP_FILE="${BACKUP_FILE:-${1:-}}"

if [[ -z "${BACKUP_FILE}" ]]; then
  echo "Usage: BACKUP_FILE=/path/to/cafco-YYYYmmddHHMMSS.tar.gz $0" >&2
  exit 1
fi

if [[ -n "${SERVER_HOST:-}" ]]; then
  SSH_OPTS=(-o BatchMode=yes -o StrictHostKeyChecking=accept-new)
  if [[ -f "${SSH_KEY_PATH}" ]]; then
    SSH_OPTS+=(-i "${SSH_KEY_PATH}")
  fi
  remote_backup="/tmp/$(basename "${BACKUP_FILE}")"
  scp "${SSH_OPTS[@]}" "${BACKUP_FILE}" "${SSH_USER}@${SERVER_HOST}:${remote_backup}"
  ssh "${SSH_OPTS[@]}" "${SSH_USER}@${SERVER_HOST}" "sudo BACKUP_FILE='${remote_backup}' /usr/local/bin/cafco-restore"
  exit 0
fi

if [[ ! -f "${BACKUP_FILE}" ]]; then
  echo "ERROR: Backup file not found: ${BACKUP_FILE}" >&2
  exit 1
fi

restore_id="restore-$(date -u +%Y%m%d%H%M%S)"
target_release="${RELEASES_PATH}/${restore_id}"
stage="$(mktemp -d)"
trap 'rm -rf "${stage}"' EXIT

tar -xzf "${BACKUP_FILE}" -C "${stage}"
test -d "${stage}/release"

mkdir -p "${target_release}" "${SHARED_PATH}"
rsync -a --delete "${stage}/release/" "${target_release}/"
if [[ -d "${stage}/shared" ]]; then
  rsync -a "${stage}/shared/" "${SHARED_PATH}/"
fi

chown -R deploy:www-data "${target_release}" "${SHARED_PATH}" 2>/dev/null || true
ln -sfn "${target_release}" "${CURRENT_PATH}"

if command -v pm2 >/dev/null 2>&1; then
  sudo -u deploy pm2 reload "${CURRENT_PATH}/pm2/ecosystem.config.cjs" --update-env || sudo -u deploy pm2 start "${CURRENT_PATH}/pm2/ecosystem.config.cjs" --update-env
  sudo -u deploy pm2 save
fi

if command -v curl >/dev/null 2>&1; then
  for attempt in {1..30}; do
    if curl -fsS --max-time 5 "http://127.0.0.1:3000${HEALTH_PATH}" >/dev/null; then
      echo "Restore healthy: ${target_release}"
      exit 0
    fi
    sleep 2
  done
  echo "WARNING: Restore completed but healthcheck failed." >&2
fi

echo "Restored ${BACKUP_FILE} to ${target_release}"
