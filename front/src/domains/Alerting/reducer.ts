import { Reducer } from 'redux';
import { pipe } from 'fp-ts/es6/pipeable';
import * as AlertingState from './api/alertingstate';
import * as actionsCreator from './actionsCreator';
import * as CPUEvent from './api/alerting/cpu';

import { type } from '../../packages/typedActions/TypedActionType';

const initialState = AlertingState.create();

export type AlertingReduxState = AlertingState.AlertingState;

function AlertingReducer(): Reducer<
  AlertingReduxState,
  actionsCreator.Actions
> {
  return (state = initialState, action): AlertingReduxState => {
    switch (action.type) {
      case type(actionsCreator.cpuHighLoadStarted):
        return pipe(
          state,
          AlertingState.add(CPUEvent.alert(action.payload.date)),
        );
      case type(actionsCreator.cpuHighLoadRecovered):
        return pipe(
          state,
          AlertingState.add(CPUEvent.recover(action.payload.date)),
        );
      default:
        return state;
    }
  };
}

export type AlertingActions = actionsCreator.Actions;

export default AlertingReducer;
