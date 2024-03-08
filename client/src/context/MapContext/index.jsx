import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { fetchWmtsOptions } from 'utils/baseMap';

export default function MapProvider({ children }) {
   const [wmtsOptions, setWmtsOptions] = useState(null);
   const initRef = useRef(true);

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

   return (
      <MapContext.Provider value={{ wmtsOptions }}>
         {children}
      </MapContext.Provider>
   );
}

export const MapContext = createContext({});
export const useMap = () => useContext(MapContext);