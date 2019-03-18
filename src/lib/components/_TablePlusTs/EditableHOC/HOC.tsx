import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { EditableBaseRowProps } from '../types';

const mapPropsToFields = props => {
  const { record } = props;
  const result = _.mapValues(record, value => Form.createFormField({ value }));
  return result;
};

const onValuesChange = (props, field) => {
  const { onEditCell, record } = props;
  if (onEditCell) {
    onEditCell(record, field);
  }
};

const WrapRowHOC = (BaseRow: React.ComponentClass<EditableBaseRowProps>) =>
  Form.create({
    mapPropsToFields,
    onValuesChange,
  })(BaseRow);

export default WrapRowHOC;
