import { useSelector } from 'react-redux';
import { pipe } from 'fp-ts/es6/pipeable';
import { getAlertingState } from '../selector';
import * as AlertingState from '../api/alertingstate';

/**
 * Hooks to get the alerting events
 */
export default function useAlerts() {
  const alertingEvents = useSelector(getAlertingState);
  const events = pipe(alertingEvents, AlertingState.events);

  return [events] as const;
}
