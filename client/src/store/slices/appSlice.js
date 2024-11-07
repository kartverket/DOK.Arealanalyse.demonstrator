import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    correlationId: null,
    dataset: {
        count: 0,
        analyzed: []
    },
    errorMessage: null
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setCorrelationId: (state, action) => {
            return {
                ...state,
                correlationId: action.payload
            };
        },
        setDatasetCount: (state, action) => {
            return {
                ...state,
                dataset: {
                    ...state.dataset,
                    count: action.payload
                }
            };
        },
        addDatasetAnalyzed: (state, action) => {
            return {
                ...state,
                dataset: {
                    ...state.dataset,
                    analyzed: [
                        ...state.dataset.analyzed,
                        action.payload
                    ]
                }
            };
        },
        setErrorMessage: (state, action) => {
            return {
                ...state,
                errorMessage: action.payload
            };
        }
    }
});

export const { setCorrelationId, setDatasetCount, addDatasetAnalyzed, setErrorMessage } = appSlice.actions;

export default appSlice.reducer;