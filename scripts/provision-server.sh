#!/usr/bin/env bash
set -Eeuo pipefail

DOMAIN="${DOMAIN:?DOMAIN is required, for example DOMAIN=cafco.cr}"
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/cafco_hetzner}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVER_IP_FILE="${ROOT_DIR}/infra/hetzner/.server-ip"
INVENTORY_FILE="${ROOT_DIR}/infra/ansible/inventory/hosts.yml"

"${ROOT_DIR}/infra/hetzner/provision.sh"

SERVER_HOST="$(tr -d '[:space:]' < "${SERVER_IP_FILE}")"
mkdir -p "$(dirname "${INVENTORY_FILE}")"
cat > "${INVENTORY_FILE}" <<EOF
all:
  hosts:
    cafco-prod:
      ansible_host: ${SERVER_HOST}
      ansible_user: deploy
      ansible_ssh_private_key_file: ${SSH_KEY_PATH}
  children:
    web:
      hosts:
        cafco-prod:
EOF

echo "Waiting for SSH and cloud-init on ${SERVER_HOST}..."
for attempt in {1..60}; do
  if ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new -i "${SSH_KEY_PATH}" "deploy@${SERVER_HOST}" "cloud-init status --wait" >/dev/null 2>&1; then
    break
  fi
  sleep 5
done

export DOMAIN
cd "${ROOT_DIR}/infra/ansible"
ansible-playbook playbooks/site.yml
