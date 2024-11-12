import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    count: 0,
    analyzed: []
};

export const datasetSlice = createSlice({
    name: 'dataset',
    initialState,
    reducers: {
        setCount: (state, action) => {
            return {
                ...state,
                count: action.payload
            };
        },
        addAnalyzed: (state, action) => {
            return {
                ...state,
                analyzed: [
                    ...state.analyzed,
                    action.payload
                ]
            };
        },
        resetProgress: () => {
            return initialState
        }
    }
});

export const { setCount, addAnalyzed, resetProgress } = datasetSlice.actions;

export default datasetSlice.reducer;