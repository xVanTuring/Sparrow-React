import { combineReducers } from 'redux';
import { Map } from 'immutable';
import * as folders from './folder';
import * as images from './images';
import { RESET_APP } from '../actions/app';

export type StoreInitState = {
  // folders: Map,
  // images: Map
};
const reducer = combineReducers({
  ...folders,
  ...images
});
export const rootReducer = (state, action) => {
  if (action.type === RESET_APP) {
    return reducer(action.state, action);
  }
  return reducer(state, action);
};
export default reducer;
