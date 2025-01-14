import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: 'Starter opp...',
    count: 0,
    analyzed: []
};

export const datasetSlice = createSlice({
    name: 'dataset',
    initialState,
    reducers: {
        setStatus: (state, action) => {
            return {
                ...state,
                status: action.payload
            };
        },
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

export const { setStatus, setCount, addAnalyzed, resetProgress } = datasetSlice.actions;

export default datasetSlice.reducer;