import { ActionCreatorWithoutPayload, ActionCreator } from './TypedActions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FunctionType = (...args: any[]) => any;

export function type<ActionType extends string>(
  actionCreator: ActionCreatorWithoutPayload<ActionType>,
): ActionType;
export function type<
  ActionType extends string,
  PayloadCreator extends FunctionType
>(actionCreator: ActionCreator<ActionType, PayloadCreator>): ActionType;
export function type(
  actionCreator:
    | ActionCreatorWithoutPayload<string>
    | ActionCreator<string, FunctionType>,
) {
  return actionCreator.type;
}
