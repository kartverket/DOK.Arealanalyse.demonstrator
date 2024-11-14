import styles from '../Result.module.scss'
export default function GuidanceText({ result }) {
   if (!result.guidanceText) {
      return null;
   }
   
   return (
      <div className='section'>
      <div className="paper">
         <h3>Veiledningstekst</h3>  
         <p>{result.guidanceText}</p>
      </div>
      </div>
   );
}