# Arealanalyse av DOK-datasett
Demonstrator for oppsett av arealanalyse basert på pygeoapi

## Forutsetninger for installasjon i eget miljø
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

Disse verktøyene er nødvendige for å bygge og kjøre applikasjonen i et containerisert miljø.

## Laste ned prosjektet
Start med å laste ned prosjektet

```bash
git clone https://github.com/kartverket/DOK.Arealanalyse.demonstrator.git
cd DOK.Arealanalyse.demonstrator
```

## Justere konfigurasjonen til ditt miljø
juster .env filen som ligger i roten av prosjektet

```ini
PYGEOAPI_API_URL=http://localhost:5000
```

## Bygge applikasjonen

```bash
docker-compose up --build
```

## Tilgang til images for Docker
TODO - nå bak Azure Container Registry tilgang
```powershell
az login
az acr login --name crdokanalyse
```

## Markedsplass
Beskrivelse av tjenesten som er ihht GaiaX for evt publisering av tjenesten i dataspace/markedsplass

[![Gaia-X Compliant](https://img.shields.io/badge/Gaia--X-Compliant-blue)](./gaia-x/self-description.json)
