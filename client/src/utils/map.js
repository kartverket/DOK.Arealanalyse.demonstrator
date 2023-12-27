import { Feature, Map, View } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer } from 'ol/layer';
import { defaults as defaultControls, FullScreen } from 'ol/control';
import { defaults as defaultInteractions, DragRotateAndZoom } from 'ol/interaction';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import { isUndefined } from 'lodash';
import { getEpsgCode } from './helpers';
import baseMap from 'config/baseMap.config';

const MAP_WIDTH = 640;
const MAP_HEIGHT = 480;

export async function createMap(inputGeometry, result) {
   const featuresLayer = createFeaturesLayer(inputGeometry, result);

   featuresLayer.set('id', 'features');

   const map = new Map({
      controls: defaultControls().extend([new FullScreen()]),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      layers: [
         createBaseMapLayer(),
         createWmsLayer(result.rasterResult),
         featuresLayer
      ]
   });

   map.setView(new View({
      padding: [50, 50, 50, 50],
      projection: getProjection(inputGeometry)
   }));

   return map;
}

export async function getMapImage(inputGeometry, result) {
   return new Promise((resolve) => {
      const [map, mapElement] = createTempMap(inputGeometry, result);

      map.once('rendercomplete', () => {
         const base64 = exportToPngImage(map);
         map.dispose();
         mapElement.remove();

         resolve(base64);
      })
   });
}

export function getLayer(map, id) {
   return map.getLayers().getArray()
      .find(layer => layer.get('id') === id);
}

function createTempMap(inputGeometry, result) {
   const featuresLayer = createFeaturesLayer(inputGeometry, result);

   const map = new Map({
      layers: [
         createBaseMapLayer(),
         createWmsLayer(result.rasterResult),
         featuresLayer
      ]
   });

   map.setView(new View({
      padding: [50, 50, 50, 50],
      projection: getProjection(inputGeometry)
   }));

   const mapElement = document.createElement('div');
   Object.assign(mapElement.style, { position: 'absolute', top: '-9999px', left: '-9999px', width: `${MAP_WIDTH}px`, height: `${MAP_HEIGHT}px` });
   document.getElementsByTagName('body')[0].appendChild(mapElement);

   map.setTarget(mapElement);

   const extent = featuresLayer.getSource().getExtent();
   map.getView().fit(extent, map.getSize());

   return [map, mapElement];
}

function createFeaturesLayer(inputGeometry, result) {
   const source = new VectorSource();

   if (result.buffer > 0) {
      source.addFeature(createFeature(result.runOnInputGeometry));
   }

   source.addFeature(createFeature(inputGeometry));

   return new VectorLayer({ source });
}

function createFeature(geoJson) {
   const reader = new GeoJSON();
   const geometry = reader.readGeometry(geoJson);
   const feature = new Feature(geometry);

   feature.setStyle(new Style({
      stroke: new Stroke({
         color: '#d33333',
         lineDash: [8, 8],
         width: 2
      })
   }));

   return feature;
}

function createBaseMapLayer() {
   return new TileLayer({
      source: new TileWMS({
         url: baseMap.wmsUrl,
         params: {
            LAYERS: baseMap.layer,
            VERSION: '1.1.1',
         },
         crossOrigin: 'anonymous'
      }),
      maxZoom: baseMap.maxZoom
   });
}

function createWmsLayer(url) {
   return new TileLayer({
      source: new TileWMS({
         url,
         crossOrigin: 'anonymous'
      })
   });
}

function getProjection(geometry) {
   const crsName = geometry?.crs?.properties?.name;
   let epsgCode = 4326;

   if (!isUndefined(crsName)) {
      epsgCode = getEpsgCode(crsName) || 4326;
   }

   return `EPSG:${epsgCode}`;
}

function exportToPngImage(map) {
   const mapCanvas = document.createElement('canvas');
   const size = map.getSize();

   mapCanvas.width = size[0];
   mapCanvas.height = size[1];
   const mapContext = mapCanvas.getContext('2d');
   const canvases = map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer');

   canvases.forEach(canvas => {
      if (canvas.width === 0) {
         return;
      }

      const opacity = canvas.parentNode.style.opacity || canvas.style.opacity;
      mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
      const transform = canvas.style.transform;
      let matrix;

      if (transform) {
         matrix = transform
            .match(/^matrix\(([^(]*)\)$/)[1]
            .split(',')
            .map(Number);
      } else {
         matrix = [parseFloat(canvas.style.width) / canvas.width, 0, 0, parseFloat(canvas.style.height) / canvas.height, 0, 0];
      }

      CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
      const backgroundColor = canvas.parentNode.style.backgroundColor;

      if (backgroundColor) {
         mapContext.fillStyle = backgroundColor;
         mapContext.fillRect(0, 0, canvas.width, canvas.height);
      }

      mapContext.drawImage(canvas, 0, 0);
   });

   mapContext.globalAlpha = 1;
   mapContext.setTransform(1, 0, 0, 1, 0, 0);

   return mapCanvas.toDataURL();
}
