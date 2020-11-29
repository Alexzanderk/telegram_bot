FROM node:14.9.0-alpine3.12

WORKDIR /bot
COPY . .

RUN  npm install
RUN npm run build

COPY .env ./dist

ENTRYPOINT [ "npm", "start" ]