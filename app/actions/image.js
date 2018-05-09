export const SELECT_IMAGE = 'SELECT_IMAGE';
export const SET_IMAGE = 'SET_IMAGE';
export function selectImage(id) {
  return {
    type: SELECT_IMAGE,
    id
  };
}
export function setImage(images) {
  return {
    type: SET_IMAGE,
    images
  };
}

