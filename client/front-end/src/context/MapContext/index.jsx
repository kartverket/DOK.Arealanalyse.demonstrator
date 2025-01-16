import { createContext, useContext, useRef } from 'react';
import { createMapImage as _createMapImage } from 'utils/map';

export default function MapProvider({ children }) {
   const mapImagesRef = useRef(new Map());

   async function createMapImage(inputGeometry, result) {
      const mapImages = mapImagesRef.current;
      
      if (mapImages.has(result._tempId)) {
         return mapImages.get(result._tempId);
      }
      
      const base64 = await _createMapImage(inputGeometry, result);
      mapImages.set(result._tempId, base64);

      return base64;
   }

   function clearCache() {
      mapImagesRef.current.clear();
   }

   return (
      <MapContext.Provider value={{ createMapImage, clearCache }}>
         {children}
      </MapContext.Provider>
   );
}

export const MapContext = createContext({});
export const useMap = () => useContext(MapContext);