import * as ArrayFP from 'fp-ts/es6/Array';
import * as Option from 'fp-ts/es6/Option';
import { createOpaqueAPI } from '@iadvize-oss/opaque-type';
import { pipe } from 'fp-ts/es6/pipeable';
import * as CPUEvent from './alerting/cpu';

type $AlertingState = {
  alertingEvents: CPUEvent.CPUEvent[];
  startedTime: Date;
};

const AlertingState = createOpaqueAPI<'ALERTING_STATE', $AlertingState>(
  'ALERTING_STATE',
);
export type AlertingState = ReturnType<typeof AlertingState.toOpaque>;

/**
 * Create alerting state
 */
export function create(
  alertingEvents: CPUEvent.CPUEvent[] = [],
): AlertingState {
  return AlertingState.toOpaque({
    alertingEvents,
    startedTime: new Date(Date.now()),
  });
}

/**
 * Add an event to the alerting state
 */
export function add(event: CPUEvent.CPUEvent) {
  return (state: AlertingState) =>
    pipe(
      state,
      AlertingState.fromOpaque,
      elt => ({ ...elt, alertingEvents: [event, ...elt.alertingEvents] }),
      AlertingState.toOpaque,
    );
}

/**
 * Get the events from a AlertingState
 * Events aren't sorted by date, but the last in is the first.
 */
export function events(state: AlertingState): CPUEvent.CPUEvent[] {
  return pipe(state, AlertingState.fromOpaque, elt => elt.alertingEvents);
}

/**
 * Get the started time of the alerting
 */
export function startedSince(state: AlertingState): Date {
  return pipe(state, AlertingState.fromOpaque, elt => elt.startedTime);
}

/**
 * It represent the Alerting actual state, either Normal or with an Alert
 */
export enum AlertingStatus {
  NORMAL = 'NORMAL',
  ALERT = 'ALERT',
}

type StatusResponse = {
  status: AlertingStatus;
  date: Option.Option<Date>;
};

/**
 * Get the actual status of the Alerting State and the time when it started.
 */
export function status(state: AlertingState): StatusResponse {
  return pipe(
    state,
    events,
    ArrayFP.head,
    Option.fold(
      () => ({
        status: AlertingStatus.NORMAL,
        date: Option.none,
      }),
      event =>
        pipe(
          event,
          CPUEvent.fold<StatusResponse>({
            onAlert: alertEvent => ({
              status: AlertingStatus.ALERT,
              date: Option.some(CPUEvent.date(alertEvent)),
            }),
            onRecover: recoverEvent => ({
              status: AlertingStatus.NORMAL,
              date: Option.some(CPUEvent.date(recoverEvent)),
            }),
          }),
        ),
    ),
  );
}
