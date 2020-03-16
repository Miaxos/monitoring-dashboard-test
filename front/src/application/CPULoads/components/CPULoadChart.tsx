import React from 'react';
import * as ArrayFP from 'fp-ts/es6/Array';
import { pipe } from 'fp-ts/es6/pipeable';
import * as CPUEvent from '../../../domains/Alerting/api/alerting/cpu';
import TimeseriesChart from '../../../components/TimeseriesChart/TimeseriesChart';
import useCPULoad from '../hooks/useCPULoad';
import useAlerts from '../../../domains/Alerting/hooks/useAlerts';

const CPULoadChart = () => {
  const [cpuLoad] = useCPULoad();
  const [events] = useAlerts();

  const dataToShow: React.ComponentProps<typeof TimeseriesChart>['data'] = pipe(
    cpuLoad,
    ArrayFP.map(elt => ({
      value: elt.load,
      date: elt.date,
    })),
  );

  const referencesLines = pipe(
    events,
    ArrayFP.map(
      CPUEvent.fold({
        onAlert: alertEvent => ({
          color: 'red',
          date: CPUEvent.date(alertEvent),
        }),
        onRecover: recoverEvent => ({
          color: 'green',
          date: CPUEvent.date(recoverEvent),
        }),
      }),
    ),
  );

  return (
    <TimeseriesChart
      name="CPU Load"
      data={dataToShow}
      referencesLines={referencesLines}
    />
  );
};

export default CPULoadChart;
