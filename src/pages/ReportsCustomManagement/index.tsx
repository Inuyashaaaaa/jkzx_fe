import React, { memo, useRef, useState } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { Form2, Select, SmartTable } from '@/containers';
import moment from 'moment';
import useLifecycles from 'react-use/lib/useLifecycles';
import { Divider, DatePicker } from 'antd';
import Page from '@/containers/Page';
import { rptCustomReportNameList, rptCustomReportSearchPaged } from '@/services/report-service';
import { REPORT_TYPE } from './constants';
import { TABLE_COL_DEFS } from './tools';
import _ from 'lodash';
import { PAGE_SIZE } from '@/constants/component';
const { RangePicker } = DatePicker;

const ReportsCustomManagement = memo<any>(props => {
  const formSearch = useRef<Form2>(null);
  const [searchFormData, setSearchFormData] = useState({
    ...Form2.createFields({
      reportName: '',
      reportType: '',
      valuationDate: [moment().subtract(1, 'day'), moment()],
    }),
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    total: null,
  });
  const [tabelData, setTabelData] = useState([]);
  const [loading, setLoading] = useState(false);

  const OnSearch = async (searchData, currentPage) => {
    // const { error: verror } = await formSearch.current.validate();
    // if (verror) return;
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

  const onPagination = (page, pageSize) => {
    setPagination({
      ...pagination,
      page,
      pageSize,
    });
    OnSearch(searchFormData, { page, pageSize });
  };

  const handlePaninationChange = (page, pageSize) => {
    onPagination(page, pageSize);
  };

  const handleShowSizeChange = (page, pageSize) => {
    onPagination(page, pageSize);
  };

  useLifecycles(() => {
    OnSearch(searchFormData, pagination);
  });

  return (
    <>
      <Page title="自定义报告管理">
        <Form2
          ref={node => (formSearch.current = node)}
          onResetButtonClick={() => {
            const _search = Form2.createFields({
              reportName: '',
              reportType: '',
              valuationDate: [moment().subtract(1, 'day'), moment()],
            });
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
                        filterOption={true}
                        style={{ minWidth: 180 }}
                        placeholder="请输入内容搜索"
                        allowClear={true}
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
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [{ required: true }],
                    })(<RangePicker allowClear={false} />)}
                  </FormItem>
                );
              },
            },
          ]}
        />
        <Divider type="horizontal" />
        <SmartTable
          rowKey="uuid"
          dataSource={tabelData}
          columns={TABLE_COL_DEFS()}
          loading={loading}
          pagination={{
            onShowSizeChange: handleShowSizeChange,
            current: pagination.page,
            pageSize: pagination.pageSize,
            onChange: handlePaninationChange,
            total: pagination.total,
          }}
        />
      </Page>
    </>
  );
});

export default ReportsCustomManagement;
