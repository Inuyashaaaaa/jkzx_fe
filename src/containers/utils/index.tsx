import { WrappedFormUtils } from 'antd/lib/form/Form';

export const wrapFormGetDecorator = (dataIndex, form: WrappedFormUtils) => {
  const old = form.getFieldDecorator;
  return {
    ...form,
    getFieldDecorator() {
      if (!arguments.length) {
        return old.apply(this, [dataIndex, {}]);
      }
      if (typeof arguments[0] === 'object') {
        return old.apply(this, [dataIndex, ...arguments]);
      }
      return old.apply(this, arguments);
    },
  };
};
