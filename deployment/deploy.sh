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

echo -e "${YELLOW}Restarting all services...${NC}\n\n"
docker-compose down
docker-compose up -d

echo -e "${GREEN}Deployment completed successfully! ${NC}\n\n"
echo -e "${GREEN}All services started. ${NC}\n\n"