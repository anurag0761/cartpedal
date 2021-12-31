import { combineReducers } from 'redux';
import { DESTROY_SESSION } from '../actions';

const appReducer = combineReducers({
    state: (state = {}) => state
});

const rootReducer = (state, action) => {
    console.log('state',state)
    if (action.type === DESTROY_SESSION)
        state = undefined;

    return appReducer(state, action);
};

export default rootReducer;