import { combineReducers, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import CPULoadReducer, { CPULoadReduxState } from './domains/CPULoad/reducer';
import { fetchingMiddleware } from './domains/CPULoad/middlewares/fetchingMiddleware';
import initializeSagas from './saga';
import AlertingReducer, {
  AlertingReduxState,
} from './domains/Alerting/reducer';

declare module 'react-redux' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface DefaultRootState {
    cpuLoad: CPULoadReduxState;
    alertingState: AlertingReduxState;
  }
}

const createRootReducer = () =>
  combineReducers({
    cpuLoad: CPULoadReducer(),
    alertingState: AlertingReducer(),
  });

const createApplicationStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [fetchingMiddleware, sagaMiddleware];

  const store = createStore(
    createRootReducer(),
    applyMiddleware(...middlewares),
  );

  initializeSagas(sagaMiddleware);

  return store;
};

export default createApplicationStore;
