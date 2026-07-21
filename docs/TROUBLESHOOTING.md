# Troubleshooting de cafco

## 502 Bad Gateway

Síntoma:

- Nginx responde `502`.
- El puerto interno no responde.

Diagnóstico:

```bash
sudo tail -n 100 /var/log/nginx/error.log
sudo -iu deploy pm2 status
sudo -iu deploy pm2 logs cafco --lines 100
curl -v http://127.0.0.1:3000/
```

Causas comunes:

- PM2 no está corriendo.
- Next.js escucha en otro puerto.
- `PORT`, `HOST` o `HOSTNAME` mal configurados.
- Build incompleto o `server.js` ausente.
- Nginx apunta a un puerto incorrecto.

Corrección:

```bash
sudo -iu deploy
cd /var/www/cafco/current
pm2 restart cafco --update-env
curl -fsS http://127.0.0.1:3000/
```

Si no levanta, hacer rollback al release anterior.

## PM2 crash loop

Síntoma:

- `pm2 status` muestra reinicios constantes.
- Logs muestran excepción al iniciar.

Diagnóstico:

```bash
sudo -iu deploy pm2 describe cafco
sudo -iu deploy pm2 logs cafco --lines 200
sudo -iu deploy env | sort
```

Causas comunes:

- Variable de entorno faltante.
- Dependencias no instaladas.
- Build incompatible con la versión de Node.
- Error de i18n o import alias.
- Puerto ocupado.

Corrección:

```bash
sudo -iu deploy
cd /var/www/cafco/current
pnpm install --frozen-lockfile
pnpm build
pm2 restart cafco --update-env
```

Ver puerto:

```bash
sudo ss -ltnp | grep ':3000'
```

## Certificado no renueva

Síntoma:

- Browser muestra certificado vencido.
- `certbot renew --dry-run` falla.

Diagnóstico:

```bash
sudo certbot certificates
sudo certbot renew --dry-run
sudo journalctl -u certbot --no-pager -n 100
sudo nginx -t
```

Causas comunes:

- DNS no apunta al VPS.
- Puerto 80 bloqueado.
- Nginx no sirve challenge ACME.
- Rate limit de Let's Encrypt.

Corrección:

```bash
sudo ufw status
sudo nginx -t
sudo systemctl reload nginx
sudo certbot renew --dry-run
```

Si hace falta emitir de nuevo:

```bash
sudo certbot --nginx -d cafco.example.com -d www.cafco.example.com
```

## Build falla

Síntoma:

- `pnpm build` falla en deploy o CI.

Diagnóstico:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm exec tsc --noEmit
pnpm exec vitest run --passWithNoTests
pnpm build
```

Causas comunes:

- Lockfile desactualizado.
- Error TypeScript.
- Cambio incompatible de Next.js.
- Memoria insuficiente en VPS.
- Alias de i18n roto.

Corrección:

- Corregir error en branch y volver a desplegar.
- Si es memoria, usar CPX21 o construir en CI.
- Si solo falla producción, comparar `.env.production` con `.env.local` sin exponer secretos.

## Problemas de i18n

Síntoma:

- Rutas traducidas no resuelven.
- Build falla importando `next-intl/config`.
- Páginas devuelven 404 inesperado por locale.

Contexto:

- `next.config.mjs` define alias `next-intl/config` hacia `src/i18n/request.ts`.
- Turbopack también define el alias.

Diagnóstico:

```bash
pnpm build
sed -n '1,120p' next.config.mjs
sed -n '1,160p' src/i18n/request.ts
sed -n '1,160p' src/i18n/routing.ts
```

Corrección:

- Confirmar que `src/i18n/request.ts` existe en el release.
- Confirmar que el alias coincide en `webpack` y `turbopack`.
- Revisar cambios de `next-intl` antes de upgrade.
- Hacer rollback si empezó después de un deploy.

## Imágenes externas no cargan

Síntoma:

- Imágenes remotas dan error de Next Image.
- Se ven placeholders o errores 400/500 para `/_next/image`.

Contexto:

El config actual permite:

- `pub-920fda90d8d340c599bf7793a05eb9fb.r2.dev`
- `static.wixstatic.com`

Diagnóstico:

```bash
curl -I https://pub-920fda90d8d340c599bf7793a05eb9fb.r2.dev/
curl -I https://static.wixstatic.com/
pnpm build
```

Corrección:

- Agregar hostname nuevo en `images.remotePatterns` si el origen cambió.
- Verificar que Cloudflare R2 permite acceso público a esos assets.
- Verificar que Wix no cambió URL o permisos.
- Purga de cache CDN si aplica.

## Disco lleno

Síntoma:

- Deploy falla instalando dependencias o construyendo.
- Nginx/PM2 loguean errores de escritura.

Diagnóstico:

```bash
df -h
df -i
du -sh /var/www/cafco/releases/* | sort -h
du -sh /var/www/cafco/shared/backups
du -sh /home/deploy/.pm2/logs
```

Corrección:

```bash
ls -1dt /var/www/cafco/releases/* | tail -n +11 | xargs -r rm -rf
sudo -iu deploy pm2 flush cafco
sudo apt clean
```

Mover backups antiguos a offsite y borrar del VPS si ya están verificados.

## Nginx no recarga

Diagnóstico:

```bash
sudo nginx -t
sudo journalctl -u nginx --no-pager -n 100
```

Corrección:

- Arreglar el archivo indicado por `nginx -t`.
- Restaurar `/etc/nginx/sites-available/cafco` desde backup si el cambio no es claro.
- Recargar:

  ```bash
  sudo systemctl reload nginx
  ```

## Deploy por GitHub Actions falla

Diagnóstico:

- Revisar que existan secrets:
  - `DEPLOY_HOST`
  - `DEPLOY_USER`
  - `DEPLOY_SSH_KEY`
- Confirmar que la clave pública correspondiente está en `/home/deploy/.ssh/authorized_keys`.
- Confirmar que el servidor acepta SSH desde GitHub Actions.
- Revisar logs del job de deploy.

Prueba manual desde una máquina autorizada:

```bash
ssh deploy@<DEPLOY_HOST> "hostname && whoami && test -d /var/www/cafco"
```

## Sitio lento

Diagnóstico:

```bash
top
free -h
pm2 monit
sudo tail -n 100 /var/log/nginx/access.log
```

Causas comunes:

- VPS corto de RAM/CPU.
- Build corriendo en producción durante tráfico alto.
- Imágenes externas lentas.
- Logs excesivos.

Corrección:

- Mover build a CI si el VPS queda saturado.
- Subir de CX22 a CPX21.
- Optimizar o cachear assets.
- Revisar `LOG_LEVEL`.
