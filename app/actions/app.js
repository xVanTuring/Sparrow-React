export const RESET_APP = 'RESET_APP';
export function resetApp(data) {
  return {
    type: RESET_APP,
    data
  };
}
