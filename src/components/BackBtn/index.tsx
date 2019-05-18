import { Button } from 'antd';
import React, { PureComponent } from 'react';
import router from 'umi/router';

export interface BackBtnProps {
  name?: string;
}

class BackBtn extends PureComponent<BackBtnProps, {}> {
  public static defaultProps = {
    name: '返回上一页',
  };

  public handleBack = (): void => {
    router.goBack();
  };

  public render() {
    const { name } = this.props;
    return (
      <Button type="primary" icon="rollback" onClick={this.handleBack}>
        {name}
      </Button>
    );
  }
}

export default BackBtn;
