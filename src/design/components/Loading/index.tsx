import { Icon, Spin } from 'antd';
import { SpinProps } from 'antd/lib/spin';
import React, { StatelessComponent } from 'react';

export interface LoadingProps extends SpinProps {
  loading?: boolean;
}

const Loading: StatelessComponent<LoadingProps> = ({
  children,
  className,
  loading = true,
  indicator,
  ...props
}) => {
  // ...rest
  // 不用 rest 是因为 umi dynamicImport 会注入其他参数
  return (
    <Spin
      indicator={indicator || <Icon type="loading" spin={true} />}
      wrapperClassName={className}
      spinning={loading}
      {...props}
    >
      {children}
    </Spin>
  );
};

export default Loading;
