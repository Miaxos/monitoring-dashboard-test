import { expectSaga } from 'redux-saga-test-plan';
import { put } from 'redux-saga/effects';
import {
  composeMockedSelect,
  mockSelect,
} from '../../../packages/redux-saga-test-plan-helpers/helpers';
import * as AlertingState from '../api/alertingstate';
import * as CPUEvent from '../api/alerting/cpu';
import * as CPULoadState from '../../CPULoad/api/cpuloadstate';
import * as CPULoad from '../../CPULoad/api/cpuload';
import { getAlertingState } from '../selector';
import { getCPULoadState } from '../../CPULoad/selector';
import { cpuLoadFetched } from '../../CPULoad/actionsCreator';
import { alertingCPUWorker } from './alertingCPUWorker.saga';
import { cpuHighLoadRecovered, cpuHighLoadStarted } from '../actionsCreator';

describe('domains/Alerting/saga/alertingCPUWorker', () => {
  describe("when it's started for a least 2 minutes", () => {
    const dateNow = new Date('2019-05-14T11:01:58.135Z');
    describe("when it's on high average", () => {
      it('should not change the status to normal if the average 2 minutes > 1', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            // When we create the Alerting State
            new Date('2019-05-14T01:01:58.135Z').valueOf(),
          )
          .mockImplementation(() => dateNow.valueOf());

        const event = CPUEvent.alert(new Date('2019-05-14T10:02:58.135Z'));
        const alertingState = AlertingState.create([event]);

        const cpuLoad = CPULoad.create({
          load: 1.1,
          date: new Date('2019-05-14T11:00:59.135Z'),
        });
        const cpuloadState = CPULoadState.create([cpuLoad]);

        return expectSaga(alertingCPUWorker)
          .provide({
            select: composeMockedSelect(
              mockSelect(getAlertingState, alertingState),
              mockSelect(getCPULoadState, cpuloadState),
            ),
          })
          .dispatch(
            cpuLoadFetched(
              CPULoad.create({ load: 0, date: new Date('Invalid') }),
            ),
          )
          .delay(1)
          .silentRun(10)
          .then(result => {
            expect(result.effects.put).toBeUndefined();
          });
      });
      it('should change the status to normal if the average 2 minutes is now < 1', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            // When we create the Alerting State
            new Date('2019-05-14T01:01:58.135Z').valueOf(),
          )
          .mockImplementation(() => dateNow.valueOf());

        const event = CPUEvent.alert(new Date('2019-05-14T10:02:58.135Z'));
        const alertingState = AlertingState.create([event]);

        const dateNewEvent = new Date('2019-05-14T11:00:59.135Z');
        const cpuLoad = CPULoad.create({
          load: 0.5,
          date: dateNewEvent,
        });
        const cpuloadState = CPULoadState.create([cpuLoad]);

        return expectSaga(alertingCPUWorker)
          .provide({
            select: composeMockedSelect(
              mockSelect(getAlertingState, alertingState),
              mockSelect(getCPULoadState, cpuloadState),
            ),
          })
          .dispatch(
            cpuLoadFetched(
              CPULoad.create({ load: 0, date: new Date('Invalid') }),
            ),
          )
          .delay(1)
          .silentRun(10)
          .then(result => {
            expect(result.effects.put[0]).toStrictEqual(
              put(cpuHighLoadRecovered(dateNow)),
            );
            expect(result.effects.put).toHaveLength(1);
          });
      });
    });
    describe("when it's on normal average", () => {
      it('should not change the status to hight if the average 2 minutes < 1', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            // When we create the Alerting State
            new Date('2019-05-14T01:01:58.135Z').valueOf(),
          )
          .mockImplementation(() => dateNow.valueOf());

        const alertingState = AlertingState.create();

        const cpuLoad = CPULoad.create({
          load: 0.3,
          date: new Date('2019-05-14T11:00:59.135Z'),
        });
        const cpuloadState = CPULoadState.create([cpuLoad]);

        return expectSaga(alertingCPUWorker)
          .provide({
            select: composeMockedSelect(
              mockSelect(getAlertingState, alertingState),
              mockSelect(getCPULoadState, cpuloadState),
            ),
          })
          .dispatch(
            cpuLoadFetched(
              CPULoad.create({ load: 0, date: new Date('Invalid') }),
            ),
          )
          .delay(1)
          .silentRun(10)
          .then(result => {
            expect(result.effects.put).toBeUndefined();
          });
      });
      it('should change the status to high if the average 2 minutes is now > 1', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            // When we create the Alerting State
            new Date('2019-05-14T01:01:58.135Z').valueOf(),
          )
          .mockImplementation(() =>
            new Date('2019-05-14T11:01:58.135Z').valueOf(),
          );

        const alertingState = AlertingState.create();

        const dateNewEvent = new Date('2019-05-14T11:00:59.135Z');
        const cpuLoad = CPULoad.create({
          load: 2,
          date: dateNewEvent,
        });
        const cpuloadState = CPULoadState.create([cpuLoad]);

        return expectSaga(alertingCPUWorker)
          .provide({
            select: composeMockedSelect(
              mockSelect(getAlertingState, alertingState),
              mockSelect(getCPULoadState, cpuloadState),
            ),
          })
          .dispatch(
            cpuLoadFetched(
              CPULoad.create({ load: 0, date: new Date('Invalid') }),
            ),
          )
          .delay(1)
          .silentRun(10)
          .then(result => {
            expect(result.effects.put[0]).toStrictEqual(
              put(cpuHighLoadStarted(dateNow)),
            );
            expect(result.effects.put).toHaveLength(1);
          });
      });
    });
  });

  describe("when it's not started for a least 2 minutes", () => {
    const dateNow = new Date('2019-05-14T11:01:58.135Z');
    it('should not change the status to normal if the average 2 minutes > 1', () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => dateNow.valueOf());

      const event = CPUEvent.alert(dateNow);
      const alertingState = AlertingState.create([event]);

      const cpuLoad = CPULoad.create({
        load: 1.1,
        date: new Date('2019-05-14T11:02:59.135Z'),
      });
      const cpuloadState = CPULoadState.create([cpuLoad]);

      return expectSaga(alertingCPUWorker)
        .provide({
          select: composeMockedSelect(
            mockSelect(getAlertingState, alertingState),
            mockSelect(getCPULoadState, cpuloadState),
          ),
        })
        .dispatch(
          cpuLoadFetched(
            CPULoad.create({ load: 0, date: new Date('Invalid') }),
          ),
        )
        .delay(1)
        .silentRun(10)
        .then(result => {
          expect(result.effects.put).toBeUndefined();
        });
    });
    it('should not change the status to normal if the average 2 minutes is now < 1', () => {
      const event = CPUEvent.alert(dateNow);
      const alertingState = AlertingState.create([event]);

      const cpuLoad = CPULoad.create({
        load: 0.5,
        date: new Date('2019-05-14T11:02:59.135Z'),
      });
      const cpuloadState = CPULoadState.create([cpuLoad]);

      return expectSaga(alertingCPUWorker)
        .provide({
          select: composeMockedSelect(
            mockSelect(getAlertingState, alertingState),
            mockSelect(getCPULoadState, cpuloadState),
          ),
        })
        .dispatch(
          cpuLoadFetched(
            CPULoad.create({ load: 0, date: new Date('Invalid') }),
          ),
        )
        .delay(1)
        .silentRun(10)
        .then(result => {
          expect(result.effects.put).toBeUndefined();
        });
    });
  });
  describe("when it's on normal average", () => {
    it('should not change the status to hight if the average 2 minutes < 1', () => {
      const alertingState = AlertingState.create();

      const cpuLoad = CPULoad.create({
        load: 0.3,
        date: new Date('2019-05-14T11:02:59.135Z'),
      });
      const cpuloadState = CPULoadState.create([cpuLoad]);

      return expectSaga(alertingCPUWorker)
        .provide({
          select: composeMockedSelect(
            mockSelect(getAlertingState, alertingState),
            mockSelect(getCPULoadState, cpuloadState),
          ),
        })
        .dispatch(
          cpuLoadFetched(
            CPULoad.create({ load: 0, date: new Date('Invalid') }),
          ),
        )
        .delay(1)
        .silentRun(10)
        .then(result => {
          expect(result.effects.put).toBeUndefined();
        });
    });
    it('should change the status to high if the average 2 minutes is now > 1', () => {
      const alertingState = AlertingState.create();

      const cpuLoad = CPULoad.create({
        load: 2,
        date: new Date('2019-05-14T11:02:59.135Z'),
      });
      const cpuloadState = CPULoadState.create([cpuLoad]);

      return expectSaga(alertingCPUWorker)
        .provide({
          select: composeMockedSelect(
            mockSelect(getAlertingState, alertingState),
            mockSelect(getCPULoadState, cpuloadState),
          ),
        })
        .dispatch(
          cpuLoadFetched(
            CPULoad.create({ load: 0, date: new Date('Invalid') }),
          ),
        )
        .delay(1)
        .silentRun(10)
        .then(result => {
          expect(result.effects.put).toBeUndefined();
        });
    });
  });
});
