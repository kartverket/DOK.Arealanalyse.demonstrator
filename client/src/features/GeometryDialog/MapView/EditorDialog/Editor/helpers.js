import DrawPolygon from './DrawPolygon';
import DrawPolygonHole from './DrawPolygonHole';
import ModifyPolygon from './ModifyPolygon';
import SelectPolygon from './SelectPolygon';
import DeletePolygon from './DeletePolygon';
import UndoRedo from './UndoRedo';

export function addInteractions(map) {
   if (map === null) {
      return;
   }

   SelectPolygon.addInteraction(map);
   DrawPolygon.addInteraction(map);
   DrawPolygonHole.addInteraction(map);
   ModifyPolygon.addInteraction(map);
   DeletePolygon.addInteraction(map);
   UndoRedo.addInteraction(map);

   //addPointerMoveEvent(map);
}

export function getInteraction(map, name) {
   return map
      .getInteractions()
      .getArray()
      .find(interaction => interaction.get('_name') === name) || null;
}

function addPointerMoveEvent(map) {
   let selected = null;

   map.on('pointermove', event => {

      if (selected !== null) {
         document.body.style.cursor = 'default';
      }

      map.forEachFeatureAtPixel(event.pixel, () => {
         document.body.style.cursor = 'pointer';
         return true;
      });
   });
}
