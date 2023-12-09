# syntax=docker/dockerfile:1

FROM node:20
COPY . /app
WORKDIR /app
CMD npm i && npm start
