import TileLayer from 'ol/layer/Tile';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import { WMTSCapabilities } from 'ol/format';
import { get } from 'ol/proj';
import axios from 'axios';
import baseMap from 'config/baseMap.config';

export async function createBaseMapLayer(wmtsOptions) {
   const tileLayer = new TileLayer({
      source: new WMTS(wmtsOptions),
      maxZoom: baseMap.maxZoom
   });

   return tileLayer;
}

export async function fetchWmtsOptions() {
   let response;

   try {
      response = await axios.get(baseMap.wmtsUrl, { timeout: 10000 });
   } catch {
      return null;
   }

   const capabilities = new WMTSCapabilities().read(response.data);

   const options = optionsFromCapabilities(capabilities, {
      layer: baseMap.layer,
      projection: get('EPSG:3857'),
      matrixSet: 'EPSG:3857'
   });

   const wmtsOptions = { 
      ...options, 
      crossOrigin: 'anonymous' 
   };

   return wmtsOptions;
}