import { useState } from 'react';
import DeletePolygon from './DeletePolygon';
import DrawHole from './DrawPolygonHole';
import DrawPolygon from './DrawPolygon';
import ModifyPolygon from './ModifyPolygon';
import SelectPolygon from './SelectPolygon';
import UndoRedo from './UndoRedo';
import styles from './Editor.module.scss';

export default function Editor({ map }) {
   const [active, setActive] = useState('selectPolygon');

   function handleClick(name) {
      setActive(name);
   }

   if (map === null) {
      return null;
   }

   return (
      <div className={styles.editor}>
         <SelectPolygon map={map} active={active} onClick={handleClick} />
         <DrawPolygon map={map} active={active} onClick={handleClick} />
         <DrawHole map={map} active={active} onClick={handleClick} />
         <ModifyPolygon map={map} active={active} onClick={handleClick} />
         <div className={styles.separator}></div>
         <DeletePolygon map={map} />
         <div className={styles.separator}></div>
         <UndoRedo map={map} />
      </div>
   );
}
