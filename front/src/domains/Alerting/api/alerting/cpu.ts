import { createOpaqueAPI } from '@iadvize-oss/opaque-type';
import { pipe } from 'fp-ts/es6/pipeable';
import { AlertingEventBase } from './base';

enum EventType {
  CPU_ALERT = 'CPU_ALERT',
  CPU_RECOVER = 'CPU_RECOVER',
}

type $CPUEvent = { type: EventType } & AlertingEventBase;
const CPUEvent = createOpaqueAPI<EventType.CPU_ALERT, $CPUEvent>(
  EventType.CPU_ALERT,
);

export type CPUEvent = ReturnType<typeof CPUEvent.toOpaque>;

/**
 * Create a CPU Alert
 */
export function alert(creationDate: Date): CPUEvent {
  return CPUEvent.toOpaque({
    type: EventType.CPU_ALERT,
    date: creationDate,
  });
}

/**
 * Create a CPU Recover
 */
export function recover(creationDate: Date): CPUEvent {
  return CPUEvent.toOpaque({
    type: EventType.CPU_RECOVER,
    date: creationDate,
  });
}

/**
 * Return the date from a CPUEvent
 */
export function date(event: CPUEvent): Date {
  return pipe(event, CPUEvent.fromOpaque, elt => elt.date);
}

/**
 * Pattern matching on a CPUEvent
 */
export function fold<R>({
  onAlert,
  onRecover,
}: {
  onAlert: (event: CPUEvent) => R;
  onRecover: (event: CPUEvent) => R;
}) {
  return (event: CPUEvent) =>
    pipe(event, CPUEvent.fromOpaque, elt => {
      switch (elt.type) {
        case EventType.CPU_ALERT:
          return onAlert(event);
        case EventType.CPU_RECOVER:
          return onRecover(event);
      }
    });
}
