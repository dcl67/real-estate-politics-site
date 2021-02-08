FROM node:current-alpine as builder

WORKDIR /srv
ADD package*.json ./

RUN npm install
ADD . .
RUN npm run build

FROM nginx:alpine

# Config that allows to run as non-root
COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY --from=builder /srv/build/ ./
