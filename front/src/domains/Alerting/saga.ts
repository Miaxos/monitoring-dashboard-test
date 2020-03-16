import { spawn } from 'redux-saga/effects';
import { alertingCPUWorker } from './sagas/alertingCPUWorker.saga';

export default function* AlertingRootSaga() {
  yield spawn(alertingCPUWorker);
}
