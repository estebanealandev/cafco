# Deploy de cafco en Hetzner VPS

Este documento describe el despliegue operativo de `cafco` (Next.js) en un VPS Hetzner usando Nginx como reverse proxy TLS y PM2 ejecutando el build standalone de Next.js.

## Prerequisitos

En el servidor:

- Ubuntu 24.04 LTS actualizado.
- Usuario de despliegue sin privilegios directos de root, por ejemplo `deploy`.
- Node.js 22 LTS y Corepack habilitado.
- pnpm activado con Corepack.
- PM2 instalado globalmente o disponible para el usuario `deploy`.
- Nginx instalado y configurado para el dominio.
- Certbot instalado y certificado TLS emitido.
- Directorio de aplicación: `/var/www/cafco`.
- Variables de entorno instaladas en `/var/www/cafco/shared/.env.production`.
- SSH del operador o CI autorizado para el usuario `deploy`.
- Firewall permitiendo solo SSH, HTTP y HTTPS.

En la estación local o CI:

- Acceso SSH al servidor.
- `rsync`, `ssh`, `git`, `pnpm` y `make`.
- Rama validada por CI antes de desplegar.
- Si se aprovisiona infraestructura desde scripts Hetzner: `HCLOUD_TOKEN` configurado.

## Estructura esperada en servidor

```text
/var/www/cafco/
  current -> /var/www/cafco/releases/<release-id>
  releases/
    <release-id>/
  shared/
    .env.production
    logs/
    backups/
```

`current` apunta al release activo. Cada despliegue crea un release nuevo y cambia el symlink solo cuando el build y las verificaciones pasan.

## Comandos de despliegue

Desde el repositorio:

```bash
./scripts/deploy.sh
```

o, si el `Makefile` está disponible:

```bash
make deploy
```

`make deploy` debe ser un wrapper de `./scripts/deploy.sh`; no debe contener lógica distinta.

## Primer deploy

1. Crear usuario y directorios:

   ```bash
   sudo adduser --disabled-password --gecos "" deploy
   sudo mkdir -p /var/www/cafco/{releases,shared/logs,shared/backups}
   sudo chown -R deploy:deploy /var/www/cafco
   ```

2. Instalar `.env.production`:

   ```bash
   sudo -u deploy nano /var/www/cafco/shared/.env.production
   chmod 600 /var/www/cafco/shared/.env.production
   ```

3. Validar Nginx:

   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. Ejecutar deploy:

   ```bash
   ./scripts/deploy.sh
   ```

5. Verificar:

   ```bash
   curl -fsS https://cafco.example.com/
   pm2 status
   pm2 logs cafco --lines 100
   ```

## Deploy zero-downtime

El flujo recomendado es:

1. Crear release nuevo en `/var/www/cafco/releases/<timestamp>-<sha>`.
2. Sincronizar código excluyendo `node_modules`, `.git`, `.next` local y archivos temporales.
3. Instalar dependencias con `pnpm install --frozen-lockfile`.
4. Construir con `pnpm build`.
5. Enlazar `.env.production` desde `shared`.
6. Cambiar `current` de forma atómica:

   ```bash
   ln -sfn /var/www/cafco/releases/<release-id> /var/www/cafco/current
   ```

7. Recargar PM2 sin cortar tráfico:

   ```bash
   pm2 reload cafco --update-env
   ```

8. Hacer health check HTTP/HTTPS.

Nginx continúa aceptando tráfico durante el build. La ventana de riesgo se reduce al cambio de symlink y reload de PM2.

## Rollback

1. Listar releases:

   ```bash
   ls -1dt /var/www/cafco/releases/*
   ```

2. Apuntar `current` al release anterior:

   ```bash
   ln -sfn /var/www/cafco/releases/<release-anterior> /var/www/cafco/current
   ```

3. Recargar PM2:

   ```bash
   cd /var/www/cafco/current
   pm2 reload cafco --update-env
   ```

4. Verificar:

   ```bash
   curl -fsS https://cafco.example.com/
   pm2 logs cafco --lines 100
   ```

Si el proceso no queda estable, usar `pm2 restart cafco --update-env` y revisar logs antes de intentar otro deploy.

## Limpieza de releases

Mantener los últimos 5 a 10 releases:

```bash
ls -1dt /var/www/cafco/releases/* | tail -n +11 | xargs -r rm -rf
```

No borrar el release apuntado por `current`.
