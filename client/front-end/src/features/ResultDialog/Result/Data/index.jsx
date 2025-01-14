import { prettyPrintJson } from 'pretty-print-json';
import styles from './Data.module.scss';

export default function Data({ result }) {
   if (!result.data) {
      return null;
   }

   const json = prettyPrintJson.toHtml(result.data, { quoteKeys: true, trailingCommas: false });

   return (
      <div className={`paper ${styles.paper}`}>
         <h3>Data</h3>
         <div className={`data ${styles.data}`}>
            <output className="json-container" dangerouslySetInnerHTML={{ __html: json }}></output>
         </div>
      </div>
   );
}