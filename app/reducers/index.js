import { combineReducers } from 'redux';
import { Map } from 'immutable';
import folders from './folder';
import images from './images';

export type StoreInitState = {
  folders: Map,
  images: Map
};
const reducer = combineReducers({
  folders,
  images
});
export default reducer;
