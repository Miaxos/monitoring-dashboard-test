import * as Option from 'fp-ts/es6/Option';
import * as AlertingState from './alertingstate';
import * as CPUEvent from './alerting/cpu';

describe('domains/Alerting/api/alertingstate', () => {
  it('should return a good projection of the status when we have alerts', () => {
    const orderedDate = [
      '2020-03-01T22:24:32.500Z',
      '2020-03-02T22:24:32.500Z',
      '2020-03-03T22:24:32.500Z',
      '2020-03-04T22:24:32.500Z',
      '2020-03-05T22:24:32.500Z',
      '2020-03-06T22:24:32.500Z',
      '2020-03-07T22:24:32.500Z',
      '2020-03-08T22:24:32.500Z',
    ].map((elt, index) =>
      index % 2 === 0
        ? CPUEvent.alert(new Date(elt))
        : CPUEvent.recover(new Date(elt)),
    );

    const state = AlertingState.create(orderedDate);
    const status = AlertingState.status(state);

    expect(status).toMatchSnapshot();
  });

  it('should return a good projection of the status when we have no alerts', () => {
    const state = AlertingState.create();
    const status = AlertingState.status(state);

    expect(status).toStrictEqual({
      status: AlertingState.AlertingStatus.NORMAL,
      date: Option.none,
    });
  });
});
