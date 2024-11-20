import { useCollapse } from 'react-collapsed';
import styles from './AboutDataset.module.scss';
import dayjs from 'dayjs';

export default function AboutDataset({ result }) {
   const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

   return (
      <div className={`expandable ${isExpanded ? 'expanded' : ''}`}>
         <div className="trigger" role="button" {...getToggleProps()}>
            Om datasettet
         </div>

         <section {...getCollapseProps()}>
            <ul className={styles.ul}>
               <li>
                  Beskrivelse: <a href={result.runOnDataset.datasetDescriptionUri} target="_blank" rel="noreferrer">{result.runOnDataset.title}</a>
               </li>
               <li>
                  Oppdatert: {dayjs(result.runOnDataset.updated).format('DD.MM.YYYY')}
               </li>
               <li>
                  Eier: {result.runOnDataset.owner}
               </li>               
            </ul>
         </section>
      </div>
   );
}