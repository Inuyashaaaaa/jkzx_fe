import React, { PureComponent } from 'react';
import Form from '@/containers/Form';
import { CREATE_FORM_CONTROLS } from './constants';
import { Form2 } from '@/containers';

class CommonModalForm extends PureComponent<{
  createFormData: any;
  onCreateFormChange: any;
  refCreateFormModal: any;
}> {
  public state = {};

  public onCreateFormChange = (props, changedFields, allFields) => {
    this.props.onCreateFormChange(props, changedFields, allFields);
  };

  public render() {
    return (
      <Form2
        ref={node => (this.props.refCreateFormModal ? this.props.refCreateFormModal(node) : null)}
        columns={CREATE_FORM_CONTROLS}
        dataSource={this.props.createFormData}
        footer={false}
        onFieldsChange={this.onCreateFormChange}
      />
    );
  }
}

export default CommonModalForm;
