import SourceTable from '@/design/components/SourceTable';
import { queryProcessToDoList } from '@/services/approval';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { PENDING_COL_DEFS } from './constants';

class Pending extends PureComponent {
  public state = {
    dataSource: [],
    loading: false,
  };

  public componentDidMount = () => {
    this.fetchTable();
  };

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });

    const { error, data } = await queryProcessToDoList();
    this.setState({ loading: false });
    if (error) return;
    const result = data.map(item => {
      const obj = { ...item };
      if (obj.processInstance) {
        Object.assign(obj, obj.processInstance);
      }
      obj.initiatorName = (obj.initiator && obj.initiator.userName) || '';
      obj.operatorName = (obj.operator && obj.operator.userName) || '';
      // obj.startTime = moment(obj.startTime).format('YYYY-MM-DD hh:mm:ss');
      return obj;
    });

    this.setState({
      dataSource: result.sort((item1, item2) => {
        return moment(item1.startTime).valueOf() - moment(item2.startTime).valueOf();
      }),
    });
  };

  public render() {
    return (
      <>
        <SourceTable
          rowKey="taskId"
          loading={this.state.loading}
          dataSource={this.state.dataSource}
          columnDefs={PENDING_COL_DEFS(this.fetchTable)}
          autoSizeColumnsToFit={false}
        />
      </>
    );
  }
}

export default Pending;
