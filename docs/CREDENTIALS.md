# Credenciales requeridas para producción Hetzner

Sin estos secretos **no es posible** crear el VPS ni completar el cutover desde Vercel.

## Obligatorias

| Variable | Dónde | Uso |
|---|---|---|
| `HCLOUD_TOKEN` | Hetzner Cloud Console → Project → Security → API Tokens (Read & Write) | Crear VPS, firewall, SSH keys |
| `DOMAIN` | Dominio apuntando al VPS (A/AAAA) | Nginx + Let's Encrypt |

## Recomendadas

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical / OG / sitemap (`https://TU_DOMINIO`) |
| `CERTBOT_EMAIL` | Avisos de renovación Let's Encrypt |
| `DEPLOY_HOST` / `DEPLOY_USER` / `DEPLOY_SSH_KEY` | GitHub Actions deploy |

## Dominio

- Brand actual: `cafco.cr` (hoy **NXDOMAIN** — hay que registrarlo o usar otro dominio).
- Sitio Vercel actual: `https://cafco.vercel.app`
- Si aún no hay DNS: tras crear el VPS se puede usar temporalmente `IP.sslip.io` exportando `DOMAIN=<ip-con-guiones>.sslip.io`.

## Bootstrap (un solo comando cuando exista el token)

```bash
export HCLOUD_TOKEN='*****'
export DOMAIN='cafco.cr'          # o IP.sslip.io temporal
export CERTBOT_EMAIL='ops@cafco.cr'

make provision    # crea VPS + firewall + SSH
make configure    # Ansible: harden + Node + Nginx + Certbot + PM2
make deploy       # build + PM2 reload + healthcheck
make health
```

## Inyectar el token en este entorno Cursor

1. Crea/edita un **Cursor Environment** con secreto `HCLOUD_TOKEN`.
2. O exporta la variable en la sesión del agente y vuelve a pedir: “continua el provision Hetzner”.
3. No commitees el token. Archivos ignorados: `infra/hetzner/.secrets`, `infra/hetzner/.server-ip`.
