import React from 'react';
import className from 'classnames';
import styles from './Flashing.module.less';

const Flashing: React.FC = () => {
  return <div className={className(styles.flashing, 'bg-black dark:bg-white')} />;
};

export default Flashing;
