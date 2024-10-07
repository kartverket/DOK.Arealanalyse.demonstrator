import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getInteraction, getLayer } from 'utils/map';
import ModifyFeature from 'ol-ext/interaction/ModifyFeature';
import styles from '../Editor.module.scss';

export default function ModifyPolygon({ map, active, onClick }) {
   const name = ModifyPolygon.interactionName;
   const [_active, setActive] = useState(false);
   const featuresSelected = useSelector(state => state.map.editor.featuresSelected);

   useEffect(
      () => {
         const interaction = getInteraction(map, name);

         interaction.setActive(active === name);
         setActive(active === name);
      },
      [map, name, active]
   );

   function toggle() {
      onClick(!_active ? name : null);
   }

   return (
      <button
         className={`${styles.modify} ${_active ? styles.active : ''}`}
         onClick={toggle}
         title="Endre polygon"
         disabled={featuresSelected}
      ></button>
   );
}

ModifyPolygon.interactionName = 'modifyPolygon';

ModifyPolygon.addInteraction = map => {
   if (getInteraction(map, ModifyPolygon.interactionName) !== null) {
      return;
   }

   const vectorLayer = getLayer(map, 'features');

   const interaction = new ModifyFeature({
      source: vectorLayer.getSource()
   });

   interaction.set('_name', ModifyPolygon.interactionName);
   interaction.setActive(false);

   map.addInteraction(interaction);
};