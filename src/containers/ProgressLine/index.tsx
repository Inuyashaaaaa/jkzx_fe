import React, { PureComponent, memo } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import NProgress from 'nprogress';

const ProgressLine = memo(() => {
  useLifecycles(
    () => {
      NProgress.start();
    },
    () => {
      NProgress.done();
    }
  );

  return null;
});

export default ProgressLine;
