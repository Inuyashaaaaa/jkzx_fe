import { WrappedFormUtils } from 'antd/lib/form/Form';

export const wrapFormGetDecorator = (dataIndex, form: WrappedFormUtils, initialValue: any) => {
  const old = form.getFieldDecorator;
  form.getFieldDecorator = function() {
    if (typeof arguments[0] === 'object') {
      return old.apply(this, [
        dataIndex,
        {
          initialValue,
          ...arguments[0],
        },
      ]);
    }
    return old.apply(this, [
      arguments[0],
      {
        initialValue,
        ...arguments[1],
      },
    ]);
  };
  return form;
};
