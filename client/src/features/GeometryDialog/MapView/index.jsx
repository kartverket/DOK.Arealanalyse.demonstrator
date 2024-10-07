import { useEffect, useRef, useState } from 'react';
import { useMap } from 'context/MapContext';
import { createOutlineMap, getLayer } from 'utils/map';
import { Zoom, ZoomToExtent } from 'components/Map';
import baseMap from 'config/baseMap.config';
import EditorDialog from './EditorDialog';
import styles from './MapView.module.scss';

export default function MapView({ geometry }) {
   const [map, setMap] = useState(null);
   const [editorOpen, setEditorOpen] = useState(false);
   const mapElementRef = useRef(null);
   const { wmtsOptions } = useMap();

   useEffect(
      () => {
         if (!geometry) {
            return;
         }

         (async () => {
            const olMap = await createOutlineMap(geometry, wmtsOptions);

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

         return () => {
            map.dispose();
         }
      },
      [map]
   );

   function openEditor() {
      setEditorOpen(true);
   }

   return (
      <>
         <div className={styles.mapContainer}>
            <div ref={mapElementRef} className={styles.map}></div>

            {
               map !== null && (
                  <div className={styles.buttons}>
                     <Zoom map={map} />
                     <ZoomToExtent map={map} layerName="features" />
                     <button onClick={openEditor} className={styles.editorButton} title="Rediger analyseområde"></button>
                  </div>
               )
            }
         </div>

         <EditorDialog
            geometry={geometry}
            open={editorOpen}
            onClose={() => setEditorOpen(false)}
         />
      </>
   );
}