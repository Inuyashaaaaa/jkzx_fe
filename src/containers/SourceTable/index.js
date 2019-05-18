import ButtonGroup from '@/components/ButtonGroup';
import ButtonPlus from '@/components/ButtonPlus';
import FormPlus from '@/components/_FormPlus';
import Loading from '@/components/_Loading';
import TablePlus from '@/components/_TablePlus';
import { wrapType } from '@/utils';
import { Icon, Row } from 'antd';
import { array, bool, func, object, objectOf, oneOfType, string } from 'prop-types';
import React, { PureComponent } from 'react';
import styles from './index.less';

class SourceTable extends PureComponent {
  static propTypes = {
    formData: object,
    visible: bool,
    createLoading: bool,
    tableDataSource: array,
    fetchTableLoading: bool,
    selectedKeys: array,
    removeLoadings: objectOf(bool),
    title: string,
    onSelectRow: func,
    onRemove: func,
    onCancel: func,
    onCreate: func,
    onCreateButtonClick: func,
    onFormChange: func,
    rowKey: string,
    hideCreateButton: oneOfType([bool, func]),
    hideRemoveButton: bool,
    formItems: oneOfType([array, func]),
    columnDataIndex: string,
  };

  static defaultProps = {
    hideCreateButton: false,
    hideRemoveButton: false,
    formItems: [],
    formData: {},
    visible: false,
    createLoading: false,
    tableDataSource: [],
    fetchTableLoading: false,
    selectedKeys: [],
    removeLoadings: {},
  };

  render() {
    const {
      formData,
      visible,
      createLoading,
      tableDataSource,
      fetchTableLoading,
      selectedKeys,
      removeLoadings,
      title,
      columnDataIndex,
      rowKey,
      hideCreateButton,
      hideRemoveButton,
      formItems,
      onRemove,
      onSelectRow,
      onCancel,
      onCreate,
      onCreateButtonClick,
      onFormChange,
    } = this.props;

    return (
      <TablePlus
        {...{
          hideTableHead: true,
          rowKey,
          hideSelection: true,
          pagination: false,
          title: () => (
            <Row type="flex" justify="space-between" align="middle">
              <span>{title}</span>
              {!hideCreateButton && (
                <ButtonPlus
                  {...{
                    name: '新建',
                    size: 'small',
                    type: 'primary',
                    onClick: onCreateButtonClick,
                    popover: {
                      id: 'popoverId',
                      visible,
                      type: 'popover',
                      placement: 'bottom',
                      title: `新建${title}`,
                      content: (
                        <div className={styles.popoverContainer}>
                          <FormPlus
                            {...{
                              getFormRef: node => {
                                this.$form = node;
                              },
                              width: 300,
                              labelCol: 8,
                              wrapperCol: 16,
                              dataSource: formData,
                              cellNumberOneRow: 1,
                              items: wrapType(formItems, Function, () => formItems).call(this, {
                                tableDataSource,
                                formData,
                              }),
                              onChange: onFormChange,
                              footer: false,
                            }}
                          />
                          <ButtonGroup
                            justify="end"
                            size="small"
                            items={[
                              {
                                name: '确认',
                                type: 'primary',
                                loading: createLoading,
                              },
                              {
                                name: '取消',
                              },
                            ]}
                            onClick={event => {
                              if (event.name === '确认') {
                                this.$form?.validateForm(({ error }) => {
                                  if (error) return;
                                  return onCreate?.();
                                });
                              }
                              if (event.name === '取消') {
                                return onCancel?.();
                              }
                            }}
                          />
                        </div>
                      ),
                    },
                  }}
                />
              )}
            </Row>
          ),
          rowSelection: {
            columnTitle: <span />,
            selectedRowKeys: selectedKeys,
            onSelect: onSelectRow,
          },
          loading: fetchTableLoading,
          dataSource: tableDataSource,
          columns: [
            {
              dataIndex: columnDataIndex || rowKey,
            },
            ...(hideRemoveButton
              ? []
              : [
                  {
                    width: 20,
                    render: record =>
                      removeLoadings[record[rowKey]] ? (
                        <Loading size="small" />
                      ) : (
                        <Icon
                          type="minus"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            onRemove?.(record);
                          }}
                        />
                      ),
                  },
                ]),
          ],
        }}
      />
    );
  }
}

export default SourceTable;
