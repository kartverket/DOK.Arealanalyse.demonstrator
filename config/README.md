# Konfigurasjonsfiler for analyser

Denne katalogen (/config) inneholder YAML-filer som konfigurerer datasett og analyser brukt i DOK Arealanalyse Demonstrator.

Hver .yml-fil representerer en spesifikk type datasett eller analysetema, som f.eks:

- Faresoner (skred, flom, steinsprang)

- Naturtyper (utvalgte naturtyper som kalksjøer, slåttemark osv.)

- Reindrift (flyttleier, anlegg)

- Kulturminner

- Infrastruktur (farleder, tilfluktsrom)

- Geotekniske data (borehull)

Eksempler på filer:

- flomsoner.yml

- naturtyper_utvalgte_kalklindeskog.yml

- stormflo.yml

## Struktur på en konfigfil

En typisk konfigurasjonsfil inneholder informasjon som:

- Id: Unik id for konfigurasjonen, bruk uuid.

- Metadata-id: Identifikator for datasett i geonorge

- Navn: Kort navn på datasettet

- Beskrivelse: Hva datasettet handler om

- Datakilde: Hvilken tjeneste eller API dataene hentes fra samt objekttyper/lag og geometrifelt som det søkes i

- Visningsfelter: Hvilke felter som hentes ut til data visningen, feks navn eller url til mer informasjon som ligger på objekter en treffer i analysen.

- Filter: Evt. filterbetingelser (for å velge ut spesifikke objekter)

- Tema: Hvilke DOK tema hører datasettet til - https://register.geonorge.no/metadata-kodelister/nasjonal-temainndeling

- Veiledningstekster: 

- Kvalitetsinformasjon:

- Deaktivering av enkelte konfigurasjoner: 


Eksempel på typisk YAML-oppbygging: