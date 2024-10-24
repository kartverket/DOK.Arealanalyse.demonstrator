import { useEffect, useState, useCallback } from 'react';
import { getMapImage } from 'utils/map';
import { CircularProgress } from '@mui/material';
import { marked } from 'marked';
import { useMap } from 'context/MapContext';
import AboutDataset from './AboutDataset';
import AboutAnalysis from './AboutAnalysis';
import GuidanceLinks from './GuidanceLinks';
import GuidanceText from './GuidanceText';
import QualityMeasurement from './QualityMeasurement';
import PossibleActions from './PossibleActions';
import Data from './Data';
import MapView from 'features/MapView';
import styles from './Result.module.scss';

export default function Result({ inputGeometry, result }) {
   const [mapBase64, setMapBase64] = useState(null);
   const [showInteractiveMap, setShowInteractiveMap] = useState(false);
   const { wmtsOptions } = useMap();

   const shouldShowMap = useCallback(
      () => {
         return result.resultStatus !== 'NO-HIT-GREEN' &&
            result.resultStatus !== 'NO-HIT-YELLOW';
      },
      [result.resultStatus]
   );

   useEffect(
      () => {
         if (!shouldShowMap()) {
            return;
         }

         (async () => {
            const base64 = await getMapImage(inputGeometry, result, wmtsOptions);
            setMapBase64(base64);
         })();
      },
      [shouldShowMap, inputGeometry, result, wmtsOptions]
   );

   return (
      <div>
         {
            result.description ?
               <div className="section">
                  <div className="paper" dangerouslySetInnerHTML={{ __html: marked.parse(result.description) }}></div>
               </div> :
               null
         }

         <PossibleActions result={result} />

         <div className={styles.grid}>
            <div>
               {
                  shouldShowMap() ?
                     <div className="paper">
                        <h3>Kartutsnitt</h3>
                        {
                           showInteractiveMap ?
                              <MapView inputGeometry={inputGeometry} result={result} /> :
                              (
                                 mapBase64 !== null ?
                                    <img src={mapBase64} role="button" title="Åpne kart" onClick={() => setShowInteractiveMap(true)} alt="Kartutsnitt" /> :
                                    <div className={styles.loading}>
                                       <CircularProgress size={32} />
                                    </div>
                              )
                        }
                     </div> :
                     null
               }
               <div className={styles.expandables}>
                  {
                     result.runOnDataset && <AboutDataset result={result} />
                  }
                  <QualityMeasurement result={result} />
                  <AboutAnalysis result={result} />
               </div>
            </div>
            <div>
               {
                  result.cartography !== null ?
                     <div className="paper">
                        <h3>Tegneregler</h3>
                        <img src={result.cartography} alt="Tegneregler" />
                     </div> :
                     null
               }
               <GuidanceText result={result} />
               <GuidanceLinks result={result} />
               <Data result={result} />
            </div>
         </div>
      </div>
   );
}