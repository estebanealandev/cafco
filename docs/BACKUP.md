# Backups de cafco

## Objetivo

Permitir restaurar rápidamente el sitio en el mismo VPS o en un VPS nuevo ante deploy fallido, corrupción de archivos, pérdida de configuración o rotación accidental de releases.

## Qué se respalda

Respaldar:

- Releases de aplicación: `/var/www/cafco/releases`.
- Symlink actual: destino de `/var/www/cafco/current`.
- Variables de entorno: `/var/www/cafco/shared/.env.production`.
- Configuración Nginx: `/etc/nginx/sites-available/cafco` y symlink en `sites-enabled`.
- Certificados TLS: `/etc/letsencrypt`.
- Estado PM2:
  - `/home/deploy/.pm2/dump.pm2`.
  - Ecosystem file si existe en el release.
- Scripts operativos del repo:
  - `scripts/deploy.sh`.
  - `scripts/backup.sh`.
- Logs recientes, si son necesarios para auditoría:
  - `/var/www/cafco/shared/logs`.
  - `/home/deploy/.pm2/logs`.

No respaldar:

- `node_modules`.
- `.next/cache`.
- Releases temporales incompletos.
- Archivos de build locales no usados por producción.

## Ubicación de backups

Local:

```text
/var/www/cafco/shared/backups/
```

Nombre recomendado:

```text
cafco-backup-YYYYMMDD-HHMMSS.tar.gz
cafco-backup-YYYYMMDD-HHMMSS.sha256
```

Offsite recomendado:

- Hetzner snapshot.
- Bucket privado compatible S3.
- Almacenamiento cifrado administrado por la organización.

## Script principal

Ejecutar:

```bash
./scripts/backup.sh
```

El script debe:

1. Crear un directorio temporal.
2. Copiar manifests de releases y `readlink -f /var/www/cafco/current`.
3. Empaquetar rutas críticas.
4. Excluir caches y dependencias regenerables.
5. Generar checksum SHA256.
6. Guardar el backup en `/var/www/cafco/shared/backups`.
7. Eliminar backups locales antiguos según retención.

Ejemplo operativo:

```bash
sudo -iu deploy
cd /var/www/cafco/current
./scripts/backup.sh
sha256sum -c /var/www/cafco/shared/backups/cafco-backup-YYYYMMDD-HHMMSS.sha256
```

Si el script necesita leer `/etc/nginx` o `/etc/letsencrypt`, ejecutarlo con permisos controlados por `sudo` o separar el backup de configuración del sistema.

## Schedule

Recomendado:

- Diario: backup de app, env, nginx y PM2.
- Semanal: snapshot Hetzner completo.
- Antes de cada deploy: backup rápido de `current`, env y Nginx.
- Antes de cambios de Node, Nginx, certbot u OS: backup completo.

Cron recomendado:

```cron
15 3 * * * /var/www/cafco/current/scripts/backup.sh >> /var/www/cafco/shared/logs/backup.log 2>&1
```

Verificar que el cron corre como usuario con permisos suficientes.

## Retención

Retención mínima:

- Backups diarios: 14 días.
- Backups semanales: 8 semanas.
- Snapshots mensuales: 3 meses.

En disco local, mantener menos si el volumen es pequeño. Priorizar backups offsite.

## Verificación

Después de crear un backup:

```bash
ls -lh /var/www/cafco/shared/backups
sha256sum -c /var/www/cafco/shared/backups/<archivo>.sha256
tar -tzf /var/www/cafco/shared/backups/<archivo>.tar.gz | head
```

Mensualmente hacer una restauración de prueba en un VPS temporal o directorio alterno.

## Seguridad

- `.env.production` contiene secretos. El backup debe tratarse como secreto.
- Usar permisos `600` para archivos de backup.
- Cifrar backups offsite.
- No subir backups al repositorio.
- No exponer `/var/www/cafco/shared/backups` por Nginx.
