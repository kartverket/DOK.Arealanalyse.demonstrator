import { useRef, useState } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Button, Checkbox, FormControl, FormControlLabel, InputAdornment, InputLabel, LinearProgress, MenuItem, Paper, Select, Snackbar, Alert } from '@mui/material';
import { isPolygon, isMultiPolygon } from 'geojson-validation';
import { groupBy } from 'lodash';
import axios from 'axios'
import GeometryDialog from 'features/GeometryDialog';
import IntegerField from 'components/IntegerField';
import Result from 'features/Result';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import logo from 'assets/gfx/logo-kartverket.svg';
import styles from './App.module.scss';
import { Toaster } from 'components';

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
   const [data, setData] = useState(null);
   const [fetching, setFetching] = useState(false);
   const [state, setState] = useState(getDefaultValues());
   const [errorMessage, setErrorMessage] = useState(null);
   const [expanded, setExpanded] = useState('');
   const geometryDialogRef = useRef(null);

   function handleGeometryDialogOk(polygon) {
      setState({ ...state, inputGeometry: polygon });
   }

   function handleChange(event) {
      const value = event.target.type === 'checkbox' ?
         event.target.checked :
         event.target.value;

      setState({ ...state, [event.target.name]: value })
   }

   const handleAccordionChange = (panel) => (_, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
   };

   function getDefaultValues() {
      return {
         inputGeometry: null,
         requestedBuffer: 0,
         context: '',
         theme: '',
         includeGuidance: false,
         includeQualityMeasurement: false
      };
   }

   function resetState() {
      setData(null);
      setExpanded('');
   }

   function getAccordionTitle(result) {
      const datasetTitle = `«${result.runOnDataset.title}» (${result.title})`;

      switch (result.resultStatus) {
         case 'NO-HIT-GREEN':
            return `Området er utenfor ${datasetTitle}`;
         case 'NO-HIT-YELLOW':
            return `Området har ikke treff for ${datasetTitle}`;
         case 'HIT-YELLOW':
            return `Området har treff i ${datasetTitle}`;
         case 'HIT-RED':
            return `Området er i konflikt med ${datasetTitle}`;
         default:
            return '';
      }
   }

   function getAccordionClassNames(result) {
      const classNames = [styles.accordion];

      switch (result.resultStatus) {
         case 'NO-HIT-GREEN':
            classNames.push(styles.success);
            break;
         case 'NO-HIT-YELLOW':
         case 'HIT-YELLOW':
            classNames.push(styles.warning);
            break;
         case 'HIT-RED':
            classNames.push(styles.error);
            break;
         default:
            break;
      }

      return classNames.join(' ');
   }

   async function start() {
      const payload = getPayload();

      resetState();

      try {
         setFetching(true);
         const response = await axios.post('http://localhost:5001/api/pygeoapi', payload);
         //const response = await axios.post('/api/', payload);

         if (response.data?.code) {
            setErrorMessage('Kunne ikke kjøre DOK-analyse. En feil har oppstått.');
            console.error(response.data.code);
         } else {
            const { inputGeometry, resultList } = response.data;
            const grouped = groupBy(resultList, result => result.resultStatus);

            setData({ inputGeometry, resultList: grouped });
         }
      } catch (error) {
         setErrorMessage('Kunne ikke kjøre DOK-analyse. En feil har oppstått.');
         console.error(error);
      } finally {
         setFetching(false);
      }
   }

   function getPayload() {
      const inputs = { ...state };

      if (inputs.context === '') {
         inputs.context = null;
      }

      if (inputs.theme === '') {
         inputs.theme = null;
      }

      return {
         inputs
      };
   }

   function isValidGeometry() {
      return isPolygon(state.inputGeometry) || isMultiPolygon(state.inputGeometry);
   }

   function renderAccordions(resultStatus) {
      const resultList = data.resultList[resultStatus];

      if (resultList === undefined) {
         return null;
      }

      return (
         <div className={styles.resultGroup}>
            {
               resultList.map((result, index) => (
                  <Accordion
                     key={result.runOnDataset.datasetId + result.title}
                     expanded={expanded === `panel-${resultStatus}-${index}`}
                     onChange={handleAccordionChange(`panel-${resultStatus}-${index}`)}
                  >
                     <AccordionSummary sx={{ padding: '0 24px', '& .MuiAccordionSummary-content': { margin: '20px 0' } }}>
                        <span className={getAccordionClassNames(result)}>
                           <span className={styles.accordionTitle}>{getAccordionTitle(result)}</span>
                        </span>
                     </AccordionSummary>
                     <AccordionDetails sx={{ padding: '6px 24px' }}>
                        <Result
                           inputGeometry={data.inputGeometry}
                           result={result}
                        />
                     </AccordionDetails>
                  </Accordion>
               ))
            }
         </div>
      );
   }

   return (
      <div className={styles.app}>
         <div className={styles.heading}>
            <img src={logo} alt="Kartverket logo" />
            <h1>Arealanalyse av DOK-datasett - Demonstrator</h1>
         </div>

         <div className={styles.content}>
            <Paper sx={{ marginBottom: '24px' }}>
               <div className={styles.input}>
                  <div className={styles.row}>
                     <div className={styles.addGeometry}>
                        <GeometryDialog
                           ref={geometryDialogRef}
                           onOk={handleGeometryDialogOk}
                        />

                        <div className={styles.icons}>
                           <CheckCircleIcon
                              color="success"
                              sx={{
                                 display: isValidGeometry() ? 'block !important' : 'none'
                              }}
                           />
                        </div>
                     </div>
                     <div>
                        <IntegerField
                           name="requestedBuffer"
                           value={state.requestedBuffer}
                           onChange={handleChange}
                           label="Buffer"
                           InputProps={{
                              endAdornment: <InputAdornment position="end">[meter]</InputAdornment>
                           }}
                           sx={{
                              width: 150
                           }}
                        />
                     </div>
                     <div>
                        <FormControl sx={{ width: 200 }}>
                           <InputLabel id="context-label">Bruksområde</InputLabel>
                           <Select
                              labelId="context-label"
                              id="context-select"
                              name="context"
                              value={state.context}
                              label="Velg bruksområde"
                              onChange={handleChange}
                           >
                              <MenuItem value="">Velg...</MenuItem>
                              <MenuItem value="reguleringsplan">Reguleringsplan</MenuItem>
                              <MenuItem value="ros">ROS</MenuItem>
                              <MenuItem value="byggesak">Byggesak</MenuItem>
                           </Select>
                        </FormControl>
                     </div>
                     <div>
                        <FormControl sx={{ width: 200 }}>
                           <InputLabel id="theme-label">Tema</InputLabel>
                           <Select
                              labelId="theme-label"
                              id="theme-select"
                              name="theme"
                              value={state.theme}
                              label="Velg tema"
                              onChange={handleChange}
                           >
                              <MenuItem value="">Velg...</MenuItem>
                              <MenuItem value="natur">Natur</MenuItem>
                              <MenuItem value="samferdsel">Samferdsel</MenuItem>
                              <MenuItem value="samfunnssikkerhet">Samfunnssikkerhet</MenuItem>
                           </Select>
                        </FormControl>
                     </div>
                     <div>
                        <FormControlLabel
                           control={
                              <Checkbox
                                 name="includeGuidance"
                                 checked={state.includeGuidance}
                                 onChange={handleChange}
                              />
                           }
                           label="Inkluder veiledning" />
                     </div>
                     <div>
                        <FormControlLabel
                           control={
                              <Checkbox
                                 name="includeQualityMeasurement"
                                 checked={state.includeQualityMeasurement}
                                 onChange={handleChange}
                              />
                           }
                           label="Inkluder kvalitetsinformasjon" />
                     </div>
                  </div>
                  <div className={styles.row}>
                     <div>
                        <Button
                           onClick={start}
                           disabled={!isValidGeometry()}
                           variant="contained"
                        >
                           Start DOK-analyse
                        </Button>
                     </div>
                  </div>
               </div>
            </Paper>
            {
               fetching ?
                  <LinearProgress /> :
                  null
            }
            {
               data !== null ?
                  <div>
                     {renderAccordions('HIT-RED')}
                     {renderAccordions('HIT-YELLOW')}
                     {renderAccordions('NO-HIT-YELLOW')}
                     {renderAccordions('NO-HIT-GREEN')}
                  </div> :
                  null
            }

            <Toaster />
         </div>
      </div>
   );
}
