import { useMemo } from 'react';
import { prettyPrintJson } from 'pretty-print-json';
import { getCrsName, getEpsgCode } from 'utils/helpers';
import styles from './GeoJson.module.scss';

export default function GeoJson({ data }) {
   const json = useMemo(() => prettyPrintJson.toHtml(data, { quoteKeys: true, trailingCommas: false }), [data]);

   function renderCrs() {
      const epsg = getEpsgCode(getCrsName(data));
      const crs = epsg !== null ? `EPSG:${epsg}` : 'WGS84';

      return (
         <div className={styles.epsg}>
            <strong>CRS:</strong> {crs}
         </div>
      );
   }

   return (
      <div className={styles.geoJsonContainer}>
         <div className={styles.geoJsonWrapper}>
            <div className={styles.geoJson}>
               <output dangerouslySetInnerHTML={{ __html: json }}></output>
            </div>
         </div>

         {renderCrs()}
      </div>
   );
}