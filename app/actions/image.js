export const SELECT_IMAGE = 'SELECT_IMAGE';
export const SET_IMAGE = 'SET_IMAGE';
export const ADD_IMAGE = 'ADD_IMAGE';
export const UPDATE_IMAGES = 'UPDATE_IMAGES';
export function selectImage(ids) {
  return {
    type: SELECT_IMAGE,
    ids
  };
}
export function setImage(images) {
  return {
    type: SET_IMAGE,
    images
  };
}
export function addImages(images) {
  return {
    type: ADD_IMAGE,
    images
  };
}
export function updateImages(images: []) {
  return {
    type: UPDATE_IMAGES,
    images
  };
}
