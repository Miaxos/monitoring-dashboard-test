import * as CPUEvent from './cpu';

describe('domains/Alerting/api/alerting/cpu', () => {
  it('should return the date from a CPUEvent', () => {
    const date = new Date('2020-03-09T22:24:32.500Z');

    const cpuRecoverEvent = CPUEvent.recover(date);
    const cpuAlertEvent = CPUEvent.alert(date);

    expect(CPUEvent.date(cpuRecoverEvent).toISOString()).toBe(
      '2020-03-09T22:24:32.500Z',
    );
    expect(CPUEvent.date(cpuAlertEvent).toISOString()).toBe(
      '2020-03-09T22:24:32.500Z',
    );
  });

  it('should fold a cpu event', () => {
    const onAlert = jest.fn();
    const onRecover = jest.fn();

    const date = new Date('2020-03-09T22:24:32.500Z');

    const cpuRecoverEvent = CPUEvent.recover(date);
    const cpuAlertEvent = CPUEvent.alert(date);

    CPUEvent.fold({ onAlert, onRecover })(cpuRecoverEvent);
    expect(onRecover).toHaveBeenCalledWith(cpuRecoverEvent);

    CPUEvent.fold({ onAlert, onRecover })(cpuAlertEvent);
    expect(onAlert).toHaveBeenCalledWith(cpuAlertEvent);
  });
});
