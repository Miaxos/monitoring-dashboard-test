/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-extraneous-dependencies
import { ProviderNextF } from 'redux-saga-test-plan/providers';
import effects from 'redux-saga/effects';

type ArgumentTypes<T> = T extends (...args: infer U) => any ? U : never;
type ReplaceReturnType<T, TNewReturn> = (...a: ArgumentTypes<T>) => TNewReturn;
type Func = (...args: any[]) => any;
type MockedCallEffect = {
  fn: Func;
  mock: Func;
  maxCall: number;
  currentCall: number;
};
type MockedGetContextEffect<T> = { prop: string; mock: T };
type MockedSelectEffect = { fn: Func; mock: Func };
/**
 * Used to mock a service function passed to a call effect
 */
export const mockCall = <T extends Func>(
  fn: T,
  mock: ReplaceReturnType<T, ReturnType<T>>,
  maxCall: number = 1,
) => {
  const callEffectProvider: MockedCallEffect = {
    fn,
    mock,
    maxCall,
    currentCall: 0,
  };

  return callEffectProvider;
};

/**
 * Used to aggregate multiple mocked call effects
 */
export const composeMockedCalls = <RT>(
  ...mockedCallEffects: MockedCallEffect[]
) => {
  return (effect: effects.CallEffectDescriptor<RT>, next: ProviderNextF) => {
    const mockedCallEffect = mockedCallEffects.find(mockedCallEffect => {
      return (
        mockedCallEffect.fn === effect.fn &&
        mockedCallEffect.currentCall < mockedCallEffect.maxCall
      );
    });

    if (mockedCallEffect) {
      mockedCallEffect.currentCall += 1;
      return mockedCallEffect.mock(...effect.args);
    }

    return next();
  };
};

/**
 * Used to mock a getContextEffect
 */
export const mockGetContext = <T>(prop: string, mock: T) => {
  const getContextEffectProvider: MockedGetContextEffect<T> = {
    prop,
    mock,
  };

  return getContextEffectProvider;
};

/**
 * Used to aggregate multiple mocked getContext effects
 */
export const composeMockedGetContext = <T>(
  ...mockedGetContextEffects: MockedGetContextEffect<T>[]
) => {
  return (effect: effects.GetContextEffectDescriptor, next: ProviderNextF) => {
    const mockedGetContextEffect = mockedGetContextEffects.find(
      mockedGetContextEffect => {
        return mockedGetContextEffect.prop === effect;
      },
    );

    if (mockedGetContextEffect) {
      return mockedGetContextEffect.mock;
    }

    return next();
  };
};

/**
 * Used to mock a selectEffect
 */
export const mockSelect = <T extends Func>(fn: T, mock: ReturnType<T>) => {
  const getContextEffectProvider: MockedSelectEffect = {
    fn,
    mock,
  };

  return getContextEffectProvider;
};

/**
 * Used to aggregate multiple mocked select effects
 */
export const composeMockedSelect = (
  ...mockedSelectEffects: MockedSelectEffect[]
) => {
  return (effect: effects.SelectEffectDescriptor, next: ProviderNextF) => {
    const mockedSelectEffect = mockedSelectEffects.find(mockedSelectEffect => {
      return mockedSelectEffect.fn === effect.selector;
    });

    if (mockedSelectEffect) {
      return mockedSelectEffect.mock;
    }

    return next();
  };
};
