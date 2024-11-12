import { useRef, useState, useEffect } from 'react';
import { ZoomToExtent } from 'ol/control';
import { createMap, getLayer } from 'utils/map';
import { useMap } from 'context/MapContext';
import baseMap from 'config/baseMap.config';
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
      <div ref={mapElementRef} className={styles.map}></div>
   );
}