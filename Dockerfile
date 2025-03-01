FROM node:22-alpine

COPY . /app

WORKDIR /app

RUN yarn install

ENV LISTEN_ADDRESS=0.0.0.0
ENV PORT=80

CMD npm start
