import { DefaultRootState } from 'react-redux';

export const getAlertingState = (state: DefaultRootState) =>
  state.alertingState;
