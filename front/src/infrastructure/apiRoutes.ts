/**
 * We got our api Routes there.
 */

import { Fetcher } from 'fetcher-ts';

const baseRoute = 'http://localhost:8000/api';

const cpuRoute = `${baseRoute}/os/cpu`;

type GetCPUResults = {
  code: 200;
  payload: {
    // eslint-disable-next-line @typescript-eslint/camelcase
    cpu_load: number;
  };
};

export const CPUFetcher = new Fetcher<GetCPUResults, number>(cpuRoute);
