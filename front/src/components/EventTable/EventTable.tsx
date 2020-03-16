import React from 'react';
import * as ArrayFP from 'fp-ts/es6/Array';
import { pipe } from 'fp-ts/es6/pipeable';
import styles from './EventTable.module.scss';

type Props = {
  /** React element that'll go to the top level of the event table */
  title: React.ReactNode;
  /** Array of rows */
  rows: {
    id: string;
    component: React.ReactElement;
  }[];
};

const EventTable = (props: Props) => {
  const { title, rows } = props;
  return (
    <div className={styles.container}>
      <div className={styles.row}>{title}</div>
      {pipe(
        rows,
        ArrayFP.map(elt => (
          <div key={elt.id} className={styles.row}>
            {elt.component}
          </div>
        )),
      )}
    </div>
  );
};

export default React.memo(EventTable);
