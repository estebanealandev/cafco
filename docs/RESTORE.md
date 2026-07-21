# Restore de cafco

## Cuándo restaurar

Usar restore cuando:

- Un deploy dejó el sitio inaccesible y rollback no alcanza.
- Se borró o dañó `/var/www/cafco`.
- Se perdió configuración de Nginx o certificados.
- Se reemplaza el VPS por uno nuevo.
- Hay corrupción de `.env.production` o del estado PM2.

## Antes de restaurar

1. Identificar el backup:

   ```bash
   ls -lh /var/www/cafco/shared/backups
   ```

2. Verificar checksum:

   ```bash
   sha256sum -c cafco-backup-YYYYMMDD-HHMMSS.sha256
   ```

3. Inspeccionar contenido:

   ```bash
   tar -tzf cafco-backup-YYYYMMDD-HHMMSS.tar.gz | less
   ```

4. Avisar al equipo si habrá ventana de mantenimiento.

## Restore rápido de release anterior

Si los releases siguen presentes:

```bash
sudo -iu deploy
ls -1dt /var/www/cafco/releases/*
ln -sfn /var/www/cafco/releases/<release-bueno> /var/www/cafco/current
cd /var/www/cafco/current
pm2 reload cafco --update-env
curl -fsS https://cafco.example.com/
```

Este es el camino preferido para errores de aplicación post-deploy.

## Restore desde backup en el mismo VPS

1. Detener aplicación:

   ```bash
   sudo -iu deploy pm2 stop cafco
   ```

2. Crear copia del estado actual:

   ```bash
   sudo mv /var/www/cafco /var/www/cafco.broken.$(date +%Y%m%d-%H%M%S)
   sudo mkdir -p /var/www/cafco
   ```

3. Extraer backup:

   ```bash
   sudo tar -xzf cafco-backup-YYYYMMDD-HHMMSS.tar.gz -C /
   ```

4. Restaurar permisos:

   ```bash
   sudo chown -R deploy:deploy /var/www/cafco
   sudo chmod 600 /var/www/cafco/shared/.env.production
   ```

5. Validar Nginx:

   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

6. Levantar PM2:

   ```bash
   sudo -iu deploy
   cd /var/www/cafco/current
   pm2 start ecosystem.config.cjs --only cafco --update-env || pm2 start "node server.js" --name cafco --update-env
   pm2 save
   ```

7. Verificar:

   ```bash
   curl -fsS http://127.0.0.1:3000/
   curl -fsS https://cafco.example.com/
   pm2 logs cafco --lines 100
   ```

## Restore en VPS nuevo

1. Crear VPS Ubuntu 24.04 LTS en Hetzner Ashburn.
2. Aplicar hardening de `docs/SERVER.md`.
3. Instalar paquetes:

   ```bash
   sudo apt update
   sudo apt install -y nginx certbot python3-certbot-nginx fail2ban rsync curl git
   ```

4. Instalar Node.js 22 y habilitar Corepack.
5. Crear usuario `deploy`.
6. Copiar backup al servidor:

   ```bash
   scp cafco-backup-YYYYMMDD-HHMMSS.tar.gz deploy@<host>:/tmp/
   scp cafco-backup-YYYYMMDD-HHMMSS.sha256 deploy@<host>:/tmp/
   ```

7. Verificar checksum en el servidor:

   ```bash
   cd /tmp
   sha256sum -c cafco-backup-YYYYMMDD-HHMMSS.sha256
   ```

8. Extraer:

   ```bash
   sudo tar -xzf /tmp/cafco-backup-YYYYMMDD-HHMMSS.tar.gz -C /
   sudo chown -R deploy:deploy /var/www/cafco
   ```

9. Revisar DNS para apuntar al nuevo VPS.
10. Emitir o restaurar certificado:

    - Si se restauró `/etc/letsencrypt`, validar permisos y `nginx -t`.
    - Si no, emitir nuevo certificado:

      ```bash
      sudo certbot --nginx -d cafco.example.com -d www.cafco.example.com
      ```

11. Iniciar app:

    ```bash
    sudo -iu deploy
    cd /var/www/cafco/current
    corepack enable
    pnpm install --frozen-lockfile
    pnpm build
    pm2 start "node server.js" --name cafco --update-env
    pm2 save
    ```

12. Validar tráfico:

    ```bash
    curl -I https://cafco.example.com/
    pm2 status
    sudo tail -n 100 /var/log/nginx/error.log
    ```

## Restore solo de Nginx

```bash
sudo cp /backup/etc/nginx/sites-available/cafco /etc/nginx/sites-available/cafco
sudo ln -sfn /etc/nginx/sites-available/cafco /etc/nginx/sites-enabled/cafco
sudo nginx -t
sudo systemctl reload nginx
```

## Restore solo de env vars

```bash
sudo cp .env.production /var/www/cafco/shared/.env.production
sudo chown deploy:deploy /var/www/cafco/shared/.env.production
sudo chmod 600 /var/www/cafco/shared/.env.production
sudo -iu deploy pm2 reload cafco --update-env
```

## Validación final

- `pm2 status` muestra `cafco` online.
- `curl -fsS http://127.0.0.1:3000/` responde.
- `curl -fsS https://cafco.example.com/` responde.
- `sudo nginx -t` pasa.
- Certificado TLS vigente.
- DNS apunta al VPS correcto.
- Logs sin errores repetidos.
