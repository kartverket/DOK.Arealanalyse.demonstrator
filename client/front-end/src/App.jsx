import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorMessage } from 'store/slices/appSlice';
import { resetProgress } from 'store/slices/datasetSlice';
import { useMap } from 'context/MapContext';
import { analyze } from 'utils/api';
import { createRandomId } from 'utils/helpers';
import { Form, ResultDialog, ResultList } from 'features';
import { Heading, ProgressBar, Toaster } from 'components';
import groupBy from 'lodash.groupby';
import useSocketIO from 'hooks/useSocketIO';
import messageHandlers from 'config/messageHandlers';
import styles from './App.module.scss';
import FactSheet from 'features/FactSheet';

export default function App() {
    useSocketIO(messageHandlers);
    const [data, setData] = useState(null);
    const [fetching, setFetching] = useState(false);
    const dispatch = useDispatch();
    const correlationId = useSelector(state => state.app.correlationId);
    const { clearCache } = useMap();

    function resetState() {
        setData(null);
        clearCache();
        dispatch(resetProgress());
    }

    async function start(payload) {
        resetState();

        try {
            setFetching(true);
            const response = await analyze(payload, correlationId);

            if (response?.code) {
                dispatch(setErrorMessage('Kunne ikke kjøre DOK-analyse. En feil har oppstått.'));
                console.log(response.code);
            } else {
                const { resultList, factList } = response;

                resultList.forEach(result => result._tempId = createRandomId());
                
                const grouped = groupBy(resultList, result => result.resultStatus);

                setData({ ...response, resultList: grouped, factList });
            }
        } catch (error) {
            dispatch(setErrorMessage('Kunne ikke kjøre DOK-analyse. En feil har oppstått.'));
            console.log(error);
        } finally {
            setFetching(false);
        }
    }

    return (
        <div className={styles.app}>
            <Heading />

            <div className={styles.content}>
                <Form onSubmit={start} fetching={fetching} />
                {
                    fetching && <ProgressBar />
                }
                {
                    data !== null && (
                        <>
                            <FactSheet factList={data.factList} municipalityNumber={data.municipalityNumber} municipalityName={data.municipalityName} inputGeometryArea={data.inputGeometryArea} inputGeometry={data.inputGeometry} />
                            <ResultList data={data} />
                            <ResultDialog inputGeometry={data.inputGeometry} />
                        </>
                    )
                }
                
                <Toaster />
            </div>
        </div>
    );
}
const datatings = {
    "resultList": [
        {
            "title": "Flom fra sjø ved høye vannstander (stormflo) og økt havnivå",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "check coverage",
                "intersect Stormflo20År_KlimaÅrNå",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": 969.8699461031401,
            "resultStatus": "HIT-RED",
            "distanceToObject": 0,
            "rasterResult": "https://wms.geonorge.no/skwms1/wms.stormflo_havniva?layers=stormflo20ar_klimaarna",
            "cartography": "https://wms.geonorge.no/skwms1/wms.stormflo_havniva?service=WMS&version=1.3.0&request=GetLegendGraphic&sld_version=1.1.0&layer=stormflo20ar_klimaarna&format=image/png",
            "data": [
                {
                    "sikkerhetsklasseFlom": "F1",
                    "oppdateringsdato": "2024-06-18T11:12:49.362",
                    "opphav": "Kartverket"
                },
                {
                    "sikkerhetsklasseFlom": "F1",
                    "oppdateringsdato": "2024-06-18T11:12:49.362",
                    "opphav": "Kartverket"
                },
                {
                    "sikkerhetsklasseFlom": "F1",
                    "oppdateringsdato": "2024-06-18T11:12:49.362",
                    "opphav": "Kartverket"
                },
                {
                    "sikkerhetsklasseFlom": "F1",
                    "oppdateringsdato": "2024-06-18T11:12:49.362",
                    "opphav": "Kartverket"
                },
                {
                    "sikkerhetsklasseFlom": "F1",
                    "oppdateringsdato": "2024-06-18T11:12:49.362",
                    "opphav": "Kartverket"
                },
                {
                    "sikkerhetsklasseFlom": "F1",
                    "oppdateringsdato": "2024-06-18T11:12:49.362",
                    "opphav": "Kartverket"
                },
                {
                    "sikkerhetsklasseFlom": "F1",
                    "oppdateringsdato": "2024-06-18T11:12:49.362",
                    "opphav": "Kartverket"
                },
                {
                    "sikkerhetsklasseFlom": "F1",
                    "oppdateringsdato": "2024-06-18T11:12:49.362",
                    "opphav": "Kartverket"
                },
                {
                    "sikkerhetsklasseFlom": "F1",
                    "oppdateringsdato": "2024-06-18T11:12:49.362",
                    "opphav": "Kartverket"
                },
                {
                    "sikkerhetsklasseFlom": "F1",
                    "oppdateringsdato": "2024-06-18T11:12:49.362",
                    "opphav": "Kartverket"
                },
                {
                    "sikkerhetsklasseFlom": "F1",
                    "oppdateringsdato": "2024-06-18T11:12:49.362",
                    "opphav": "Kartverket"
                },
                {
                    "sikkerhetsklasseFlom": "F1",
                    "oppdateringsdato": "2024-06-18T11:12:49.362",
                    "opphav": "Kartverket"
                },
                {
                    "sikkerhetsklasseFlom": "F1",
                    "oppdateringsdato": "2024-06-18T11:12:49.362",
                    "opphav": "Kartverket"
                },
                {
                    "sikkerhetsklasseFlom": "F1",
                    "oppdateringsdato": "2024-06-18T11:12:49.362",
                    "opphav": "Kartverket"
                },
                {
                    "sikkerhetsklasseFlom": "F1",
                    "oppdateringsdato": "2024-06-18T11:12:49.362",
                    "opphav": "Kartverket"
                }
            ],
            "themes": [
                "samfunnssikkerhet"
            ],
            "runOnDataset": {
                "datasetId": "fbb95c67-623f-430a-9fa5-9cfcea8366b3",
                "title": "Stormflo og havnivå",
                "description": "Merk at dette datasettet nylig er oppdatert ihht veilder fra DSB lansert 1. juli. Forbedringer av datasettet vil komme hyppig i starten. Blant annet vil de isolerte oversvømte arealene på land fjernes, siden man ikke vil få flom fra sjø her.\n\nEn konsekvens av menneskeskapte klimaendringer er at havnivået stiger. Rapporten Sea-Level Rise and Extremes in Norway (2024) viser at også i Norge vil vi merke den økende stigningen. I veilederen «Havnivåstigning og høye vannstander i samfunnsplanlegging» (2024) kommer DSB med råd og anbefalinger om hvordan kommunene skal ta hensyn til havnivåstigning i sin planlegging, både på kort og lang sikt, og for ny og eksisterende bebyggelse. Hensikten er å forebygge risiko for tap av liv, skade på helse, miljø og viktig infrastruktur, materielle verdier mv. på grunn av oversvømmelse. I tillegg til havnivåstigning, omhandler veilederen høye vannstander (stormflo) fordi havnivåstigningen fører til at høye vannstander vil inntreffe lenger, og oftere, inn over land enn hva som er tilfelle i dag.\n\nInformasjon om de høye vannstander med dagens havnivå eller med et framtidig havnivå som denne veilederen anbefaler kommunene å bruke, er samlet i dette datasettet. Videre har Kartverket modellert hvilke areal som kan bli berørt av oversvømmelse ved de ulike høye vannstandene, nå og i framtiden. \nDe høye vannstandene tilsvarer sikkerhetsklassene for flom brukt i TEK17 som er 20-års, 200-års og 1000-års stormflo. I tillegg finnes et «øvre estimat vannstand» som er anbefalt brukt for bygg som omfattes av TEK17 § 7-2 første ledd. \n\nNoen av disse høye vannstandene kommer også med klimapåslaget for havnivåendring frem til år 2100 eller år 2150. I tråd med det nye føre-var-grunnlaget for klimatilpasning i Norge er klimapåslaget basert på utslippsscenario SSP3-7.0 der man bruker 83-prosentiler for det sannsynlige utfallsrommet.\n\nDatasettet og veilederen fra DSB retter seg hovedsakelig mot kommuner og andre fagkyndige som skal utrede og vurdere konsekvensene av havnivåstigning og stormflo i saker etter plan- og bygningsloven, og ved utarbeidelse av helhetlig risiko- og sårbarhetsanalyse etter sivilbeskyttelsesloven.  \n\nSe produktspesifikasjon for ytterligere informasjon.",
                "owner": "Kartverket",
                "updated": "2024-07-04T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/fbb95c67-623f-430a-9fa5-9cfcea8366b3"
            },
            "description": "En konsekvens av menneskeskapte klimaendringer er at havnivået stiger. Rapporten Sea-Level Rise and Extremes in Norway (2024) viser at også i Norge vil vi merke den økende stigningen. I veilederen «Havnivåstigning og høye vannstander i samfunnsplanlegging» (2024) kommer DSB med råd og anbefalinger om hvordan kommunene skal ta hensyn til havnivåstigning i sin planlegging, både på kort og lang sikt, og for ny og eksisterende bebyggelse. Hensikten er å forebygge risiko for tap av liv, skade på helse, miljø og viktig infrastruktur, materielle verdier mv. på grunn av oversvømmelse. I tillegg til havnivåstigning, omhandler veilederen høye vannstander (stormflo) fordi havnivåstigningen fører til at høye vannstander vil inntreffe lenger, og oftere, inn over land enn hva som er tilfelle i dag.\n\nAnalyser viser at området i dette treffet kan bli utsatt for flom ved høye vannstander fra sjø og økt havnivå. ",
            "guidanceText": "Planområdet kan være utsatt for flom ved høye vannstander fra sjø og økt havnivå. ",
            "guidanceUri": [
                {
                    "href": "https://www.dsb.no/veiledere-handboker-og-informasjonsmateriell/havnivastigning-og-hoye-vannstander/",
                    "title": "Veileder fra DSB: Havnivåstigning og høye vannstander i samfunnsplanleggingen"
                },
                {
                    "href": "https://kartverket.no/til-sjos/se-havniva/kart",
                    "title": "Visualiseringstjeneste fra Kartverket for høye vannstander og økt havnivå"
                },
                {
                    "href": "https://kartkatalog.geonorge.no/metadata/stormflo-og-havnivaa/fbb95c67-623f-430a-9fa5-9cfcea8366b3",
                    "title": "Datasettet \"Stormflo og havnivå\" i Geonorge"
                }
            ],
            "possibleActions": [
                "Først må man finne ut i hvilken grad planområdet er utsatt for flom fra sjø. Se DSBs veileder for «Havnivåstigning og høye vannstander i samfunnsplanleggingen» for anbefalinger om hvilke kartlag for stormflo og havnivå som skal legges til grunn i planarbeidet og hvordan vurdere bølger som kommer i tillegg til dette.",
                "",
                "DSB anbefaler fire mulige strategiser for å møte utfordringer med flom fra sjø og økt havnivå:",
                "Beskytte: gjennom fysiske sikringstiltak slik som diker, barrierer og voller.",
                "Tilpasse: man tillater bygging i utsatte områder, men tilpasser mennesklig aktivitet, bygg og infrastruktur til økende havnivå. Dette kan være forsterking av bygg og infrastruktur slik at den tåler påvirkningen eller ulike naturbaserte løsninger.",
                "Unngå: ikke tillate ny utvikling i utsatte områder og revurdere avsatte arealer som er utsatt",
                "Tilbaketrekke: strategisk planlagt tilbaketrekking fra rammede kystområder ved å relokalisere bygninger og infrastruktur"
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "fullstendighet_dekning",
                    "qualityDimensionName": "Fullstendighetsdekning",
                    "value": "Ja",
                    "comment": "Grundig kartlagt med funn"
                },
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 4,
                    "comment": "Godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Faresoner for flom",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "query gjentaksintervall IN [20, 200, 2100]",
                "intersect FlomAreal",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 5935,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "samfunnssikkerhet"
            ],
            "runOnDataset": {
                "datasetId": "e95008fc-0945-4d66-8bc9-e50ab3f50401",
                "title": "Flomsoner",
                "description": "Flomsoner viser arealer som oversvømmes ved ulike flomstørrelser (gjentaksintervall).  Det blir utarbeidet flomsoner for 20-, 200- og 1000-årsflommene. I områder der klimaendringene gir en forventet økning i vannføringen på mer enn 20 %, utarbeides det flomsone for 200-årsflommen i år 2100.",
                "owner": "Norges vassdrags- og energidirektorat",
                "updated": "2024-11-19T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/e95008fc-0945-4d66-8bc9-e50ab3f50401"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [
                {
                    "href": "Plan- og bygningsloven § 28-1",
                    "title": "https://lovdata.no/dokument/NL/lov/2008-06-27-71/KAPITTEL_4-9#%C2%A728-1"
                },
                {
                    "href": "https://dibk.no/regelverk/byggteknisk-forskrift-tek17/7/7-2/",
                    "title": "TEK17 Kapittel 7 - Sikkerhet mot naturpåkjenninger § 7-2. Sikkerhet mot flom og stormflo"
                }
            ],
            "possibleActions": [
                "Sjekke hvilke krav til sikkerhet som gjelder for ønsket tiltak i byggteknisk forskrift (TEK17) § 7-2 og om ønsket tiltak likevel oppfyller krav til sikkerhet.",
                "Flytte tiltaket ut av faresonen.",
                "Hvis behov, utføre sikringstiltak etter råd fra fagkyndig."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Aktsomhetsområde for flom og erosjon",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect FlomAktsomhetOmr",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": 45957.65393569113,
            "resultStatus": "HIT-YELLOW",
            "distanceToObject": 0,
            "rasterResult": "https://nve.geodataonline.no/arcgis/services/FlomAktsomhet/MapServer/WMSServer?layers=Flom_aktsomhetsomrade",
            "cartography": "https://nve.geodataonline.no/arcgis/services/FlomAktsomhet/MapServer/WMSServer?service=WMS&version=1.3.0&request=GetLegendGraphic&sld_version=1.1.0&layer=Flom_aktsomhetsomrade&format=image/png",
            "data": [
                {
                    "vassOmråde": 19,
                    "temaKvalitet": "Nokså god",
                    "vannKilde": "FKB Vann"
                }
            ],
            "themes": [
                "samfunnssikkerhet"
            ],
            "runOnDataset": {
                "datasetId": "60c5024f-bf93-4d7a-888a-5fe001427195",
                "title": "Flom aktsomhetsområder",
                "description": "NVEs aktsomhetskart for flom er et nasjonalt datasett som på oversiktsnivå viser hvilke arealer som kan være utsatt for flomfare. \nDetaljeringsgraden på flomaktsomhetskartet er tilpasset kommuneplannivået (kommunenes oversiktsplanlegging), der det er egnet til bruk som et første vurderingsgrunnlag i konsekvensutredninger og/eller risiko- og sårbarhetsanalyser tilknyttet kommuneplanen for å identifisere aktsomhetsområder for flom. Aktsomhetsområdene skal legges til grunn ved fastsetting av flomhensynssoner og planbestemmelser.",
                "owner": "Norges vassdrags- og energidirektorat",
                "updated": "2024-11-18T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/60c5024f-bf93-4d7a-888a-5fe001427195"
            },
            "description": "NVEs aktsomhetskart for flom viser hvilke arealer som kan være utsatt for flom- og erosjonsfare. Kartet er egnet til bruk i kommuneplanens arealdel. Kartet vil aldri kunne bli helt nøyaktig, men er godt nok til å gi en indikasjon på hvor flomfaren bør vurderes nærmere, dersom det er aktuelt med ny utbygging. [Klikk her](https://gis3.nve.no/metadata/produktark/Produktark_FlomAktsomhet.pdf) for mer informasjon om aktsomhetskartet.\n\nSikkerhet mot flom må dokumenteres ivaretatt i henhold til krav gitt i byggteknisk forskrift (TEK17) [§ 7-2](https://dibk.no/regelverk/byggteknisk-forskrift-tek17/7/7-2/). Se NVEs retningslinjer 2/2011 [Flaum og skredfare i arealplanar](https://publikasjoner.nve.no/retningslinjer/2011/retningslinjer2011_02.pdf) for mer informasjon om videre fremgangsmåte.\n\nFor tiltak i sikkerhetsklasse F3 og tiltak som omfattes av § 7-2 første ledd, må det alltid gjennomføres en faresonekartlegging/-utredning. **Merk likevel at aktsomhetskartet kan være unøyaktig. Lokale terrengforhold bør vurderes før flomfaren kan utelukkes. Det samme gjelder tilstedeværelsen av mindre bekker som ikke har blitt plukket opp i analysen.**\n\nLangs små vassdrag (nedbørsfelt < 20 km2) bør byggegrense til vassdraget være minimum 20 m. For større vassdrag bør byggegrense settes til minimum 50-100 meter. Lokalt terreng og høydeforskjell kan tilsi at større avstand bør vurderes.",
            "guidanceText": "Tiltaket ligger innenfor et område hvor det kan være fare for flom og/eller erosjon. Reell fare må avklares og tas hensyn til.",
            "guidanceUri": [
                {
                    "href": "https://publikasjoner.nve.no/retningslinjer/2011/retningslinjer2011_02.pdf",
                    "title": "NVEs retningslinjer 2/2011 Flaum og skredfare i arealplanar"
                },
                {
                    "href": "http://publikasjoner.nve.no/veileder/2015/veileder2015_03.pdf",
                    "title": "NVEs veileder 3/2015 Flaumfare langs bekker"
                },
                {
                    "href": "https://www.nve.no/arealplanlegging/bygge-og-dispensasjonssaker/",
                    "title": "NVEs nettsider om bygge- og dispensasjonssaker"
                },
                {
                    "href": "https://lovdata.no/dokument/NL/lov/2008-06-27-71/KAPITTEL_4-9#%C2%A728-1",
                    "title": "Plan- og bygningsloven § 28-1"
                },
                {
                    "href": "https://dibk.no/regelverk/byggteknisk-forskrift-tek17/7/7-2/",
                    "title": "TEK17 Kapittel 7 - Sikkerhet mot naturpåkjenninger § 7-2. Sikkerhet mot flom og stormflo"
                }
            ],
            "possibleActions": [
                "Flytt tiltaket vekk fra fareutsatt område.",
                "Dokumenter tilstrekkelig sikkerhet mot flom og erosjon i henhold til krav gitt i byggteknisk forskrift (TEK17) § 7-2."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 2,
                    "comment": "Noe egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 3,
                    "comment": "Egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 2,
                    "comment": "Noe egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Aktsomhetsområder for jord- og flomskred",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect PotensieltSkredfareOmr",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 2743,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "samfunnssikkerhet"
            ],
            "runOnDataset": {
                "datasetId": "30e1883e-70e9-4510-9e97-00edbdcddc02",
                "title": "Jord- og flomskred aktsomhetsområder",
                "description": "Aktsomhetsområder for jord- og flomskred viser potensielle utløpsområder for alle typer løsmasseskred bortsett fra kvikkleireskred og store flomskred i slake elveløp.\nVed bruk av datasettet til analyseformål bør som hovedregel hele utløpsområdet vurderes. Utløpsområdet dekker alle areal hvor skredet fortsatt inneholder en viss andel fast materiale som kan avsettes. Dersom vanninnholdet i skredet er veldig høyt, kan selve vanninnholdet av skredet i visse tilfeller flyte enda lenger.\nAktsomhetskartet kan være nyttige i samband med overvåkning og beredskap i spesielt utsatte områder\nder mer detaljerte kart ikke finnes.",
                "owner": "Norges vassdrags- og energidirektorat",
                "updated": "2023-12-07T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/30e1883e-70e9-4510-9e97-00edbdcddc02"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [
                {
                    "href": "https://veileder-skredfareutredning-bratt-terreng.nve.no/",
                    "title": "NVEs veileder Utredning av sikkerhet mot skred i bratt terreng"
                },
                {
                    "href": "https://www.nve.no/arealplanlegging/bygge-og-dispensasjonssaker/",
                    "title": "NVEs nettsider om bygge- og dispensasjonssaker"
                },
                {
                    "href": "https://lovdata.no/dokument/NL/lov/2008-06-27-71/KAPITTEL_4-9#%C2%A728-1",
                    "title": "Plan- og bygningsloven § 28-1"
                },
                {
                    "href": "https://dibk.no/regelverk/byggteknisk-forskrift-tek17/7/7-3/",
                    "title": "TEK 17 Kapittel 7 - Sikkerhet mot naturpåkjenninger - § 7-3 Sikkerhet mot skred"
                }
            ],
            "possibleActions": [
                "Flytte tiltaket ut av aktsomhetsområdet.",
                "Få fagkyndig til å dokumentere tilstrekkelig sikkerhet mot skred for tiltaket i henhold til byggteknisk forskrift (TEK17) §7-3.",
                "Hvis behov, utføre sikringstiltak etter råd fra fagkyndig."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 3,
                    "comment": "Egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 4,
                    "comment": "Godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 4,
                    "comment": "Godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Aktsomhetsområder for snøskred",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect PotensieltSkredfareOmr",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 9223372036854776000,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "samfunnssikkerhet"
            ],
            "runOnDataset": {
                "datasetId": "54ada9d8-e6fc-48d6-82b0-5477166a4aaa",
                "title": "Aktsomhetskart for snøskred",
                "description": "Aktsomhetskart for snøskred er et GIS-generert landsdekkende datasett som gir en grov oversikt over områder som potensielt kan være snøskredutsatt. Aktsomhetskartet ble ferdigtstilt i 2023 med ny metodikk. Kartet er utviklet av Norges Geotekniske Institutt (NGI) og blir forvaltet av NVE.\n\nNye aktsomhetskart for snøskred 2023 finnes i tre forskjellige utgaver:\n\nAktsomhetskart snøskred S3 til bruk i kommuneplan for å avklare sikkerhet for bygg opp til \nsikkerhetsklasse S3. Kartet er sammensatt av aktsomhetskart for snøskred fra 2010 og \nAktsomhetskart for snøskred S2 uten skog fra 2023.\n\nAktsomhetskart snøskred S2 uten skogeffekt til å avklare sikkerhet for bygg opp til og med \nsikkerhetsklasse S2 uten å måtte båndlegge skog.\n\nAktsomhetskart snøskred S2 med skogeffekt til å avklare sikkerhet for bygg opp til \nsikkerhetsklasse S2, dersom skogen sin sikringseffekt er sikret.\n\nNasjonal høydemodell er brukt som grunnlag for å identifisere områder der snøskred kan løsne. \nKlimadata fra SeNorge og skogdata fra SR16-datasettet til NIBIO er brukt til å estimere \nsnømengder og sannsynlighet for skred. Kartet bruker en dynamisk utløpsmodell som gir \nutløpssoner som er mer tilpasset terrenget og dermed gir mer realistiske utløpssoner enn tidligere \naktsomhetskart.",
                "owner": "Norges vassdrags- og energidirektorat",
                "updated": "2024-04-28T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/54ada9d8-e6fc-48d6-82b0-5477166a4aaa"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [
                {
                    "href": "https://veileder-skredfareutredning-bratt-terreng.nve.no/",
                    "title": "NVEs veileder Utredning av sikkerhet mot skred i bratt terreng"
                },
                {
                    "href": "https://www.nve.no/arealplanlegging/bygge-og-dispensasjonssaker/",
                    "title": "NVEs nettsider om bygge- og dispensasjonssaker"
                },
                {
                    "href": "https://lovdata.no/dokument/NL/lov/2008-06-27-71/KAPITTEL_4-9#%C2%A728-1",
                    "title": "Plan- og bygningsloven § 28-1"
                },
                {
                    "href": "https://dibk.no/regelverk/byggteknisk-forskrift-tek17/7/7-3/",
                    "title": "TEK 17 Kapittel 7 - Sikkerhet mot naturpåkjenninger - § 7-3 Sikkerhet mot skred"
                }
            ],
            "possibleActions": [
                "Flytte tiltaket ut av aktsomhetsområdet.",
                "Få fagkyndig til å dokumentere tilstrekkelig sikkerhet mot skred for tiltaket i henhold til byggteknisk forskrift (TEK17) §7-3.",
                "Hvis behov, utføre sikringstiltak etter råd fra fagkyndig."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 0,
                    "comment": "Ikke egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 0,
                    "comment": "Ikke egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 0,
                    "comment": "Ikke egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Aktsomhetsområder for steinsprang",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect PotensieltSkredfareOmr",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 9223372036854776000,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "samfunnssikkerhet"
            ],
            "runOnDataset": {
                "datasetId": "02c6d51c-4e8c-4948-a620-dc046c8cb747",
                "title": "Steinsprang - aktsomhetsområder",
                "description": "Aktsomhetsområder for steinsprang er en nasjonal kartserie som viser potensielt steinsprangutsatte områder på oversiktsnivå. Kartene viser potensielle løsneområder og utløpsområder for steinsprang.\\\\nDet gjøres oppmerksom på at arealene som dekkes av utløsningsområder  i praksis også er utløpsområder, ettersom skred som løsner helt øverst i et utløsningsområde beveger seg gjennom nedenforliggende utløsningsområder før det når utløpsområdene nedenfor. Ved bruk av datasettet til analyseformål bør derfor som en hovedregel både utløsningsområder og utløpsområder benyttes sammen.\\\\nAktsomhetsområdene er identifisert ved bruk av en datamodell som gjenkjenner mulige løsneområder for steinsprang ut fra helning på terreng og geologisk informasjon. Fra hvert kildeområde er utløpsområdet for steinsprang beregnet automatisk. Det er ikke gjort feltarbeid ved identifisering eller avgrensning av områdene.",
                "owner": "Norges vassdrags- og energidirektorat",
                "updated": "2023-12-16T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/02c6d51c-4e8c-4948-a620-dc046c8cb747"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [
                {
                    "href": "https://veileder-skredfareutredning-bratt-terreng.nve.no/",
                    "title": "NVEs veileder Utredning av sikkerhet mot skred i bratt terreng"
                },
                {
                    "href": "https://www.nve.no/arealplanlegging/bygge-og-dispensasjonssaker/",
                    "title": "NVEs nettsider om bygge- og dispensasjonssaker"
                },
                {
                    "href": "https://lovdata.no/dokument/NL/lov/2008-06-27-71/KAPITTEL_4-9#%C2%A728-1",
                    "title": "Plan- og bygningsloven § 28-1"
                },
                {
                    "href": "https://dibk.no/regelverk/byggteknisk-forskrift-tek17/7/7-3/",
                    "title": "TEK 17 Kapittel 7 - Sikkerhet mot naturpåkjenninger - § 7-3 Sikkerhet mot skred"
                }
            ],
            "possibleActions": [
                "Flytte tiltaket ut av aktsomhetsområdet.",
                "Få fagkyndig til å dokumentere tilstrekkelig sikkerhet mot skred for tiltaket i henhold til byggteknisk forskrift (TEK17) §7-3.",
                "Hvis behov, utføre sikringstiltak etter råd fra fagkyndig."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 2,
                    "comment": "Noe egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 4,
                    "comment": "Godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 4,
                    "comment": "Godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Faresoner for fjellskred",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect layer 8",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 9223372036854776000,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "samfunnssikkerhet"
            ],
            "runOnDataset": {
                "datasetId": "17149f79-1289-4e3c-b964-94113eeb14c8",
                "title": "Store fjellskred",
                "description": "Dette produktet er et resultat av at NVE overtok det statlige forvaltningsansvaret for skred i 2009.\nTjenesten er ment som et hjelpemiddel som gjør det enklere å skaffe oversikt over ustabile fjellparti og\ntilhørende konsekvenser.\nFare- og risikokartlegging gjennomføres av NGU på vegne av NVE. Hvordan oppfølgingen av de ustabile fjellpartiene og faresonene bør følges opp med overvåking og i arealplanlegging er beskrevet i NVE rapport 77/2016: Fare og risikoklassifisering av ustabile fjellparti.\n\nDet er etablert to databaser for formidling av kartleggingen og fareområdene. NVEs database formidler faresoner for utløpsområder og flodbølger, samt potensielle oppdemmingsområder og nedstrøms flom som følge av dambrudd der dette er aktuelt. NGUs database har fokus på de geologiske data, inkludert bevegelsesmålinger.\n\nNVEs kartlegging retter seg først og fremst mot eksisterende bebyggelse. Ved identifisering og prioritering av områder som har behov for kontinuerlig overvåking er det derfor lagt vekt på hvor det bor og oppholder seg mennesker innenfor potensielt skredfareutsatte områder og områder som blir berørt av flodbølger eller oppdemning/dambrudd som en direkte konsekvens av et fjellskred.\n\nDatabasen er et produkt av den kartleggingen og fare- og risikoklassifiseringen som er gjort. Sammen skal dette gi grunnlag for å vurdere tiltak i form av overvåking med sikte på å kunne varsle et kommende fjellskred og dermed unngå potensielt tap av menneskeliv. Kartleggingen gir viktig informasjon om faregraden som grunnlag for arealplanlegging.",
                "owner": "Norges vassdrags- og energidirektorat",
                "updated": "2023-11-15T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/17149f79-1289-4e3c-b964-94113eeb14c8"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [
                {
                    "href": "https://lovdata.no/dokument/NL/lov/2008-06-27-71/KAPITTEL_4-9#%C2%A728-1",
                    "title": "Plan- og bygningsloven § 28-1"
                },
                {
                    "href": "https://dibk.no/regelverk/byggteknisk-forskrift-tek17/7/7-3/",
                    "title": "TEK 17 Kapittel 7 - Sikkerhet mot naturpåkjenninger - § 7-3 Sikkerhet mot skred"
                }
            ],
            "possibleActions": [
                "Sjekke hvilke krav til sikkerhet som gjelder for ønsket tiltak i byggteknisk forskrift (TEK17) §§ 7-3 og 7-4 og om ønsket tiltak likevel oppfyller krav til sikkerhet.",
                "Flytte tiltaket ut av faresonen.",
                "Hvis behov, utføre sikringstiltak etter råd fra fagkyndig."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Faresoner for kvikkleireskred",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect layer 1",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 1364,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "samfunnssikkerhet"
            ],
            "runOnDataset": {
                "datasetId": "b2d5aaf8-79ac-40f3-9cd6-fdc30bc42ea1",
                "title": "Skredfaresoner",
                "description": "NVE gjennomfører faresonekartlegging av skred i bratt terreng for utvalgte områder prioritert for kartlegging, jfr Plan for skredfarekartlegging (NVE rapport 14/2011).Kartleggingen dekker skredtypene snøskred, sørpeskred, steinsprang, jordskred og flomskred.",
                "owner": "Norges vassdrags- og energidirektorat",
                "updated": "2024-11-19T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/b2d5aaf8-79ac-40f3-9cd6-fdc30bc42ea1"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [
                {
                    "href": "https://lovdata.no/dokument/NL/lov/2008-06-27-71/KAPITTEL_4-9#%C2%A728-1",
                    "title": "https://lovdata.no/dokument/NL/lov/2008-06-27-71/KAPITTEL_4-9#%C2%A728-1"
                },
                {
                    "href": "https://dibk.no/regelverk/byggteknisk-forskrift-tek17/7/7-3/",
                    "title": "TEK 17 Kapittel 7 - Sikkerhet mot naturpåkjenninger - § 7-3 Sikkerhet mot skred"
                }
            ],
            "possibleActions": [
                "Flytte tiltaket ut av faresonen.",
                "Sjekk om tiltaket faller inn under tiltakskategori K0 i henhold til NVEs veileder 1/2019, og om tiltaket kan utføres etter føringer gitt i vedlegg to i veilederen. Hvis føringer ikke kan følges, må det utarbeides en geoteknisk vurderings om dokumenterer tilfredsstillende sikkerhet.",
                "Få geotekniker med tilstrekkelig kompetanse til å dokumentere tilstrekkelig sikkerhet mot skred for tiltaket i henhold til NVEs veileder 1/2019 og byggteknisk forskrift (TEK17) §7-3.",
                "Hvis behov, utføre sikringstiltak etter råd fra fagkyndig."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Faresoner for skred i bratt terreng",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect layer 0",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 9223372036854776000,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "samfunnssikkerhet"
            ],
            "runOnDataset": {
                "datasetId": "b2d5aaf8-79ac-40f3-9cd6-fdc30bc42ea1",
                "title": "Skredfaresoner",
                "description": "NVE gjennomfører faresonekartlegging av skred i bratt terreng for utvalgte områder prioritert for kartlegging, jfr Plan for skredfarekartlegging (NVE rapport 14/2011).Kartleggingen dekker skredtypene snøskred, sørpeskred, steinsprang, jordskred og flomskred.",
                "owner": "Norges vassdrags- og energidirektorat",
                "updated": "2024-11-19T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/b2d5aaf8-79ac-40f3-9cd6-fdc30bc42ea1"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [
                {
                    "href": "https://lovdata.no/dokument/NL/lov/2008-06-27-71/KAPITTEL_4-9#%C2%A728-1",
                    "title": "Plan- og bygningsloven § 28-1"
                },
                {
                    "href": "https://dibk.no/regelverk/byggteknisk-forskrift-tek17/7/7-3/",
                    "title": "TEK 17 Kapittel 7 - Sikkerhet mot naturpåkjenninger - § 7-3 Sikkerhet mot skred"
                }
            ],
            "possibleActions": [
                "Sjekke hvilke krav til sikkerhet som gjelder for ønsket tiltak i byggteknisk forskrift (TEK17) § 7-3 og om ønsket tiltak likevel oppfyller krav til sikkerhet.",
                "Flytte tiltaket ut av faresonen.",
                "Hvis behov, utføre sikringstiltak etter råd fra fagkyndig."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Tilfluktsrom - offentlige",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect Tilfluktsrom",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 2022,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "samfunnssikkerhet"
            ],
            "runOnDataset": {
                "datasetId": "dbae9aae-10e7-4b75-8d67-7f0e8828f3d8",
                "title": "Tilfluktsrom - Offentlige",
                "description": "Offentlige tilfluktsrom i Norge. Tilfluktsrom er permanente beskyttelsesrom som skal verne befolkningen mot skader ved krigshandlinger. Offentlige tilfluktsrom er for befolkningen i et område og er bygget i byer og større tettsteder, samt i boligområder hvor dekningen av private tilfluktsrom ikke er tilfredsstillende.",
                "owner": "Direktoratet for samfunnssikkerhet og beredskap",
                "updated": "2024-11-19T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/dbae9aae-10e7-4b75-8d67-7f0e8828f3d8"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [],
            "possibleActions": [],
            "qualityMeasurement": [],
            "qualityWarning": []
        },
        {
            "title": "Hensynssone for energianlegg",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect EL_Luftlinje",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 106,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "samfunnssikkerhet"
            ],
            "runOnDataset": {
                "datasetId": "9f71a24b-9997-409f-8e42-ce6f0c62e073",
                "title": "Nettanlegg",
                "description": "Viser beliggenhet av luftlinjer, sjøkabler, transformatorstasjoner og master i sentral-, regional- og høyspent distribusjonsnett. Lavspent distribusjonsnett er ikke en del av datasettet. Jordkabler er heller ikke inkludert. Datasettet oppdateres ikke fortløpende, kun ved behov. Det kan derfor være feil og mangler i datasettet som skyldes manglende oppdatering.",
                "owner": "Norges vassdrags- og energidirektorat",
                "updated": "2024-09-01T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/9f71a24b-9997-409f-8e42-ce6f0c62e073"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [
                {
                    "href": "https://www.dsb.no/lover/elektriske-anlegg-og-elektrisk-utstyr/veiledning-til-forskrift/veiledning-til-forskrift-om-elektriske-forsyningsanlegg/",
                    "title": " Veiledning til forskrift om elektriske forsyningsanlegg"
                },
                {
                    "href": "https://lovdata.no/dokument/NL/lov/1990-06-29-50",
                    "title": "Energilova"
                }
            ],
            "possibleActions": [
                "Plasser tiltaket lenger vekk fra energianlegget.",
                "Ta kontakt med netteier for avklaring om det er greit at tiltaket gjennomføres."
            ],
            "qualityMeasurement": [],
            "qualityWarning": []
        },
        {
            "title": null,
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect layer 2",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 1848,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "natur"
            ],
            "runOnDataset": {
                "datasetId": "a8456aed-441a-40c4-831f-46bcbe4e6ff1",
                "title": "Arter av nasjonal forvaltningsinteresse",
                "description": "Arter av nasjonal forvaltningsinteresse er et forvaltningsrettet datasett som distribueres av Miljødirektoratet, der datafangsten helt og fullt er basert på dataflyten for artsdata som er etablert av\nArtsdatabanken. Artsdatabanken har siden etableringen i 2005 etablert dataflyt med relevante institusjoner og relevante databaser. Eierskapet til data er avklart og ligger hos originalverten.\n\nArter av nasjonal forvaltningsinteresse består både av arter som trenger beskyttelse og arter som er\nskadelige (fremmede). Alle relevante artsgrupper er omfattet. Beslutning om hvilke arter som inngår er i\nall hovedsak tatt i henhold til ulike relevante statuser som arter kan befinne seg i. Trua arter, ansvarsarter\nog freda arter er eksempler på slike statuser, som i datasettet er definert som utvalgskriterier.\n\nI tillegg til at det er besluttet hvilke arter som skal inngå, er det besluttet to kvalitetsparametere som\nmå være utfylt eller som må fylle noen minstekrav; geografisk presisjon og funksjon (aktivitet). Disse kravene varierer mellom ulike artsgrupper.\n\nKartlagte forekomster av sensitive funksjonsområder for gitte arter, dvs. forekomster som det ikke skal\nvære allmenn tilgang til detaljert informasjon om, er ikke inkludert i dette datasettet.",
                "owner": "Miljødirektoratet",
                "updated": "2021-01-01T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/a8456aed-441a-40c4-831f-46bcbe4e6ff1"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [],
            "possibleActions": [],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 4,
                    "comment": "Godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 4,
                    "comment": "Godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 4,
                    "comment": "Godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": null,
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect Enkeltminne",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 43,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "kulturminner"
            ],
            "runOnDataset": {
                "datasetId": "c72906a0-2bc2-41d7-bea2-c92d368e3c49",
                "title": "Kulturminner - Lokaliteter, Enkeltminner og Sikringssoner",
                "description": "Datasettet Kulturminner – Lokaliteter, Enkeltminner og Sikringssoner inneholder alle  kulturminner på fastlands-Norge og Svalbard (bortsett fra kulturminner som har begrenset offentlighet) som er registrert i Riksantikvarens offisielle database over kulturminner og kulturmiljøer, Askeladden, uavhengig av vernestatus. Et kulturminne er i denne sammenhengen en helhet bestående av en lokalitet med et eller flere enkeltminner, samt sikringssoner (hvis vernestatus tilsier det). \n\nOverordnet kan man si at et enkeltminne representerer et fysisk kulturminne, med dets geografiske utstrekning og informasjon som er spesifikt for det. En lokalitet representerer et geografisk område som inneholder et eller flere enkeltminner som hører sammen på en eller annen måte. Lokaliteten inneholder generell informasjon om dette området, samt informasjon om høyeste vern («høyesteVern») blant enkeltminnene innenfor.\n\nEksempelvis vil et gravfelt utgjøre en lokalitet, mens gravhaug(er)/gravrøys(er) i gravfeltet utgjør enkeltminner. For nyere tids kulturminner kan lokaliteten være ett anlegg som er representert av et enkelt bygg, et gårdstun bestående av flere bygninger, eller én eller flere bygninger med et vedtaksfredet område rundt (park, hage, o.l.).\n\nEn sikringssone er et geografisk område rundt automatisk fredede kulturminner. Området er ment for å gi et ekstra vern mot tiltak, og er derfor særlig viktig å ta hensyn til.",
                "owner": "Riksantikvaren",
                "updated": "2024-11-19T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/c72906a0-2bc2-41d7-bea2-c92d368e3c49"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [],
            "possibleActions": [],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 0,
                    "comment": "Ikke egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 0,
                    "comment": "Ikke egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 0,
                    "comment": "Ikke egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Verdsatt naturtype av svært stor verdi",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "query Verdikategori = 'Svært stor verdi'",
                "intersect layer 0",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": 150.6055999972741,
            "resultStatus": "HIT-RED",
            "distanceToObject": 0,
            "rasterResult": "https://kart.miljodirektoratet.no/arcgis/services/naturtyper_kuverdi/MapServer/WMSServer?layers=kuverdi_svært_stor_verdi",
            "cartography": "https://kart.miljodirektoratet.no/arcgis/services/naturtyper_kuverdi/MapServer/WMSServer?service=WMS&version=1.3.0&request=GetLegendGraphic&sld_version=1.1.0&layer=kuverdi_svært_stor_verdi&format=image/png",
            "data": [
                {
                    "naturtype": "Store gamle trær",
                    "verdikategori": "Svært stor verdi",
                    "opphav": "Naturtyper - Utvalgte",
                    "nøyaktighetsklasse": "Mindre god (> 50m)",
                    "faktaark": "https://faktaark.naturbase.no/?id=VKU-UN-BN00120594"
                },
                {
                    "naturtype": "Store gamle trær",
                    "verdikategori": "Svært stor verdi",
                    "opphav": "Naturtyper - Utvalgte",
                    "nøyaktighetsklasse": "Mindre god (> 50m)",
                    "faktaark": "https://faktaark.naturbase.no/?id=VKU-UN-BN00120595"
                }
            ],
            "themes": [
                "natur"
            ],
            "runOnDataset": {
                "datasetId": "64cbb884-a19d-4356-a114-380cfe4a7314",
                "title": "Naturtyper - KU-verdi",
                "description": "Datasettet viser naturtypelokaliteter fordelt på verdikategorier i henhold til verdsettingskriteriene i veilederen M-1941 Konsekvensutredninger for klima og miljø. Datasettet viser ikke naturtyper i marint miljø.\n\nSom grunnlagsdatasett er benyttet \"Naturtyper - Utvalgte\", \"Naturtyper - Miljødirektoratets instruks\" og \"Naturtyper - DN-håndbok 13\". Naturtypene kartlagt etter DN-håndbok 13 er ikke mulig å knytte presist til dagens utvalgskriterier for hvilke naturtyper som kartlegges. Lokalitetene er derfor plassert uten forsøk på å ta hensyn til utvalgskriterier.",
                "owner": "Miljødirektoratet",
                "updated": "2021-01-01T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/64cbb884-a19d-4356-a114-380cfe4a7314"
            },
            "description": "Verdsatte naturtyper er kartlagte lokaliteter av naturtyper, som er verdsatt etter den verdiklassifiseringen som brukes ved konsekvensutredninger. Naturtypekartleggingen omfatter ikke all natur, men et utvalg av naturtyper som er særlig viktige for naturmangfold. En konsekvens av dette er at alle kartlagte lokaliteter skal regnes som viktigere for naturmangfold enn nærliggende areal uten lokaliteter.\n\nDette treffet er begrenset til å vise overlapp med eller nærhet til naturtypelokaliteten. Bruk lenkene nedenfor for å finne mer informasjon om lokaliteten, inkludert hvilken naturtype det er tale om. I kartet er det aktuelle kartlaget automatisk slått på, så du zoomer og flytter på kartet til du ser lokaliteten eller lokalitetene.",
            "guidanceText": "Arealet som er tegnet opp overlapper en naturtypelokalitet av svært stor verdi. Dette vil gjøre det vanskelig å få tiltaket eller planen godkjent.",
            "guidanceUri": [
                {
                    "href": "https://geocortex02.miljodirektoratet.no/Html5Viewer/?viewer=naturbase&layerTheme=null&scale=10240000&basemap=&center=827359.5791647113%2C7221990.099276289&layers=3%2B1IlU3rguLv0FxOfW",
                    "title": "Finn lokaliteten og informasjon om den i Naturbase"
                },
                {
                    "href": "https://www.miljodirektoratet.no/ansvarsomrader/overvaking-arealplanlegging/naturkartlegging/naturtyper/",
                    "title": "Se beskrivelse av naturtypene"
                }
            ],
            "possibleActions": [
                "Unngå overlapp ved å justere arealet for tiltaket eller planen. Gjør overlappsarealet så lite som mulig. Vis hvordan tiltaket eller planen ikke vil påvirke lokaliteten negativt, selv ved overlapp."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "stedfestingsnøyaktighet",
                    "qualityDimensionName": "Stedfestingsnøyaktighet",
                    "value": "Mindre god (> 50m)",
                    "comment": null
                },
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 0,
                    "comment": "Ikke egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 0,
                    "comment": "Ikke egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 0,
                    "comment": "Ikke egnet"
                }
            ],
            "qualityWarning": [
                "Data kan være utfordrende å bruke i plan- eller byggesak"
            ]
        },
        {
            "title": "Slåttemark",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "query UtvalgtNaturtypeKode = 'UN01'",
                "intersect layer 0",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 2035,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "natur"
            ],
            "runOnDataset": {
                "datasetId": "2c0072de-f702-401e-bfb3-5ad3d08d4c2d",
                "title": "Naturtyper - utvalgte",
                "description": "Datasettet viser registrerte forekomster av utvalgte naturtyper, jf forskrift om utvalgte naturtyper, http://lovdata.no/dokument/SF/forskrift/2011-05-13-512. \nÅtte naturtyper har status som utvalgt naturtype: Kystlynghei, slåttemark, slåttemyr, kalklindeskog, kalksjøer, hule eiker, åpen grunnlendt kalkmark i boreonemoral sone og olivinskog. Lokaliteter av\nutvalgte naturtyper forvaltes i Miljødirektoratets datasett Naturtyper - DN-håndbok 13 og Naturtyper – Miljødirektoratets instruks.\nForskriften for utvalgte naturtyper gjelder alle lokaliteter som fyller kravene i forskriften, uavhengig av om lokaliteten er registrert i Naturbase eller ikke. Statsforvalteren vil kunne bistå dersom det er usikkerhet om hvorvidt en lokalitet faktisk er en utvalgt naturtype. I tvilstilfeller kan det være nødvendig å kontakte spesialkompetanse for å få gjort en vurdering.",
                "owner": "Miljødirektoratet",
                "updated": "2021-01-01T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/2c0072de-f702-401e-bfb3-5ad3d08d4c2d"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [
                {
                    "href": "https://miljostatus.miljodirektoratet.no/tema/naturomrader-pa-land/kulturlandskap/slattemark/",
                    "title": "Les mer om slåttemark"
                },
                {
                    "href": "https://lovdata.no/dokument/SF/forskrift/2011-05-13-512",
                    "title": "Forskrift om utvalgte naturtyper etter naturmangfoldloven"
                }
            ],
            "possibleActions": [
                "Plasser tiltaket utenom slåttemarka.",
                "Plasser tiltaket i ytterkanten av slåttemarka.",
                "Gjør tiltaket så lite arealkrevende som mulig.",
                "Dersom tiltaket helt eller delvis må plasseres inn på slåttemarka, skal kommunen vurdere tiltaket i henhold til naturmangfoldloven. Gi en begrunnelse for behovet."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Slåttemyr",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "query UtvalgtNaturtypeKode = 'UN02'",
                "intersect layer 0",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 18824,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "natur"
            ],
            "runOnDataset": {
                "datasetId": "2c0072de-f702-401e-bfb3-5ad3d08d4c2d",
                "title": "Naturtyper - utvalgte",
                "description": "Datasettet viser registrerte forekomster av utvalgte naturtyper, jf forskrift om utvalgte naturtyper, http://lovdata.no/dokument/SF/forskrift/2011-05-13-512. \nÅtte naturtyper har status som utvalgt naturtype: Kystlynghei, slåttemark, slåttemyr, kalklindeskog, kalksjøer, hule eiker, åpen grunnlendt kalkmark i boreonemoral sone og olivinskog. Lokaliteter av\nutvalgte naturtyper forvaltes i Miljødirektoratets datasett Naturtyper - DN-håndbok 13 og Naturtyper – Miljødirektoratets instruks.\nForskriften for utvalgte naturtyper gjelder alle lokaliteter som fyller kravene i forskriften, uavhengig av om lokaliteten er registrert i Naturbase eller ikke. Statsforvalteren vil kunne bistå dersom det er usikkerhet om hvorvidt en lokalitet faktisk er en utvalgt naturtype. I tvilstilfeller kan det være nødvendig å kontakte spesialkompetanse for å få gjort en vurdering.",
                "owner": "Miljødirektoratet",
                "updated": "2021-01-01T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/2c0072de-f702-401e-bfb3-5ad3d08d4c2d"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [
                {
                    "href": "https://miljostatus.miljodirektoratet.no/tema/naturomrader-pa-land/kulturlandskap/slattemyr/",
                    "title": "Les mer om slåttemyr"
                },
                {
                    "href": "https://lovdata.no/dokument/SF/forskrift/2011-05-13-512",
                    "title": "Forskrift om utvalgte naturtyper etter naturmangfoldloven"
                }
            ],
            "possibleActions": [
                "Plasser tiltaket utenom slåttemyra.",
                "Plasser tiltaket i ytterkanten av slåttemyra.",
                "Gjør tiltaket så lite arealkrevende som mulig.",
                "Dersom tiltaket helt eller delvis må plasseres inn på slåttemyra, skal kommunen vurdere tiltaket i henhold til naturmangfoldloven. Gi en begrunnelse for behovet."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Hule eiker",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "query UtvalgtNaturtypeKode = 'UN03'",
                "intersect layer 0",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": 150.6055999972741,
            "resultStatus": "HIT-RED",
            "distanceToObject": 0,
            "rasterResult": "https://kart.miljodirektoratet.no/arcgis/services/naturtyper_utvalgte2/MapServer/WMSServer?layers=naturtype_utvalgt_omr",
            "cartography": "https://kart.miljodirektoratet.no/arcgis/services/naturtyper_utvalgte2/MapServer/WMSServer?service=WMS&version=1.3.0&request=GetLegendGraphic&sld_version=1.1.0&layer=naturtype_utvalgt_omr&format=image/png",
            "data": [
                {
                    "områdenavn": "Kirkeveien 10",
                    "utvalgtNaturtype": "Hule eiker",
                    "nøyaktighetsklasse": "Mindre god (> 50m)",
                    "registreringsdato": 1498089600000,
                    "faktaark": "https://faktaark.naturbase.no?id=UN-BN00120594"
                },
                {
                    "områdenavn": "Gamle kirkevei 6",
                    "utvalgtNaturtype": "Hule eiker",
                    "nøyaktighetsklasse": "Mindre god (> 50m)",
                    "registreringsdato": 1498089600000,
                    "faktaark": "https://faktaark.naturbase.no?id=UN-BN00120595"
                }
            ],
            "themes": [
                "natur"
            ],
            "runOnDataset": {
                "datasetId": "2c0072de-f702-401e-bfb3-5ad3d08d4c2d",
                "title": "Naturtyper - utvalgte",
                "description": "Datasettet viser registrerte forekomster av utvalgte naturtyper, jf forskrift om utvalgte naturtyper, http://lovdata.no/dokument/SF/forskrift/2011-05-13-512. \nÅtte naturtyper har status som utvalgt naturtype: Kystlynghei, slåttemark, slåttemyr, kalklindeskog, kalksjøer, hule eiker, åpen grunnlendt kalkmark i boreonemoral sone og olivinskog. Lokaliteter av\nutvalgte naturtyper forvaltes i Miljødirektoratets datasett Naturtyper - DN-håndbok 13 og Naturtyper – Miljødirektoratets instruks.\nForskriften for utvalgte naturtyper gjelder alle lokaliteter som fyller kravene i forskriften, uavhengig av om lokaliteten er registrert i Naturbase eller ikke. Statsforvalteren vil kunne bistå dersom det er usikkerhet om hvorvidt en lokalitet faktisk er en utvalgt naturtype. I tvilstilfeller kan det være nødvendig å kontakte spesialkompetanse for å få gjort en vurdering.",
                "owner": "Miljødirektoratet",
                "updated": "2021-01-01T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/2c0072de-f702-401e-bfb3-5ad3d08d4c2d"
            },
            "description": "Eiketrær kan bli flere hundre år gamle og et stort mangfold av arter lever i hulrom, dype barkesprekker og på døde grener i slike trær. Så mange som 1500 arter kan leve på og i hule eiker. Hul eik er en utvalgt naturtype som skal tas hensyn til og vurderes i byggesøknaden.",
            "guidanceText": "Tiltaket er plassert nærmere enn 15m fra stammen til en hul eik som er utvalgt naturtype.",
            "guidanceUri": [
                {
                    "href": "https://miljostatus.miljodirektoratet.no/tema/naturomrader-pa-land/skog/hule-eiker/",
                    "title": "Les mer om hul eik"
                },
                {
                    "href": "https://lovdata.no/dokument/SF/forskrift/2011-05-13-512",
                    "title": "Forskrift om utvalgte naturtyper etter naturmangfoldloven"
                }
            ],
            "possibleActions": [
                "Tiltaket kan plasseres 15m eller lengre fra stammen.",
                "Dersom tiltaket må plasseres nærmere enn 15m fra stammen, skal kommunen vurdere tiltaket i henhold til bestemmelsene i naturmangfoldloven. Rotsystemet på treet må ikke skades. En arborist kan vurdere det for deg. Gi en begrunnelse for behovet og legg ved en eventuell uttalelse fra arborist."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Kalklindeskog",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "query UtvalgtNaturtypeKode = 'UN04'",
                "intersect layer 0",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 7659,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "natur"
            ],
            "runOnDataset": {
                "datasetId": "2c0072de-f702-401e-bfb3-5ad3d08d4c2d",
                "title": "Naturtyper - utvalgte",
                "description": "Datasettet viser registrerte forekomster av utvalgte naturtyper, jf forskrift om utvalgte naturtyper, http://lovdata.no/dokument/SF/forskrift/2011-05-13-512. \nÅtte naturtyper har status som utvalgt naturtype: Kystlynghei, slåttemark, slåttemyr, kalklindeskog, kalksjøer, hule eiker, åpen grunnlendt kalkmark i boreonemoral sone og olivinskog. Lokaliteter av\nutvalgte naturtyper forvaltes i Miljødirektoratets datasett Naturtyper - DN-håndbok 13 og Naturtyper – Miljødirektoratets instruks.\nForskriften for utvalgte naturtyper gjelder alle lokaliteter som fyller kravene i forskriften, uavhengig av om lokaliteten er registrert i Naturbase eller ikke. Statsforvalteren vil kunne bistå dersom det er usikkerhet om hvorvidt en lokalitet faktisk er en utvalgt naturtype. I tvilstilfeller kan det være nødvendig å kontakte spesialkompetanse for å få gjort en vurdering.",
                "owner": "Miljødirektoratet",
                "updated": "2021-01-01T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/2c0072de-f702-401e-bfb3-5ad3d08d4c2d"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [
                {
                    "href": "https://miljostatus.miljodirektoratet.no/tema/naturomrader-pa-land/skog/kalklindeskog/",
                    "title": "Les mer om kalklindeskog"
                },
                {
                    "href": "https://lovdata.no/dokument/SF/forskrift/2011-05-13-512",
                    "title": "Forskrift om utvalgte naturtyper etter naturmangfoldloven"
                }
            ],
            "possibleActions": [
                "Plasser tiltaket utenom kalklindskogen.",
                "Plasser tiltaket i ytterkanten av kalklindeskogen.",
                "Gjør tiltaket så lite arealkrevende som mulig.",
                "Dersom tiltaket helt eller delvis må plasseres inn i kalklindeskogen, skal kommunen vurdere tiltaket i henhold til naturmangfoldloven. Gi en begrunnelse for behovet."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Kalksjøer",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "query UtvalgtNaturtypeKode = 'UN05'",
                "intersect layer 0",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 9223372036854776000,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "natur"
            ],
            "runOnDataset": {
                "datasetId": "2c0072de-f702-401e-bfb3-5ad3d08d4c2d",
                "title": "Naturtyper - utvalgte",
                "description": "Datasettet viser registrerte forekomster av utvalgte naturtyper, jf forskrift om utvalgte naturtyper, http://lovdata.no/dokument/SF/forskrift/2011-05-13-512. \nÅtte naturtyper har status som utvalgt naturtype: Kystlynghei, slåttemark, slåttemyr, kalklindeskog, kalksjøer, hule eiker, åpen grunnlendt kalkmark i boreonemoral sone og olivinskog. Lokaliteter av\nutvalgte naturtyper forvaltes i Miljødirektoratets datasett Naturtyper - DN-håndbok 13 og Naturtyper – Miljødirektoratets instruks.\nForskriften for utvalgte naturtyper gjelder alle lokaliteter som fyller kravene i forskriften, uavhengig av om lokaliteten er registrert i Naturbase eller ikke. Statsforvalteren vil kunne bistå dersom det er usikkerhet om hvorvidt en lokalitet faktisk er en utvalgt naturtype. I tvilstilfeller kan det være nødvendig å kontakte spesialkompetanse for å få gjort en vurdering.",
                "owner": "Miljødirektoratet",
                "updated": "2021-01-01T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/2c0072de-f702-401e-bfb3-5ad3d08d4c2d"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [
                {
                    "href": "https://miljostatus.miljodirektoratet.no/tema/ferskvann/kalksjoer/",
                    "title": "Les mer om kalksjøer"
                },
                {
                    "href": "https://lovdata.no/dokument/SF/forskrift/2011-05-13-512",
                    "title": "Forskrift om utvalgte naturtyper etter naturmangfoldloven"
                }
            ],
            "possibleActions": [
                "Plasser tiltaket utenom kalksjøen, og  unngå påvirkning av tilførselsbekker.",
                "Unngå også myr eller vegetasjonsbelter som hører til sjøen.",
                "Dersom tiltaket helt eller delvis må plasseres inn på kalksjøen, skal kommunen vurdere tiltaket i henhold til naturmangfoldloven. Gi en begrunnelse for behovet."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Kystlynghei",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "query UtvalgtNaturtypeKode = 'UN06'",
                "intersect layer 0",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 9223372036854776000,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "natur"
            ],
            "runOnDataset": {
                "datasetId": "2c0072de-f702-401e-bfb3-5ad3d08d4c2d",
                "title": "Naturtyper - utvalgte",
                "description": "Datasettet viser registrerte forekomster av utvalgte naturtyper, jf forskrift om utvalgte naturtyper, http://lovdata.no/dokument/SF/forskrift/2011-05-13-512. \nÅtte naturtyper har status som utvalgt naturtype: Kystlynghei, slåttemark, slåttemyr, kalklindeskog, kalksjøer, hule eiker, åpen grunnlendt kalkmark i boreonemoral sone og olivinskog. Lokaliteter av\nutvalgte naturtyper forvaltes i Miljødirektoratets datasett Naturtyper - DN-håndbok 13 og Naturtyper – Miljødirektoratets instruks.\nForskriften for utvalgte naturtyper gjelder alle lokaliteter som fyller kravene i forskriften, uavhengig av om lokaliteten er registrert i Naturbase eller ikke. Statsforvalteren vil kunne bistå dersom det er usikkerhet om hvorvidt en lokalitet faktisk er en utvalgt naturtype. I tvilstilfeller kan det være nødvendig å kontakte spesialkompetanse for å få gjort en vurdering.",
                "owner": "Miljødirektoratet",
                "updated": "2021-01-01T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/2c0072de-f702-401e-bfb3-5ad3d08d4c2d"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [
                {
                    "href": "https://miljostatus.miljodirektoratet.no/tema/naturomrader-pa-land/kulturlandskap/kystlynghei/",
                    "title": "Les mer om kystlynghei"
                },
                {
                    "href": "https://lovdata.no/dokument/SF/forskrift/2011-05-13-512",
                    "title": "Forskrift om utvalgte naturtyper etter naturmangfoldloven"
                }
            ],
            "possibleActions": [
                "Plasser tiltaket utenom kystlyngheia.",
                "Plasser tiltaket i ytterkanten av kystlyngheia.",
                "Gjør tiltaket så lite arealkrevende som mulig.",
                "Dersom tiltaket helt eller delvis må plasseres inn på kystlyngheia, skal kommunen vurdere tiltaket i henhold til naturmangfoldloven. Gi en begrunnelse for behovet."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Åpen grunnlendt kalkmark i boreonemoral sone",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "query UtvalgtNaturtypeKode = 'UN07'",
                "intersect layer 0",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 15073,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "natur"
            ],
            "runOnDataset": {
                "datasetId": "2c0072de-f702-401e-bfb3-5ad3d08d4c2d",
                "title": "Naturtyper - utvalgte",
                "description": "Datasettet viser registrerte forekomster av utvalgte naturtyper, jf forskrift om utvalgte naturtyper, http://lovdata.no/dokument/SF/forskrift/2011-05-13-512. \nÅtte naturtyper har status som utvalgt naturtype: Kystlynghei, slåttemark, slåttemyr, kalklindeskog, kalksjøer, hule eiker, åpen grunnlendt kalkmark i boreonemoral sone og olivinskog. Lokaliteter av\nutvalgte naturtyper forvaltes i Miljødirektoratets datasett Naturtyper - DN-håndbok 13 og Naturtyper – Miljødirektoratets instruks.\nForskriften for utvalgte naturtyper gjelder alle lokaliteter som fyller kravene i forskriften, uavhengig av om lokaliteten er registrert i Naturbase eller ikke. Statsforvalteren vil kunne bistå dersom det er usikkerhet om hvorvidt en lokalitet faktisk er en utvalgt naturtype. I tvilstilfeller kan det være nødvendig å kontakte spesialkompetanse for å få gjort en vurdering.",
                "owner": "Miljødirektoratet",
                "updated": "2021-01-01T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/2c0072de-f702-401e-bfb3-5ad3d08d4c2d"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [
                {
                    "href": "https://artsdatabanken.no/RLN2018/266/aapen_grunnlendt_kalkrik_mark_i_boreonemoral_sone",
                    "title": "Rødlistevurdering 2018 (Artsdatabanken)"
                },
                {
                    "href": "https://lovdata.no/dokument/SF/forskrift/2011-05-13-512",
                    "title": "Forskrift om utvalgte naturtyper etter naturmangfoldloven"
                }
            ],
            "possibleActions": [
                "Plasser tiltaket utenom kalkmarka.",
                "Plasser tiltaket i ytterkanten av kalkmarka.",
                "Gjør tiltaket så lite arealkrevende som mulig.",
                "Dersom tiltaket helt eller delvis må plasseres inn på kalkmarka, skal kommunen vurdere tiltaket i henhold til naturmangfoldloven. Gi en begrunnelse for behovet."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Farledsareal",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect HovedledOgBiledAreal",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 1797,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "samferdsel"
            ],
            "runOnDataset": {
                "datasetId": "8ff1538a-a93c-4391-8d6f-3555fc37819c",
                "title": "Hovedled og Biled",
                "description": "Farleden er gitt gjennom forskrift av 11. desember 2019 nr. 1834 (forskrift om farleder).\n\nHele norskekysten er i dag dekket av et standardisert referansesystem av ulike farledskategorier. Farledsstrukturen omfatter nettverket av sjøverts transportårer og er et nasjonalt geografisk referansesystem for tiltak innen forvaltning, planlegging, utbygging og operativ virksomhet i kystsonen.\n\nMer om farledsstrukturen:\n\nhttp://www.kystverket.no/Maritim-infrastruktur/Farleder\n/Farledsstrukturen/",
                "owner": "Kystverket",
                "updated": "2024-10-22T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/8ff1538a-a93c-4391-8d6f-3555fc37819c"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [
                {
                    "href": "https://www.kystverket.no/sjovegen/farleder---vegen-til-sjos/",
                    "title": "Les mer om farleder"
                }
            ],
            "possibleActions": [
                "Du bør justere planforslaget slik at det ikke overlapper med farleden. Om dette ikke lar seg gjøre, må du få vurdert hvilke virkninger planforslaget ditt har for sikker og effektiv ferdsel. Vurderingen må gjøres av en person med nautisk kompetanse. Deretter kan du ta kontakt med Kystverket, som kan vurdere om de synes dette ser greit ut eller ikke."
            ],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 3,
                    "comment": "Egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 4,
                    "comment": "Godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 3,
                    "comment": "Egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": "Geoteknisk borehull",
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect layer geotekniskborehull",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": 0,
            "resultStatus": "HIT-YELLOW",
            "distanceToObject": 0,
            "rasterResult": "https://geo.ngu.no/geoserver/nadag/ows?layers=GB_filter_komplette_data",
            "cartography": "https://geo.ngu.no/geoserver/nadag/ows?service=WMS&version=1.3.0&request=GetLegendGraphic&sld_version=1.1.0&layer=GB_filter_komplette_data&format=image/png",
            "data": [
                {
                    "kvikkleirePåvisning": "IkkeVurdert",
                    "antallBorehullUndersøkelser": 52,
                    "høyde": 7.5,
                    "maksBoretLengde": 12.3
                }
            ],
            "themes": [
                "geologi"
            ],
            "runOnDataset": {
                "datasetId": "bf45a463-434d-4b4d-84dc-9325780ab5fb",
                "title": "Nasjonal database for grunnundersøkelser (NADAG)",
                "description": "NGU har utviklet Nasjonal database for grunnundersøkelser (NADAG) med tilhørende karttjenester og muligheter for å laste opp data, i første omgang for geotekniske undersøkelser. Prosjektet for utvikling av NADAG er et samarbeid mellom NGU og etatene Statens vegvesen, Bane NOR, og Norges vassdrags- og energidirektorat, og konsulentene Norkart, Trimble, CGI og Geodata. Punktene i kartet representerer geotekniske borehull (GB), hvor metadata vises (f.eks. boretype, oppdragsfirma, oppdragsgiver, stedfestelse (posisjon), boret dybde (evt. dyp til fjell), rapportnr.). For noen punkter vil mer informasjon være tilgjengelig (f.eks. lenke til rapport og evt. til rådata, boreprofil og måleresultater). NADAG-modellen er basert på en datastruktur beskrevet i SOSI-standardene for Geovitenskapelige undersøkelser og Geotekniske undersøkelser. NADAG er innlemmet på listen over datasett til DOK.\n\nVisningstjenesten til NADAG har to innsynsløsninger. Mobil versjon ligner de andre kartinnsynene til NGU. I menyen på høyre side kan man klikke på «Gå til NADAG fullversjon» (man beholder da kartutsnittet).  NADAG er landsdekkende, og vil gradvis fylles med mer data etter som dataeiere  leverer sine data. Man kan levere data til NADAG på to måter: gjennom verktøyet GeoSuite toolbox (fullstendige datasett, foretrukket måte), eller gjennom NADAG WebReg (i hovedsak metadata og pdf-rapporter). Det vil komme en tredje innmeldingsløsning for komplette data på åpent format (API). Alle data som ligger i NADAG er fritt tilgjengelig for alle, og lastes ned vederlagsfritt. Det vil være varierende mengde informasjon tilhørende hvert datapunkt, noe som vil avhenge blant annet av formatet data er overlevert på, og dataeiers vilje til å offentliggjøre data utover kun å vise metadata. Tilgjengelige rapporter (pdf) kan lastes ned fra NADAGs infoark. Data lastes ned på formatene GML, Filgeodatabase og GeoSuite. I tillegg kan man benytte NADAGs WMS, samt at det arbeides med lese-API (OGC API Features). Nedlastingen via Geonorge gjelder enkle datasett, dvs. primært metadata og URL-lenker til rapporter. Komplette data må lastes ned gjennom NADAGs kartinnsyn.\n\nNADAG og bidragsytere er ikke ansvarlige for den enkeltes bruk av datasettene. Datasettene og rapportene ble laget for bestemte formål/prosjekt. Den som benytter data for nye formål/prosjekt må gjøre egne og selvstendige vurderinger av dataenes kvalitet, egnethet og gyldighet. Ved bruk av data skal det refereres til rapport/dataeier. Datasettet er gjort tilgjengelig under Norsk lisens for offentlige data (NLOD). Ved å starte NADAG nettjeneste godtar du disse vilkårene for bruk.",
                "owner": "Norges geologiske undersøkelse",
                "updated": "2024-11-02T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/bf45a463-434d-4b4d-84dc-9325780ab5fb"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [],
            "possibleActions": [],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 3,
                    "comment": "Egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 3,
                    "comment": "Egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 1,
                    "comment": "Dårlig egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": null,
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect Flyttlei",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 9223372036854776000,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "landbruk"
            ],
            "runOnDataset": {
                "datasetId": "f9c1e228-892f-4f1a-9e4e-b6d6149f373c",
                "title": "Reindrift - Flyttlei",
                "description": "Datasettet flyttlei beskriver lengre leier eller traséer i terrenget der reinen enten drives/ledes/føres eller trekker selv mellom årstidsbeitene. Også svømmelei inngår som flyttlei. \n\nBredden på en flyttlei varierer ut ifra terreng og måten det flyttes på. Det kan være en aktiv driving av reinen, eller at reinen styres i ønsket retning, hvor reinen får beite seg gjennom et område. Enkelte steder er det utvidelser på flyttleia. Disse utvidelsene markerer beitelommer eller overnattingsbeiter hvor flokken hviler/beiter. Bredden vil variere, blant annet etter terrenget og snøforholdene samt størrelsen og samlingen på flokken. Beitelommer/ overnattingsbeite er markert som utvidelser. \n\nHøstflyttingen foregår som oftest mer spredt og over adskillig lenger tid enn vår-flyttingen. Derfor er ofte høstleia bredere. \n\nDatasettet viser dagens arealbruk og er å regne som veiledende illustrasjon på hvordan reindriftsnæringen i hovedsak og normalt bruker områdene.",
                "owner": "Landbruksdirektoratet",
                "updated": "2024-11-01T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/f9c1e228-892f-4f1a-9e4e-b6d6149f373c"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [],
            "possibleActions": [],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 4,
                    "comment": "Godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": null,
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect Trekklei",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 9223372036854776000,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "landbruk"
            ],
            "runOnDataset": {
                "datasetId": "95b0d396-a6fe-462b-8753-120efd0b60f3",
                "title": "Reindrift - Trekklei",
                "description": "Datasettet trekklei viser viktige naturlige trekk mellom ulike beiteområder og forbi passasjer, der reinen trekker av seg selv, enten enkeltvis eller i flokk.\n\nDatasettet viser dagens arealbruk og er å regne som veiledende illustrasjon på hvordan reindriftsnæringen i hovedsak og normalt bruker områdene.",
                "owner": "Landbruksdirektoratet",
                "updated": "2024-11-01T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/95b0d396-a6fe-462b-8753-120efd0b60f3"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [],
            "possibleActions": [],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 4,
                    "comment": "Godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": null,
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect Oppsamlingsomrade",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 9223372036854776000,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "landbruk"
            ],
            "runOnDataset": {
                "datasetId": "a02e84ec-322c-47a7-a626-ca02d57d1f7e",
                "title": "Reindrift - Oppsamlingsområde",
                "description": "Datasettet oppsamlingsområde viser områder som har kvaliteter (godt beite, oversiktlig, naturlig avgrensning etc.) som gjør det enklere for reineiere å kunne utøve kontroll over flokken i et ønsket tidsrom. Oppsamlingsområder benyttes når reinen samles for å foreta kalvemerking, skilling, slakting eller flytting. \n\nDatasettet viser dagens arealbruk og er å regne som veiledende illustrasjon på hvordan reindriftsnæringen i hovedsak og normalt bruker områdene.",
                "owner": "Landbruksdirektoratet",
                "updated": "2024-11-01T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/a02e84ec-322c-47a7-a626-ca02d57d1f7e"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [],
            "possibleActions": [],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 4,
                    "comment": "Godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        },
        {
            "title": null,
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runAlgorithm": [
                "set input_geometry",
                "intersect ReindriftsAnleggPunkt",
                "get distance",
                "deliver result"
            ],
            "inputGeometryArea": 83854.69,
            "hitArea": null,
            "resultStatus": "NO-HIT-GREEN",
            "distanceToObject": 9223372036854776000,
            "rasterResult": null,
            "cartography": null,
            "data": [],
            "themes": [
                "landbruk"
            ],
            "runOnDataset": {
                "datasetId": "8dfa67c5-3099-4353-9ce0-72f9ebd44a2c",
                "title": "Reindrift - Reindriftsanlegg",
                "description": "Datasettet reindriftsanlegg gir opplysninger om ulike typer gjerder, gjeterhytter og anlegg som er tilknyttet reindrifta. Retten til å utøve reindrift kan også gi rett til husvære, buer o.l. etter reindriftsloven § 21, og rett til å føre opp arbeids- og sperregjerder, slakteanlegg, broer og andre anlegg som er nødvendige for reindriften, etter reindriftsloven § 24. Gjerder og anlegg som skal bli stående ut over en sesong, kan ikke oppføres uten godkjenning av departementet.\n\nDatasettet gir illustrasjon på stedfesting av ulike typer gjerder og anlegg i tilknyttet reindrifta. Dette kan være både linjer og punkter.",
                "owner": "Landbruksdirektoratet",
                "updated": "2024-11-01T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/8dfa67c5-3099-4353-9ce0-72f9ebd44a2c"
            },
            "description": null,
            "guidanceText": null,
            "guidanceUri": [],
            "possibleActions": [],
            "qualityMeasurement": [
                {
                    "qualityDimensionId": "egnethet_reguleringsplan",
                    "qualityDimensionName": "Reguleringsplan",
                    "value": 4,
                    "comment": "Godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_kommuneplan",
                    "qualityDimensionName": "Kommuneplan",
                    "value": 5,
                    "comment": "Svært godt egnet"
                },
                {
                    "qualityDimensionId": "egnethet_byggesak",
                    "qualityDimensionName": "Byggesak",
                    "value": 5,
                    "comment": "Svært godt egnet"
                }
            ],
            "qualityWarning": []
        }
    ],
    "inputGeometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [
                    484868.18,
                    6477271.96
                ],
                [
                    484857.38,
                    6477278.33
                ],
                [
                    484844.89,
                    6477277.21
                ],
                [
                    484833.72,
                    6477268.18
                ],
                [
                    484817.77,
                    6477250.7
                ],
                [
                    484811.91,
                    6477246.5
                ],
                [
                    484805.96,
                    6477245.44
                ],
                [
                    484802.23,
                    6477236.59
                ],
                [
                    484817.66,
                    6477226.43
                ],
                [
                    484812.32,
                    6477219.43
                ],
                [
                    484804.72,
                    6477214.23
                ],
                [
                    484822.49,
                    6477187.94
                ],
                [
                    484818.49,
                    6477184.37
                ],
                [
                    484821.48,
                    6477167.27
                ],
                [
                    484850.73,
                    6477160.51
                ],
                [
                    484865.1,
                    6477160.33
                ],
                [
                    484871.57,
                    6477155.2
                ],
                [
                    484869.72,
                    6477153.25
                ],
                [
                    484897.19,
                    6477137.05
                ],
                [
                    484922.6,
                    6477119.76
                ],
                [
                    484940.63,
                    6477112.21
                ],
                [
                    484952.45,
                    6477103.96
                ],
                [
                    484978.13,
                    6477075.34
                ],
                [
                    485002.11,
                    6477044.02
                ],
                [
                    485010.41,
                    6477036.77
                ],
                [
                    485028.63,
                    6477028.64
                ],
                [
                    485058.59,
                    6477022.94
                ],
                [
                    485071.43,
                    6477018.68
                ],
                [
                    485075.37,
                    6477013.8
                ],
                [
                    485044.68,
                    6476971.52
                ],
                [
                    485127.63,
                    6476894.59
                ],
                [
                    485154.88,
                    6476868.18
                ],
                [
                    485158.52,
                    6476862.91
                ],
                [
                    485174.92,
                    6476873.1
                ],
                [
                    485174.57,
                    6476876.67
                ],
                [
                    485213.3,
                    6476910.02
                ],
                [
                    485209.76,
                    6476918.74
                ],
                [
                    485210.18,
                    6476922.69
                ],
                [
                    485198.85,
                    6476962.32
                ],
                [
                    485189.27,
                    6476979.35
                ],
                [
                    485196.04,
                    6476986.89
                ],
                [
                    485204.77,
                    6476982.33
                ],
                [
                    485212.35,
                    6476983.05
                ],
                [
                    485222.64,
                    6476991.95
                ],
                [
                    485229.64,
                    6477005.33
                ],
                [
                    485247.7,
                    6477057.25
                ],
                [
                    485247.02,
                    6477078.56
                ],
                [
                    485229.37,
                    6477089.25
                ],
                [
                    485231.07,
                    6477094.1
                ],
                [
                    485219.69,
                    6477100.62
                ],
                [
                    485216.2,
                    6477095.47
                ],
                [
                    485206.19,
                    6477104.22
                ],
                [
                    485221.52,
                    6477128.61
                ],
                [
                    485192.92,
                    6477147.23
                ],
                [
                    485198.54,
                    6477161.36
                ],
                [
                    485167.48,
                    6477171.92
                ],
                [
                    485140.36,
                    6477124.06
                ],
                [
                    485113.05,
                    6477146.11
                ],
                [
                    485087.44,
                    6477161.43
                ],
                [
                    485051.42,
                    6477203.27
                ],
                [
                    485030.54,
                    6477220.38
                ],
                [
                    485022.79,
                    6477213.71
                ],
                [
                    485019.86,
                    6477216.8
                ],
                [
                    485005.96,
                    6477232.19
                ],
                [
                    484994.71,
                    6477261.88
                ],
                [
                    484997.14,
                    6477277.81
                ],
                [
                    484946.26,
                    6477330.58
                ],
                [
                    484902.99,
                    6477340.04
                ],
                [
                    484872.94,
                    6477341.71
                ],
                [
                    484880.79,
                    6477329.46
                ],
                [
                    484894.61,
                    6477299.29
                ],
                [
                    484898.8,
                    6477275.13
                ],
                [
                    484896.17,
                    6477253.06
                ],
                [
                    484893.85,
                    6477255.13
                ],
                [
                    484885.71,
                    6477246.4
                ],
                [
                    484868.18,
                    6477271.96
                ]
            ]
        ],
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:EPSG::25832"
            }
        }
    },
    "inputGeometryArea": 83854.69,
    "factSheetRasterResult": null,
    "factSheetCartography": null,
    "factList": [
        {
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runOnDataset": {
                "datasetId": "166382b4-82d6-4ea9-a68e-6fd0c87bf788",
                "title": "FKB-AR5",
                "description": "FKB-AR5, som står for \"Felles Kartdatabase - Arealressurs 5\", representerer en omfattende kartlegging og beskrivelse av Norges arealressurser på et svært detaljert nivå. Dette datasettet er designet for å gi en grundig og presis oversikt over landets arealbruk, naturressurser, og topografiske forhold, og er et kritisk verktøy for planleggere, forskere, og beslutningstakere som arbeider med landforvaltning, miljøovervåking, og utviklingsplanlegging.\n\nAR5-datasettet er flatedekkende, noe som betyr at det gir en sammenhengende oversikt over hele Norges landareal, inkludert både urbane og rurale områder. Det skiller seg ut ved sin høye oppløsning og detaljnivå, som muliggjør analyse og kartframstillinger av høy kvalitet. Denne detaljerte innsikten er spesielt verdifull for å forstå og håndtere komplekse arealbruksutfordringer, som balansen mellom bevaring og utvikling, landbruk, skogbruk, og byutvikling.\n\nEn av de viktigste funksjonene til AR5 er dens rolle i ajourhold og oppdatering av Norges arealressursinformasjon. Ved å tilby en detaljert og nøyaktig base, gjør AR5 det mulig for ulike aktører å hollegge, oppdatere, og dele relevant informasjon om arealbruksendringer, miljøtilstand, og ressursforvaltning. Dette sikrer at beslutningstaking kan baseres på oppdatert og nøyaktig informasjon, noe som er avgjørende for effektiv forvaltning og bærekraftig utvikling.\n\nVidere er AR5 designet for å være fleksibelt og tilgjengelig for en bred brukergruppe, inkludert offentlige etater, private selskaper, forskningsinstitusjoner, og den generelle offentligheten. Dette gjør datasettet til et verdifullt verktøy for en rekke analyseformål, fra miljøovervåking og risikostyring til urban planlegging og landskapsanalyser.\n\nSamlet sett representerer FKB-AR5 et fundamentalt verktøy for å forstå, forvalte, og utvikle Norges arealressurser på en bærekraftig måte. Dets detaljerte innsikt og omfattende dekning gjør det mulig for brukere å utføre avanserte analyser og skape informative kartframstillinger som understøtter informerte beslutninger og effektiv ressursforvaltning.",
                "owner": "Geovekst",
                "updated": "2024-11-19T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/166382b4-82d6-4ea9-a68e-6fd0c87bf788"
            },
            "runAlgorithm": [
                "intersect fkb_ar5_omrade"
            ],
            "data": {
                "inputArea": 83854.69,
                "areaTypes": [
                    {
                        "areaType": "Bebygd",
                        "area": 39617.92
                    },
                    {
                        "areaType": "Ferskvann",
                        "area": 73.43
                    },
                    {
                        "areaType": "Fulldyrka jord",
                        "area": 6476.6
                    },
                    {
                        "areaType": "Hav",
                        "area": 0
                    },
                    {
                        "areaType": "Ikke kartlagt",
                        "area": 0
                    },
                    {
                        "areaType": "Innmarksbeite",
                        "area": 0
                    },
                    {
                        "areaType": "Myr",
                        "area": 0
                    },
                    {
                        "areaType": "Overflatedyrka jord",
                        "area": 0
                    },
                    {
                        "areaType": "Samferdsel",
                        "area": 11044.87
                    },
                    {
                        "areaType": "Skog",
                        "area": 15124.82
                    },
                    {
                        "areaType": "Snøisbre",
                        "area": 0
                    },
                    {
                        "areaType": "Åpen fastmark",
                        "area": 11517.04
                    }
                ]
            },
            "dataTemplate": null
        },
        {
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runOnDataset": {
                "datasetId": "24d7e9d1-87f6-45a0-b38e-3447f8d7f9a1",
                "title": "Matrikkelen - Bygningspunkt",
                "description": "Datasettet Matrikkelen-Bygningspunkt inneholder et lite utdrag av bygningsinformasjonen som er registrert i Matrikkelen, Norges offisielle register over fast eiendom, herunder bygninger.\\\\nDatasettet inneholder representasjonspunkt, bygningstype, bygningsnummer, nåværende bygningsstatus. I tillegg inneholder det ulike id-er for gjenfinning og koblinger (lokal id eller universell uuid) for bygning, og det leveres id(er) for adresse og eiendom pr bygning (hentet fra bruksenhetobjekter i matrikkelsystemet) samt Sefrak-id. \\\\n\\\\nUtgåtte bygninger er ikke med, - heller ikke bygningsendringer som for eksempel påbygg eller tilbygg.\\\\nProduktet inneholder data som er fritt tilgjengelig for alle.\\\\n\\\\nDistribusjoner er satt opp mot en distribusjonsløsning som baserer seg på endringslogg-tjeneste fra Matrikkelsystemet. De ulike distribusjonene har ulik oppdateringsfrekvens, fra 15 minutters forsinkelse på WFS og nedlasting av fritt valgt område fra kart, daglig for kommunevise filer og ukentlig for fylkes- og lands-filer (ny fil kun hvis det er skjedd endringer i Matrikkelen). Ved større endringer/lastinger kan forsinkelsen bli større.",
                "owner": "Kartverket",
                "updated": "2024-11-18T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/24d7e9d1-87f6-45a0-b38e-3447f8d7f9a1"
            },
            "runAlgorithm": [
                "intersect Bygning"
            ],
            "data": [
                {
                    "category": "Bolig",
                    "count": 9
                },
                {
                    "category": "Fritidsbolig - hytte",
                    "count": 0
                },
                {
                    "category": "Industri og lagerbygning",
                    "count": 2
                },
                {
                    "category": "Kontor- og forretningsbygning",
                    "count": 6
                },
                {
                    "category": "Samferdsels- og kommunikasjonsbygning",
                    "count": 0
                },
                {
                    "category": "Hotell og restaurantbygning",
                    "count": 0
                },
                {
                    "category": "Skole-, kultur-, idrett-, forskningsbygning",
                    "count": 1
                },
                {
                    "category": "Helse- og omsorgsbygning",
                    "count": 1
                },
                {
                    "category": "Fengsel, beredskapsbygning, mv.",
                    "count": 0
                }
            ],
            "dataTemplate": null
        },
        {
            "runOnInputGeometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            484868.18,
                            6477271.96
                        ],
                        [
                            484885.71,
                            6477246.4
                        ],
                        [
                            484893.85,
                            6477255.13
                        ],
                        [
                            484896.17,
                            6477253.06
                        ],
                        [
                            484898.8,
                            6477275.13
                        ],
                        [
                            484894.61,
                            6477299.29
                        ],
                        [
                            484880.79,
                            6477329.46
                        ],
                        [
                            484872.94,
                            6477341.71
                        ],
                        [
                            484902.99,
                            6477340.04
                        ],
                        [
                            484946.26,
                            6477330.58
                        ],
                        [
                            484997.14,
                            6477277.81
                        ],
                        [
                            484994.71,
                            6477261.88
                        ],
                        [
                            485005.96,
                            6477232.19
                        ],
                        [
                            485019.86,
                            6477216.8
                        ],
                        [
                            485022.79,
                            6477213.71
                        ],
                        [
                            485030.54,
                            6477220.38
                        ],
                        [
                            485051.42,
                            6477203.27
                        ],
                        [
                            485087.44,
                            6477161.43
                        ],
                        [
                            485113.05,
                            6477146.11
                        ],
                        [
                            485140.36,
                            6477124.06
                        ],
                        [
                            485167.48,
                            6477171.92
                        ],
                        [
                            485198.54,
                            6477161.36
                        ],
                        [
                            485192.92,
                            6477147.23
                        ],
                        [
                            485221.52,
                            6477128.61
                        ],
                        [
                            485206.19,
                            6477104.22
                        ],
                        [
                            485216.2,
                            6477095.47
                        ],
                        [
                            485219.69,
                            6477100.62
                        ],
                        [
                            485231.07,
                            6477094.1
                        ],
                        [
                            485229.37,
                            6477089.25
                        ],
                        [
                            485247.02,
                            6477078.56
                        ],
                        [
                            485247.7,
                            6477057.25
                        ],
                        [
                            485229.64,
                            6477005.33
                        ],
                        [
                            485222.64,
                            6476991.95
                        ],
                        [
                            485212.35,
                            6476983.05
                        ],
                        [
                            485204.77,
                            6476982.33
                        ],
                        [
                            485196.04,
                            6476986.89
                        ],
                        [
                            485189.27,
                            6476979.35
                        ],
                        [
                            485198.85,
                            6476962.32
                        ],
                        [
                            485210.18,
                            6476922.69
                        ],
                        [
                            485209.76,
                            6476918.74
                        ],
                        [
                            485213.3,
                            6476910.02
                        ],
                        [
                            485174.57,
                            6476876.67
                        ],
                        [
                            485174.92,
                            6476873.1
                        ],
                        [
                            485158.52,
                            6476862.91
                        ],
                        [
                            485154.88,
                            6476868.18
                        ],
                        [
                            485127.63,
                            6476894.59
                        ],
                        [
                            485044.68,
                            6476971.52
                        ],
                        [
                            485075.37,
                            6477013.8
                        ],
                        [
                            485071.43,
                            6477018.68
                        ],
                        [
                            485058.59,
                            6477022.94
                        ],
                        [
                            485028.63,
                            6477028.64
                        ],
                        [
                            485010.41,
                            6477036.77
                        ],
                        [
                            485002.11,
                            6477044.02
                        ],
                        [
                            484978.13,
                            6477075.34
                        ],
                        [
                            484952.45,
                            6477103.96
                        ],
                        [
                            484940.63,
                            6477112.21
                        ],
                        [
                            484922.6,
                            6477119.76
                        ],
                        [
                            484897.19,
                            6477137.05
                        ],
                        [
                            484869.72,
                            6477153.25
                        ],
                        [
                            484871.57,
                            6477155.2
                        ],
                        [
                            484865.1,
                            6477160.33
                        ],
                        [
                            484850.73,
                            6477160.51
                        ],
                        [
                            484821.48,
                            6477167.27
                        ],
                        [
                            484818.49,
                            6477184.37
                        ],
                        [
                            484822.49,
                            6477187.94
                        ],
                        [
                            484804.72,
                            6477214.23
                        ],
                        [
                            484812.32,
                            6477219.43
                        ],
                        [
                            484817.66,
                            6477226.43
                        ],
                        [
                            484802.23,
                            6477236.59
                        ],
                        [
                            484805.96,
                            6477245.44
                        ],
                        [
                            484811.91,
                            6477246.5
                        ],
                        [
                            484817.77,
                            6477250.7
                        ],
                        [
                            484833.72,
                            6477268.18
                        ],
                        [
                            484844.89,
                            6477277.21
                        ],
                        [
                            484857.38,
                            6477278.33
                        ],
                        [
                            484868.18,
                            6477271.96
                        ]
                    ]
                ],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::25833"
                    }
                }
            },
            "buffer": 0,
            "runOnDataset": {
                "datasetId": "900206a8-686f-4591-9394-327eb02d0899",
                "title": "Forenklet Elveg 2.0",
                "description": "Forenklet Elveg 2.0 er en forenklet utgave av vegnettsdatasettet Elveg 2.0 og inneholder kun veglenkegeometri og vegsperringer. Dette datasettet erstatter Vbase. Det omfatter alle kjørbare veger som er lengre enn 50 meter, eller er en del av et nettverk, samt gang- og sykkelveger og sykkelveger representert som veglenkegeometri. Fortau, gangveger og gangfelt som tidligere fantes i FKB-TraktorvegSti skal også bli en del av Forenklet Elveg 2.0 i løpet av 2022. Forenklet Elveg 2.0 er en eksport fra Nasjonal vegdatabank (NVDB) og ajourholdes av Statens vegvesen og Kartverket.  Leveranse består av lands-, fylkes- og kommunevise filer. Oppdateres og utgis ukentlig.",
                "owner": "Kartverket",
                "updated": "2024-11-14T00:00:00",
                "datasetDescriptionUri": "https://kartkatalog.geonorge.no/metadata/900206a8-686f-4591-9394-327eb02d0899"
            },
            "runAlgorithm": [
                "intersect veglenke"
            ],
            "data": [
                {
                    "roadType": "Kommunal veg",
                    "length": 763.68
                },
                {
                    "roadType": "Gang og sykkelveg",
                    "length": 110.96
                },
                {
                    "roadType": "Privat veg",
                    "length": 984.23
                },
                {
                    "roadType": "Fylkesveg",
                    "length": 710.79
                },
                {
                    "roadType": "Rundkjøring",
                    "length": 73.27
                },
                {
                    "roadType": "Kanalisert veg",
                    "length": 210.7
                },
                {
                    "roadType": "Fortau",
                    "length": 1235.02
                },
                {
                    "roadType": "Gangveg",
                    "length": 236.75
                },
                {
                    "roadType": "Gangfelt",
                    "length": 3.07
                }
            ],
            "dataTemplate": null
        }
    ],
    "municipalityNumber": "4203",
    "municipalityName": "Arendals",
    "report": null
}