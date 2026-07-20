# Reporte de migración CAFCO → Hetzner

Fecha: 2026-07-20  
Branch: `cursor/hetzner-production-infra-fd85`  
Sitio actual Vercel: `https://cafco.vercel.app`

## Estado

| Área | Estado |
|---|---|
| Auditoría Next.js | Completa |
| App production-ready (`standalone`, headers, SEO, health) | Completa y validada localmente |
| Infra IaC (Hetzner + Ansible + Nginx + PM2 + deploy) | Completa en repo |
| CI/CD GitHub Actions | Completa en repo |
| Documentación operativa | Completa |
| Creación VPS Hetzner | **BLOQUEADA** — falta `HCLOUD_TOKEN` |
| DNS `cafco.cr` | **BLOQUEADO** — NXDOMAIN (dominio no resuelve) |
| HTTPS Let's Encrypt en producción | Pendiente de VPS + DNS |
| Cutover desde Vercel | Pendiente de VPS + DNS |

## Arquitectura final

```
Internet → Nginx (TLS, HTTP/2, rate limit, security headers)
         → PM2 cluster → Next.js 16 standalone (127.0.0.1:3000)
Assets: Cloudflare R2 + Wix Static (remotePatterns)
Deploy: scripts/deploy.sh (rsync releases + symlink + healthcheck + rollback)
CI: GitHub Actions (lint, typecheck, test, build) + deploy opcional por SSH
```

Ver diagrama en `docs/ARCHITECTURE.md`.

## Specs VPS

- OS: Ubuntu 24.04 LTS
- Región: Ashburn (`ash`) — cercana a Costa Rica
- Plan: `cx22` (2 vCPU / 4 GB / 40 GB) — subir a CPX21 si el build en servidor satura RAM
- Usuario: `deploy` (sudo, SSH key only)
- App root: `/var/www/cafco` (`releases/`, `current`, `shared/`)

## Nginx

Template: `infra/nginx/cafco.conf.j2`

- Redirect HTTP→HTTPS
- HTTP/2 (+ HTTP/3 preparado/comentado)
- gzip + brotli (si módulo disponible)
- proxy a `127.0.0.1:3000` con websockets
- rate limiting `10r/s` burst 20
- cache immutable `/_next/static`
- cache corto `/_next/image`
- HSTS, CSP, X-Frame-Options DENY, OCSP stapling
- Certbot / Let's Encrypt + renovación automática

## PM2

Config: `pm2/ecosystem.config.cjs`

- `exec_mode: cluster`, `instances: 2`
- `max_memory_restart: 512M`
- bind `127.0.0.1:3000`
- logs en `/var/log/cafco/`
- reload zero-downtime vía `scripts/deploy.sh`

## Variables de entorno

Ver `docs/ENVIRONMENT.md` y `.env.example`.

**Bloqueadores de producción:**

1. `HCLOUD_TOKEN` — API token Read & Write de Hetzner Cloud
2. `DOMAIN` con DNS A/AAAA al VPS (hoy `cafco.cr` es NXDOMAIN)

Bootstrap cuando existan:

```bash
export HCLOUD_TOKEN='***'
export DOMAIN='cafco.cr'   # o <ip>.sslip.io temporal
export CERTBOT_EMAIL='ops@cafco.cr'
make provision && make configure && make deploy && make health
```

Detalle: `docs/CREDENTIALS.md`.

## Archivos clave añadidos/modificados

### App

- `next.config.mjs` — `output: 'standalone'`, security headers, CSP
- `src/proxy.ts` — next-intl (migrado desde middleware deprecated)
- `src/app/layout.tsx` — root layout
- `src/app/api/health/route.ts`
- `src/app/robots.ts`, `src/app/sitemap.ts`
- `src/app/[locale]/layout.tsx` — metadata/OG/hreflang/preconnect
- `src/lib/logger.ts`, `src/lib/site-url.ts`
- `package.json` — pnpm packageManager, scripts prod, sin SWC Windows
- Eliminado `package-lock.json`, `public/vercel.svg`

### Infra

- `infra/hetzner/*` — provision, cloud-init, firewall
- `infra/ansible/*` — harden, node, nginx, certbot, pm2, backup
- `infra/nginx/cafco.conf.j2`
- `pm2/ecosystem.config.cjs`
- `systemd/cafco-backup.*`
- `scripts/{deploy,rollback,backup,restore,healthcheck,provision-server}.sh`
- `Makefile`
- `docker/*` — paridad local

### Docs / CI

- `docs/*.md` (DEPLOY, SERVER, OPERATIONS, BACKUP, RESTORE, ENVIRONMENT, UPGRADE, TROUBLESHOOTING, ARCHITECTURE, CREDENTIALS, MIGRATION_REPORT)
- `.github/workflows/ci.yml`, `deploy.yml`

## Validación local (completada)

- `pnpm lint` ✓
- `pnpm typecheck` ✓
- `pnpm test` ✓
- `pnpm build` (standalone, sin warning middleware) ✓
- `GET /api/health` → `{"status":"ok"}` ✓
- Locales `/es` `/en` `/de` `/fr` → 200 ✓
- `/` → 307 → `/es` ✓
- Security headers presentes ✓
- `robots.txt` + `sitemap.xml` ✓
- `/_next/image` optimiza R2 → JPEG 200 ✓
- Sin dependencias `@vercel/*` en runtime ✓

## Riesgos

- Sin `HCLOUD_TOKEN` no se puede crear el VPS desde este entorno.
- `cafco.cr` no está registrado/publicado (NXDOMAIN).
- Builds en CX22 pueden necesitar swap (Ansible lo configura a 2G) o build en CI.
- CSP con `'unsafe-inline'`/`'unsafe-eval'` por requisitos de Next; endurecer en el futuro con nonces.
- Imágenes Wix/R2 siguen siendo dependencia externa (aceptable y ya en uso).

## Mejoras aplicadas

- Output standalone + pipeline de releases atómicos con rollback.
- Hardening Ansible (ufw, fail2ban, ssh, unattended-upgrades, sysctl, journald, logrotate).
- Headers de seguridad + SEO (canonical, hreflang, OG, Twitter, robots, sitemap).
- Health endpoint + healthcheck en deploy.
- Migración `middleware` → `proxy` (Next 16).
- Estandarización pnpm + eliminación de SWC Windows.
- Documentación operativa completa en español.

## Mejoras futuras

1. Inyectar `HCLOUD_TOKEN` y ejecutar `make provision && make configure && make deploy`.
2. Registrar/apuntar DNS de `cafco.cr` (o dominio definitivo) al IP del VPS.
3. Cutover: apuntar DNS, verificar HTTPS, retirar proyecto Vercel.
4. Snapshots Hetzner automáticos + backups offsite.
5. Observabilidad externa (UptimeRobot/Better Stack + alertas).
6. Staging VPS separado.
7. CSP con nonces / strict-dynamic.
8. Build de artefactos en CI para aliviar RAM del VPS.
