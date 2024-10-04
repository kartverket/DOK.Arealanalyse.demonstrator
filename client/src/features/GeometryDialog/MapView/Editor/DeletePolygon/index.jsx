import { getInteraction } from '../helpers';
import styles from '../Editor.module.scss';
import { useDispatch } from 'react-redux';
import { setFeaturesSelected } from 'store/slices/appSlice';

export default function DeletePolygon({ map }) {
   const name = 'deletePolygon';
   const dispatch = useDispatch();

   function toggle() {
      const interaction = getInteraction(map, name);
      const selectInteraction = getInteraction(map, 'selectPolygon');

      interaction.delete(selectInteraction.getFeatures());
      dispatch(setFeaturesSelected(false));
   }

   return (
      <button className={styles.delete} onClick={toggle} title="Slett polygon"></button>
   );
}