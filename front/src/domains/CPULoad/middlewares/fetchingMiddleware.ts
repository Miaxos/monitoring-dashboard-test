import * as Console from 'fp-ts/es6/Console';
import * as Option from 'fp-ts/es6/Option';
import * as IO from 'fp-ts/es6/IO';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import * as Task from 'fp-ts/es6/Task';
import { pipe } from 'fp-ts/es6/pipeable';
import { constVoid } from 'fp-ts/es6/function';
import { CPUService } from '../service';
import { cpuLoadFetched, cpuLoadRequested } from '../actionsCreator';
import * as CPULoad from '../api/cpuload';
import { type } from '../../../packages/typedActions/TypedActionType';
import {
  ApplicationDispatch,
  ApplicationMiddleware,
} from '../../../storeTypes';

/**
 * Our function get the load from the server, and when we get the load value, we add our
 * client side's date.
 *
 * Easy to test, just need to mock our CPUService.
 */
const fetchCPULoadTask = (dispatch: ApplicationDispatch) =>
  pipe(
    CPUService,
    TaskEither.fold(
      error => pipe(error, Console.error, Task.fromIO),
      result =>
        pipe(
          result,
          IO.of,
          IO.chainFirst(([, err]) =>
            pipe(
              err,
              Option.fold(() => constVoid, Console.error),
            ),
          ),
          IO.map(([load]) => {
            dispatch(
              cpuLoadFetched(
                CPULoad.create({ load, date: new Date(Date.now()) }),
              ),
            );
            return undefined;
          }),
          Task.fromIO,
        ),
    ),
  );

/**
 * An example with a Functional approch for a fetching middleware
 */
export const fetchingMiddleware: ApplicationMiddleware = ({
  dispatch,
}) => next => action => {
  next(action);

  switch (action.type) {
    case type(cpuLoadRequested): {
      fetchCPULoadTask(dispatch)();
      break;
    }
    default:
      break;
  }
};
