import { Reducer } from 'redux';
import { pipe } from 'fp-ts/es6/pipeable';
import * as actionsCreator from './actionsCreator';
import * as CPULoadState from './api/cpuloadstate';

import { type } from '../../packages/typedActions/TypedActionType';

const initialState = CPULoadState.create();

export type CPULoadReduxState = CPULoadState.CPULoadState;

function CPULoadReducer(): Reducer<CPULoadReduxState, actionsCreator.Actions> {
  return (state = initialState, action): CPULoadReduxState => {
    switch (action.type) {
      case type(actionsCreator.cpuLoadRequested): {
        return pipe(state, CPULoadState.beginLoadCPU);
      }
      case type(actionsCreator.cpuLoadFetched): {
        const { payload } = action;
        return pipe(
          state,
          CPULoadState.getLast(10),
          CPULoadState.add(payload.cpuLoad),
          CPULoadState.endLoadCPU,
        );
      }
      default:
        return state;
    }
  };
}

export type CPULoadActions = actionsCreator.Actions;

export default CPULoadReducer;
