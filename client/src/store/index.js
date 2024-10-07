import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import mapReducer from './slices/mapSlice';

export default configureStore({
   reducer: {
      app: appReducer,
      map: mapReducer
   }
});
