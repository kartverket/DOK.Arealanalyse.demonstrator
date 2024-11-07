import { Alert } from '@mui/material';
import styles from './PossibleActions.module.scss';

export default function PossibleActions({ result }) {
    function renderPossibleActions() {
        switch (result.resultStatus) {
            case 'NO-HIT-GREEN':
                return <Alert icon={false} severity="success">Ingen tiltak trenger å utføres</Alert>
            case 'NO-HIT-YELLOW':
                return <Alert icon={false} severity="warning">Det finnes ikke dekning i området og ytterligere kartlegging bør vurderes</Alert>
            case 'HIT-YELLOW':
                return (
                    <Alert icon={false} severity="warning">
                        <ul className={styles.possibleActionsList}>
                            {
                                result.possibleActions.map(action => <li key={action}>{action}</li>)
                            }
                        </ul>
                    </Alert>
                );
            case 'HIT-RED':
                return (
                    <Alert icon={false} severity="error">
                        <ul className={styles.possibleActionsList}>
                            {
                                result.possibleActions.map(action => <li key={action}>{action}</li>)
                            }
                        </ul>
                    </Alert>
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