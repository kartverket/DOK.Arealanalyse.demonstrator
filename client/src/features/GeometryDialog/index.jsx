import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, TextField } from '@mui/material';
import { addCrsName, getCrsName, getEpsgCode, parseJson } from 'utils/helpers';
import { isPolygon, isMultiPolygon } from 'geojson-validation';
import { isUndefined } from 'lodash';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import styles from './GeometryDialog.module.scss';
import HiddenInput from 'components/HiddenInput';
import axios from 'axios';
import { getFileContents, getFileType, parseJsonFile } from './helpers';
import MapView from './MapView';
import { TabPanel } from 'components';
import GeoJson from './GeoJson';
import useSamples from 'hooks/useSamples';
import { convert, validate } from 'utils/api';
import { useDispatch } from 'react-redux';
import { setErrorMessage } from 'store/slices/appSlice';

const GeometryDialog = forwardRef(({ onOk }, ref) => {
   const [open, setOpen] = useState(false);
   const [geometry, setGeometry] = useState(null);
   const [selectedFile, setSelectedFile] = useState('');
   const [selectedTab, setSelectedTab] = useState(0);
   const { samples = [] } = useSamples();
   const dispatch = useDispatch();

   useImperativeHandle(ref, () => ({
      reset: () => {
         setGeometry(null);
      }
   }));

   const hasCrsName = useCallback(() => !isUndefined(getCrsName(geometry)), [geometry]);

   function handleClickOpen() {
      setOpen(true);
   }

   function handleClose() {
      setOpen(false);
   }

   function handleOk() {
      // if (!hasCrsName() && epsg !== '4326') {
      //    addCrsName(polygon, epsg);
      // }

      onOk(geometry);
      setOpen(false);
   }

   function handleTabChange(event, newValue) {
      setSelectedTab(newValue);
   }

   async function handleFileSelect(event) {
      const value = event.target.value;
      setSelectedFile(value);

      const sample = samples.find(sample => sample.fileName === value);
      setGeometry(sample.geoJson);
   }

   async function handleAddFileChange(event) {
      const file = [...event.target.files][0];

      if (!file) {
         setSelectedFile('');
         return;
      }

      const fileType = getFileType(file);
      let geoJson;

      if (fileType !== 'geojson') {
         geoJson = await convert(file, fileType);
      } else {
         geoJson = await parseJsonFile(file);
      }

      const isValid = geoJson !== null && await validate(geoJson);

      if (!isValid) {
         dispatch(setErrorMessage(`Geometrien i «${file.name}» er ugyldig`));
         geoJson = null;
      }
      
      setSelectedFile('');
      setGeometry(geoJson);      
   }

   return (
      <div>
         <Button
            onClick={handleClickOpen}
            variant="outlined"
         >
            Analyseområde
         </Button>

         <Dialog
            open={open}
            onClose={handleClose}
            sx={{
               "& .MuiDialog-container": {
                  "& .MuiPaper-root": {
                     width: "100%",
                     maxWidth: '720px',
                  },
               }
            }}
         >
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
                           <HiddenInput type="file" onChange={handleAddFileChange} accept=".json, .geojson, .sos, .sosi, .gml" />
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
                                 samples.map(sample => (
                                    <MenuItem key={sample.fileName} value={sample.fileName}>{sample.name}</MenuItem>
                                 ))
                              }
                           </Select>
                        </FormControl>
                     </div>
                  </div>

                  <Box className={styles.tabs}>
                     <Tabs value={selectedTab} onChange={handleTabChange}>
                        <Tab label="Kart" disabled={geometry === null} />
                        <Tab label="GeoJSON" disabled={geometry === null} />
                     </Tabs>
                  </Box>

                  <TabPanel value={selectedTab} index={0} className={styles.tabPanel}>
                     <MapView geometry={geometry} />
                  </TabPanel>

                  <TabPanel value={selectedTab} index={1} className={styles.tabPanel}>
                     <GeoJson data={geometry} />
                  </TabPanel>
               </div>
            </DialogContent>

            <DialogActions>
               <Button onClick={handleClose}>Avbryt</Button>
               <Button onClick={handleOk} disabled={geometry === null}>OK</Button>
            </DialogActions>
         </Dialog>
      </div>
   );
});

GeometryDialog.displayName = 'GeometryDialog';

export default GeometryDialog;