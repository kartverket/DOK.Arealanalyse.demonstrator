import { useDispatch, useSelector } from 'react-redux';
import { setSelectedResult } from 'store/slices/appSlice';
import { getDistance, getHitAreaPercent, getResultClassNames, getResultTitle } from 'features/ResultList/helpers';
import { Button, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import Result from './Result';
import styles from './ResultDialog.module.scss';

export default function ResultDialog({ inputGeometry }) {
    const result = useSelector(state => state.app.selectedResult);
    const dispatch = useDispatch();

    function handleClose(event, reason) {
        if (reason && reason === 'backdropClick') {
            return;
        }

        dispatch(setSelectedResult(null));
    }

    function handleOk() {
        dispatch(setSelectedResult(null));
    }

    function renderHitAreaOrDistance() {
        if (result.hitArea !== null && result.hitArea !== 0) {
            return (
                <span>
                    Treff: <strong>{getHitAreaPercent(result)}</strong>
                </span>
            );
        } else if (result.distanceToObject !== 0) {
            return (
                <span>
                    Avstand: <strong>{getDistance(result)}</strong>
                </span>
            );
        }

        return null;
    }

    function renderDialogTitle() {
        return (
            <div className={styles.dialogTitle}>
                <div>
                    <span className={`${styles.resultTitle} ${getResultClassNames(result, styles)}`}>
                        <strong className={styles.themeName}>{result.themes[0]}:</strong>
                        <span> {getResultTitle(result)}</span>
                    </span>  
                    {renderHitAreaOrDistance()}                  
                </div>

                <IconButton onClick={handleClose}>
                    <Close />
                </IconButton>
            </div>
        );
    }

    if (result === null) {
        return null;
    }

    return (
        <Dialog
            open={true}
            onClose={handleClose}
            sx={{
                '& .MuiDialog-container': {
                    '& > .MuiPaper-root': {
                        minWidth: '1600px',
                        maxWidth: '1600px',
                    },
                }
            }}
        >
            {renderDialogTitle()}

            <DialogContent>
                <div className={styles.dialogContent}>
                    <Result
                        inputGeometry={inputGeometry}
                        result={result}
                    />
                </div>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleOk}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}