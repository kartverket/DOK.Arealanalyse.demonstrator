import { prettyPrintJson } from 'pretty-print-json';

export default function Data({ result }) {
   if (!result.data) {
      return null;
   }

   const json = prettyPrintJson.toHtml(result.data, { quoteKeys: true, trailingCommas: false });

   return (
      <div className="paper">
         <h3>Data</h3>
         <div className="data">
            <output className="json-container" dangerouslySetInnerHTML={{ __html: json }}></output>
         </div>
      </div>
   );
}