FROM node:alpine

WORKDIR /usr/src/app

COPY ./ ./

RUN yarn
RUN yarn build

EXPOSE 4000

CMD ["node", "dist/index.js"]