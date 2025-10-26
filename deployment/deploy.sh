#!/bin/bash
set -e

RED='\e[31m'
GREEN='\e[32m'
YELLOW='\e[33m'
NC='\e[0m'

domain="chat.elmountahi.dev"
email="youssef@elmountahi.dev"


staging=1

if [ $staging != "0" ]; then
  staging_arg="--staging"
fi

echo -e "${YELLOW}Requesting certificate for ${GREEN}$domain ${YELLOW}...${NC}\n\n"

docker-compose run --rm -p 80:80 --entrypoint "\
  certbot certonly --standalone \
    $staging_arg \
    --email $email \
    -d $domain \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal \
    --non-interactive \
    --no-eff-email" certbot

echo -e "${GREEN}Certificate obtained successfully! ${NC}\n\n"

echo -e "${YELLOW}Downloading recommended TLS parameters...${NC}\n\n"
mkdir -p ./tmp-certbot
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "./tmp-certbot/options-ssl-nginx.conf"
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "./tmp-certbot/ssl-dhparams.pem"

echo -e "${YELLOW}Copying TLS parameters to certbot volume...${NC}\n\n"
docker cp ./tmp-certbot/options-ssl-nginx.conf certbot:/etc/letsencrypt/options-ssl-nginx.conf
docker cp ./tmp-certbot/ssl-dhparams.pem certbot:/etc/letsencrypt/ssl-dhparams.pem
rm -rf ./tmp-certbot

echo -e "${YELLOW}Restarting all services...${NC}\n\n"
docker-compose down
docker-compose up -d

echo -e "${GREEN}Deployment completed successfully! ${NC}\n\n"
echo -e "${GREEN}All services started. ${NC}\n\n"