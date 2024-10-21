import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Result from './Result';
import styles from './ResultList.module.scss';

export default function ResultList({ data }) {
   const [expanded, setExpanded] = useState('');

   const handleAccordionChange = (panel) => (_, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
   };

   function getAccordionTitle(result) {
      const datasetTitle = result.runOnDataset ?
         `«${result.runOnDataset.title}» (${result.title})` :
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

      switch (result.resultStatus) {
         case 'NO-HIT-GREEN':
            classNames.push(styles.success);
            break;
         case 'NO-HIT-YELLOW':
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

   function getHitAreaPercent(result) {
      const percent = (result.hitArea / result.inputGeometryArea) * 100;

      return Math.round((percent + Number.EPSILON) * 100) / 100;
   }

   function renderThemeName(result) {
      return (
         <strong className={styles.themeName}>{result.themes[0]}</strong>
      );
   }

   function renderAccordions(resultStatus) {
      const resultList = data.resultList[resultStatus];

      if (resultList === undefined) {
         return null;
      }

      return (
         <div className={styles.resultGroup}>
            {
               resultList.map((result, index) => (
                  <Accordion
                     key={result.title}
                     expanded={expanded === `panel-${resultStatus}-${index}`}
                     onChange={handleAccordionChange(`panel-${resultStatus}-${index}`)}
                  >
                     <AccordionSummary sx={{ padding: '0 24px', '& .MuiAccordionSummary-content': { margin: '20px 0' } }}>
                        <div className={styles.accordionSummary}>
                        <span className={getAccordionClassNames(result)}>
                           <span className={styles.accordionTitle}>{renderThemeName(result)}: {getAccordionTitle(result)}</span>
                        </span>
                        {
                           result.hitArea && (
                              <span className={styles.hitArea}>{getHitAreaPercent(result).toLocaleString('nb-NO')} %</span>
                           )
                        }
                        </div>
                     </AccordionSummary>
                     <AccordionDetails sx={{ padding: '6px 24px' }}>
                        <Result
                           inputGeometry={data.inputGeometry}
                           result={result}
                        />
                     </AccordionDetails>
                  </Accordion>
               ))
            }
         </div>
      );
   }

   return (
      <div>
         {renderAccordions('HIT-RED')}
         {renderAccordions('HIT-YELLOW')}
         {renderAccordions('NO-HIT-YELLOW')}
         {renderAccordions('NO-HIT-GREEN')}
      </div>
   );
}