import * as Console from 'fp-ts/es6/Console';
import { takeEvery, select } from 'redux-saga/effects';

export default function* logSaga() {
  yield takeEvery('*', function*(action) {
    yield Console.info(yield select())();
    yield Console.info(action)();
  });
}
