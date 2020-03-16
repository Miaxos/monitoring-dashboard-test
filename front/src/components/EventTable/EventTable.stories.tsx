import React from 'react';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import EventTable from './EventTable';
import { EventRowAlert } from './EventRow';

const generateRow = (id: string) => ({
  id,
  component: <EventRowAlert date="A date" />,
});

const rows = Array.from(Array(20).keys()).map((_, index) =>
  generateRow(String(index)),
);

storiesOf('EventTable', module)
  .addDecorator(centered)
  .add('Default', () => {
    return (
      <div style={{ width: 500, height: 500, border: '1px black solid' }}>
        <EventTable title="Blbl" rows={rows} />
      </div>
    );
  });
