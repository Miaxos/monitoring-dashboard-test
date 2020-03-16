import React from 'react';
import styles from './TitleBar.module.scss';

type Props = {
  title: string;
};

const TitleBar = (props: Props) => {
  const { title } = props;
  return <header className={styles.TitleBar}>{title}</header>;
};

export default React.memo(TitleBar);
