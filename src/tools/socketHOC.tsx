import { SOCKET_MAP } from '@/constants/global';
import { SOCKET_EVENT_TYPE } from '@/constants/socket';
import { socketEventBus } from '@/services/socket';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { notification } from 'antd';

export const socketHOC = reportType => Component => {
  return class Wrapper extends PureComponent {
    public $reload: any = null;

    public componentDidMount = () => {
      socketEventBus.listen(SOCKET_EVENT_TYPE, this.reload);
    };

    public componentWillUnmount = () => {
      socketEventBus.unListen(SOCKET_EVENT_TYPE, this.reload);
    };

    public reload = event => {
      if (this.$reload && _.get(event, 'data.reportType') === reportType) {
        notification.success({
          message: '页面数据已刷新',
          description: '接受到计算完成通知',
        });
        this.$reload();
      }
    };

    public render() {
      return <Component {...this.props} getReload={reload => (this.$reload = reload)} />;
    }
  };
};
