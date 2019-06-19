import _ from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import { Divider, Button, Checkbox, Row } from 'antd';
import { Form2, InputNumber, Table2, SmartTable } from '@/containers';
import FormItem from 'antd/lib/form/FormItem';

const ActiveTable = memo<any>(props => {
  const { handleCellValueChanged, underlyer, onTableFormChange } = props;
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState(props.dataSource);
  const [columns, setColumns] = useState(props.columns);
  const [batch, setBatch] = useState(false);
  const [rowSelection, setRowSelection] = useState(null);
  const [selectedRow, setSelectedRow] = useState([]);
  useEffect(
    () => {
      setDataSource(props.dataSource);
      setColumns(props.columns);
    },
    [props]
  );

  // 批量选择
  const rowSelectionData = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRow(selectedRowKeys);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  const handleSaveTable = () => {};

  const handleBatchCancel = () => {
    setBatch(false);
    setRowSelection(null);
  };

  const handleBatchSelect = () => {
    setBatch(true);
    setRowSelection(rowSelectionData);
  };

  const handleBatchSave = () => {
    const selectColumns = _.filter(columns, item => {
      return item.checked;
    });
    console.log(selectColumns);
    console.log(selectedRow);
  };

  const columnsSelect = (e, dataIndex) => {
    setColumns(
      columns.map(item => {
        item.checked = e.target.checked;
        return item;
      })
    );
  };

  const columnsData = columns.map(item => {
    console.log(item);
    if (!item.text && item.dataIndex !== 'operation' && batch) {
      item.text = item.title;
      item.title = (
        <Checkbox checked={item.checked} onChange={e => columnsSelect(e, item.dataIndex)}>
          {item.title}
        </Checkbox>
      );
    }
    return item;
  });

  return (
    <>
      <Row>
        <Button type="primary" onClick={handleSaveTable} style={{ marginRight: '20px' }}>
          保存
        </Button>
        {dataSource.length ? (
          <>
            {dataSource.length && batch ? (
              <>
                <Button type="primary" onClick={handleBatchCancel} style={{ marginRight: '20px' }}>
                  取消
                </Button>
                <Button type="primary" onClick={handleBatchSave} style={{ marginRight: '20px' }}>
                  批量保存
                </Button>
              </>
            ) : (
              <Button type="primary" onClick={handleBatchSelect} style={{ marginRight: '20px' }}>
                批量选择
              </Button>
            )}
          </>
        ) : null}
      </Row>
      {underlyer ? (
        <>
          <Divider type="horizontal" />
          <Form2
            layout="inline"
            dataSource={Form2.createFields(props.tableFormData)}
            submitable={false}
            resetable={false}
            onFieldsChange={onTableFormChange}
            columns={[
              {
                dataIndex: 'quote',
                title: '标的物价格',
                render: (value, record, index, { form, editing }) => {
                  return (
                    <FormItem>
                      {form.getFieldDecorator({
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      })(<InputNumber style={{ width: 200 }} />)}
                    </FormItem>
                  );
                },
              },
            ]}
          />
        </>
      ) : null}
      <SmartTable
        dataSource={dataSource}
        columns={columnsData}
        onCellFieldsChange={handleCellValueChanged}
        loading={loading}
        rowKey="id"
        pagination={false}
        style={{ marginTop: 20 }}
        rowSelection={rowSelection}
        scroll={dataSource.length ? { x: 1250 } : undefined}
      />
    </>
  );
});

export default ActiveTable;
