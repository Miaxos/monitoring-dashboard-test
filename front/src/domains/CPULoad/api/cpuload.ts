import * as ArrayFP from 'fp-ts/es6/Array';
import * as Either from 'fp-ts/es6/Either';
import { createOpaqueAPI } from '@iadvize-oss/opaque-type';
import { pipe } from 'fp-ts/es6/pipeable';
import { sequenceS } from 'fp-ts/es6/Apply';

const sequenceSEither = sequenceS(Either.either);

type $CPULoad = Either.Either<
  Error,
  {
    load: number;
    date: Date;
  }
>;

/**
 * A CPU Load can be either Valid or Invalid.
 */
const CPULoad = createOpaqueAPI<'CPU_LOAD', $CPULoad>('CPU_LOAD');

export type CPULoad = ReturnType<typeof CPULoad.toOpaque>;

/**
 * Function to create a CPULoad
 */
export function create(payload: { load: number; date: Date }) {
  return pipe(
    payload,
    elt =>
      sequenceSEither({
        date:
          elt.date.toString() === 'Invalid Date'
            ? Either.left(new Error('Invalid Date'))
            : Either.right(elt.date),
        load: Either.right(elt.load),
      }),
    CPULoad.toOpaque,
  );
}

/**
 * Function to get the data from a CPULoad
 */
export function get(cpuLoad: CPULoad) {
  return pipe(cpuLoad, CPULoad.fromOpaque);
}

/**
 * Get average from an array of CPULoad
 */
export function average(cpuLoads: CPULoad[]) {
  return pipe(
    cpuLoads,
    ArrayFP.map(CPULoad.fromOpaque),
    ArrayFP.rights,
    elt => [elt.length, elt] as const,
    ([length, elt]) =>
      pipe(
        elt,
        ArrayFP.reduce(0, (acc, curr) => curr.load + acc),
        sum => sum / length,
      ),
  );
}
