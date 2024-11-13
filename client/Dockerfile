FROM node:22-alpine AS client-build
WORKDIR /app
COPY front-end/. .
RUN corepack enable && corepack prepare yarn@4.5 \
    && yarn install --immutable \
    && yarn build

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS api-build
WORKDIR /app
COPY api/. .
RUN dotnet restore
RUN dotnet build -c Release

FROM api-build AS api-publish
RUN dotnet publish -c Release /p:PublishDir=/app/publish /p:UseAppHost=false

FROM python:3.12 AS sio-build
WORKDIR /app
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
COPY socket-io/. .
RUN apt update \
    && apt install -y binutils \
    && pip3 install -r requirements.txt \
    && pyinstaller --name main --onefile --hidden-import=main ./main.py
	
FROM nginx:1.27.2
RUN apt update \
   && apt install -y wget supervisor \
   && wget https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \
   && dpkg -i packages-microsoft-prod.deb \
   && rm packages-microsoft-prod.deb \
   && apt update \
   && apt install -y aspnetcore-runtime-8.0 \
   && apt autoremove \
   && apt clean \
   && rm -rf /var/lib/apt/lists/*

COPY --from=client-build /app/dist /usr/share/nginx/html
COPY --from=sio-build /app/dist /app/socket-io
COPY --from=api-publish /app/publish /app/api
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/supervisor.conf /etc/supervisor.conf

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor.conf"]
