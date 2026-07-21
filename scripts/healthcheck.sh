#!/usr/bin/env bash
set -Eeuo pipefail

HEALTH_PATH="${HEALTH_PATH:-/api/health}"
SERVER_IP_FILE="${SERVER_IP_FILE:-infra/hetzner/.server-ip}"
SSH_USER="${SSH_USER:-deploy}"
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/cafco_hetzner}"

if [[ -z "${SERVER_HOST:-}" && -f "${SERVER_IP_FILE}" ]]; then
  SERVER_HOST="$(tr -d '[:space:]' < "${SERVER_IP_FILE}")"
fi

if [[ -n "${SERVER_HOST:-}" ]]; then
  SSH_OPTS=(-o BatchMode=yes -o StrictHostKeyChecking=accept-new)
  if [[ -f "${SSH_KEY_PATH}" ]]; then
    SSH_OPTS+=(-i "${SSH_KEY_PATH}")
  fi

  ssh "${SSH_OPTS[@]}" "${SSH_USER}@${SERVER_HOST}" \
    "curl -fsS --max-time 10 'http://127.0.0.1:3000${HEALTH_PATH}'"
  echo
  exit 0
fi

DOMAIN="${DOMAIN:-cafco.cr}"
URL="${HEALTH_URL:-https://${DOMAIN}${HEALTH_PATH}}"
curl -fsS --max-time 10 "${URL}"
echo
