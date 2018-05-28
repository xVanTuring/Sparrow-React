import { combineReducers } from 'redux';
// import { Map } from 'immutable';
import * as folders from './folder';
import * as images from './images';
import tags from './tags';
import * as keys from './keys';
import * as app from './app';
import { RESET_APP } from '../actions/app';

export type StoreInitState = {
  // folders: Map,
  // images: Map
};
const basePath = (state = '') => state;

const reducer = combineReducers({
  ...folders,
  ...images,
  tags,
  ...keys,
  ...app,
  basePath
});
export const rootReducer = (state, action) => {
  if (action.type === RESET_APP) {
    return reducer(action.data, action);
  }
  return reducer(state, action);
};
export default rootReducer;
