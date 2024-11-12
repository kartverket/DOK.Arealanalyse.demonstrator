import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorMessage } from 'store/slices/appSlice';
import { analyze } from 'utils/api';
import groupBy from 'lodash.groupby';
import { LinearProgress } from '@mui/material';
import { Form, ResultDialog, ResultList } from 'features';
import { Toaster } from 'components';
import useSocketIO from 'hooks/useSocketIO';
import messageHandlers from 'config/messageHandlers';
import logo from 'assets/gfx/logo-kartverket.svg';
import styles from './App.module.scss';

export default function App() {
    useSocketIO(messageHandlers);
    const [data, setData] = useState(null);
    const [fetching, setFetching] = useState(false);
    const dispatch = useDispatch();
    const correlationId = useSelector(state => state.app.correlationId);

    function resetState() {
        setData(null);
    }

    async function start(payload) {
        resetState();

        try {
            setFetching(true);
            const response = await analyze(payload, correlationId);

            if (response?.code) {
                dispatch(setErrorMessage('Kunne ikke kjøre DOK-analyse. En feil har oppstått.'));
                console.error(response.code);
            } else {
                const { resultList } = response;
                const grouped = groupBy(resultList, result => result.resultStatus);

                setData({ ...response, resultList: grouped });
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
                {
                    data !== null && <ResultDialog inputGeometry={data.inputGeometry} />
                }
                <Toaster />
            </div>
        </div>
    );
}
