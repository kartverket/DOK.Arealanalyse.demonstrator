import React from 'react';
import styles from './GeneralInfo.module.scss';

const GeneralInfo = ({ number, name, area }) => {
    return (
        <div className={styles.generalInfo}>        
            <p><strong>Kommunenavn:</strong> {name}</p>
            <p><strong>Kommunenummer:</strong> {number}</p>
            <p><strong>Areal:</strong> {area} m²</p>
            
        </div>
    );
};

export default GeneralInfo;