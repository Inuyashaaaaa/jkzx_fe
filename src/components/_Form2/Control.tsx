import { Form } from 'antd';
import { ColProps } from 'antd/lib/col';
import { FormItemProps } from 'antd/lib/form';
import memo from 'memoize-one';
import React, { FunctionComponent } from 'react';

const { Item: FormItem } = Form;

export type IColSpace = ColProps | number;

export interface ControlProps extends FormItemProps {
  labelSpace?: IColSpace;
  wrapperSpace?: IColSpace;
}

const converCol = memo(col => {
  if (!col) {
    return {};
  }
  if (typeof col === 'number') {
    return { md: { span: col } };
  }
  if (col.span) {
    return { md: col };
  }
  return col;
});

const getCol = memo((labelSpace, wrapperSpace) => {
  if (!labelSpace && !wrapperSpace) {
    return {};
  }

  labelSpace = converCol(labelSpace);
  wrapperSpace = converCol(wrapperSpace);

  Object.keys(labelSpace).forEach(key => {
    if (wrapperSpace[key]) return;
    wrapperSpace[key] = {
      span: 24 - labelSpace[key].span,
    };
  });

  Object.keys(wrapperSpace).forEach(key => {
    if (labelSpace[key]) return;
    labelSpace[key] = {
      span: 24 - wrapperSpace[key].span,
    };
  });

  return { labelSpace, wrapperSpace };
});

const Control: FunctionComponent<ControlProps> = (props): JSX.Element => {
  const { labelSpace, wrapperSpace, ...restProps } = props;

  const computedCol = getCol(labelSpace, wrapperSpace);

  return (
    <FormItem
      labelCol={computedCol.labelSpace}
      wrapperCol={computedCol.wrapperSpace}
      {...restProps}
    />
  );
};

export default Control;
