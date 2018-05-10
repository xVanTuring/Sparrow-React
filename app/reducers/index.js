import { combineReducers } from 'redux';
// import { Map } from 'immutable';
import * as folders from './folder';
import * as images from './images';
import { RESET_APP } from '../actions/app';

export type StoreInitState = {
  // folders: Map,
  // images: Map
};
const basePath = (state = '') => {
  return state;
};

const reducer = combineReducers({
  ...folders,
  ...images,
  basePath
});
export const rootReducer = (state, action) => {
  if (action.type === RESET_APP) {
    console.log(action.data);
    return reducer(action.data, action);
  }
  return reducer(state, action);
};
export default rootReducer;
