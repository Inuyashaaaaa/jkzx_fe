import React, { PureComponent } from 'react';
import { Popconfirm, Divider, Modal, message } from 'antd';
import { Form2 } from '@/containers';
import { editFormControls } from './services';
import { mktInstrumentCreate, mktInstrumentDelete } from '@/services/market-data-service';
import _ from 'lodash';
import moment, { isMoment } from 'moment';

class Operation extends PureComponent<{ record: any; fetchTable: any }> {
  public $form: Form2 = null;

  public state = {
    editVisible: false,
    editFormControls: {},
    editFormData: {},
  };

  public onRemove = async () => {
    const { error } = await mktInstrumentDelete({
      instrumentId: this.props.record.instrumentId,
    });
    if (error) {
      message.error('删除失败');
      return;
    }
    message.success('删除成功');
    this.props.fetchTable();
  };

  public switchModal = () => {
    const data = _.mapValues(this.props.record, (value, key) => {
      if (key === 'maturity') {
        return moment(value);
      }
      return value;
    });
    this.setState({
      editVisible: !this.state.editVisible,
      editFormData: Form2.createFields(data),
      editFormControls: editFormControls(this.props.record, 'edit'),
    });
  };

  public composeInstrumentInfo = modalFormData => {
    const instrumentInfoFields = ['multiplier', 'name', 'exchange', 'maturity'];
    let instrumentInfoSomeFields = ['multiplier', 'name', 'exchange', 'maturity'];
    if (modalFormData.instrumentType === 'INDEX') {
      instrumentInfoSomeFields = ['name', 'exchange'];
    }
    const params = {
      ..._.omit(modalFormData, instrumentInfoFields),
      instrumentInfo: this.omitNull(_.pick(modalFormData, instrumentInfoSomeFields)),
    };
    return this.omitNull(params);
  };

  public omitNull = obj => _.omitBy(obj, val => val === null);

  public onEdit = async () => {
    const rsp = await this.$form.validate();
    if (rsp.error) return;
    const editFormData = Form2.getFieldsValue(this.state.editFormData);
    const { error, data } = await mktInstrumentCreate(this.composeInstrumentInfo(editFormData));
    if (error) {
      message.error('编辑失败');
      return;
    }
    message.success('编辑成功');
    this.setState({
      editVisible: false,
    });
    this.props.fetchTable();
    return;
  };

  public filterFormData = (allFields, fields) => {
    const changed = Form2.getFieldsValue(fields);
    const formData = Form2.getFieldsValue(allFields);
    if (Object.keys(changed)[0] === 'assetClass') {
      return {
        ..._.pick(this.props.record, ['instrumentId']),
        ...changed,
      };
    }
    if (changed.instrumentType === 'STOCK') {
      return {
        ...formData,
        multiplier: 1,
      };
    }
    return formData;
  };

  public onEditFormChange = (props, fields, allFields) => {
    const columns = editFormControls(Form2.getFieldsValue(allFields), 'edit');
    this.setState({
      editFormControls: columns,
      editFormData: Form2.createFields(this.filterFormData(allFields, fields)),
    });
  };

  public render() {
    return (
      <>
        <a href="javascript:;" style={{ color: '#1890ff' }} onClick={this.switchModal}>
          编辑
        </a>
        <Divider type="vertical" />
        <Popconfirm title="确定要删除吗？" onConfirm={this.onRemove}>
          <a href="javascript:;" style={{ color: 'red' }}>
            删除
          </a>
        </Popconfirm>
        <Modal
          visible={this.state.editVisible}
          onOk={this.onEdit}
          onCancel={this.switchModal}
          title={'编辑标的物'}
        >
          <Form2
            ref={node => (this.$form = node)}
            columns={this.state.editFormControls}
            dataSource={this.state.editFormData}
            onFieldsChange={this.onEditFormChange}
            footer={false}
          />
        </Modal>
      </>
    );
  }
}

export default Operation;
