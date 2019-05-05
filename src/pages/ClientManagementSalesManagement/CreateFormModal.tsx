import Form from '@/design/components/Form';
import React, { PureComponent } from 'react';
import { CREATE_FORM_CONTROLS } from './constants';

class CreateFormModal extends PureComponent {
  // public state = {
  //   dataSource: {},
  // };
  // public componentDidMount = () => {
  //   debugger;
  //   this.setState(
  //     {
  //       dataSource: {
  //         salesName: this.props.dataSource.salesName,
  //         cascSubBranch: [this.props.dataSource.subsidiaryName, this.props.dataSource.branchName],
  //       },
  //     },
  //     () => {
  //       console.log(this.state.dataSource.cascSubBranch);
  //       debugger;
  //     }
  //   );
  // };
  public onValueChange = params => {
    this.props.handleValueChange(params);
  };

  public render() {
    return (
      <>
        <Form
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
