import { React, useState } from 'react';
import { Table, TableBody, TableCell,TableContainer,TableHead,TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Result from './Result';
import styles from './ResultList.module.scss';


export default function ResultList({ data }) {    
   
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
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
        const classNames = [styles.tabledok];

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

    function getDistance(result) {
        let distance = result.distanceToObject;

        if (distance >= 20_000) {
            distance = 20_000;
            return `> ${distance.toLocaleString('nb-NO')} m`
        }

        return `${distance.toLocaleString('nb-NO')} m`
    }

 
    function getLastUpdated(result) {
        const updated = result.runOnDataset?.updated;
        if (!updated) {
            return "Dato ikke tilgjengelig";
        }
        const date = new Date(updated);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = String(date.getFullYear()); 
        return `${day}.${month}.${year}`;
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

        return (<>                           
                {
                    resultList.map((result, index) => (
                        <TableRow key={index} >
                            <TableCell className={getAccordionClassNames(result)}>
                                {renderThemeName(result)}
                            </TableCell>
                            <TableCell onClick={handleClickOpen}>
                            <span className={styles.title}>{getAccordionTitle(result)}</span>                                                        
                            </TableCell>
                            <TableCell>
                            {resultStatus === "NO-HIT-YELLOW" && result.runOnDataset && (<span className={styles.warningbadge}>Det finnes ikke dekning i området og ytterligere kartlegging bør vurderes
                                </span>
                                )}
                                <div>"nøyaktighetsklasse : Mindre god her"<br />Dekningskart: Over normalen</div>
                            </TableCell>
                            <TableCell>
                             {getLastUpdated(result)}
                            </TableCell>
                            <TableCell>
                            {
                            result.hitArea && (
                                <span> {getHitAreaPercent(result).toLocaleString('nb-NO')} % av området</span>
                            )
                        }                           
                            {getDistance(result) === "0 m" ? null : getDistance(result)}
                            </TableCell>
                        </TableRow>                  
                    ))
                }       
                </>                    
        );
    }

    return (
       <TableContainer> 
        <Table sx={{ minWidth: 650 }} size="small" >
        
        <TableHead>
            <TableRow>
                <TableCell>
                    Tema
                </TableCell>
                <TableCell>
                    Datasett
                </TableCell>
                <TableCell>
                    Kvalitetsindikator
                </TableCell>
                <TableCell>
                    Sist oppdatert
                </TableCell>
                <TableCell>
                    treffindikator
                </TableCell>               
            </TableRow>
        </TableHead>
        <TableBody>
            {renderAccordions('HIT-RED')}
            {renderAccordions('HIT-YELLOW')}
            {renderAccordions('NO-HIT-YELLOW')}
            {renderAccordions('NO-HIT-GREEN')}
       </TableBody>
             </Table> 
             </TableContainer>
    );
}