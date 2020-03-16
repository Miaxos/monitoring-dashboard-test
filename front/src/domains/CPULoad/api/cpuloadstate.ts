import { createOpaqueAPI } from '@iadvize-oss/opaque-type';
import * as Option from 'fp-ts/es6/Option';
import { pipe } from 'fp-ts/es6/pipeable';
import * as ArrayFP from 'fp-ts/es6/Array';
import * as CPULoad from './cpuload';

type $CPULoadState = {
  /** Store the cpu loads */
  cpuLoads: CPULoad.CPULoad[];
  /** The loading state is a projection of every task ongoing that are fetching data */
  loadingState: number;
};

const CPULoadState = createOpaqueAPI<'CPU_LOAD_STATE', $CPULoadState>(
  'CPU_LOAD_STATE',
);

export type CPULoadState = ReturnType<typeof CPULoadState.toOpaque>;

/**
 * Function to create a CPULoadState
 */
export function create(cpuLoads: CPULoad.CPULoad[] = []): CPULoadState {
  return CPULoadState.toOpaque({
    cpuLoads,
    loadingState: 0,
  });
}

/**
 * Function to add a CPULoad
 * Actually it's not sorted
 * TODO: Add it sorted.
 */
export function add(cpuLoad: CPULoad.CPULoad) {
  return (state: CPULoadState): CPULoadState =>
    pipe(
      state,
      CPULoadState.fromOpaque,
      elt => ({
        ...elt,
        cpuLoads: [...elt.cpuLoads, cpuLoad],
      }),
      CPULoadState.toOpaque,
    );
}

/**
 * To manage loading projection, we use this fonction to increment
 * our projection.
 */
export function beginLoadCPU(state: CPULoadState): CPULoadState {
  return pipe(
    state,
    CPULoadState.fromOpaque,
    elt => ({ ...elt, loadingState: elt.loadingState + 1 }),
    CPULoadState.toOpaque,
  );
}

/**
 * To manage loading projection, we use this fonction todecrease
 * our projection.
 */
export function endLoadCPU(state: CPULoadState): CPULoadState {
  return pipe(
    state,
    CPULoadState.fromOpaque,
    elt => ({ ...elt, loadingState: elt.loadingState - 1 }),
    CPULoadState.toOpaque,
  );
}

/**
 * Get the last X minutes elements and remove Error Elements
 */
export function getLast(minutes: number) {
  return (state: CPULoadState) =>
    pipe(
      state,
      CPULoadState.fromOpaque,
      elt => ({
        ...elt,
        cpuLoads: pipe(
          elt.cpuLoads,
          ArrayFP.map(CPULoad.get),
          ArrayFP.rights,
          ArrayFP.filterMap(cpu => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (Date.now() - cpu.date < minutes * 60 * 1000) {
              return Option.some(CPULoad.create(cpu));
            }
            return Option.none;
          }),
        ),
      }),
      CPULoadState.toOpaque,
    );
}

/**
 * Get cpuLoads
 */
export function cpusLoad(state: CPULoadState) {
  return pipe(state, CPULoadState.fromOpaque, elt => elt.cpuLoads);
}

/**
 * Get average load from a CPULoadState
 */
export function averageLoad(state: CPULoadState): number {
  return pipe(state, cpusLoad, CPULoad.average);
}
