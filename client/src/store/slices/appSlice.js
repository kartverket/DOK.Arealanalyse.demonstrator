import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   errorMessage: null,
   featuresSelected: false
};

export const appSlice = createSlice({
   name: 'app',
   initialState,
   reducers: {
      setErrorMessage: (state, action) => {
         return {
            ...state,
            errorMessage: action.payload
         };
      },
      setFeaturesSelected: (state, action) => {
         return {
            ...state,
            featuresSelected: action.payload
         };
      },
   }
});

export const { setErrorMessage, setFeaturesSelected } = appSlice.actions;

export default appSlice.reducer;