import React from 'react';
import * as ArrayFP from 'fp-ts/es6/Array';
import { pipe } from 'fp-ts/es6/pipeable';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

type Row = {
  date: Date;
  value: number;
};

type Props = {
  /** Timeseries input for the chart */
  data: Row[];
  referencesLines?: {
    color: string;
    date: Row['date'];
  }[];
  name: string;
};

const TimeseriesChart = (props: Props) => {
  const { data, name, referencesLines } = props;

  const dataToShow = pipe(
    data,
    ArrayFP.map(elt => ({
      date: elt.date.toLocaleTimeString(),
      value: elt.value.toFixed(2),
    })),
  );

  return (
    <ResponsiveContainer width="100%" height="30%">
      <LineChart
        layout="horizontal"
        width={500}
        height={300}
        data={dataToShow}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {pipe(
          referencesLines || [],
          ArrayFP.map(line => (
            <ReferenceLine
              x={line.date.toLocaleTimeString()}
              stroke={line.color}
              key={line.date.valueOf()}
            />
          )),
        )}
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" type="category" />
        <YAxis dataKey="value" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          dot={false}
          stroke="#82ca9d"
          name={name}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeseriesChart;
