import React from 'react';
import { storiesOf } from '@storybook/react';
import { useState, useEffect } from '@storybook/addons';
import { constVoid } from 'fp-ts/es6/function';
import TimeseriesChart from './TimeseriesChart';

function generateData() {
  const data = [
    {
      date: new Date(2050, 1, 1, 1 % 23, 1 % 60),
      value: 50,
    },
  ];

  // eslint-disable-next-line no-plusplus
  for (let i = 2; i <= 20; i++) {
    data.push({
      date: new Date(2050, 1, i, i % 23, i % 60),
      value: Math.random() * 100,
    });
  }
  return data;
}

const defaultData = generateData();

storiesOf('TimeseriesChart', module)
  .add('Update data every second', () => {
    const [count, setCount] = useState(1);
    const [stateData, setState] = useState([
      {
        date: new Date(2050, 1, 1, count, count),
        value: 50,
      },
    ]);

    useEffect(() => {
      setTimeout(() => {
        setState(prevState => [
          ...prevState,
          {
            value: Math.random() * 100,
            date: new Date(2050, 1, 1, count % 23, count % 60),
          },
        ]);
        setCount(count + 1);
      }, 1000);
      return constVoid;
    }, [count]);

    return <TimeseriesChart name="blbl" data={stateData} />;
  })
  .add('default', () => <TimeseriesChart name="blbl" data={defaultData} />);
