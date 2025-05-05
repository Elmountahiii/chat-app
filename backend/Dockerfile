FROM node:22-alpine

WORKDIR  /usr/src/app

COPY package*.json  tsconfig*.json ./

COPY src ./src

COPY .env ./

RUN npm install

RUN npm run build


EXPOSE 3000

CMD [ "npm", "run", "start"]