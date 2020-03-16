import React from 'react';
import { storiesOf } from '@storybook/react';
import { EventRowAlert } from './EventRow';

storiesOf('EventRow', module).add('Default', () => {
  return <EventRowAlert date="A date" />;
});
