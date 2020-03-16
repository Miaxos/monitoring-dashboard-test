import React from 'react';
import styles from './StatusChips.module.scss';

type PropsInternal = {
  /** React element that'll go to the top level of the event table */
  title: React.ReactNode;
  className: string;
};

const StatusChips = React.memo((props: PropsInternal) => {
  const { title, className } = props;
  return <span className={className}>{title}</span>;
});

export const StatusChipsAlert = () => (
  <StatusChips title="High CPU Alert" className={styles.alert} />
);

export const StatusChipsRecovered = () => (
  <StatusChips title="Recovered CPU Alert" className={styles.recovered} />
);
