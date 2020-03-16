import { spawn } from 'redux-saga/effects';
import { automaticFetchingSaga } from './sagas/automaticFetching.saga';

export default function* CPULoadRootSaga() {
  yield spawn(automaticFetchingSaga);
}
