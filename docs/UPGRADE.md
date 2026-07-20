# Upgrades seguros

## Principios

- Hacer backup antes de cambios de plataforma.
- Validar en staging o VPS temporal cuando sea posible.
- Cambiar una capa a la vez: Node, app, Nginx, Certbot u OS.
- Mantener rollback claro.
- No actualizar durante incidentes salvo que la actualización sea la corrección.

## Checklist previo

```bash
./scripts/backup.sh
pm2 status
sudo nginx -t
curl -fsS https://cafco.example.com/
df -h
```

Confirmar que hay al menos un release anterior funcional:

```bash
ls -1dt /var/www/cafco/releases/*
```

## Upgrading Node.js

Versión objetivo actual: Node.js 22.

1. Revisar versión:

   ```bash
   node -v
   corepack --version
   pnpm -v
   ```

2. Instalar nueva versión con el método estándar del servidor.
3. Habilitar Corepack:

   ```bash
   corepack enable
   corepack prepare pnpm@latest --activate
   ```

4. Reinstalar dependencias y build en un release nuevo:

   ```bash
   cd /var/www/cafco/current
   pnpm install --frozen-lockfile
   pnpm build
   ```

5. Recargar PM2:

   ```bash
   pm2 reload cafco --update-env
   ```

6. Verificar:

   ```bash
   curl -fsS http://127.0.0.1:3000/
   curl -fsS https://cafco.example.com/
   pm2 logs cafco --lines 100
   ```

Rollback:

- Volver a la versión anterior de Node.
- Reinstalar dependencias.
- Apuntar `current` a un release construido con la versión anterior.
- `pm2 reload cafco --update-env`.

## Upgrading Next.js

La app usa Next.js 16.x.

1. Crear branch de upgrade.
2. Actualizar dependencias localmente.
3. Ejecutar:

   ```bash
   pnpm install
   pnpm lint
   pnpm exec tsc --noEmit
   pnpm exec vitest run --passWithNoTests
   pnpm build
   ```

4. Revisar cambios de `next.config.mjs`, imágenes remotas e i18n.
5. Deploy a staging o deploy controlado.
6. Monitorear PM2 y Nginx.

Puntos sensibles:

- `next-intl` y alias `next-intl/config`.
- `images.remotePatterns` para Cloudflare R2 y Wix.
- Output standalone si el deploy depende de `server.js`.

Rollback:

- Revertir branch o seleccionar release anterior.
- `pm2 reload cafco --update-env`.

## Upgrading dependencias npm/pnpm

1. Revisar cambios:

   ```bash
   pnpm outdated
   ```

2. Actualizar en grupos pequeños.
3. Correr CI local:

   ```bash
   pnpm lint
   pnpm exec tsc --noEmit
   pnpm exec vitest run --passWithNoTests
   pnpm build
   ```

4. Deploy normal.

No actualizar librerías grandes junto con cambios de infraestructura.

## Upgrading paquetes de OS

Semanalmente:

```bash
sudo apt update
sudo apt list --upgradable
sudo apt upgrade
```

Si hay kernel nuevo:

```bash
sudo reboot
```

Después:

```bash
systemctl status nginx --no-pager
sudo -iu deploy pm2 status
curl -fsS https://cafco.example.com/
```

Rollback:

- Para paquetes comunes, usar logs de apt en `/var/log/apt/history.log`.
- Para problemas graves, restaurar snapshot Hetzner o VPS nuevo desde backup.

## Upgrading Nginx

1. Backup de config:

   ```bash
   sudo cp -a /etc/nginx /etc/nginx.backup.$(date +%Y%m%d-%H%M%S)
   ```

2. Actualizar:

   ```bash
   sudo apt update
   sudo apt upgrade nginx
   ```

3. Validar:

   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. Verificar:

   ```bash
   curl -I https://cafco.example.com/
   sudo tail -n 100 /var/log/nginx/error.log
   ```

Rollback:

```bash
sudo cp -a /etc/nginx.backup.<fecha>/* /etc/nginx/
sudo nginx -t
sudo systemctl reload nginx
```

## Upgrading Certbot

1. Verificar renovación actual:

   ```bash
   sudo certbot renew --dry-run
   ```

2. Actualizar paquetes:

   ```bash
   sudo apt update
   sudo apt upgrade certbot python3-certbot-nginx
   ```

3. Probar de nuevo:

   ```bash
   sudo certbot renew --dry-run
   systemctl list-timers | grep certbot
   ```

4. Validar certificado:

   ```bash
   echo | openssl s_client -connect cafco.example.com:443 -servername cafco.example.com 2>/dev/null | openssl x509 -noout -dates
   ```

Rollback:

- Restaurar `/etc/letsencrypt` desde backup si se dañó.
- Restaurar config Nginx.
- Emitir certificado nuevo si el backup no es confiable.

## Ventanas de mantenimiento

Usar ventana de mantenimiento para:

- Upgrade mayor de Node.
- Upgrade mayor de Next.js.
- Reboot del servidor.
- Cambios de Nginx que alteren TLS o proxy.

No se requiere ventana para:

- `pm2 reload`.
- `nginx reload` con config validada.
- Renovación Certbot normal.
