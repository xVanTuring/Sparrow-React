export const SELECT_IMAGE = 'SELECT_IMAGE';
export const SET_IMAGE = 'SET_IMAGE';
export const ADD_IMAGE = 'ADD_IMAGE';
export const UPDATE_IMAGES = 'UPDATE_IMAGES';
export const SET_HOVERED_IMAGES = 'SET_HOVERED_IMAGES';
export const SET_IMAGE_HEIGHT = 'SET_IMAGE_HEIGHT';
export function selectImage(ids: string[]) {
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
export function setHoveredImage(images: string[]) {
  return {
    type: SET_HOVERED_IMAGES,
    images
  };
}
export function setImageHeight(height) {
  return {
    type: SET_IMAGE_HEIGHT,
    height
  };
}
