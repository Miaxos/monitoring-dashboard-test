import * as ArrayFP from 'fp-ts/es6/Array';
import { useSelector } from 'react-redux';
import { pipe } from 'fp-ts/es6/pipeable';
import * as CPULoadState from '../../../domains/CPULoad/api/cpuloadstate';
import * as CPULoad from '../../../domains/CPULoad/api/cpuload';

export default function useCPULoad() {
  const cpuLoadFromState = useSelector(state => state.cpuLoad);

  const cpuLoad = pipe(
    cpuLoadFromState,
    CPULoadState.getLast(10),
    CPULoadState.cpusLoad,
    ArrayFP.map(CPULoad.get),
    ArrayFP.rights,
  );

  return [cpuLoad] as const;
}
