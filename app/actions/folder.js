export const SELECT_FOLDER = 'SELECT_FOLDER';
export function selectFolder(id) {
  return {
    type: SELECT_FOLDER,
    id
  };
}
