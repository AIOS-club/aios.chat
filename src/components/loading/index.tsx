import React from 'react';
import classNames from 'classnames';
import styles from './Loading.module.less';

const Loading: React.FC = function Loading() {
  return (
    <div className={classNames('absolute text-2xl p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2', styles.loading)}>
      <span>.</span>
      <span className={styles.loadingFirst}>.</span>
      <span className={styles.loadingSecond}>.</span>
    </div>
  );
};

export default Loading;
