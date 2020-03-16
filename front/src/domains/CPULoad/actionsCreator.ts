import createActionCreator, {
  ActionsUnion,
} from '../../packages/typedActions/TypedActions';
import * as CPULoad from './api/cpuload';

export const cpuLoadRequested = createActionCreator('CPU_LOAD_REQUESTED');

export const cpuLoadFetched = createActionCreator(
  'CPU_LOAD_UPDATED',
  (cpuLoad: CPULoad.CPULoad) => ({
    cpuLoad,
  }),
);

const actionsCreators = {
  cpuLoadFetched,
  cpuLoadRequested,
};

export type Actions = ActionsUnion<typeof actionsCreators>;
