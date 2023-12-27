
export default function GuidanceLinks({ result }) {
   if (!result.guidanceUri?.length) {
      return null;
   }
   
   return (
      <div className="paper">
         <h3>Veiledningslenker</h3>
         <ul>
            {
               result.guidanceUri.map(uri => {
                  return (
                     <li key={uri.href}>
                        <a href={uri.href} target="_blank" rel="noreferrer">{uri.title}</a>
                     </li>
                  )
               })
            }
         </ul>
      </div>
   );
}