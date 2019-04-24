import { Form2, InputNumber } from '@/design/components';
import { clientSaveAccountOpRecord } from '@/services/reference-data-service';
import { Button, message, Modal } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React, { PureComponent } from 'react';

class Operation extends PureComponent<{ record: any; fetchTable: any }> {
  public $form: Form2 = null;

  public state = {
    visible: false,
    formData: {
      counterPartyCreditChange: {
        type: 'field',
        value: this.props.record.counterPartyCredit,
      },
      creditChange: {
        type: 'field',
        value: this.props.record.credit,
      },
    },
  };

  public switchModal = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  public onConfirm = async () => {
    const { error: _error } = await this.$form.validate();
    if (_error) return;
    const params = _.mapValues(this.state.formData, item => _.get(item, 'value'));
    const { error, data } = await clientSaveAccountOpRecord({
      accountOpRecord: {
        ...params,
        accountId: this.props.record.accountId,
        event: 'CHANGE_CREDIT',
      },
    });
    this.setState({
      visible: false,
    });
    if (error) {
      message.error('修改失败');
      return;
    }
    message.success('修改成功');
    this.props.fetchTable();
  };

  public onFieldsChange = (props, changedFields, allFields) => {
    this.setState({
      formData: allFields,
    });
  };

  public render() {
    return (
      <>
        <Button type="primary" onClick={this.switchModal} size="small">
          调整授信额度
        </Button>
        <Modal
          visible={this.state.visible}
          onOk={this.onConfirm}
          onCancel={this.switchModal}
          title="调整授信额度"
        >
          <Form2
            ref={node => (this.$form = node)}
            dataSource={this.state.formData}
            onFieldsChange={this.onFieldsChange}
            submitable={false}
            resetable={false}
            footer={false}
            columns={[
              {
                title: '我方授信总额',
                dataIndex: 'counterPartyCreditChange',
                render: (value, record, index, { form, editing }) => {
                  return (
                    <FormItem>
                      {form.getFieldDecorator({
                        rules: [
                          {
                            required: true,
                            message: '我方授信额度是必填项',
                          },
                        ],
                      })(<InputNumber min={0} precision={4} />)}
                    </FormItem>
                  );
                },
              },
              {
                title: '客户授信总额',
                dataIndex: 'creditChange',
                render: (value, record, index, { form, editing }) => {
                  return (
                    <FormItem>
                      {form.getFieldDecorator({
                        rules: [
                          {
                            required: true,
                            message: '客户授信额度是必填项',
                          },
                        ],
                      })(<InputNumber min={0} precision={4} />)}
                    </FormItem>
                  );
                },
              },
            ]}
          />
        </Modal>
      </>
    );
  }
}

export default Operation;
