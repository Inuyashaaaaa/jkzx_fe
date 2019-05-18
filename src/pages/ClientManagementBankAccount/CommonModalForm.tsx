import Form from '@/components/Form';
import React, { PureComponent } from 'react';
import { CREATE_FORM_CONTROLS } from './constants';

class CommonModalForm extends PureComponent<{
  createFormData: any;
  onCreateFormChange: any;
}> {
  public state = {};

  public onCreateFormChange = params => {
    this.props.onCreateFormChange(params);
  };
  public render() {
    return (
      <Form
        controls={CREATE_FORM_CONTROLS}
        dataSource={this.props.createFormData}
        footer={false}
        controlNumberOneRow={1}
        onValueChange={this.onCreateFormChange}
      />
    );
  }
}

export default CommonModalForm;
