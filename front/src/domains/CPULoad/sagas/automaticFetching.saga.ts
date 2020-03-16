import * as Console from 'fp-ts/es6/Console';
import { delay, put } from 'redux-saga/effects';
import { cpuLoadRequested } from '../actionsCreator';
/**
 * An example with a saga that'll launch every 10 seconds the fetch.
 *
 * We should put a circuit breaker here, and manage the error, if the back-end
 * doesn't answer and doesn't timeout, we'll have a lot of pending request.
 *
 * Also we could imagine a circuit breaker implementation to avoid DDOS the api if
 * the API is failing.
 */
export function* automaticFetchingSaga() {
  yield Console.info('Automatic Fetching worker started')();

  while (true) {
    yield put(cpuLoadRequested());
    yield delay(10_000);
  }
}
