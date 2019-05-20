import Form from '@/components/Form';
import React, { PureComponent } from 'react';
import { CREATE_FORM_CONTROLS } from './constants';

class CreateFormModal extends PureComponent {
  public onValueChange = params => {
    this.props.handleValueChange(params);
  };

  public render() {
    return (
      <>
        <Form
          ref={node => (this.props.refCreateFormModal ? this.props.refCreateFormModal(node) : null)}
          dataSource={this.props.dataSource}
          controls={CREATE_FORM_CONTROLS(this.props.branchSalesList)}
          footer={false}
          onValueChange={this.onValueChange}
          controlNumberOneRow={1}
        />
      </>
    );
  }
}

export default CreateFormModal;
