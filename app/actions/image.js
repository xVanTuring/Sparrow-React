export const SELECT_IMAGE = 'SELECT_IMAGE';
export function selectImage(id) {
  return {
    type: SELECT_IMAGE,
    id
  };
}
