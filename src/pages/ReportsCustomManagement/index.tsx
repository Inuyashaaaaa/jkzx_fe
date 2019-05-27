import React, { memo, useEffect, useRef, useState } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { Form2, Select, Table2 } from '@/containers';
import moment from 'moment';
import useLifecycles from 'react-use/lib/useLifecycles';
import { Pagination, Divider, Row, Table, DatePicker } from 'antd';
import Page from '@/containers/Page';
import { rptCustomReportNameList, rptCustomReportSearchPaged } from '@/services/report-service';
import { TABLE_COL_DEFS, REPORT_TYPE } from './constants';
import _ from 'lodash';
import { async } from 'q';
const { RangePicker } = DatePicker;

const ReportsCustomManagement = memo<any>(props => {
  let formSearch = useRef<Form2>(null);
  const [searchFormData, setSearchFormData] = useState({
    ...Form2.createFields({
      reportName: '',
      reportType: '',
      valuationDate: [moment().subtract(1, 'day'), moment()],
    }),
  });

  const pagination = {
    page: 1,
    pageSize: 20,
    total: 1,
  };
  const [tabelData, setTabelData] = useState([]);
  const [loading, setLoading] = useState(false);

  const OnSearch = async (searchData, currentPage) => {
    searchData = Form2.getFieldsValue(searchData);
    const formValues = {
      startDate: _.get(searchData, 'valuationDate[0]').format('YYYY-MM-DD'),
      endDate: _.get(searchData, 'valuationDate[1]').format('YYYY-MM-DD'),
      ..._.omit(searchData, 'valuationDate'),
    };

    setLoading(true);
    const { error, data } = await rptCustomReportSearchPaged({
      ...formValues,
      page: currentPage.page - 1,
      pageSize: currentPage.pageSize,
    });
    setLoading(false);
    if (error) return;
    setTabelData(data.page);
  };

  const onPagination = (current, pageSize) => {
    OnSearch(searchFormData, { current, pageSize });
  };

  const handlePaninationChange = (current, pageSize) => {
    onPagination(current, pageSize);
  };

  const handleShowSizeChange = (current, pageSize) => {
    onPagination(current, pageSize);
  };

  useLifecycles(() => {
    OnSearch(searchFormData, pagination);
  });

  return (
    <>
      <Page title="自定义报告管理">
        <Form2
          ref={node => (formSearch = node)}
          onResetButtonClick={() => {
            const _search = {
              ...Form2.createFields({
                reportName: '',
                reportType: '',
                valuationDate: [moment().subtract(1, 'day'), moment()],
              }),
            };
            setSearchFormData(_search);
            OnSearch(_search, pagination);
          }}
          onSubmitButtonClick={async ({ domEvent }) => {
            domEvent.preventDefault();
            OnSearch(searchFormData, pagination);
          }}
          layout="inline"
          submitText="查询"
          onFieldsChange={(props, changedFields, allFields) => {
            setSearchFormData(allFields);
          }}
          dataSource={searchFormData}
          columns={[
            {
              title: '报告名称',
              dataIndex: 'reportName',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        style={{ minWidth: 180 }}
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        fetchOptionsOnSearch={true}
                        showSearch={true}
                        options={async value => {
                          const { data, error } = await rptCustomReportNameList({});
                          if (error) return [];
                          return _.concat(
                            {
                              label: '全部',
                              value: '',
                            },
                            data.map(item => ({
                              label: item,
                              value: item,
                            }))
                          );
                        }}
                      />
                    )}
                  </FormItem>
                );
              },
            },
            {
              title: '报告类型',
              dataIndex: 'reportType',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        style={{ minWidth: 180 }}
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        fetchOptionsOnSearch={true}
                        showSearch={true}
                        options={REPORT_TYPE}
                      />
                    )}
                  </FormItem>
                );
              },
            },
            {
              title: '报告日期',
              dataIndex: 'valuationDate',
              render: (value, record, index, { form, editing }) => {
                return <FormItem>{form.getFieldDecorator({})(<RangePicker />)}</FormItem>;
              },
            },
          ]}
        />
        <Divider type="horizontal" />
        <Table
          size="middle"
          rowKey="uuid"
          dataSource={tabelData}
          columns={TABLE_COL_DEFS()}
          pagination={false}
          loading={loading}
        />
        <Row type="flex" justify="end" style={{ marginTop: 15 }}>
          <Pagination
            {...{
              size: 'small',
              showSizeChanger: true,
              onShowSizeChange: handleShowSizeChange,
              showQuickJumper: true,
              current: pagination.page,
              pageSize: pagination.pageSize,
              onChange: handlePaninationChange,
              total: pagination.total,
            }}
          />
        </Row>
      </Page>
    </>
  );
});

export default ReportsCustomManagement;
