import React from 'react';
import { storiesOf } from '@storybook/react';
import { StatusChipsAlert, StatusChipsRecovered } from './StatusChips';

storiesOf('StatusChips', module)
  .add('Alert', () => <StatusChipsAlert />)
  .add('Recovered', () => <StatusChipsRecovered />);
