FROM node:14.9.0-alpine3.12

WORKDIR /service
COPY . .

RUN  npm install
RUN npm run build

COPY .env ./dist

# COPY ./src/app/Worker/utils/country-codes.json ./dist/utils/

ENTRYPOINT [ "npm", "start" ]