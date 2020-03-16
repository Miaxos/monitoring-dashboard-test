import * as io from 'io-ts';
import { CPUFetcher } from '../../infrastructure/apiRoutes';

// eslint-disable-next-line @typescript-eslint/camelcase
const CPUCodec = io.type({ cpu_load: io.number });

export const CPUService = CPUFetcher.handle(
  200,
  result => result.cpu_load,
  CPUCodec,
).toTaskEither();
