import { delay } from '@/design/utils';
import { reloadAirflowTrigger } from '@/services/report-service';
import { Button } from 'antd';
import React, { PureComponent } from 'react';

class ReloadGreekButton extends PureComponent<any, any> {
  public state = {
    reloading: false,
  };

  public onReload = async () => {
    this.setState({
      reloading: true,
    });
    await delay(250);
    await reloadAirflowTrigger(this.props.id);
    this.setState({
      reloading: false,
    });
  };

  public onReloadButtonClick = () => {
    if (!this.props.fetchTable) return;
    this.props.fetchTable();
  };

  public render() {
    const { reloading } = this.state;

    return (
      <Button.Group>
        <Button loading={reloading} icon="reload" onClick={this.onReload} disabled={true}>
          重新计算
        </Button>
        <Button type="primary" onClick={this.onReloadButtonClick}>
          刷新计算结果
        </Button>
      </Button.Group>
    );
  }
}

export default ReloadGreekButton;
