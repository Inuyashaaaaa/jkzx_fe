import React, { memo, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
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
  const [searchForm, setSearchForm] = useState(
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

  const fetchTable = async (formParam, update) => {
    const res = await $form.current.validate();
    if (res.error) {
      return;
    }
    setLoading(true);
    const searchData = Form2.getFieldsValue(formParam);
    const { error, data } = await fetchMethod({
      start_date: moment(_.get(searchData, 'date[0]')).format('YYYY-MM-DD'),
      end_date: moment(_.get(searchData, 'date[1]')).format('YYYY-MM-DD'),
      page: pagination.current - 1,
      page_size: pagination.pageSize,
    });
    setLoading(false);
    if (error) {
      return;
    }
    const { page, totalCount } = data;
    setDataSource(page);
    setTotal(totalCount);
    if (update) {
      setSearchForm(formParam);
    }
  };

  const onChange = (current, pagesize) => {
    setPagination({ current, pagesize });
    fetchTable(searchForm);
  };

  useEffect(() => {
    fetchTable(searchForm);
  }, []);

  return (
    <>
      <Title>{title}</Title>
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        gutter={12}
        style={{ marginTop: 18, marginBottom: 13 }}
      >
        <Col>
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
                  submitText="查询"
                  resetable={false}
                ></Form2>
              </FormItemWrapper>
            </Col>
            <Col>
              <ThemeButton type="primary" onClick={() => fetchTable(formData, true)}>
                确定
              </ThemeButton>
            </Col>
          </Row>
        </Col>
        <Col>
          <Button style={{ margin: '10px 0' }} type="primary">
            导出
          </Button>
        </Col>
      </Row>
      <ThemeTableWrapper>
        <ThemeTable
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          scroll={props.scrollWidth}
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
