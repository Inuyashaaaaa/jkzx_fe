import _ from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import { Divider, Button, Checkbox, Row, Popover, Col, message } from 'antd';
import { Form2, InputNumber, Table2, SmartTable } from '@/containers';
import FormItem from 'antd/lib/form/FormItem';
import InputButton from '@/containers/_InputButton';
import { saveModelVolSurface } from '@/services/model';
import { GROUP_KEY, INSTANCE_KEY, TENOR_KEY, OPERATION } from './constants';
import styles from './index.less';

const ActiveTable = memo<any>(props => {
  const {
    handleCellValueChanged,
    tableFormData,
    searchFormData,
    underlyer,
    onTableFormChange,
    columns,
  } = props;
  const [loading, setLoading] = useState(false);
  const [selectedColKeys, setSelectedColKeys] = useState({});
  const [selectColumns, setSelectColumns] = useState(props.columns);
  const [dataSource, setDataSource] = useState(props.dataSource);
  const [batch, setBatch] = useState(false);
  const [rowSelection, setRowSelection] = useState(null);
  const [selectedRow, setSelectedRow] = useState([]);
  const [number, setNumber] = useState();

  useEffect(
    () => {
      setBatch(false);
    },
    [searchFormData]
  );

  useEffect(
    () => {
      setDataSource(props.dataSource);
    },
    [props.dataSource]
  );

  useEffect(
    () => {
      setSelectColumns(() => {
        return props.columns.map((item, index) => {
          if (!batch) return item;
          if (index === 0 || index === props.columns.length - 1) return item;
          return {
            ...item,
            oldTitle: item.oldTitle || item.title,
            onCell: () => {
              return {
                className: !!selectedColKeys[item.dataIndex] ? 'col-selected' : '',
              };
            },
            title: (
              <Checkbox
                checked={!!selectedColKeys[item.dataIndex]}
                onChange={e => {
                  setSelectedColKeys((pre: any) => {
                    return {
                      ...pre,
                      [item.dataIndex]: e.target.checked,
                    };
                  });
                }}
              >
                {item.oldTitle || item.title}
              </Checkbox>
            ),
          };
        });
      });
    },
    [selectedColKeys, props.columns, batch]
  );

  // 批量选择
  const rowSelectionData = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRow(selectedRowKeys);
    },
  };

  const handleSaveTable = async () => {
    const searchFormDataValues = Form2.getFieldsValue(searchFormData);
    const { error } = await saveModelVolSurface({
      columns: columns.filter(col => !(col.dataIndex === TENOR_KEY || col.dataIndex === OPERATION)),
      dataSource: dataSource.map(item => Form2.getFieldsValue(item)),
      underlyer,
      newQuote: (tableFormData as any).quote,
      modelName: searchFormDataValues[GROUP_KEY],
      instance: searchFormDataValues[INSTANCE_KEY],
    });

    if (error) return;

    message.success('保存成功');
  };

  const handleBatchCancel = () => {
    setBatch(false);
    setNumber(null);
    setRowSelection(null);
  };

  const handleBatchSelect = () => {
    setBatch(true);
    setRowSelection(rowSelectionData);
  };

  const handleBatchSave = event => {
    if (_.isEmpty(selectedRow) && _.isEmpty(selectedColKeys)) {
      return message.warn('还未选择行或者列');
    }

    (_.isEmpty(selectedRow) ? dataSource.map(item => item.id) : selectedRow).forEach(rowKey => {
      const selectedColIds = _.toPairs(selectedColKeys)
        .filter(([key, checked]) => checked)
        .map(([colKey]) => colKey);

      (_.isEmpty(selectedColIds)
        ? selectColumns.map(item => item.dataIndex)
        : selectedColIds
      ).forEach(colKey => {
        if (colKey === TENOR_KEY || colKey === OPERATION) return;
        setDataSource(pre => {
          return pre.map(record => {
            if (record.id === rowKey) {
              return {
                ...record,
                [colKey]: {
                  ...record[colKey],
                  value: number,
                },
              };
            }
            return record;
          });
        });
      });
    });

    setBatch(false);
    setNumber(null);
    setSelectedColKeys([]);
    setSelectedRow([]);
  };

  return (
    <>
      <Row type="flex" justify="space-between">
        <Button type="primary" onClick={handleSaveTable} style={{ marginRight: '20px' }}>
          保存
        </Button>
      </Row>
      {underlyer ? (
        <>
          <Divider type="horizontal" />
          <Row type="flex" justify="space-between">
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
                        })(<InputNumber style={{ width: 200 }} disabled={batch} />)}
                      </FormItem>
                    );
                  },
                },
              ]}
            />

            {dataSource.length ? (
              <>
                {dataSource.length && batch ? (
                  <Row type="flex" justify="end">
                    <Col>
                      <InputNumber value={number} onChange={val => setNumber(val)} />
                    </Col>
                    <Col>
                      <Button.Group>
                        <Button type="primary" onClick={handleBatchSave} disabled={number == null}>
                          确认
                        </Button>
                        <Button onClick={handleBatchCancel}>取消</Button>
                      </Button.Group>
                    </Col>
                  </Row>
                ) : (
                  <Button type="primary" onClick={handleBatchSelect}>
                    批量设置
                  </Button>
                )}
              </>
            ) : null}
          </Row>
        </>
      ) : null}
      <SmartTable
        className={styles.scope}
        dataSource={dataSource}
        columns={selectColumns}
        onCellFieldsChange={handleCellValueChanged}
        loading={loading}
        rowKey="id"
        pagination={false}
        style={{ marginTop: 20 }}
        rowSelection={batch ? rowSelection : null}
        scroll={dataSource.length ? { x: 1250 } : undefined}
      />
    </>
  );
});

export default ActiveTable;
