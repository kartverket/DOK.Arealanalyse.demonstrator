import { useEffect, useRef, useState } from 'react';
import { useMap } from 'context/MapContext';
import { addInteractions } from './Editor/helpers';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { createOutlineMap, getLayer } from 'utils/map';
import baseMap from 'config/baseMap.config';
import styles from './EditorDialog.module.scss';
import Editor from './Editor';
import { Zoom, ZoomToExtent } from 'components/Map';

export default function EditorDialog({ geometry, open, onClose }) {
   const [map, setMap] = useState(null);
   const mapElementRef = useRef(null);
   const { wmtsOptions } = useMap();

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

   function handleOk() {
      onClose();
   }

   function handleClose(event, reason) {
      if (reason && reason === 'backdropClick') {
         return;
      }

      onClose();
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
            <Button onClick={handleOk}>OK</Button>
         </DialogActions>
      </Dialog>
   )
}