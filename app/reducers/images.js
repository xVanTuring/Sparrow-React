import { List } from 'immutable';
import { SELECT_IMAGE, SET_IMAGE } from '../actions/image';

export const selectedImg = (state = '', action) => {
  if (action.type === SELECT_IMAGE) {
    return action.id;
  }
  return state;
};
export const images = (state = List(), action) => {
  if (action.type === SET_IMAGE) {
    return List(action.images);
  }
  return state;
};
export const addImage = (state = '', action) => {
  return state;
};

