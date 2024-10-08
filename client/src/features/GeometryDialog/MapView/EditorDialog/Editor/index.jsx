import { useState } from 'react';
import DeletePolygon from './DeletePolygon';
import DrawHole from './DrawPolygonHole';
import DrawPolygon from './DrawPolygon';
import ModifyPolygon from './ModifyPolygon';
import SelectPolygon from './SelectPolygon';
import UndoRedo from './UndoRedo';
import truncate from '@turf/truncate';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { getLayer, writeGeometryObject } from 'utils/map';
import styles from './Editor.module.scss';


export default function Editor({ map }) {
   const [active, setActive] = useState('selectPolygon');

   function handleClick(name) {
      setActive(name);
   }

   function clearAll() {
      const vectorLayer = getLayer(map, 'features');
      const vectorSource = vectorLayer.getSource();
      const features = vectorSource.getFeatures();

      if (features.length > 0) {
         vectorSource.clear();
      }
   }

   function save() {
      const vectorLayer = getLayer(map, 'features');
      const vectorSource = vectorLayer.getSource();
      const features = vectorSource.getFeatures();

      if (features.length === 0) {
         return;
      }

      const geometryObject = writeGeometryObject(features[0].getGeometry());
      const truncated = truncate(geometryObject, { precision: 6 });
      const json = JSON.stringify(truncated, null, 3);

      const blob = new Blob([json], { type: 'application/geo+json;charset=utf-8' });
      const fileName = `analyseområde-${dayjs().format('YYYYMMDDHHmmss')}.geojson`;

      saveAs(blob, fileName);
   }

   if (map === null) {
      return null;
   }

   return (
      <div className={styles.editor}>
         <SelectPolygon map={map} active={active} onClick={handleClick} />
         <DrawPolygon map={map} active={active} onClick={handleClick} />
         <DrawHole map={map} active={active} onClick={handleClick} />
         <ModifyPolygon map={map} active={active} onClick={handleClick} />
         <div className={styles.separator}></div>
         <button onClick={clearAll} className={styles.clearAll} title="Start på nytt" />
         <button onClick={save} className={styles.save} title="Lagre til disk" />
         <DeletePolygon map={map} />
         <div className={styles.separator}></div>
         <UndoRedo map={map} />
      </div>
   );
}
