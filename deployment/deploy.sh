#!/bin/bash
set -e

domain="chat.elmountahi.dev"
email="youssef@elmountahi.dev"


echo "---- Starting Nginx for certificate generation..."

docker-compose up -d nginx

echo "Done "


echo "---- Requesting certificate for $domain ..."
