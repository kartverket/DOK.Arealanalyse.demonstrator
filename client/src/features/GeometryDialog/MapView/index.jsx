import { useEffect, useRef, useState } from 'react';
import { useMap } from 'context/MapContext';
import { createOutlineMap, getLayer, readFeature, setupMap } from 'utils/map';
import { Zoom, ZoomToExtent } from 'components/Map';
import EditorDialog from './EditorDialog';
import styles from './MapView.module.scss';

export default function MapView({ geometry, onEditDone }) {
   const [map, setMap] = useState(null);
   const [geoJson, setGeoJson] = useState(null);
   const [editorOpen, setEditorOpen] = useState(false);
   const mapElementRef = useRef(null);
   const { wmtsOptions } = useMap();

   useEffect(
      () => {
         if (geometry === null) {
            return;
         }

         setGeoJson(geometry);

         (async () => {
            const olMap = await createOutlineMap(geometry, wmtsOptions);

            setMap(olMap);
         })();
      },
      [geometry, wmtsOptions]
   );

   useEffect(
      () => {
         if (map === null) {
            return;
         }

         setupMap(map, mapElementRef);

         return () => {
            map.dispose();
         }
      },
      [map]
   );

   function openEditor() {
      setEditorOpen(true);
   }

   function handleClose(geoJson) {
      setEditorOpen(false);

      if (geoJson !== null) {
         setGeoJson(geoJson);
         onEditDone(geoJson);

         const feature = readFeature(geoJson);
         const vectorLayer = getLayer(map, 'features');
         const vectorSource = vectorLayer.getSource();

         vectorSource.clear();
         vectorSource.addFeature(feature);
      }
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
            geometry={geoJson}
            open={editorOpen}
            onClose={handleClose}
         />
      </>
   );
}