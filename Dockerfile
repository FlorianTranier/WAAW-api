FROM node:alpine

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install
RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]