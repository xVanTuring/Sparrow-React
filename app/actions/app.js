export const RESET_APP = 'RESET_APP';
export const SET_INIT_STATUS = 'SET_INIT_STATUS';
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
