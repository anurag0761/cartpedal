import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import rootReducer from './reducers/root.reducer.js';
import { persistStore, persistReducer,  } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage';
const enhancerList = [];
const devToolsExtension = window && window.__REDUX_DEVTOOLS_EXTENSION__;
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}
if (typeof devToolsExtension === 'function') {
  enhancerList.push(devToolsExtension());
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

// const middlewareEnhancer = applyMiddleware(thunk)
// const composedEnhancer = compose(middlewareEnhancer, ... (window.__REDUX_DEVTOOLS_EXTENSION__ ? [window.__REDUX_DEVTOOLS_EXTENSION__()] : []));

// export const initStore = () => {
//   createStore(persistedReducer, {}, composedEnhancer);
//   let persistor = persistStore(store)
// }

export default initStore= (initialState= {}) => {
  const middlewareEnhancer = applyMiddleware(thunk)
  const composedEnhancer = compose(middlewareEnhancer, ... (window.__REDUX_DEVTOOLS_EXTENSION__ ? [window.__REDUX_DEVTOOLS_EXTENSION__()] : []));
  const store = createStore(persistedReducer,
    initialState,
    composedEnhancer,
  );
  let persistor = persistStore(store)

  return {store, persistor};
};
	
// module.exports = {
//   initStore
// };