FROM node:alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn
RUN yarn build

COPY ./dist ./

EXPOSE 4000

CMD ["node", "index.js"]