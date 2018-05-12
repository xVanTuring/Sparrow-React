import { List } from 'immutable';
import { SELECT_IMAGE, SET_IMAGE, ADD_IMAGE, UPDATE_IMAGES, updateImages } from '../actions/image';
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
  if (action.type === UPDATE_IMAGES) {
    // test on huge mount image without update,but use reload
    let updatedState = state;
    for (let i = 0; i < action.images.length; i += 1) {
      updatedState = updateImage(updatedState, action.images[i]);
    }
    return updatedState;
  }
  return state;
};
const updateImage = (state: List, image) => {
  for (let i = 0; i < state.size; i += 1) {
    const old = state.get(i);
    if (old.id === image.id) {
      return state.update(i, () => image);
    }
  }
};
