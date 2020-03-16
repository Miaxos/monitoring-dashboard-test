import { Dispatch, MiddlewareAPI } from 'redux';
import { DefaultRootState } from 'react-redux';
import { CPULoadActions } from './domains/CPULoad/reducer';
import { AlertingActions } from './domains/Alerting/reducer';

type AnyAction = CPULoadActions | AlertingActions;

export type ApplicationDispatch = Dispatch<AnyAction>;

/** Our applications Middlewares */
export type ApplicationMiddleware = (
  api: MiddlewareAPI<Dispatch<AnyAction>, DefaultRootState>,
) => (next: Dispatch<AnyAction>) => (action: AnyAction) => void;
