import styles from './Editor.module.scss';

export default function Editor() {
   return (
      <div className={styles.editor}>
         <button className={styles.select} title="Velg"></button>
         <button className={styles.polygon} title="Polygon"></button>
         <button className={styles.polygonHole} title="Polygon med hull"></button>
         <div className={styles.separator}></div>
         <button className={styles.delete} title="Slett"></button>
         <div className={styles.separator}></div>
         <button className={styles.undo} title="Angre"></button>         
         <button className={styles.redo} title="Gjør om"></button>
      </div>
   );
}
