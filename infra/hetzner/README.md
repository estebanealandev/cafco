# Cafco Hetzner provisioning

This directory provisions a hardened Ubuntu 24.04 Hetzner Cloud VPS for the
`cafco` standalone Next.js application.

## Prerequisites

- A Hetzner Cloud project token exported as `HCLOUD_TOKEN` or `HETZNER_TOKEN`
- DNS control for the production domain, default `cafco.cr`
- Local `curl`, `ssh`, and `ssh-keygen`

The provisioner installs the `hcloud` CLI into `~/.local/bin` when it is missing.

## Create the server

```bash
export HCLOUD_TOKEN=...
export DOMAIN=cafco.cr

infra/hetzner/provision.sh
```

Useful optional variables:

| Variable | Default | Description |
| --- | --- | --- |
| `SERVER_NAME` | `cafco-prod` | Hetzner server name |
| `LOCATION` | `ash` | Hetzner location. `ash` is closer to Costa Rica; `fsn1` is a safe EU fallback |
| `SERVER_TYPE` | `cx22` | VPS size. The script retries with `cpx21` if `cx22` is unavailable |
| `IMAGE` | `ubuntu-24.04` | Base server image |
| `SSH_KEY_PATH` | `~/.ssh/cafco_hetzner` | Ed25519 private key path |

The script:

1. Generates an Ed25519 SSH key if missing.
2. Uploads the public key to Hetzner.
3. Creates/updates an `cafco-web` firewall for ports `22`, `80`, `443`, and ICMP.
4. Creates an Ubuntu 24.04 VPS with `cloud-init.yaml`.
5. Writes the server IP to `infra/hetzner/.server-ip`.

## Configure after DNS

Point `cafco.cr` (and `www.cafco.cr` if enabled) at the server IP, then run:

```bash
cp infra/ansible/inventory/hosts.yml.example infra/ansible/inventory/hosts.yml
$EDITOR infra/ansible/inventory/hosts.yml
make configure DOMAIN=cafco.cr
```

## Deploy

```bash
make deploy DOMAIN=cafco.cr
```

The deployment script builds a release under `/var/www/cafco/releases/<timestamp>`,
updates `/var/www/cafco/current`, reloads PM2, checks `/api/health`, and rolls back
automatically if the release is unhealthy.

## Files intentionally ignored by git

- `.server-ip`
- `.secrets`
- generated inventory (`infra/ansible/inventory/hosts.yml`)
