#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="${APP_NAME:-cafco}"
SERVER_NAME="${SERVER_NAME:-cafco-prod}"
LOCATION="${LOCATION:-ash}"
SERVER_TYPE="${SERVER_TYPE:-cx22}"
IMAGE="${IMAGE:-ubuntu-24.04}"
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/cafco_hetzner}"
SSH_KEY_NAME="${SSH_KEY_NAME:-cafco-hetzner-$(hostname -s 2>/dev/null || echo local)}"
DOMAIN="${DOMAIN:?DOMAIN is required, for example DOMAIN=cafco.cr}"
HCLOUD_TOKEN="${HCLOUD_TOKEN:-${HETZNER_TOKEN:-}}"

if [[ -z "${HCLOUD_TOKEN}" ]]; then
  echo "ERROR: HCLOUD_TOKEN or HETZNER_TOKEN is required." >&2
  exit 1
fi
export HCLOUD_TOKEN

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
CLOUD_INIT_FILE="${SCRIPT_DIR}/cloud-init.yaml"
SERVER_IP_FILE="${SCRIPT_DIR}/.server-ip"
RENDERED_CLOUD_INIT=""

install_hcloud() {
  if command -v hcloud >/dev/null 2>&1; then
    return
  fi

  echo "hcloud CLI not found; installing to ${HOME}/.local/bin..."
  mkdir -p "${HOME}/.local/bin"

  local os arch tmp version url
  os="$(uname -s | tr '[:upper:]' '[:lower:]')"
  arch="$(uname -m)"
  case "${arch}" in
    x86_64 | amd64) arch="amd64" ;;
    aarch64 | arm64) arch="arm64" ;;
    *) echo "Unsupported architecture for hcloud install: ${arch}" >&2; exit 1 ;;
  esac

  tmp="$(mktemp -d)"
  trap 'rm -rf "${tmp}"' RETURN
  version="$(curl -fsSL https://api.github.com/repos/hetznercloud/cli/releases/latest | sed -n 's/.*"tag_name": *"\([^"]*\)".*/\1/p' | head -n1)"
  if [[ -z "${version}" ]]; then
    echo "Could not determine latest hcloud version." >&2
    exit 1
  fi

  url="https://github.com/hetznercloud/cli/releases/download/${version}/hcloud-${os}-${arch}.tar.gz"
  curl -fsSL "${url}" | tar -xz -C "${tmp}"
  install -m 0755 "${tmp}/hcloud" "${HOME}/.local/bin/hcloud"
  export PATH="${HOME}/.local/bin:${PATH}"
}

ensure_ssh_key() {
  if [[ ! -f "${SSH_KEY_PATH}" ]]; then
    echo "Generating SSH key at ${SSH_KEY_PATH}..."
    mkdir -p "$(dirname "${SSH_KEY_PATH}")"
    ssh-keygen -t ed25519 -a 100 -f "${SSH_KEY_PATH}" -C "${APP_NAME}@hetzner" -N ""
  fi
  chmod 600 "${SSH_KEY_PATH}"
  chmod 644 "${SSH_KEY_PATH}.pub"
}

ensure_hcloud_ssh_key() {
  if hcloud ssh-key describe "${SSH_KEY_NAME}" >/dev/null 2>&1; then
    echo "Using existing Hetzner SSH key: ${SSH_KEY_NAME}"
    return
  fi

  echo "Uploading SSH key ${SSH_KEY_NAME} to Hetzner..."
  hcloud ssh-key create --name "${SSH_KEY_NAME}" --public-key-from-file "${SSH_KEY_PATH}.pub" >/dev/null
}

ensure_firewall() {
  "${SCRIPT_DIR}/firewall.sh"
}

create_server() {
  local public_key
  public_key="$(<"${SSH_KEY_PATH}.pub")"
  RENDERED_CLOUD_INIT="$(mktemp)"
  sed "s|ssh-ed25519 CHANGE_ME_REPLACED_BY_HETZNER_SSH_KEY deploy@cafco|${public_key}|" "${CLOUD_INIT_FILE}" > "${RENDERED_CLOUD_INIT}"

  if hcloud server describe "${SERVER_NAME}" >/dev/null 2>&1; then
    echo "Server ${SERVER_NAME} already exists."
  else
    echo "Creating ${SERVER_NAME} (${SERVER_TYPE}, ${IMAGE}, ${LOCATION}) for ${DOMAIN}..."
    if ! hcloud server create \
      --name "${SERVER_NAME}" \
      --type "${SERVER_TYPE}" \
      --image "${IMAGE}" \
      --location "${LOCATION}" \
      --ssh-key "${SSH_KEY_NAME}" \
      --firewall "${APP_NAME}-web" \
      --user-data-from-file "${RENDERED_CLOUD_INIT}" \
      --label "app=${APP_NAME}" \
      --label "domain=${DOMAIN}" \
      --start-after-create >/dev/null; then
      if [[ "${SERVER_TYPE}" != "cpx21" ]]; then
        echo "Retrying with fallback server type cpx21..."
        hcloud server create \
          --name "${SERVER_NAME}" \
          --type "cpx21" \
          --image "${IMAGE}" \
          --location "${LOCATION}" \
          --ssh-key "${SSH_KEY_NAME}" \
          --firewall "${APP_NAME}-web" \
          --user-data-from-file "${RENDERED_CLOUD_INIT}" \
          --label "app=${APP_NAME}" \
          --label "domain=${DOMAIN}" \
          --start-after-create >/dev/null
      else
        return 1
      fi
    fi
  fi

  local ip
  ip="$(hcloud server ip "${SERVER_NAME}")"
  printf '%s\n' "${ip}" > "${SERVER_IP_FILE}"

  cat <<EOF
Server ready:
  name: ${SERVER_NAME}
  ip:   ${ip}
  ssh:  ssh -i ${SSH_KEY_PATH} deploy@${ip}

IP written to ${SERVER_IP_FILE}
Point ${DOMAIN} A/AAAA records at this address before running certbot/Ansible TLS.
EOF
}

main() {
  install_hcloud
  ensure_ssh_key
  ensure_hcloud_ssh_key
  ensure_firewall
  create_server
}

trap '[[ -n "${RENDERED_CLOUD_INIT}" ]] && rm -f "${RENDERED_CLOUD_INIT}"' EXIT

main "$@"
