#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="${APP_NAME:-cafco}"
APP_ROOT="${APP_ROOT:-/var/www/cafco}"
RELEASES_PATH="${RELEASES_PATH:-${APP_ROOT}/releases}"
CURRENT_PATH="${CURRENT_PATH:-${APP_ROOT}/current}"
SHARED_PATH="${SHARED_PATH:-${APP_ROOT}/shared}"
HEALTH_PATH="${HEALTH_PATH:-/api/health}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
SSH_USER="${SSH_USER:-deploy}"
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/cafco_hetzner}"
SERVER_IP_FILE="${SERVER_IP_FILE:-infra/hetzner/.server-ip}"
RELEASE_ID="${RELEASE_ID:-$(date -u +%Y%m%d%H%M%S)}"
REMOTE_RELEASE="${RELEASES_PATH}/${RELEASE_ID}"

if [[ -z "${SERVER_HOST:-}" ]]; then
  if [[ -f "${SERVER_IP_FILE}" ]]; then
    SERVER_HOST="$(tr -d '[:space:]' < "${SERVER_IP_FILE}")"
  else
    echo "ERROR: SERVER_HOST is required or ${SERVER_IP_FILE} must exist." >&2
    exit 1
  fi
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

SSH_OPTS=(-o BatchMode=yes -o StrictHostKeyChecking=accept-new)
if [[ -f "${SSH_KEY_PATH}" ]]; then
  SSH_OPTS+=(-i "${SSH_KEY_PATH}")
fi

REMOTE="${SSH_USER}@${SERVER_HOST}"

echo "Creating remote release ${REMOTE_RELEASE}..."
ssh "${SSH_OPTS[@]}" "${REMOTE}" "mkdir -p '${REMOTE_RELEASE}' '${SHARED_PATH}' '${RELEASES_PATH}' /var/log/${APP_NAME}"

echo "Uploading source via rsync..."
rsync -az --delete \
  --exclude '.git/' \
  --exclude '.next/' \
  --exclude 'node_modules/' \
  --exclude '.env' \
  --exclude '.env.*' \
  --exclude 'infra/hetzner/.server-ip' \
  --exclude 'infra/hetzner/.secrets' \
  -e "ssh ${SSH_OPTS[*]}" \
  ./ "${REMOTE}:${REMOTE_RELEASE}/"

echo "Building and activating release on ${SERVER_HOST}..."
ssh "${SSH_OPTS[@]}" "${REMOTE}" "bash -s" <<EOF
set -Eeuo pipefail

APP_NAME='${APP_NAME}'
APP_ROOT='${APP_ROOT}'
CURRENT_PATH='${CURRENT_PATH}'
RELEASES_PATH='${RELEASES_PATH}'
SHARED_PATH='${SHARED_PATH}'
REMOTE_RELEASE='${REMOTE_RELEASE}'
HEALTH_PATH='${HEALTH_PATH}'
KEEP_RELEASES='${KEEP_RELEASES}'

rollback() {
  local previous="\${1:-}"
  if [[ -n "\${previous}" && -d "\${previous}" ]]; then
    echo "Rolling back to \${previous}..."
    ln -sfn "\${previous}" "\${CURRENT_PATH}"
    if pm2 describe "\${APP_NAME}" >/dev/null 2>&1; then
      pm2 reload "\${CURRENT_PATH}/pm2/ecosystem.config.cjs" --update-env
      pm2 save
    fi
  else
    echo "No previous release available for rollback." >&2
  fi
}

PREVIOUS_RELEASE=""
if [[ -L "\${CURRENT_PATH}" ]]; then
  PREVIOUS_RELEASE="\$(readlink -f "\${CURRENT_PATH}" || true)"
fi

cd "\${REMOTE_RELEASE}"

if [[ -f "\${SHARED_PATH}/.env.production" ]]; then
  ln -sfn "\${SHARED_PATH}/.env.production" .env.production
fi

export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
corepack enable
pnpm install --frozen-lockfile
pnpm build

test -f .next/standalone/server.js
mkdir -p .next/standalone/.next
rm -rf .next/standalone/public .next/standalone/.next/static
if [[ -d public ]]; then
  cp -a public .next/standalone/public
fi
cp -a .next/static .next/standalone/.next/static

ln -sfn "\${REMOTE_RELEASE}" "\${CURRENT_PATH}"

if pm2 describe "\${APP_NAME}" >/dev/null 2>&1; then
  pm2 reload "\${CURRENT_PATH}/pm2/ecosystem.config.cjs" --update-env
else
  pm2 start "\${CURRENT_PATH}/pm2/ecosystem.config.cjs" --update-env
fi
pm2 save

echo "Checking health at http://127.0.0.1:3000\${HEALTH_PATH}..."
healthy=0
for attempt in {1..30}; do
  if curl -fsS --max-time 5 "http://127.0.0.1:3000\${HEALTH_PATH}" >/dev/null; then
    healthy=1
    break
  fi
  sleep 2
done

if [[ "\${healthy}" != "1" ]]; then
  echo "Healthcheck failed for \${REMOTE_RELEASE}." >&2
  rollback "\${PREVIOUS_RELEASE}"
  exit 1
fi

find "\${RELEASES_PATH}" -mindepth 1 -maxdepth 1 -type d | sort -r | tail -n "+\$((KEEP_RELEASES + 1))" | xargs -r rm -rf
echo "Release \${REMOTE_RELEASE} deployed successfully."
EOF

echo "Deploy complete: ${REMOTE_RELEASE}"
