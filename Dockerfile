FROM node:alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY ./dist ./

EXPOSE 4000

CMD ["node", "index.js"]