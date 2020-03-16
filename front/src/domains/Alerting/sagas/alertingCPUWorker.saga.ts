import * as Either from 'fp-ts/es6/Either';
import * as Console from 'fp-ts/es6/Console';
import { takeEvery, put, select } from 'redux-saga/effects';
import { pipe } from 'fp-ts/es6/pipeable';
import { cpuHighLoadStarted, cpuHighLoadRecovered } from '../actionsCreator';
import { type } from '../../../packages/typedActions/TypedActionType';
import * as actionsCreatorCPULoad from '../../CPULoad/actionsCreator';
import { getAlertingState } from '../selector';
import * as AlertingState from '../api/alertingstate';
import * as CPULoadState from '../../CPULoad/api/cpuloadstate';
import { getCPULoadState } from '../../CPULoad/selector';
import * as CPULoad from '../../CPULoad/api/cpuload';

/**
 * The AlertingCPUWorker that'll listen to the event emitted by the CPULoad Domain
 * and decide if it should have an alert or it shouldn't
 */
export function* alertingCPUWorker() {
  Console.info('Automatic Alerting CPU Worker started')();

  yield takeEvery<ReturnType<typeof actionsCreatorCPULoad.cpuLoadFetched>>(
    type(actionsCreatorCPULoad.cpuLoadFetched),
    function*(action) {
      const alertingState: ReturnType<typeof getAlertingState> = yield select(
        getAlertingState,
      );
      const cpuLoadState: ReturnType<typeof getCPULoadState> = yield select(
        getCPULoadState,
      );

      const loadAverage2minutes = pipe(
        cpuLoadState,
        CPULoadState.getLast(2),
        CPULoadState.averageLoad,
      );

      const isOnHighAverage = loadAverage2minutes > 1;
      const isTheAppLaunchForAtLeast2minutes =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new Date(Date.now()) - AlertingState.startedSince(alertingState) >
        2 * 60 * 1000;

      const { status } = AlertingState.status(alertingState);
      const date = pipe(
        action.payload.cpuLoad,
        CPULoad.get,
        Either.map(elt => elt.date),
        Either.getOrElse(() => new Date(Date.now())),
      );

      if (
        isTheAppLaunchForAtLeast2minutes &&
        isOnHighAverage &&
        status === AlertingState.AlertingStatus.NORMAL
      ) {
        yield put(cpuHighLoadStarted(date));
      }

      if (
        isTheAppLaunchForAtLeast2minutes &&
        !isOnHighAverage &&
        status === AlertingState.AlertingStatus.ALERT
      ) {
        yield put(cpuHighLoadRecovered(date));
      }
    },
  );
}
