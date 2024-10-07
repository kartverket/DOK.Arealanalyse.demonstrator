import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setErrorMessage } from 'store/slices/appSlice';
import { useMap } from 'context/MapContext';
import { addInteractions } from './Editor/helpers';
import { validate } from 'utils/api';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { createOutlineMap, getLayer, setupMap, writeGeometryObject } from 'utils/map';
import { Zoom, ZoomToExtent } from 'components/Map';
import Editor from './Editor';
import styles from './EditorDialog.module.scss';
import truncate from '@turf/truncate';

export default function EditorDialog({ geometry, open, onClose }) {
   const [map, setMap] = useState(null);
   const mapElementRef = useRef(null);
   const { wmtsOptions } = useMap();
   const dispatch = useDispatch();

   useEffect(
      () => {
         if (geometry === null || !open) {
            return;
         }

         (async () => {
            const olMap = await createOutlineMap(geometry, wmtsOptions, false);

            addInteractions(olMap);
            setMap(olMap);
         })();
      },
      [open, geometry, wmtsOptions]
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

   async function handleOk() {
      const vectorLayer = getLayer(map, 'features');
      const vectorSource = vectorLayer.getSource();
      const features = vectorSource.getFeatures();
      const geoJson = writeGeometryObject(features[0].getGeometry());
      const truncated = truncate(geoJson, { precision: 6 });
      const isValid = await validate(truncated);

      if (!isValid) {
         dispatch(setErrorMessage('Geometrien i analyseområdet er ugyldig'));
      } else {
         onClose(truncated);
      }
   }

   function handleClose(event, reason) {
      if (reason && reason === 'backdropClick') {
         return;
      }

      onClose(null);
   }

   return (
      <Dialog
         open={open}
         onClose={handleClose}
         disableEscapeKeyDown={true}
         sx={{
            '& .MuiDialog-container': {
               '& .MuiPaper-root': {
                  width: '100%',
                  maxWidth: '720px',
               },
            }
         }}
      >
         <DialogTitle>Rediger analyseområde</DialogTitle>

         <DialogContent>
            <div className={styles.dialogContent}>
               <div className={styles.mapContainer}>
                  <div ref={mapElementRef} className={styles.map}></div>

                  <div className={styles.buttons}>
                     <Zoom map={map} />
                     <ZoomToExtent map={map} layerName="features" />
                  </div>

                  <div className={styles.editorButtons}>
                     <Editor map={map} />
                  </div>
               </div>
            </div>
         </DialogContent>

         <DialogActions>
            <Button onClick={handleClose}>Avbryt</Button>
            <Button onClick={handleOk}>Lagre</Button>
         </DialogActions>
      </Dialog>
   );
}