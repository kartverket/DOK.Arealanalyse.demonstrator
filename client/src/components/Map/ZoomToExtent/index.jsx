import { getLayer } from 'utils/map';
import styles from './ZoomToExtent.module.scss';

export default function ZoomToExtent({ map, layerName }) {
   function zoomToExtent() {
      const vectorLayer = getLayer(map, layerName);
      const extent = vectorLayer.getSource().getExtent();
      const view = map.getView();

      view.fit(extent, map.getSize());
   }

   return (
      <button className={styles.button} onClick={zoomToExtent} title="Zoom til kartets utstrekning"></button>
   );
}