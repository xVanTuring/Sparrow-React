import { List } from 'immutable';
import { SELECT_IMAGE, SET_IMAGE, ADD_IMAGE } from '../actions/image';
import { RESET_APP } from '../actions/app';

export const selectedImgs = (state = List([]), action) => {
  if (action.type === SELECT_IMAGE) {
    return List(action.ids);
  }
  return state;
};
export const images = (state = List(), action) => {
  if (action.type === SET_IMAGE) {
    return List(action.images);
  }
  if (action.type === RESET_APP) {
    return List(state);
  }
  if (action.type === ADD_IMAGE) {
    return state.concat(List(action.images));
  }
  return state;
};
// export const addImage = (state = '', action) => {
//   return state;
// };

