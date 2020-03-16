import React from 'react';
import * as ArrayFP from 'fp-ts/es6/Array';
import { pipe } from 'fp-ts/es6/pipeable';
import EventTable from '../../../components/EventTable/EventTable';
import useAlerts from '../../../domains/Alerting/hooks/useAlerts';
import * as CPUEvent from '../../../domains/Alerting/api/alerting/cpu';
import {
  EventRowAlert,
  EventRowRecovered,
} from '../../../components/EventTable/EventRow';

const AlertingEvents = () => {
  const [events] = useAlerts();

  const rows = pipe(
    events,
    ArrayFP.map(
      CPUEvent.fold({
        onAlert: alertEvent => {
          const date = CPUEvent.date(alertEvent);
          return {
            id: date.toISOString(),
            component: <EventRowAlert date={date.toISOString()} />,
          };
        },
        onRecover: recoverEvent => {
          const date = CPUEvent.date(recoverEvent);
          return {
            id: date.toISOString(),
            component: <EventRowRecovered date={date.toISOString()} />,
          };
        },
      }),
    ),
  );
  return <EventTable title="Alerting Events" rows={rows} />;
};

export default AlertingEvents;
