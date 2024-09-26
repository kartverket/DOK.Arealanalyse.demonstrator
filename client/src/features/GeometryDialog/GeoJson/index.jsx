import { JsonPrint } from 'components';
import { getCrsName, getEpsgCode } from 'utils/helpers';
import styles from './GeoJson.module.scss';

export default function GeoJson({ data }) {
   function renderCrs() {
      const epsg = getEpsgCode(getCrsName(data));
      const crs = epsg !== null ? `EPSG:${epsg}` : 'WGS84';

      return (
         <div className={styles.epsg}>
            <strong>CRS:</strong> {crs}
         </div>
      )
   }

   return (
      <div className={styles.geoJsonContainer}>
         <div className={styles.geoJsonWrapper}>
            <div className={styles.geoJson}>
               <JsonPrint data={data} />
            </div>
         </div>

         {renderCrs()}
      </div>
   );
}