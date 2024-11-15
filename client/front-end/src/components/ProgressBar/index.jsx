import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LinearProgress } from '@mui/material';
import styles from './ProgressBar.module.scss';

export default function ProgressBar() {
    const count = useSelector(state => state.dataset.count);
    const analyzed = useSelector(state => state.dataset.analyzed);
    const progress = useMemo(() => count !== 0 ? Math.round((analyzed.length / count) * 100) : 0, [count, analyzed]);

    return (
        <div className={styles.progressBar}>
            <LinearProgress variant="determinate" value={progress} sx={{ flex: 1 }} />
            <span className={styles.percent}>{progress} %</span>
        </div>
    );
}