import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import MultiLeg from '@/lib/components/_MultiLeg';
import { unwindTypes, allLeg } from '@/constants/leg';
import { connect } from 'dva';
import { set, mapDeep } from '@/lib/utils';

@connect(state => {
  const { bookEditControl } = state;
  return {
    dataSourceItem: bookEditControl.curUnwindDataSourceItem,
    visible: bookEditControl.unwindModalVisible,
  };
})
class UnwindModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleLegChange = ({ dataSource }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bookEditControl/changeDataSourceItem',
      payload: dataSource[0],
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bookEditControl/switchUnwindModalVisible',
    });
  };

  handleModalOk = () => {
    const { dispatch, dataSourceItem } = this.props;
    dispatch({
      type: 'bookEdit/changeDataSourceItem',
      payload: dataSourceItem,
    });
    dispatch({
      type: 'bookEditControl/switchUnwindModalVisible',
    });
  };

  render() {
    const { dataSourceItem, visible } = this.props;

    if (!dataSourceItem) return null;

    const multiLegProps = {
      rowMenu: false,
      add: false,
      noAffix: true,
      dataSource: [dataSourceItem],
      onLegChange: this.handleLegChange,
      extraLeg: unwindTypes,
      legs: dataSourceItem.$types
        .map($type => allLeg.find(item => item.type === $type))
        .map(item => {
          // 设置已有类型为只读
          return set(item, 'columns', columns =>
            mapDeep(columns, column => set(column, 'readonly', true), 'children', false)
          );
        })
        .concat(unwindTypes),
    };

    const modalProps = {
      visible,
      closable: false,
      onCancel: this.handleCancel,
      onOk: this.handleModalOk,
    };

    return <Modal {...modalProps}>{dataSourceItem && <MultiLeg {...multiLegProps} />}</Modal>;
  }
}

export default UnwindModal;
