FROM mongo:8.0.13-noble

ENV MONGO_INITDB_ROOT_USERNAME=admin
ENV MONGO_INITDB_ROOT_PASSWORD=password
ENV MONGO_INITDB_DATABASE=chatapp

COPY init.js /docker-entrypoint-initdb.d/init.js

EXPOSE 27017

