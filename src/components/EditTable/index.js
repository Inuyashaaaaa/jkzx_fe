import { SPLIT } from '@/components/EditTable/contants';
import { EditTableBase as types } from '@/components/EditTable/types';
import { DATE_FIELDS } from '@/components/_InputControl/constants';
import FormControl from '@/components/_FormControl';
import { Button, Divider, Form, Row, Table } from 'antd';
import lodash from 'lodash';
import moment, { isMoment } from 'moment';
import React, { PureComponent } from 'react';
import styles from './index.less';

function generateUnionKey(rowKey) {
  return {
    [rowKey]: new Date().getTime(),
    $new: true,
  };
}

@Form.create({
  mapPropsToFields(props) {
    const { dataSource = [], columns } = props;

    const formatedDataSource = dataSource.map(rowData => {
      return lodash.mapValues(rowData, (value, dataIndex) => {
        const column = columns.find(item => item.dataIndex === dataIndex);
        if (column && DATE_FIELDS.includes(column.type) && column.format && value) {
          return moment(value, column.format);
        }
        return value;
      });
    });

    // @todo cache
    const formData = formatedDataSource
      .map(item => lodash.mapKeys(item, (value, ikey) => `${item.id}${SPLIT}${ikey}`))
      .reduce((obj, next) => ({ ...obj, ...next }), {});

    return lodash.mapValues(formData, value => {
      return Form.createFormField({ value });
    });
  },

  onFieldsChange(props, changedFields) {
    const { dataSource, columns, onEdit } = props;
    const field = changedFields[Object.keys(changedFields)[0]];
    const { name } = field;
    const [dataSourceItemId, dataIndex] = name.split(SPLIT);

    let { value } = field;

    if (value === null) {
      value = undefined;
    }

    if (isMoment(value)) {
      const column = columns.find(item => item.dataIndex === dataIndex);
      if (column && column.format) {
        value = value.format(column.format);
      }
    }

    const nextDataSource = dataSource.map(dataSourceItem => {
      if (Number(dataSourceItemId) === dataSourceItem.id) {
        return {
          ...dataSourceItem,
          [dataIndex]: value,
        };
      }
      return dataSourceItem;
    });

    onEdit?.({
      action: 'change',
      dataSource: nextDataSource,
      value,
    });
  },
})
class EditTableBase extends PureComponent {
  static propTypes = types;

  static defaultProps = {
    actions: ['copy', 'up', 'down', 'create', 'remove'],
    columns: [],
    rowKey: 'id',
  };

  handleOperateRow = ({ index, action, direction }) => {
    const { dataSource, onEdit, rowKey } = this.props;

    if (action === 'add') {
      const nextDataSource = [...dataSource];
      const nextItem = generateUnionKey(rowKey);
      nextDataSource.splice(index + 1, 0, nextItem);
      return onEdit?.({
        action,
        value: nextItem,
        dataSource: nextDataSource,
      });
    }

    if (action === 'remove') {
      const nextDataSource = [...dataSource];
      const nextItem = nextDataSource.splice(index, 1);
      return onEdit?.({
        action,
        value: nextItem,
        dataSource: nextDataSource,
      });
    }

    if (action === 'move') {
      const nextDataSource = [...dataSource];
      const [removeItem] = nextDataSource.splice(index, 1);
      if (direction === 'up') {
        action = 'moveup';
        if (index <= 0) return;
        nextDataSource.splice(index - 1, 0, removeItem);
        return onEdit?.({
          action,
          value: removeItem,
          dataSource: nextDataSource,
        });
      }
      if (direction === 'down') {
        action = 'movedown';
        if (index >= dataSource.length - 1) return;
        nextDataSource.splice(index + 1, 0, removeItem);
        return onEdit?.({
          action,
          value: removeItem,
          dataSource: nextDataSource,
        });
      }
    }

    if (action === 'copy') {
      const nextDataSource = [...dataSource];
      const nextItem = {
        ...nextDataSource[index],
        [rowKey]: nextDataSource[index][rowKey] + new Date().getTime(),
        $copy: true,
      };
      nextDataSource.splice(index + 1, 0, nextItem);

      return onEdit?.({
        action,
        dataSourceItem: nextItem,
        dataSource: nextDataSource,
      });
    }
  };

  handleCreateNewRow = () => {
    const { onEdit, rowKey } = this.props;
    const nextItem = generateUnionKey(rowKey);
    onEdit?.({
      action: 'add',
      dataSource: [nextItem],
      dataSourceItem: nextItem,
    });
  };

  render() {
    const { columns, form, dataSource, actions, hideOperate, ...tableProps } = this.props;

    const actionElements = {
      copy: params => (
        <Button
          icon="copy"
          size="small"
          onClick={() =>
            this.handleOperateRow({
              ...params,
              action: 'copy',
            })
          }
        />
      ),
      create: params => (
        <Button
          icon="plus"
          size="small"
          onClick={() =>
            this.handleOperateRow({
              ...params,
              action: 'add',
            })
          }
        />
      ),
      remove: params => (
        <Button
          icon="minus"
          size="small"
          onClick={() =>
            this.handleOperateRow({
              ...params,
              action: 'remove',
            })
          }
        />
      ),
      up: params => (
        <Button
          disabled={params.index === 0}
          icon="arrow-up"
          size="small"
          onClick={() =>
            this.handleOperateRow({
              ...params,
              action: 'move',
              direction: 'up',
            })
          }
        />
      ),
      down: params => (
        <Button
          disabled={params.index === dataSource.length - 1}
          icon="arrow-down"
          size="small"
          onClick={() =>
            this.handleOperateRow({
              ...params,
              action: 'move',
              direction: 'down',
            })
          }
        />
      ),
    };

    const afterColumns = columns
      .map(column => {
        if (column.render) {
          return column;
        }

        const { rules, ...field } = column;
        const { dataIndex } = field;
        return {
          ...column,
          render: (text, record) => {
            const key = `${record.id}${SPLIT}${dataIndex}`;

            // @todo cache
            const formData = lodash
              .map(dataSource, item =>
                lodash.mapKeys(item, (value, ikey) => `${item.id}${SPLIT}${ikey}`)
              )
              .reduce((obj, next) => ({ ...obj, ...next }), {});

            return form.getFieldDecorator(key, {
              rules,
            })(
              <FormControl
                field={{
                  ...field,
                  dataIndex: key,
                }}
                formData={formData}
              />
            );
          },
        };
      })
      .concat(
        hideOperate
          ? []
          : [
              {
                title: '操作',
                dataIndex: 'cz',
                onCell: () => {
                  return {
                    className: styles.noBgColor,
                  };
                },
                render: (text, record, index) => {
                  return (
                    <Row type="flex" justify="center" align="middle">
                      {actions.map((action, iindex) => {
                        return (
                          <div key={action}>
                            {actionElements[action]({
                              text,
                              record,
                              index,
                            })}
                            {actions.length - 1 !== iindex && <Divider type="vertical" />}
                          </div>
                        );
                      })}
                    </Row>
                  );
                },
              },
            ]
      );
    return dataSource.length === 0 && !tableProps.loading?.spinning ? (
      <Button block type="dashed" onClick={this.handleCreateNewRow}>
        新增一行
      </Button>
    ) : (
      <Table {...tableProps} dataSource={dataSource} columns={afterColumns} />
    );
  }
}

export default EditTableBase;
