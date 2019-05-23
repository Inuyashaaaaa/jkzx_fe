import { Icon, Spin } from 'antd';
import { SpinProps } from 'antd/lib/spin';
import React, { StatelessComponent } from 'react';

export interface LoadingProps extends SpinProps {
  loading?: boolean;
}

const Loading: StatelessComponent<LoadingProps> = ({
  children,
  className,
  tip,
  loading = true,
  delay,
  indicator,
  size,
}) => {
  // ...rest
  // 不用 rest 是因为 umi dynamicImport 会注入其他参数
  return (
    <Spin
      indicator={indicator || <Icon type="loading" spin={true} />}
      wrapperClassName={className}
      tip={tip}
      spinning={loading}
      delay={delay}
      size={size}
    >
      {children}
    </Spin>
  );
};

export default Loading;
