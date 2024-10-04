import { useEffect, useRef, useState } from 'react';
import { useMap } from 'context/MapContext';
import { createOutlineMap, getLayer } from 'utils/map';
import { ZoomToExtent } from 'ol/control';
import { addInteractions } from './Editor/helpers';
import baseMap from 'config/baseMap.config';
import Editor from './Editor';
import styles from './MapView.module.scss';

export default function MapView({ geometry }) {
   const [map, setMap] = useState(null);
   const mapElementRef = useRef(null);
   const { wmtsOptions } = useMap();

   useEffect(
      () => {
         if (!geometry) {
            return;
         }

         (async () => {
            const olMap = await createOutlineMap(geometry, wmtsOptions);

            addInteractions(olMap);
            setMap(olMap);
         })();
      },
      [geometry, wmtsOptions]
   );

   useEffect(
      () => {
         if (!map) {
            return;
         }

         map.setTarget(mapElementRef.current);

         const vectorLayer = getLayer(map, 'features');
         const extent = vectorLayer.getSource().getExtent();
         const view = map.getView();

         view.fit(extent, map.getSize());
         view.setMinZoom(baseMap.minZoom);
         view.setMaxZoom(baseMap.maxZoom);

         const currentZoom = view.getZoom();

         if (currentZoom > baseMap.maxZoom) {
            view.setZoom(baseMap.maxZoom);
         }

         map.addControl(new ZoomToExtent({ extent }));

         return () => {
            map.dispose();
         }
      },
      [map]
   );

   return (
      <div className={styles.mapContainer}>
         <div ref={mapElementRef} className={styles.map}></div>

         <div className={styles.editor}>
            <Editor map={map} />
         </div>
      </div>
   );
}