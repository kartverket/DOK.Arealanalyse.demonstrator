import { useEffect, useRef, useState } from 'react';
import { getLayer } from 'utils/map';
import DrawPolygon from './DrawPolygon';
import DrawHole from './DrawPolygonHole';
import styles from './Editor.module.scss';
import ModifyPolygon from './ModifyPolygon';
import DeletePolygon from './DeletePolygon';
import { getInteraction } from './helpers';
import { useDispatch } from 'react-redux';
import { setFeaturesSelected } from 'store/slices/appSlice';

export default function Editor({ map }) {
   const [active, setActive] = useState(null);
   const [editMode, setEditMode] = useState(false);
   const selectInteractionRef = useRef(false);
   const dispatch = useDispatch();

   useEffect(
      () => {
         if (map === null) {
            return;
         }

         const selectInteraction = getInteraction(map, 'selectPolygon');

         selectInteraction.on('select', event => {
            dispatch(setFeaturesSelected(event.selected.length > 0));
         });

         selectInteractionRef.current = selectInteraction;

         return () => {

         }
      },
      [map]
   );

   function switchStyle() {
      const vectorLayer = getLayer(map, 'features');
      const currentStyle = vectorLayer.getStyleFunction();

      vectorLayer.setStyle(vectorLayer.get('_savedStyle'));
      vectorLayer.set('_savedStyle', currentStyle);
   }

   function edit() {
      const _editMode = !editMode;
      const selectInteraction = getInteraction(map, 'selectPolygon');

      setActive(null);
      switchStyle();

      selectInteraction.setActive(_editMode);      
      setEditMode(_editMode);
      //selectInteraction.setActive(_editMode);
   }

   function handleClick(name) {
      setActive(name);

      const selectInteraction = getInteraction(map, 'selectPolygon');
      selectInteraction.setActive(name === null);
   }

   if (map === null) {
      return null;
   }

   return (
      <div className={`${styles.editor} ${editMode ? styles.editMode : ''}`}>
         <button className={`${styles.edit} ${editMode ? styles.active : ''}`} onClick={edit} title="Rediger analyseområde"></button>
         <DrawPolygon map={map} active={active} onClick={handleClick} />
         <DrawHole map={map} active={active} onClick={handleClick} />
         <ModifyPolygon map={map} active={active} onClick={handleClick} />
         <div className={styles.separator}></div>
         <DeletePolygon map={map} onClick={handleClick} />
         <div className={styles.separator}></div>
         <button className={styles.undo} title="Angre"></button>
         <button className={styles.redo} title="Gjør om"></button>
      </div>
   );
}
