import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getInteraction } from '../helpers';
import { Draw } from 'ol/interaction';
import { getLayer } from 'utils/map';
import GeoJSON from 'ol/format/GeoJSON';
import union from '@turf/union';
import styles from '../Editor.module.scss';

const GEOJSON_OPTIONS = { 
   dataProjection: 'EPSG:4326', 
   featureProjection: 'EPSG:3857' 
};

export default function DrawPolygon({ map, active, onClick }) {
   const name = DrawPolygon.interactionName;
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
         className={`${styles.polygon} ${_active ? styles.active : ''}`}
         onClick={toggle}
         disabled={featuresSelected}
         title="Legg til polygon"
      ></button>
   );
}

DrawPolygon.interactionName = 'drawPolygon';

DrawPolygon.addInteraction = map => {
   if (getInteraction(map, DrawPolygon.interactionName) !== null) {
      return;
   }

   const vectorLayer = getLayer(map, 'features');

   const interaction = new Draw({
      type: 'Polygon'
   });

   interaction.on('drawend', event => {
      const source = vectorLayer.getSource();
      const features = source.getFeatures();
      let newFeature;

      if (features.length === 0) {
         newFeature = event.feature;
      } else {
         const geoJson = new GeoJSON();
         const featureCollection = geoJson.writeFeaturesObject(features, GEOJSON_OPTIONS);
         const feature = geoJson.writeFeatureObject(event.feature, GEOJSON_OPTIONS);
         
         featureCollection.features.push(feature);
         const unionized = union(featureCollection);
         newFeature = geoJson.readFeature(unionized, GEOJSON_OPTIONS);
      }

      source.clear();
      source.addFeature(newFeature);
   });

   interaction.set('_name', DrawPolygon.interactionName);
   interaction.setActive(false);

   map.addInteraction(interaction);
};