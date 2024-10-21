import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setErrorMessage } from 'store/slices/appSlice';
import { analyze } from 'utils/api';
import groupBy from 'lodash.groupby';
import { LinearProgress } from '@mui/material';
import { Form, ResultList } from 'features';
import { Toaster } from 'components';
import logo from 'assets/gfx/logo-kartverket.svg';
import styles from './App.module.scss';

export default function App() {
   const [data, setData] = useState(null);
   const [fetching, setFetching] = useState(false);
   const dispatch = useDispatch();

   function resetState() {
      setData(null);
   }

   async function start(payload) {
      resetState();

      try {
         setFetching(true);
         const response = await analyze(payload);

         if (response?.code) {
            dispatch(setErrorMessage('Kunne ikke kjøre DOK-analyse. En feil har oppstått.'));
            console.error(response.code);
         } else {
            const { inputGeometry, resultList } = response;
            const grouped = groupBy(resultList, result => result.resultStatus);

            setData({ inputGeometry, resultList: grouped });
         }
      } catch (error) {
         dispatch(setErrorMessage('Kunne ikke kjøre DOK-analyse. En feil har oppstått.'));
         console.error(error);
      } finally {
         setFetching(false);
      }
   }

   return (
      <div className={styles.app}>
         <div className={styles.heading}>
            <img src={logo} alt="Kartverket logo" />
            <h1>Arealanalyse av DOK-datasett - Demonstrator</h1>
            <a href="https://dok-arealanalyse-api.azurewebsites.net/" target="_blank" rel="noopener noreferrer" className={styles.apiLink}>API</a>
         </div>

         <div className={styles.content}>
            <Form onSubmit={start} />
            {
               fetching && <LinearProgress />
            }
            {
               data !== null && <ResultList data={data} />
            }
            <Toaster />
         </div>
      </div>
   );
}
