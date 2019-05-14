import { delay } from '@/design/utils';
import { reloadAirflowTrigger } from '@/services/report-service';
import { Button, notification, message } from 'antd';
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
    const { raw = {} } = await reloadAirflowTrigger(this.props.id);
    if (raw.error) {
      notification.error({
        message: '请求失败',
        description: raw.error,
      });
    }
    if (raw.message) {
      notification.success({
        message: '触发成功',
        description: '计算过程可能需要一段时间',
      });
    }
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
        {!this.props.hideReload && (
          <Button loading={reloading} icon="reload" onClick={this.onReload}>
            重新计算
          </Button>
        )}
        <Button type="primary" onClick={this.onReloadButtonClick}>
          刷新计算结果
        </Button>
      </Button.Group>
    );
  }
}

export default ReloadGreekButton;
