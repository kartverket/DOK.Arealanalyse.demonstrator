FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .
RUN yarn build

WORKDIR /proxy
COPY ./proxy/package.json ./proxy/yarn.lock ./
RUN yarn --frozen-lockfile
COPY ./proxy .

FROM nginx:1.25.4
RUN apt update \
   && apt install -y nodejs supervisor
COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /proxy /proxy
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/supervisor.conf /etc/supervisor.conf

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor.conf"]
