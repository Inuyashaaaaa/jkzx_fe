import React, { memo, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Row, Col, Divider, Button } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import { Form2 } from '@/containers';
import ThemeButton from '@/containers/ThemeButton';
import ThemeDatePickerRanger from '@/containers/ThemeDatePickerRanger';
import ThemeTable from '@/containers/ThemeTable';
import { rptSearchPagedMarketRiskDetailReport } from '@/services/report-service';

const Title = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: rgba(246, 250, 255, 1);
  line-height: 32px;
`;

const FormItemWrapper = styled.div`
  .ant-form-item-label label {
    color: #f5faff;
  }
  .ant-row.ant-form-item {
    margin-bottom: 0;
  }
`;

const ThemeTableWrapper = styled.div`
  margin-top: 24px;
`;

const ThemeCenterCommonTable = props => {
  const { title, formControls, fetchMethod, columns } = props;

  const [formData, setFormData] = useState(
    Form2.createFields({
      date: [moment().subtract(1, 'd'), moment()],
    }),
  );
  const [form, setForm] = useState(
    Form2.createFields({
      date: [moment().subtract(1, 'd'), moment()],
    }),
  );
  const $form = useRef<Form2>(null);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const onFormChange = (propsData, changedFields, allFields) => {
    setFormData({
      ...formData,
      ...changedFields,
    });
  };

  const fetchTable = async () => {
    const res = await $form.current.validate();
    if (res.error) {
      return;
    }
    setLoading(true);
    const { error, data } = await fetchMethod(formData);
    setLoading(false);
    if (error) {
      return;
    }
    const { page, totalCount } = data;
    setDataSource(page);
    setTotal(totalCount);
  };

  const onChange = (current, pagesize) => {
    setPagination({ current, pagesize });
    fetchTable();
  };

  useEffect(() => {
    fetchTable();
  }, []);

  return (
    <>
      <Title>{title}</Title>
      <Row
        type="flex"
        justify="start"
        align="middle"
        gutter={12}
        style={{ marginTop: 18, marginBottom: 13 }}
      >
        <Col>
          <FormItemWrapper>
            <Form2
              hideRequiredMark
              ref={node => {
                $form.current = node;
              }}
              dataSource={formData}
              onFieldsChange={onFormChange}
              columns={formControls}
              layout="inline"
              footer={false}
              onSubmitButtonClick={fetchTable}
              submitText="查询"
              resetable={false}
            ></Form2>
          </FormItemWrapper>
        </Col>
        <Col>
          <ThemeButton type="primary">确定</ThemeButton>
        </Col>
      </Row>
      {/* <Divider /> */}
      <Button style={{ margin: '10px 0' }} type="primary">
        导出Excel
      </Button>
      <ThemeTableWrapper>
        <ThemeTable
          loading={loading}
          wrapStyle={{ maxWidth: 1685 }}
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: columns.length && columns.length * 150 }}
          rowkey="id"
          pagination={{
            ...pagination,
            total,
            simple: true,
            onChange,
          }}
        ></ThemeTable>
      </ThemeTableWrapper>
    </>
  );
};

export default ThemeCenterCommonTable;
