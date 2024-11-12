FROM node:18-alpine AS client-build
WORKDIR /app
COPY front-end/package.json front-end/yarn.lock ./
RUN yarn --frozen-lockfile
COPY front-end/. .
RUN yarn build

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS api-build
WORKDIR /api
COPY api/. .
RUN dotnet restore
RUN dotnet build -c Release

FROM api-build AS api-publish
RUN dotnet publish -c Release /p:PublishDir=/api/publish /p:UseAppHost=false

FROM nginx:1.27.2
RUN apt update \
   && apt install -y wget supervisor python3 python3-pip python3-venv  \
   && wget https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \
   && dpkg -i packages-microsoft-prod.deb \
   && rm packages-microsoft-prod.deb \
   && apt update \
   && apt install -y aspnetcore-runtime-8.0 \
   && apt autoremove \
   && apt clean \
   && rm -rf /var/lib/apt/lists/*

WORKDIR /socketio
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
COPY socket-io/. .
RUN pip install -r requirements.txt \
    && chmod +x ./main.py    

COPY --from=client-build /app/dist /usr/share/nginx/html
COPY --from=api-publish /api/publish /api
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/supervisor.conf /etc/supervisor.conf

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor.conf"]
