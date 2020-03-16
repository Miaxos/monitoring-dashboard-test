import React from 'react';
import styles from './EventRow.module.scss';
import { StatusChipsAlert, StatusChipsRecovered } from './StatusChips';

type PropsInternal = {
  date: string;
  status: React.ReactElement;
};

const EventRow = React.memo((props: PropsInternal) => {
  const { date, status } = props;
  return (
    <div className={styles.container}>
      <div className={styles.left}>{status}</div>
      <div className={styles.right}>{date}</div>
    </div>
  );
});

export const EventRowAlert = ({ date }: { date: string }) => (
  <EventRow date={date} status={<StatusChipsAlert />} />
);

export const EventRowRecovered = ({ date }: { date: string }) => (
  <EventRow date={date} status={<StatusChipsRecovered />} />
);
