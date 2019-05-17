import SourceTable from '@/design/components/SourceTable';
import { trdTradeLCMEventList } from '@/services/general-service';
import { Modal } from 'antd';
import produce from 'immer';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';
import { OVERVIEW_TABLE_COLUMNDEFS, ROW_KEY } from './constants';
import moment from 'moment';

class LifeModalTable extends PureComponent<
  {
    modalVisible: boolean;
    lifeTableData: any;
    handleCancelVisible: any;
  },
  any
> {
  public state = {
    modalVisiable: false,
    lifeLoading: false,
    lifeTableData: [],
  };

  public fetchOverviewTableData = async () => {
    this.switchLifeLoading();
    const { error, data } = await trdTradeLCMEventList({
      tradeId: this.props.rowData[ROW_KEY],
    });
    this.switchLifeLoading();
    if (error) return;
    const result = [...data];
    result.sort((item1, item2) => {
      return moment(item1.createdAt).valueOf() - moment(item2.createdAt).valueOf();
    });
    this.setState({
      lifeTableData: result.map(item => {
        return {
          ...item,
          uuid: uuidv4(),
        };
      }),
    });
  };

  public switchLifeLoading = () => {
    this.setState(
      produce((state: any) => {
        state.lifeLoading = !state.lifeLoading;
      })
    );
  };

  public handleOk = async () => {
    this.setState({
      modalVisiable: false,
    });
  };

  public handleCancel = () => {
    this.props.handleCancelVisible();
  };

  public showModal = async event => {
    this.setState(
      {
        modalVisiable: true,
      },
      () => {
        this.fetchOverviewTableData();
      }
    );
  };

  public render() {
    let { lifeTableData } = this.props;
    lifeTableData = _.reverse(_.sortBy(lifeTableData, 'createdAt'));
    return (
      <Modal
        width={1200}
        title="生命周期事件概览"
        footer={false}
        closable={true}
        onOk={this.handleOk}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
      >
        <SourceTable
          rowKey={'uuid'}
          loading={this.state.lifeLoading}
          dataSource={lifeTableData}
          columnDefs={OVERVIEW_TABLE_COLUMNDEFS}
          pagination={false}
        />
      </Modal>
    );
  }
}

export default LifeModalTable;
