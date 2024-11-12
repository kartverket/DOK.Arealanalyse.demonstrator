import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import datasetReducer from './slices/datasetSlice';

export default configureStore({
   reducer: {
      app: appReducer,
      dataset: datasetReducer
   }
});
