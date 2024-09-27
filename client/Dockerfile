FROM node:18-alpine AS client-build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .
RUN yarn build

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS api-build
WORKDIR /api
COPY api/. .
RUN dotnet restore
RUN dotnet build -c Release

FROM api-build AS api-publish
RUN dotnet publish -c Release /p:PublishDir=/api/publish /p:UseAppHost=false

FROM nginx:1.27.1
RUN apt update \
   && apt install -y wget supervisor \
   && wget https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \
   && dpkg -i packages-microsoft-prod.deb \
   && rm packages-microsoft-prod.deb \
   && apt update \
   && apt install -y aspnetcore-runtime-8.0   
  
COPY --from=client-build /app/dist /usr/share/nginx/html
COPY --from=api-publish /api/publish /api
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/supervisor.conf /etc/supervisor.conf

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor.conf"]
