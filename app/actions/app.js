export const RESET_APP = 'RESET_APP';
export const SET_INIT_STATUS = 'SET_INIT_STATUS';
export const INCREASE_LAYOUT_INDEX = 'INCREASE_LAYOUT_INDEX';
export function resetApp(data) {
  return {
    type: RESET_APP,
    data
  };
}
export function setInitStatus(status) {
  return {
    type: SET_INIT_STATUS,
    status
  };
}
export function increaseLayoutIndex() {
  return {
    type: INCREASE_LAYOUT_INDEX
  };
}
