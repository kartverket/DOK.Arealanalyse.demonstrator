import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   editor: {
      featuresSelected: false
   }
};

export const mapSlice = createSlice({
   name: 'map',
   initialState,
   reducers: {
      setFeaturesSelected: (state, action) => {
         return {
            ...state,
            editor: {
               ...state.editor,
               featuresSelected: action.payload
            }         
         };
      },
   }
});

export const { setFeaturesSelected } = mapSlice.actions;

export default mapSlice.reducer;