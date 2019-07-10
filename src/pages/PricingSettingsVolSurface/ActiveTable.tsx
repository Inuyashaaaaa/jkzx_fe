import _ from 'lodash';
import React, { memo, useEffect, useState, useRef } from 'react';
import { Divider, Button, Checkbox, Row, Popover, Col, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { Form2, InputNumber, Table2, SmartTable } from '@/containers';
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
  const tableEl = useRef<Table2>(null);

  useEffect(() => {
    setBatch(false);
  }, [searchFormData]);

  useEffect(() => {
    setDataSource(props.dataSource);
  }, [props.dataSource]);

  useEffect(() => {
    setSelectColumns(() =>
      props.columns.map((item, index) => {
        if (!batch) return item;
        if (index === 0 || index === props.columns.length - 1) return item;
        return {
          ...item,
          oldTitle: item.oldTitle || item.title,
          onCell: () => ({
            className: selectedColKeys[item.dataIndex] ? 'col-selected' : '',
          }),
          title: (
            <Checkbox
              checked={!!selectedColKeys[item.dataIndex]}
              onChange={e => {
                setSelectedColKeys((pre: any) => ({
                  ...pre,
                  [item.dataIndex]: e.target.checked,
                }));
              }}
            >
              {item.oldTitle || item.title}
            </Checkbox>
          ),
        };
      }),
    );
  }, [selectedColKeys, props.columns, batch]);

  // 批量选择
  const rowSelectionData = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRow(selectedRowKeys);
    },
  };

  const handleSaveTable = async () => {
    const res = await tableEl.current.validate();
    if (_.isArray(res) && res.some(value => value.errors)) {
      return;
    }
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
      message.warn('还未选择行或者列');
      return;
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
        setDataSource(pre =>
          pre.map(record => {
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
          }),
        );
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
                  render: (value, record, index, { form, editing }) => (
                    <FormItem>
                      {form.getFieldDecorator({
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      })(<InputNumber style={{ width: 200 }} disabled={batch} />)}
                    </FormItem>
                  ),
                },
              ]}
            />
            {batch ? (
              <Row type="flex" justify="end">
                <Col>
                  <InputNumber value={number} onChange={val => setNumber(val)} min={0} />
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
              <Button type="primary" onClick={handleBatchSelect} disabled={_.isEmpty(dataSource)}>
                批量设置
              </Button>
            )}
          </Row>
        </>
      ) : null}
      <SmartTable
        ref={node => {
          tableEl.current = node;
        }}
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
