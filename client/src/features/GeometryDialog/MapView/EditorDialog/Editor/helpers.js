import DrawPolygon from './DrawPolygon';
import DrawPolygonHole from './DrawPolygonHole';
import ModifyPolygon from './ModifyPolygon';
import SelectPolygon from './SelectPolygon';
import DeletePolygon from './DeletePolygon';
import UndoRedo from './UndoRedo';

export function addInteractions(map) {
   SelectPolygon.addInteraction(map);
   DrawPolygon.addInteraction(map);
   DrawPolygonHole.addInteraction(map);
   ModifyPolygon.addInteraction(map);
   DeletePolygon.addInteraction(map);
   UndoRedo.addInteraction(map);
}
