import store from 'store';
import { addAnalyzed, setCount } from 'store/slices/datasetSlice';

const messageHandlers = new Map();

messageHandlers.set('datasets_counted', message => {
    store.dispatch(setCount(parseInt(message)));
});

messageHandlers.set('dataset_analyzed', message => {
    store.dispatch(addAnalyzed(message));
});

export default messageHandlers;