import { SOCKET_MAP } from '@/constants/global';
import { SOCKET_EVENT_TYPE } from '@/constants/socket';
import { socketEventBus } from '@/services/socket';
import { ISourceTable } from '@/types';
import _ from 'lodash';
import React, { PureComponent } from 'react';

export const socketHOC = Component => {
  return class Wrapper extends PureComponent {
    public $child: ISourceTable = null;

    public componentDidMount = () => {
      socketEventBus.listen(SOCKET_EVENT_TYPE, this.reload);
    };

    public componentWillUnmount = () => {
      socketEventBus.unListen(SOCKET_EVENT_TYPE, this.reload);
    };

    public reload = event => {
      if (_.get(event, 'data.reportType') === SOCKET_MAP.ALL) {
        this.$child.fetch();
      }
    };

    public render() {
      return <Component {...this.props} ref={node => (this.$child = node)} />;
    }
  };
};
