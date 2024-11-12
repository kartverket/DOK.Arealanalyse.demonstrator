export default function GuidanceText({ result }) {
   if (!result.guidanceText) {
      return null;
   }
   
   return (
      <div className="paper">
         <h3>Veiledningstekst</h3>
         <p>{result.guidanceText}</p>
      </div>
   );
}