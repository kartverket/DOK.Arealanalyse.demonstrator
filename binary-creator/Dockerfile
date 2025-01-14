FROM node:23-alpine AS build
WORKDIR /app
COPY src/client-script/. .
RUN corepack enable && corepack prepare yarn@4.6.0 \
    && yarn install --immutable \
    && yarn build

FROM node:23-bookworm-slim
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY src ./src
RUN corepack enable && corepack prepare yarn@4.6.0 \
    && yarn install --immutable
COPY --from=build /html ./src/html

RUN echo "deb http://ftp.debian.org/debian bullseye main contrib" >> /etc/apt/sources.list \
    && apt update \
    && apt install -y supervisor chromium

COPY supervisor.conf /etc/supervisor.conf   

EXPOSE 5003

CMD ["supervisord", "-c", "/etc/supervisor.conf"]