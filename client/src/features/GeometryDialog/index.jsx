import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { addCrsName, getCrsName, getEpsgCode, parseJson } from 'utils/helpers';
import { isPolygon, isMultiPolygon } from 'geojson-validation';
import { isUndefined } from 'lodash';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import styles from './GeometryDialog.module.scss';
import HiddenInput from 'components/HiddenInput';
import axios from 'axios';

const GEOJSON_FILE_MAPPINGS = {
   'Drammen': 'drammen.geojson',
   'Eidanger': 'eidanger.geojson',
   'His allé': 'his-alle.geojson',
   'Skien havnelager': 'skien-havnelager.geojson',
   'Ullevål': 'ullevål.geojson'
};

const GeometryDialog = forwardRef(({ onOk }, ref) => {
   const [open, setOpen] = useState(false);
   const [geoJson, setGeoJson] = useState('');
   const [polygon, setPolygon] = useState(null);
   const [epsg, setEpsg] = useState('');
   const [selectedFile, setSelectedFile] = useState('');

   useImperativeHandle(ref, () => ({
      reset: () => {
         setGeoJson('');
      }
   }));

   const hasCrsName = useCallback(() => !isUndefined(getCrsName(polygon)), [polygon]);

   useEffect(
      () => {
         const obj = parseJson(geoJson);

         if (isPolygon(obj) || isMultiPolygon(obj)) {
            setPolygon(obj);
            setEpsg(getEpsgCode(getCrsName(obj)) || '4326');
         } else {
            setPolygon(null);
            setEpsg('');
         }
      },
      [geoJson]
   );

   function handleClickOpen() {
      setOpen(true);
   }

   function handleClose() {
      setOpen(false);
   }

   function handleOk() {
      if (!hasCrsName() && epsg !== '4326') {
         addCrsName(polygon, epsg);
      }

      onOk(polygon);
      setOpen(false);
   }

   function handleGeoJsonChange(event) {
      setGeoJson(event.target.value);
   }

   function handleEpsgChange(event) {
      setEpsg(event.target.value);
   }

   async function handleFileSelect(event) {
      setSelectedFile(event.target.value);

      const url = `/geojson/${event.target.value}`;
      const response = await axios.get(url);
      const json = JSON.stringify(response.data, null, 3);

      setGeoJson(json);
   }

   async function handleAddFileChange(event) {
      const file = [...event.target.files][0];

      if (file) {
         const text = await file.text();

         setSelectedFile('');
         setGeoJson(text);
      }
   }

   return (
      <div>
         <Button
            onClick={handleClickOpen}
            variant="outlined"
         >
            Analyseområde
         </Button>

         <Dialog open={open} onClose={handleClose} >
            <DialogTitle>Analyseområde</DialogTitle>

            <DialogContent>
               <div className={styles.dialogContent}>
                  <div className={styles.contentTop}>
                     <div className={styles.uploadButton}>
                        <Button
                           component="label"
                           variant="contained"
                           sx={{
                              width: 200
                           }}
                        >
                           Legg til fil
                           <HiddenInput type="file" onChange={handleAddFileChange} accept=".json, .geojson" />
                        </Button>
                     </div>

                     <div className={styles.fileSelect}>
                        <FormControl fullWidth>
                           <InputLabel id="select-file-label">Velg fil</InputLabel>
                           <Select
                              labelId="select-file-label"
                              value={selectedFile}
                              label="Velg fil"
                              onChange={handleFileSelect}
                           >
                              {
                                 Object.entries(GEOJSON_FILE_MAPPINGS).map(entry => (
                                    <MenuItem key={entry[1]} value={entry[1]}>{entry[0]}</MenuItem>
                                 ))
                              }
                           </Select>
                        </FormControl>
                     </div>
                  </div>

                  <div className={styles.geoJson}>
                     <TextField
                        value={geoJson}
                        onChange={handleGeoJsonChange}
                        label="GeoJSON"
                        autoFocus
                        multiline={true}
                        rows={20}
                        sx={{
                           width: 500
                        }}
                     />

                     <div className={styles.icons}>
                        <CheckCircleIcon
                           color="success"
                           sx={{
                              display: geoJson !== '' && polygon !== null ? 'block !important' : 'none'
                           }}
                        />

                        <CancelIcon
                           sx={{
                              color: '#d53838',
                              display: geoJson !== '' && polygon === null ? 'block !important' : 'none'
                           }}
                        />
                     </div>
                  </div>

                  <TextField
                     value={epsg}
                     onChange={handleEpsgChange}
                     label="EPSG"
                     disabled={hasCrsName()}
                     sx={{
                        width: 150
                     }}
                  />
               </div>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose}>Avbryt</Button>
               <Button onClick={handleOk} disabled={polygon === null}>OK</Button>
            </DialogActions>
         </Dialog>
      </div>
   );
});

GeometryDialog.displayName = 'GeometryDialog';

export default GeometryDialog;