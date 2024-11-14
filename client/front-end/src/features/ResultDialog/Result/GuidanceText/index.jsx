import styles from '../Result.module.scss'
import { Alert } from '@mui/material';
export default function GuidanceText({ result }) {
   function renderPossibleActions() {
      switch (result.resultStatus) {
          case 'NO-HIT-GREEN':
              return <Alert icon={false} severity="success">Ingen tiltak trenger å utføres</Alert>
          case 'NO-HIT-YELLOW':
              return result.qualityWarning.length > 0 ?
                  <Alert icon={false} severity="warning">
                      <div className={styles.content}>                      
                      {result.guidanceText}
                      </div>
                  </Alert> :
                  null
          case 'HIT-YELLOW':
              return (
                  <Alert icon={false} severity="warning">
                       <div className={styles.content}>                      
                      {result.guidanceText}
                      </div>
                  </Alert>
              );
          case 'HIT-RED':
              return (
                  <Alert icon={false} severity="error">
                       <div className={styles.content}>                      
                      {result.guidanceText}
                      </div>
                  </Alert>
              );
          default:
              return null;
      }
  }
   if (!result.guidanceText) {
      return null;
   }
   
   return (
      <div className='section'>
      <div className={styles.content}>                    
         {renderPossibleActions()}
      </div>
      </div>
   );
}