// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FunctionType = (...args: any[]) => any;

export type Action<T extends string> = {
  type: T;
};

export type ActionWithPayload<T extends string, P> = {
  payload: P;
} & Action<T>;

export type ActionCreator<
  ActionType extends string,
  PayloadCreator extends FunctionType
> = {
  (...args: Parameters<PayloadCreator>): ActionWithPayload<
    ActionType,
    ReturnType<PayloadCreator>
  >;
  type: ActionType;
};

export type ActionCreatorWithoutPayload<ActionType extends string> = {
  (): Action<ActionType>;
  type: ActionType;
};

export function createAction<T extends string>(type: T): Action<T>;
export function createAction<T extends string, P>(
  type: T,
  payload: P,
): ActionWithPayload<T, P>;
export function createAction<T extends string, P>(type: T, payload?: P) {
  if (typeof payload === 'undefined') {
    return { type };
  }

  return {
    type,
    payload,
  };
}
type ActionCreatorsMapObject = {
  [actionCreator: string]: FunctionType;
};

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<
  A[keyof A]
>;

function createActionCreatorWithoutPayload<ActionType extends string>(
  type: ActionType,
): ActionCreatorWithoutPayload<ActionType> {
  const actionCreator = () => createAction(type);

  actionCreator.type = type;
  return actionCreator;
}

function createActionCreatorWithPayload<
  ActionType extends string,
  PayloadCreator extends FunctionType
>(
  type: ActionType,
  payloadCreator: PayloadCreator,
): ActionCreator<ActionType, PayloadCreator> {
  const actionCreator = (...args: Parameters<PayloadCreator>) =>
    createAction(type, payloadCreator(...args));

  actionCreator.type = type;
  return actionCreator;
}

export default function createActionCreator<ActionType extends string>(
  type: ActionType,
): ActionCreatorWithoutPayload<ActionType>;
export default function createActionCreator<
  ActionType extends string,
  PayloadCreator extends FunctionType
>(
  type: ActionType,
  payloadCreator: PayloadCreator,
): ActionCreator<ActionType, PayloadCreator>;
export default function createActionCreator<
  ActionType extends string,
  PayloadCreator extends FunctionType
>(type: ActionType, payloadCreator?: PayloadCreator) {
  if (!payloadCreator) {
    return createActionCreatorWithoutPayload(type);
  }

  return createActionCreatorWithPayload(type, payloadCreator);
}
