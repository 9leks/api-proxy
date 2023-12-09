# syntax=docker/dockerfile:1

FROM node:20
ENV PORT 8000
ENV IP 0.0.0.0
COPY . /app
WORKDIR /app
CMD npm i && npm start
EXPOSE $PORT
