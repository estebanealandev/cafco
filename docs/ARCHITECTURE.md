# Arquitectura de producción cafco

## Diagrama final

```mermaid
flowchart LR
    user[Usuarios / Navegadores] --> dns[DNS del dominio]
    dns --> nginx[Nginx en Hetzner VPS<br/>TLS 80/443]

    subgraph hetzner[Hetzner Cloud - Ashburn ash]
        nginx --> pm2[PM2 process manager]
        pm2 --> next[Next.js standalone<br/>Node.js 22<br/>127.0.0.1:3000]
        next --> fs[/var/www/cafco/current<br/>release activo]
        fs --> releases[/var/www/cafco/releases]
        fs --> shared[/var/www/cafco/shared<br/>env, logs, backups]
    end

    next --> r2[Cloudflare R2 assets<br/>pub-920fda90d8d340c599bf7793a05eb9fb.r2.dev]
    next --> wix[Wix Static assets<br/>static.wixstatic.com]

    dev[GitHub push / PR] --> gha[GitHub Actions CI<br/>pnpm lint/typecheck/test/build]
    gha --> deploy[GitHub Actions Deploy<br/>SSH + rsync]
    deploy --> nginx
```

## Flujo de request

1. El usuario entra al dominio público.
2. DNS resuelve al VPS Hetzner en Ashburn.
3. Nginx termina TLS y aplica proxy hacia `127.0.0.1:3000`.
4. PM2 mantiene vivo el proceso Next.js standalone.
5. Next.js sirve HTML, rutas i18n y assets internos.
6. Imágenes remotas autorizadas se consumen desde Cloudflare R2 y Wix Static.

## Flujo de deploy

1. Push o PR ejecuta CI:
   - `pnpm install --frozen-lockfile`.
   - `pnpm lint`.
   - `pnpm exec tsc --noEmit`.
   - `pnpm exec vitest run --passWithNoTests`.
   - `pnpm build`.
2. Deploy por GitHub Actions o manual.
3. El código se sincroniza por SSH/rsync.
4. `./scripts/deploy.sh` crea un release nuevo.
5. Se actualiza `/var/www/cafco/current`.
6. PM2 recarga `cafco`.
7. Se ejecuta health check HTTPS.

## Componentes

| Componente | Responsabilidad |
| --- | --- |
| Hetzner VPS | Cómputo principal de producción. |
| Ubuntu 24.04 LTS | Sistema operativo base. |
| Nginx | TLS, reverse proxy, HTTP/2, redirects. |
| PM2 | Supervisor del proceso Next.js. |
| Next.js standalone | Aplicación web cafco. |
| Cloudflare R2 | Assets remotos permitidos por `next.config.mjs`. |
| Wix Static | Assets remotos permitidos por `next.config.mjs`. |
| GitHub Actions CI | Validación automática de código. |
| GitHub Actions Deploy | Despliegue por SSH al VPS. |

## Puertos

| Puerto | Público | Uso |
| --- | --- | --- |
| 22/tcp | Sí, restringido por SSH keys | Operación y deploy. |
| 80/tcp | Sí | Redirect HTTPS y ACME. |
| 443/tcp | Sí | Tráfico web HTTPS. |
| 3000/tcp | No | Next.js interno detrás de Nginx. |

## Estado persistente

La app no debe depender de estado mutable dentro del release. Estado persistente operativo:

- `/var/www/cafco/shared/.env.production`.
- `/var/www/cafco/shared/logs`.
- `/var/www/cafco/shared/backups`.
- `/etc/nginx`.
- `/etc/letsencrypt`.
- PM2 dump del usuario `deploy`.

## Riesgos principales

- Falta de `HCLOUD_TOKEN` bloquea aprovisionamiento automatizado de Hetzner.
- Falta de `DEPLOY_SSH_KEY` bloquea deploy desde GitHub Actions.
- Recursos insuficientes del VPS pueden afectar builds de Next.js.
- Cambios en dominios de assets remotos requieren actualizar `images.remotePatterns`.
