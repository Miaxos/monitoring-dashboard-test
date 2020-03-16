import { SagaMiddleware } from 'redux-saga';
import { spawn } from 'redux-saga/effects';
import logSaga from './infrastructure/logger.saga';
import CPULoadRootSaga from './domains/CPULoad/saga';
import AlertingRootSaga from './domains/Alerting/saga';

const PRODUCTION = false;
/**
 * We initialize our sagas here.
 */
export default function initializeSagas(sagaMiddleware: SagaMiddleware) {
  if (!PRODUCTION) {
    sagaMiddleware.run(function*() {
      yield spawn(logSaga);
    });
  }

  sagaMiddleware.run(function*() {
    yield spawn(CPULoadRootSaga);
    yield spawn(AlertingRootSaga);
  });
}
