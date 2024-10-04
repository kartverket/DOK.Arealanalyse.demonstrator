import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getInteraction } from '../helpers';
import styles from '../Editor.module.scss';

export default function DrawPolygon({ map, active, onClick }) {
   const name = 'drawPolygon';
   const [_active, setActive] = useState(false);
   const featuresSelected = useSelector(state => state.app.featuresSelected);

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
         className={`${styles.polygon} ${_active ? styles.active : ''}`}
         onClick={toggle}
         disabled={featuresSelected}
         title="Legg til polygon"
      ></button>
   );
}