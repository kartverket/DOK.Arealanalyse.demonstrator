import { useRef, useState, useEffect } from 'react';
import { createMap, setupMap } from 'utils/map';
import { useMap } from 'context/MapContext';
import { Zoom, ZoomToExtent } from 'components/Map';
import styles from './MapView.module.scss';

export default function MapView({ inputGeometry, result }) {
   const [map, setMap] = useState(null);
   const mapElementRef = useRef(null);
   const { wmtsOptions } = useMap();

   useEffect(
      () => {
         if (!inputGeometry || !result) {
            return;
         }

         (async () => {
            const olMap = await createMap(inputGeometry, result, wmtsOptions);            
            setMap(olMap);
         })();
      },
      [inputGeometry, result, wmtsOptions]
   );

   useEffect(
      () => {
         if (!map) {
            return;
         }

         setupMap(map, mapElementRef);

         return () => {
            map.dispose();
         }
      },
      [map]
   );

   return (
      <div className={styles.mapContainer}>
         <div ref={mapElementRef} className={styles.map}></div>

         <div className={styles.buttons}>
            <Zoom map={map} />
            <ZoomToExtent map={map} layerName="features" />
         </div>
      </div>
   );
}