FROM mcr.microsoft.com/dotnet/sdk:8.0.203-bookworm-slim-amd64 AS build
WORKDIR /app
COPY . .
RUN dotnet restore
RUN dotnet build -c Release

FROM build AS publish
RUN dotnet publish -c Release /p:PublishDir=/app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0.3-bookworm-slim-amd64
WORKDIR /app
COPY --from=publish /app/publish /app

EXPOSE 81

CMD ["dotnet", "Dok.Arealanalyse.Api.Web.dll"]
