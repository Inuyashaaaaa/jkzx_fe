import Form, { Form2Props, IFormControl } from '@/containers/_Form2';
import { viewModel } from '@/containers/common/types';
import React from 'react';
import LinkageFormData from './$model';

export interface LinkageControl extends IFormControl {
  getValue?: (...depends: any[]) => any;
  depends?: string[];
}

export interface LinkageFormProps extends Form2Props {
  controls?: LinkageControl[];
  LinkageFormData: LinkageFormData;
}

class LinkageForm extends React.Component<LinkageFormProps> {
  public handleChangeValue = (value, changed) => {
    this.props.LinkageFormData.change(changed);
    if (this.props.onChangeValue) {
      this.props.onChangeValue(value, changed);
    }
  };

  public render() {
    const { LinkageFormData: _LinkageFormData, ...rest } = this.props;
    return (
      <Form
        {...rest}
        dataSource={_LinkageFormData.computedDataSource}
        onChangeValue={this.handleChangeValue}
      />
    );
  }
}

export default viewModel<LinkageFormProps, 'LinkageFormData'>(LinkageFormData, 'LinkageFormData')(
  LinkageForm
);
