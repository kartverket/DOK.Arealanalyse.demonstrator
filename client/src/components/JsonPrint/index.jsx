import { useEffect, useRef, useState } from 'react';
import { getHtmlString } from './helpers';
import './JsonPrint.scss';

export default function JsonPrint({ data }) {
   const [htmlString, setHtmlString] = useState(null);
   const jsonPrintRef = useRef(null);

   useEffect(
      () => {
         const htmlStr = getHtmlString(data);
         setHtmlString(htmlStr);
      },
      [data]
   );

   if (!data) {
      return null;
   }

   return (
      <div className="json-print-container-wrapper">
         <div className="json-print-container">
            <div className="json-print">
               <code ref={jsonPrintRef}>
                  <pre dangerouslySetInnerHTML={{ __html: htmlString }}></pre>
               </code>
            </div>
         </div>
      </div>
   );
}