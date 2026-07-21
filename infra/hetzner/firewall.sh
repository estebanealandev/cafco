#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="${APP_NAME:-cafco}"
FIREWALL_NAME="${FIREWALL_NAME:-${APP_NAME}-web}"
HCLOUD_TOKEN="${HCLOUD_TOKEN:-${HETZNER_TOKEN:-}}"

if [[ -z "${HCLOUD_TOKEN}" ]]; then
  echo "ERROR: HCLOUD_TOKEN or HETZNER_TOKEN is required." >&2
  exit 1
fi
export HCLOUD_TOKEN

if ! command -v hcloud >/dev/null 2>&1; then
  echo "ERROR: hcloud CLI is required. Run infra/hetzner/provision.sh to auto-install it." >&2
  exit 1
fi

if hcloud firewall describe "${FIREWALL_NAME}" >/dev/null 2>&1; then
  echo "Firewall ${FIREWALL_NAME} already exists; ensuring required rules."
else
  echo "Creating firewall ${FIREWALL_NAME}..."
  hcloud firewall create --name "${FIREWALL_NAME}" >/dev/null
fi

hcloud firewall add-rule "${FIREWALL_NAME}" --direction in --protocol tcp --port 22 --source-ips 0.0.0.0/0 --source-ips ::/0 >/dev/null 2>&1 || true
hcloud firewall add-rule "${FIREWALL_NAME}" --direction in --protocol tcp --port 80 --source-ips 0.0.0.0/0 --source-ips ::/0 >/dev/null 2>&1 || true
hcloud firewall add-rule "${FIREWALL_NAME}" --direction in --protocol tcp --port 443 --source-ips 0.0.0.0/0 --source-ips ::/0 >/dev/null 2>&1 || true
hcloud firewall add-rule "${FIREWALL_NAME}" --direction in --protocol icmp --source-ips 0.0.0.0/0 --source-ips ::/0 >/dev/null 2>&1 || true

echo "Firewall ${FIREWALL_NAME} allows SSH, HTTP, HTTPS, and ICMP."
