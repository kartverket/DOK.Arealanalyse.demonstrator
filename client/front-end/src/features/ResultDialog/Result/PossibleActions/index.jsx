import { Alert } from '@mui/material';
import styles from './PossibleActions.module.scss';

export default function PossibleActions({ result }) {
    function renderPossibleActions() {
        switch (result.resultStatus) {
            case 'NO-HIT-GREEN':
                return <Alert icon={false} severity="success">Ingen tiltak trenger å utføres</Alert>
            case 'NO-HIT-YELLOW':
                return result.qualityWarning.length > 0 ?
                        <div className={styles.content}>
                        <h3>Mulige tiltak</h3>
                        <ul className={styles.possibleActionsList}>
                            {
                                result.qualityWarning.map(warning => <li key={warning}>{warning}</li>)
                            }
                        </ul>
                        </div>
                   :
                    null
            case 'HIT-YELLOW':
                return (                    
                         <div className={styles.content}>
                        <h3>Mulige tiltak</h3>
                        <ul className={styles.possibleActionsList}>
                            {
                                result.possibleActions.map(action => <li key={action}>{action}</li>)
                            }
                        </ul>
                        </div>
                   
                );
            case 'HIT-RED':
                return (                   
                         <div className={styles.content}>
                        <h3>Mulige tiltak</h3>
                        <ul className={styles.possibleActionsList}>
                            {
                                result.possibleActions.map(action => <li key={action}>{action}</li>)
                            }
                        </ul>
                        </div>                    
                );
            default:
                return null;
        }
    }

    if (!Array.isArray(result.possibleActions) || result.possibleActions.length === 0) {
        return null;
    }

    return (
        <div className="section">
            {renderPossibleActions()}
        </div>
    );
}