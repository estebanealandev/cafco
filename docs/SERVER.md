# Servidor Hetzner para cafco

## Recomendación de VPS

Para producción inicial de `cafco`:

- Proveedor: Hetzner Cloud.
- Región: Ashburn, VA (`ash`) para baja latencia hacia Costa Rica y Centroamérica.
- Sistema operativo: Ubuntu 24.04 LTS.
- Tamaño recomendado:
  - Base: CX22.
  - Alternativa con más margen de CPU/RAM: CPX21.
- Disco: mínimo 40 GB.
- RAM: mínimo 4 GB para build de Next.js, PM2 y Nginx.
- CPU: mínimo 2 vCPU.
- IPv4 pública habilitada.
- Backups/snapshots de Hetzner habilitados si el presupuesto lo permite.

Si el build de Next.js consume demasiada memoria, preferir CPX21 o construir en CI y subir artefactos.

## Hardening inicial

Aplicar antes del primer deploy:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y ufw fail2ban nginx certbot python3-certbot-nginx rsync curl git
```

Acciones mínimas:

- Deshabilitar login SSH por password.
- Usar claves SSH ed25519.
- Deshabilitar login directo de root por SSH.
- Crear usuario `deploy` para la aplicación.
- Mantener `sudo` solo para operadores, no para la aplicación.
- Activar firewall.
- Activar fail2ban.
- Configurar actualizaciones de seguridad.

## Usuarios

Usuarios recomendados:

- `root`: solo administración inicial y recuperación.
- `ubuntu` o usuario operador: acceso administrativo con `sudo`.
- `deploy`: propietario de `/var/www/cafco`; ejecuta PM2 y despliegues.

Crear usuario de deploy:

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo mkdir -p /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chown -R deploy:deploy /home/deploy/.ssh
```

Agregar claves autorizadas:

```bash
sudo nano /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys
```

## Paths

Paths estándar:

```text
/var/www/cafco/current
/var/www/cafco/releases
/var/www/cafco/shared/.env.production
/var/www/cafco/shared/logs
/var/www/cafco/shared/backups
/etc/nginx/sites-available/cafco
/etc/nginx/sites-enabled/cafco
/etc/letsencrypt/live/<dominio>
```

Permisos:

```bash
sudo mkdir -p /var/www/cafco/{releases,shared/logs,shared/backups}
sudo chown -R deploy:deploy /var/www/cafco
chmod 750 /var/www/cafco
chmod 700 /var/www/cafco/shared
chmod 600 /var/www/cafco/shared/.env.production
```

## Firewall

Configurar UFW:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status verbose
```

Puertos públicos esperados:

- `22/tcp`: SSH.
- `80/tcp`: HTTP para redirect y renovación ACME.
- `443/tcp`: HTTPS.

El puerto interno de Next.js, por ejemplo `3000`, no debe exponerse públicamente.

## fail2ban

Instalar y activar:

```bash
sudo apt install -y fail2ban
sudo systemctl enable --now fail2ban
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

Config mínimo recomendado en `/etc/fail2ban/jail.d/sshd.local`:

```ini
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = %(sshd_log)s
maxretry = 5
findtime = 10m
bantime = 1h
```

Reiniciar:

```bash
sudo systemctl restart fail2ban
```

## Nginx

Nginx termina TLS y proxy hacia Next.js:

```nginx
server {
    listen 80;
    server_name cafco.example.com www.cafco.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cafco.example.com www.cafco.example.com;

    ssl_certificate /etc/letsencrypt/live/cafco.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cafco.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Validar siempre antes de recargar:

```bash
sudo nginx -t
sudo systemctl reload nginx
```
