import React, { useMemo, useState } from 'react';
import GeneralInfo from './GeneralInfo';
import Buildings from './Buildings';
import Roads from './Roads';
import Area from './Area';
import style from './FactSheet.module.scss';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const FactSheet = ({ municipalityNumber, municipalityName, inputGeometryArea, inputGeometry, factList }) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    if (!factList || factList.length === 0) {
        return <p>Ingen data tilgjengelig.</p>;
    }
    const { areaTypes, buildings, roads } = useMemo(
        () => {
            return {
                areaTypes: factList.find(entry => entry.runOnDataset.datasetId === '166382b4-82d6-4ea9-a68e-6fd0c87bf788'),
                buildings: factList.find(entry => entry.runOnDataset.datasetId === '24d7e9d1-87f6-45a0-b38e-3447f8d7f9a1'),
                roads: factList.find(entry => entry.runOnDataset.datasetId === '900206a8-686f-4591-9394-327eb02d0899')                
            }
        },
        [factList]
    );
    const toggleClass = () => {
        setIsExpanded(prevState => !prevState); 
    };
    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    return (
        <div className={`${style.factsheet} ${isExpanded ? style.expanded : ''}`}>
            <h3>Faktaark</h3>
            <GeneralInfo number={municipalityNumber} name={municipalityName} area={inputGeometryArea} geo={inputGeometry}  />
            <a onClick={() => toggleClass()} >Se detaljer</a>
            <Button onClick={handleOpenModal}>Se detaljer</Button>
            <Dialog open={openModal} sx={{
                '& .MuiDialog-container': {
                    '& > .MuiPaper-root': {
                        minWidth: '90vw',
                        maxWidth: '90vh',
                    },
                }
            }}onClose={handleCloseModal}>
                <DialogTitle>Faktaark</DialogTitle>
                <DialogContent>
                    <GeneralInfo number={municipalityNumber} name={municipalityName} area={inputGeometryArea} geo={inputGeometry}  />
                    <Area factList={areaTypes} />
                    <Buildings factList={buildings} />                                        
                    <Roads factList={roads} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Lukk</Button>
                </DialogActions>
            </Dialog>
            <Buildings factList={buildings} />
            <Roads factList={roads} />
            <Area factList={areaTypes} />
        </div>
    );
};

export default FactSheet;