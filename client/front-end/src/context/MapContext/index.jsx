import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { fetchWmtsOptions } from 'utils/baseMap';
import { createMapImage as _createMapImage } from 'utils/map';

export default function MapProvider({ children }) {
   const [wmtsOptions, setWmtsOptions] = useState(null);
   const initRef = useRef(true);
   const mapImagesRef = useRef(new Map());

   useEffect(
      () => {
         if (!initRef.current) {
            return;
         }

         initRef.current = false;

         (async () => {
            const options = await fetchWmtsOptions();
            setWmtsOptions(options);
         })();
      },
      []
   );

   async function createMapImage(inputGeometry, result) {
      const mapImages = mapImagesRef.current;
      
      if (mapImages.has(result._tempId)) {
         return mapImages.get(result._tempId);
      }
      
      const base64 = await _createMapImage(inputGeometry, result, wmtsOptions);
      mapImages.set(result._tempId, base64);

      return base64;
   }

   function clearCache() {
      mapImagesRef.current.clear();
   }

   return (
      <MapContext.Provider value={{ wmtsOptions, createMapImage, clearCache }}>
         {children}
      </MapContext.Provider>
   );
}

export const MapContext = createContext({});
export const useMap = () => useContext(MapContext);