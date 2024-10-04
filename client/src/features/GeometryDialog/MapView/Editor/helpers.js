import { Draw, Select } from 'ol/interaction';
import Delete from 'ol-ext/interaction/Delete';
import DrawHole from 'ol-ext/interaction/DrawHole';
import ModifyFeature from 'ol-ext/interaction/ModifyFeature';
import { getLayer } from 'utils/map';

export function addInteractions(map) {
   if (map === null) {
      return;
   }

   const vectorLayer = getLayer(map, 'features');

   const selectPolygon = new Select({
      layers: [vectorLayer]
   });

   const modifyPolygon = new ModifyFeature({
      source: vectorLayer.getSource()
   });

   const drawPolygon = new Draw({
      source: vectorLayer.getSource(),
      type: 'Polygon'
   });

   const drawHole = new DrawHole({
      layers: [vectorLayer]
   });

   const deletePolygon = new Delete({
      source: vectorLayer.getSource()
   });

   selectPolygon.set('_name', 'selectPolygon');
   selectPolygon.setActive(false);

   modifyPolygon.set('_name', 'modifyPolygon');
   modifyPolygon.setActive(false);

   drawPolygon.set('_name', 'drawPolygon');
   drawPolygon.setActive(false);

   drawHole.set('_name', 'drawPolygonHole');
   drawHole.setActive(false);
   
   deletePolygon.set('_name', 'deletePolygon');
   deletePolygon.setActive(false);

   map.addInteraction(selectPolygon);
   map.addInteraction(modifyPolygon);
   map.addInteraction(drawPolygon);
   map.addInteraction(drawHole);
   map.addInteraction(deletePolygon);

}

export function getInteraction(map, name) {
   return map
      .getInteractions()
      .getArray()
      .find(interaction => interaction.get('_name') === name) || null;
}