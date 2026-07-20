#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="${APP_NAME:-cafco}"
APP_ROOT="${APP_ROOT:-/var/www/cafco}"
RELEASES_PATH="${RELEASES_PATH:-${APP_ROOT}/releases}"
CURRENT_PATH="${CURRENT_PATH:-${APP_ROOT}/current}"
HEALTH_PATH="${HEALTH_PATH:-/api/health}"
SSH_USER="${SSH_USER:-deploy}"
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/cafco_hetzner}"
SERVER_IP_FILE="${SERVER_IP_FILE:-infra/hetzner/.server-ip}"

if [[ -z "${SERVER_HOST:-}" ]]; then
  if [[ -f "${SERVER_IP_FILE}" ]]; then
    SERVER_HOST="$(tr -d '[:space:]' < "${SERVER_IP_FILE}")"
  else
    echo "ERROR: SERVER_HOST is required or ${SERVER_IP_FILE} must exist." >&2
    exit 1
  fi
fi

SSH_OPTS=(-o BatchMode=yes -o StrictHostKeyChecking=accept-new)
if [[ -f "${SSH_KEY_PATH}" ]]; then
  SSH_OPTS+=(-i "${SSH_KEY_PATH}")
fi

REMOTE="${SSH_USER}@${SERVER_HOST}"

ssh "${SSH_OPTS[@]}" "${REMOTE}" "bash -s" <<EOF
set -Eeuo pipefail

APP_NAME='${APP_NAME}'
RELEASES_PATH='${RELEASES_PATH}'
CURRENT_PATH='${CURRENT_PATH}'
HEALTH_PATH='${HEALTH_PATH}'
REQUESTED_RELEASE='${ROLLBACK_RELEASE:-}'

if [[ -n "\${REQUESTED_RELEASE}" ]]; then
  if [[ "\${REQUESTED_RELEASE}" = /* ]]; then
    TARGET="\${REQUESTED_RELEASE}"
  else
    TARGET="\${RELEASES_PATH}/\${REQUESTED_RELEASE}"
  fi
else
  CURRENT=""
  if [[ -L "\${CURRENT_PATH}" ]]; then
    CURRENT="\$(readlink -f "\${CURRENT_PATH}" || true)"
  fi
  if [[ -n "\${CURRENT}" ]]; then
    TARGET="\$(find "\${RELEASES_PATH}" -mindepth 1 -maxdepth 1 -type d | sort -r | grep -v -F "\${CURRENT}" | head -n 1 || true)"
  else
    TARGET="\$(find "\${RELEASES_PATH}" -mindepth 1 -maxdepth 1 -type d | sort -r | head -n 1 || true)"
  fi
fi

if [[ -z "\${TARGET}" || ! -d "\${TARGET}" ]]; then
  echo "No rollback target found." >&2
  exit 1
fi

echo "Rolling back to \${TARGET}..."
ln -sfn "\${TARGET}" "\${CURRENT_PATH}"
pm2 reload "\${CURRENT_PATH}/pm2/ecosystem.config.cjs" --update-env || pm2 start "\${CURRENT_PATH}/pm2/ecosystem.config.cjs" --update-env
pm2 save

for attempt in {1..30}; do
  if curl -fsS --max-time 5 "http://127.0.0.1:3000\${HEALTH_PATH}" >/dev/null; then
    echo "Rollback healthy: \${TARGET}"
    exit 0
  fi
  sleep 2
done

echo "Rollback target did not become healthy." >&2
exit 1
EOF
