import createActionCreator, {
  ActionsUnion,
} from '../../packages/typedActions/TypedActions';

export const cpuHighLoadStarted = createActionCreator(
  'CPU_HIGH_LOAD_STARTED',
  (date: Date) => ({
    date,
  }),
);

export const cpuHighLoadRecovered = createActionCreator(
  'CPU_HIGH_LOAD_RECOVERED',
  (date: Date) => ({
    date,
  }),
);

const actionsCreators = {
  cpuHighLoadStarted,
  cpuHighLoadRecovered,
};

export type Actions = ActionsUnion<typeof actionsCreators>;
