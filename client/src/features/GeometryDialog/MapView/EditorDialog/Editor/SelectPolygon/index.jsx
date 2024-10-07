import { useEffect, useState } from 'react';
import { Select } from 'ol/interaction';
import { getInteraction, getLayer } from 'utils/map';
import { setFeaturesSelected } from 'store/slices/mapSlice';
import store from 'store';
import styles from '../Editor.module.scss';

export default function SelectPolygon({ map, active, onClick }) {
   const name = SelectPolygon.interactionName;
   const [_active, setActive] = useState(false);

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
         className={`${styles.select} ${_active ? styles.active : ''}`}
         onClick={toggle}
         title="Velg polygon"
      ></button>
   );
}

SelectPolygon.interactionName = 'selectPolygon';

SelectPolygon.addInteraction = map => {
   if (getInteraction(map, SelectPolygon.interactionName) !== null) {
      return;
   }

   const vectorLayer = getLayer(map, 'features');

   const interaction = new Select({
      layers: [vectorLayer]
   });

   interaction.on('select', event => {
      store.dispatch(setFeaturesSelected(event.selected.length > 0));
   });

   interaction.set('_name', SelectPolygon.interactionName);
   interaction.setActive(false);

   map.addInteraction(interaction);
};