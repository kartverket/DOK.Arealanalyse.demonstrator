FROM node:18-alpine AS client-build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .
RUN yarn build

WORKDIR /proxy
COPY ./proxy/package.json ./proxy/yarn.lock ./
RUN yarn --frozen-lockfile
COPY ./proxy .

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS converter-build
WORKDIR /converter
COPY converter/. .
RUN dotnet restore
RUN dotnet build -c Release

FROM converter-build AS converter-publish
RUN dotnet publish -c Release -o /converter/publish /p:UseAppHost=false

FROM nginx:1.25.4
RUN apt update \
   && apt install -y wget nodejs supervisor \
   && wget https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \
   && dpkg -i packages-microsoft-prod.deb \
   && rm packages-microsoft-prod.deb \
   && apt update \
   && apt install -y aspnetcore-runtime-8.0   
  
COPY --from=client-build /app/build /usr/share/nginx/html
COPY --from=client-build /proxy /proxy
COPY --from=converter-publish /converter/publish /converter
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/supervisor.conf /etc/supervisor.conf

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor.conf"]
