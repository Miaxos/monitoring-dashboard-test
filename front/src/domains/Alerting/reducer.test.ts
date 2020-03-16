import * as AlertingState from './api/alertingstate';
import { cpuHighLoadStarted, cpuHighLoadRecovered } from './actionsCreator';
import AlertingReducer from './reducer';

describe('domains/Alerting/reducer', () => {
  it('should add an alert event', () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() =>
        new Date('2019-05-14T11:01:58.135Z').valueOf(),
      );

    const state = AlertingState.create();
    const action = cpuHighLoadStarted(new Date('2020-03-01T22:24:32.500Z'));
    const reducer = AlertingReducer();

    expect(reducer(state, action)).toMatchSnapshot();
  });

  it('should add an recover event', () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() =>
        new Date('2019-05-14T11:01:58.135Z').valueOf(),
      );

    const state = AlertingState.create();
    const action = cpuHighLoadRecovered(new Date('2020-03-01T22:24:32.500Z'));
    const reducer = AlertingReducer();

    expect(reducer(state, action)).toMatchSnapshot();
  });
});
