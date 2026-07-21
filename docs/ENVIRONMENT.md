# Variables de entorno

## Dónde viven

Producción:

```text
/var/www/cafco/shared/.env.production
```

Permisos:

```bash
sudo chown deploy:deploy /var/www/cafco/shared/.env.production
sudo chmod 600 /var/www/cafco/shared/.env.production
```

CI/CD:

- GitHub Actions Secrets.
- Nunca en texto plano dentro del repositorio.

Local:

```text
.env.local
```

No commitear archivos `.env*` con secretos.

## Variables de runtime de Next.js

### `NODE_ENV`

- Producción: `production`.
- Desarrollo local: `development`.

Ejemplo:

```env
NODE_ENV=production
```

### `HOST`

Host de escucha del proceso Node/Next.

Producción recomendada:

```env
HOST=127.0.0.1
```

Usar loopback para que Nginx sea el único punto público.

### `PORT`

Puerto interno de Next.js.

Producción recomendada:

```env
PORT=3000
```

Debe coincidir con `proxy_pass http://127.0.0.1:3000` en Nginx.

### `HOSTNAME`

Hostname usado por Next standalone cuando se ejecuta `server.js`.

Producción recomendada:

```env
HOSTNAME=127.0.0.1
```

### `NEXT_PUBLIC_SITE_URL`

URL pública canónica del sitio.

Ejemplo:

```env
NEXT_PUBLIC_SITE_URL=https://cafco.example.com
```

Al empezar por `NEXT_PUBLIC_`, su valor puede quedar embebido en el bundle del cliente. No poner secretos aquí.

### `LOG_LEVEL`

Nivel de logs de la aplicación.

Valores recomendados:

```env
LOG_LEVEL=info
```

Para diagnóstico temporal:

```env
LOG_LEVEL=debug
```

Volver a `info` después de resolver el incidente.

## Variables de infraestructura

### `HCLOUD_TOKEN`

Token de Hetzner Cloud para crear o modificar infraestructura desde scripts.

Dónde vive:

- Local del operador: variable de shell o secreto temporal.
- CI: GitHub Actions Secret si se aprovisiona desde CI.

Ejemplo:

```bash
export HCLOUD_TOKEN=...
```

No debe vivir en `/var/www/cafco/shared/.env.production` salvo que la app lo necesite en runtime, lo cual no está previsto.

Bloqueante conocido: si `HCLOUD_TOKEN` no está definido, no se puede automatizar la creación del VPS, firewall cloud, snapshots ni otros recursos Hetzner. El deploy de aplicación a un servidor ya creado sí puede continuar.

### `DOMAIN`

Dominio público usado por scripts de deploy, Nginx y Certbot.

Ejemplo:

```env
DOMAIN=cafco.example.com
```

Dónde vive:

- En `.env.production` si los scripts lo cargan desde el servidor.
- En GitHub Actions Variables o Secrets si el workflow lo necesita.

### `DEPLOY_SSH_KEY`

Clave privada SSH usada por CI para conectarse como `deploy`.

Dónde vive:

- GitHub Actions Secret: `DEPLOY_SSH_KEY`.

No debe guardarse en el VPS ni en el repositorio.

Formato:

```text
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

## Secrets de GitHub Actions

Para deploy:

```text
DEPLOY_HOST      Host o IP pública del VPS.
DEPLOY_USER      Usuario SSH, recomendado deploy.
DEPLOY_SSH_KEY   Clave privada SSH con acceso al VPS.
```

Opcionales según scripts:

```text
DOMAIN
HCLOUD_TOKEN
```

## Ejemplo de `.env.production`

```env
NODE_ENV=production
HOST=127.0.0.1
HOSTNAME=127.0.0.1
PORT=3000
NEXT_PUBLIC_SITE_URL=https://cafco.example.com
LOG_LEVEL=info
DOMAIN=cafco.example.com
```

## Cambios de env vars

1. Editar:

   ```bash
   sudo -iu deploy
   nano /var/www/cafco/shared/.env.production
   ```

2. Validar permisos:

   ```bash
   chmod 600 /var/www/cafco/shared/.env.production
   ```

3. Recargar PM2:

   ```bash
   cd /var/www/cafco/current
   pm2 reload cafco --update-env
   ```

4. Verificar:

   ```bash
   pm2 logs cafco --lines 100
   curl -fsS https://cafco.example.com/
   ```
