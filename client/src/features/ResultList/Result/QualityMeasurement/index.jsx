import { useCollapse } from 'react-collapsed';
import styles from './QualityMeasurement.module.scss';

export default function QualityMeasurement({ result }) {
   const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

   if (!result.qualityMeasurement?.length) {
      return null;
   }

   return (
      <div className={`expandable ${isExpanded ? 'expanded' : ''}`}>
         <div className="trigger" role="button" {...getToggleProps()}>
            Kvalitetsinformasjon
         </div>

         <section {...getCollapseProps()}>
            <ul className={styles.ul}>
               {
                  result.qualityMeasurement.map(measurement => {
                     return (
                        <li key={measurement.qualityDimension} className={styles.measurement}>
                           <span className={styles.dimension}>{measurement.qualityDimension}:</span>
                           <span>{measurement.value}</span>
                           <span>({measurement.comment})</span>
                        </li>
                     )
                  })
               }
            </ul>
         </section>
      </div>
   );
}