import { useDispatch, useSelector } from 'react-redux';
import { setFeaturesSelected } from 'store/slices/mapSlice';
import { getInteraction } from '../helpers';
import { getLayer } from 'utils/map';
import Delete from 'ol-ext/interaction/Delete';
import SelectPolygon from '../SelectPolygon';
import styles from '../Editor.module.scss';

export default function DeletePolygon({ map }) {
   const name = DeletePolygon.interactionName;
   const dispatch = useDispatch();
   const featuresSelected = useSelector(state => state.map.editor.featuresSelected);

   function _delete() {
      const interaction = getInteraction(map, name);
      const selectInteraction = getInteraction(map, SelectPolygon.interactionName);

      interaction.delete(selectInteraction.getFeatures());
      dispatch(setFeaturesSelected(false));
   }

   return (
      <button className={styles.delete} onClick={_delete} disabled={!featuresSelected} title="Slett polygon"></button>
   );
}

DeletePolygon.interactionName = 'deletePolygon';

DeletePolygon.addInteraction = map => {
   if (getInteraction(map, DeletePolygon.interactionName) !== null) {
      return;
   }

   const vectorLayer = getLayer(map, 'features');

   const interaction = new Delete({
      source: vectorLayer.getSource()
   });

   interaction.set('_name', DeletePolygon.interactionName);
   interaction.setActive(false);

   map.addInteraction(interaction);
};