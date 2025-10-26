#!/bin/sh

set -e

echo "Starting Nginx..."

# Check if SSL config files exist
if [ ! -f "/etc/letsencrypt/options-ssl-nginx.conf" ]; then
  echo "Downloading recommended TLS parameters..."
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "/etc/letsencrypt/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "/etc/letsencrypt/ssl-dhparams.pem"
  echo "TLS parameters downloaded successfully!"
else
  echo "TLS parameters already exist, skipping download."
fi

exec "$@"