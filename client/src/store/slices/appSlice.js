import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   errorMessage: null   
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
      }
   }
});

export const { setErrorMessage } = appSlice.actions;

export default appSlice.reducer;