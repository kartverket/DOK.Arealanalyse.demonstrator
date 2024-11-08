import { useState } from 'react';
import { inPlaceSort } from 'fast-sort';
import { Accordion, AccordionDetails, AccordionSummary, Tooltip } from '@mui/material';
import Result from './Result';
import styles from './ResultList.module.scss';

export default function ResultList({ data }) {
    const [expanded, setExpanded] = useState('');

    const handleAccordionChange = (panel) => (_, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    function getAccordionTitle(result) {
        const datasetTitle = result.runOnDataset ?
            `«${result.runOnDataset.title}»${result.title !== null ? ` (${result.title})` : ''}` :
            `«${result.title}»`

        switch (result.resultStatus) {
            case 'NO-HIT-GREEN':
                return `Området er utenfor ${datasetTitle}`;
            case 'NO-HIT-YELLOW':
                return `Området har ikke treff for ${datasetTitle}`;
            case 'HIT-YELLOW':
                return `Området har treff i ${datasetTitle}`;
            case 'HIT-RED':
                return `Området er i konflikt med ${datasetTitle}`;
            default:
                return '';
        }
    }

    function getAccordionClassNames(result) {
        const classNames = [styles.accordion];
        const classNameMain = [styles.accordionSummary]

        switch (result.resultStatus) {
            case 'NO-HIT-GREEN':
                classNames.push(styles.success);
                break;
            case 'NO-HIT-YELLOW':
                classNames.push(styles.redwarning);              
                break;
            case 'HIT-YELLOW':
                classNames.push(styles.warning);               
                break;
            case 'HIT-RED':
                classNames.push(styles.error);
                break;
            
            default:
                break;
        }       
        return classNames.join(' ');
    }
    function getAccordionContentClassName(result) {
        const className = [styles.accordionContainer];
        result.resultStatus === 'NO-HIT-YELLOW' ? className.push(styles.redwarning) : null;
        return className.join(' ');
    }

    function getHitAreaPercent(result) {
        const percent = (result.hitArea / result.inputGeometryArea) * 100;

        return Math.round((percent + Number.EPSILON) * 100) / 100;
    }

    function getDistance(result) {
        let distance = result.distanceToObject;

        if (distance >= 20_000) {
            distance = 20_000;
            return `> ${distance.toLocaleString('nb-NO')} meter`
        }

        return `${distance.toLocaleString('nb-NO')} meter`
    }
    function renderNotRelevant() {
        const resultList = data.resultList['NOT-RELEVANT'] || [];

        if (resultList.length === 0) {
            return null;
        }

        inPlaceSort(resultList).asc(result => result.runOnDataset.title);        
        const distinct = new Set(resultList.map(result => result.runOnDataset?.title || result.title));

        return (
            <Paper className={styles.notRelevant}>
                <span className={styles.heading}>Ikke relevant for analyseområdet:</span>
                <ul>
                    {[...distinct].map(title => <li key={title}>{title}</li>)}
                </ul>
            </Paper>
        );
    }

    function renderThemeName(result) {
        return (
            <strong className={styles.themeName}>{result.themes[0]}:</strong>
        );
    }

    function renderWarningText(result) {
        return (
            result.resultStatus === 'NO-HIT-YELLOW' ? <div className={styles.warnings}>
            <div><span>Egenskapskvalitet:</span> <strong>Mindre god</strong></div> 
            <div><span>Nøyaktighet: </span><strong>Stedfestingsnøyaktigheten er utfordrene</strong></div>
            <div><span>Dato: </span><strong>Datasettet er gammelt</strong></div></div> : null
        )
    }

    function renderAccordions(resultStatus) {
        const resultList = data.resultList[resultStatus];

        if (resultList === undefined) {
            return null;
        }

        if (resultStatus === 'NO-HIT-GREEN') {
            inPlaceSort(resultList).asc([
                result => result.distanceToObject,
                result => result.themes[0]
            ]);
        }

        return (
            <div className={styles.resultGroup}>
                {
                    resultList.map((result, index) => (
                        
                        <Accordion
                            key={result.runOnDataset?.datasetId || result.title}
                            expanded={expanded === `panel-${resultStatus}-${index}`}
                            onChange={handleAccordionChange(`panel-${resultStatus}-${index}`)}
                        ><div className={getAccordionContentClassName(result)}>
                            <AccordionSummary sx={{ padding: '0 24px', '& .MuiAccordionSummary-content': { margin: '20px 0' } }}>
                                <div className={styles.accordionSummary}>
                                    <span className={getAccordionClassNames(result)}>
                                        <span className={styles.accordionTitle}>{renderThemeName(result)}<span> {getAccordionTitle(result)}</span></span>
                                    </span>
                                    <div className={styles.warningText}>
                                      {renderWarningText(result)}
                                    </div>
                                    <div className={styles.hitAndDistance}>
                                        {
                                            result.hitArea || getDistance(result) === '0 m' ? (
                                                <span><Tooltip title={<h2>Andel av analyseområde med evt buffer som treffer område til datasett</h2>} placement='top-end'>Treff: {getHitAreaPercent(result).toLocaleString('nb-NO')} %</Tooltip></span>
                                            ) :  <span><Tooltip title={<h2>Angir antall meter fra utkant analyseområde til nærmeste objekt i datasett.</h2>} placement='top-end'>Avstand: {getDistance(result)}</Tooltip></span>
                                        }
                                       
                                    </div>
                                </div>
                            </AccordionSummary></div>
                            <AccordionDetails sx={{ padding: '6px 24px' }}>
                                {
                                    result.resultStatus !== 'NOT-RELEVANT' && (
                                        <Result
                                            inputGeometry={data.inputGeometry}
                                            result={result}
                                        />
                                    )
                                }
                            </AccordionDetails>
                        </Accordion>
                    ))
                }
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div>
                {renderAccordions('HIT-RED')}
                {renderAccordions('HIT-YELLOW')}
                {renderAccordions('NO-HIT-YELLOW')}
                {renderAccordions('NO-HIT-GREEN')}
            </div>

            {renderNotRelevant()}
        </div>
    );
}