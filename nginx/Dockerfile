FROM nginx:alpine

RUN apk add --no-cache curl
RUN rm -rf /etc/nginx/conf.d/default.conf

COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./config/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80 443

ENTRYPOINT [ "entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]