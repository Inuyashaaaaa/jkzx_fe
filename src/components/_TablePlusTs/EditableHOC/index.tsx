import React, { PureComponent } from 'react';
import { AntdTableProps, EditableProps, InjectEditableBaseRowProps } from '../types';
import EditableRowHOC from './EditableRowHOC';

const getRow = (old: React.ReactType) => {
  return EditableRowHOC(old);
};

const getComponents = components => {
  const { body = {} } = components;
  const { row = 'div', cell } = body;

  return {
    ...components,
    body: {
      ...body,
      row: getRow(row),
      // cell: this.getCell(cell)
    },
  };
};

const getOnRow = (oldOnRow, components, rowKey, editable) => {
  const { body = {} } = components;

  return (record, index): InjectEditableBaseRowProps => {
    return {
      ...oldOnRow(record, index),
      index,
      editable,
      rowId: record[rowKey],
    };
  };
};

const EditableHOC = (options = {}) => (Table: React.ComponentClass<AntdTableProps>) =>
  class EditableTable extends PureComponent<EditableProps> {
    public static defaultProps = {
      components: {},
      onRow: () => {},
    };

    public render() {
      const { components, onRow, editable, ...restProps } = this.props;
      const { rowKey } = restProps;

      return (
        <Table
          components={getComponents(components)}
          onRow={getOnRow(onRow, components, rowKey, editable)}
          {...restProps}
        />
      );
    }
  };

export default EditableHOC;
