# Operaciones diarias de cafco

## Resumen de servicios

- Nginx: recibe tráfico público en `80/443` y proxy a Next.js.
- PM2: mantiene vivo el proceso `cafco`.
- Next.js standalone: corre en `127.0.0.1:3000`.
- Assets externos: Cloudflare R2 y Wix Static según `next.config.mjs`.

## PM2

Ejecutar como usuario `deploy`:

```bash
sudo -iu deploy
cd /var/www/cafco/current
```

Estado:

```bash
pm2 status
pm2 describe cafco
```

Logs:

```bash
pm2 logs cafco
pm2 logs cafco --lines 200
pm2 monit
```

Reload sin cortar tráfico:

```bash
pm2 reload cafco --update-env
```

Restart completo:

```bash
pm2 restart cafco --update-env
```

Detener:

```bash
pm2 stop cafco
```

Guardar estado para reinicio del servidor:

```bash
pm2 save
pm2 startup systemd -u deploy --hp /home/deploy
```

## Nginx

Validar configuración:

```bash
sudo nginx -t
```

Recargar sin cortar conexiones:

```bash
sudo systemctl reload nginx
```

Reiniciar solo si reload no alcanza:

```bash
sudo systemctl restart nginx
```

Estado:

```bash
systemctl status nginx --no-pager
```

Logs:

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Logs de aplicación

PM2:

```bash
pm2 logs cafco --lines 200
```

Archivos PM2:

```bash
ls -lah ~/.pm2/logs/
tail -f ~/.pm2/logs/cafco-out.log
tail -f ~/.pm2/logs/cafco-error.log
```

Logs compartidos de la app, si `deploy.sh` los enlaza:

```bash
ls -lah /var/www/cafco/shared/logs
```

## Health checks

HTTPS público:

```bash
curl -fsS https://cafco.example.com/
```

Local contra Next.js:

```bash
curl -fsS http://127.0.0.1:3000/
```

Cabeceras:

```bash
curl -I https://cafco.example.com/
```

Certificado:

```bash
echo | openssl s_client -connect cafco.example.com:443 -servername cafco.example.com 2>/dev/null | openssl x509 -noout -dates
```

## Restarts controlados

Aplicación:

```bash
sudo -iu deploy
cd /var/www/cafco/current
pm2 reload cafco --update-env
```

Nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Servidor completo, solo en ventana de mantenimiento:

```bash
sudo reboot
```

Después del reboot:

```bash
systemctl status nginx --no-pager
sudo -iu deploy pm2 status
curl -fsS https://cafco.example.com/
```

## Updates de seguridad

Semanalmente:

```bash
sudo apt update
sudo apt list --upgradable
sudo apt upgrade
```

Si se actualiza kernel o librerías críticas:

```bash
sudo reboot
```

Validar después:

```bash
sudo systemctl status nginx --no-pager
sudo -iu deploy pm2 status
curl -fsS https://cafco.example.com/
```

## Espacio en disco

Revisar:

```bash
df -h
du -sh /var/www/cafco/releases/* | sort -h
du -sh ~/.pm2/logs
```

Limpiar releases antiguos:

```bash
ls -1dt /var/www/cafco/releases/* | tail -n +11 | xargs -r rm -rf
```

Rotar logs si crecen demasiado:

```bash
pm2 flush cafco
```

## Checklist diario

- `pm2 status` muestra `cafco` en `online`.
- `curl -fsS https://cafco.example.com/` responde 200/3xx esperado.
- `systemctl status nginx` está activo.
- No hay errores repetidos en `pm2 logs`.
- `df -h` tiene al menos 20% libre.
- Certificado TLS vence en más de 14 días.
