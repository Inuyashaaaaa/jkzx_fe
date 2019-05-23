import { VERTICAL_GUTTER } from '@/constants/global';
import CustomNoDataOverlay from '@/containers/CustomNoDataOverlay';
import DownloadExcelButton from '@/containers/DownloadExcelButton';
import ReloadGreekButton from '@/containers/ReloadGreekButton';
import { Form2, Select } from '@/containers';
import Page from '@/containers/Page';
import { socketHOC } from '@/tools/socketHOC';
import { ConfigProvider, Divider, message, Row, Table } from 'antd';
import _ from 'lodash';
import React, { useEffect, useRef, useState, memo } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import FormItem from 'antd/lib/form/FormItem';
import { rptIntradayReportNamesList, rptIntradayReportPaged } from '@/services/report-service';
import uuidV4 from 'uuid';

const RiskManagerCustomReport = memo<any>(props => {
  const form = useRef<Form2>(null);
  const { getReload } = props;
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(true);
  const [searchFormData, setSearchFormData] = useState({});
  const [total, setTotal] = useState(null);
  const [data, setData] = useState([]);
  const [tableColumnDefs, setTableColumnDefs] = useState([]);
  const [excelFormData, setExcelFormData] = useState({});

  const onPaginationChange = (current, pageSize) => {
    setPagination({
      current,
      pageSize,
    });
  };

  const onSearchFormChange = (param, fields, allFields) => {
    setSearchFormData(allFields);
  };

  const fetchTable = async (paramsSearchFormData?) => {
    const usedFormData = paramsSearchFormData || searchFormData;
    setExcelFormData(usedFormData);
    const formValidateRsp = await form.current.validate();
    if (formValidateRsp.error) {
      return;
    }
    setLoading(true);
    const { error, data } = await rptIntradayReportPaged({
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
      ..._.mapValues(Form2.getFieldsValue(usedFormData)),
    });
    setLoading(false);
    if (error) return;
    if (!data.page.length) {
      message.warning('报告暂无数据');
      setDataSource(data.page);
      setInfo(false);
      setTotal(data.totalCount);
      return;
    }
    const tableDataSource = data.page.map(item => {
      return {
        ..._.get(item, 'reportData', {}),
        uuid: uuidV4(),
      };
    });
    const tableColumnDefs = Object.keys(_.get(tableDataSource, '[0]', {}))
      .filter(key => key !== 'uuid')
      .map(item => ({
        title: item,
        dataIndex: item,
        width: 200,
      }));
    setTableColumnDefs(tableColumnDefs);
    setDataSource(tableDataSource);
    setTotal(data.totalCount);
  };

  const handleData = (dataSource, cols, headers) => {
    const data = [];
    data.push(headers);
    const length = data.length;
    dataSource.forEach((ds, index) => {
      const _data = [];
      Object.keys(ds).forEach(key => {
        const dsIndex = _.findIndex(cols, k => k === key);
        if (dsIndex >= 0) {
          _data[dsIndex] = ds[key];
        }
      });
      data.push(_data);
    });
    return data;
  };

  useLifecycles(async () => {
    if (getReload) {
      getReload(fetchTable);
    }
  });

  useEffect(
    () => {
      setData(
        handleData(
          dataSource,
          tableColumnDefs.map(item => item.dataIndex),
          tableColumnDefs.map(item => item.title)
        )
      );
    },
    [dataSource]
  );

  return (
    <Page>
      <Form2
        ref={node => (form.current = node)}
        dataSource={searchFormData}
        columns={[
          {
            title: '报告名称',
            dataIndex: 'reportName',
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator({
                    rules: [
                      {
                        required: true,
                        message: '报告名称是必填项',
                      },
                    ],
                  })(
                    <Select
                      {...{
                        editing,
                        style: {
                          width: 180,
                        },
                        placeholder: '请输入内容搜索',
                        allowClear: true,
                        type: 'select',
                        showSearch: true,
                        options: async (value: string) => {
                          const { data, error } = await rptIntradayReportNamesList();
                          if (error) return [];
                          return data.map(item => ({
                            label: item,
                            value: item,
                          }));
                        },
                      }}
                    />
                  )}
                </FormItem>
              );
            },
          },
        ]}
        layout="inline"
        style={{ marginBottom: VERTICAL_GUTTER }}
        submitText={'查询'}
        onFieldsChange={onSearchFormChange}
        onSubmitButtonClick={() => fetchTable(searchFormData)}
        resetable={false}
      />
      <Divider />
      <DownloadExcelButton
        style={{ margin: '10px 0' }}
        key="export"
        type="primary"
        data={{
          searchMethod: rptIntradayReportPaged,
          cols: tableColumnDefs,
          name: '定制化报告',
          argument: {
            searchFormData: excelFormData,
          },
        }}
      >
        导出Excel
      </DownloadExcelButton>
      <ConfigProvider renderEmpty={!info && (() => <CustomNoDataOverlay />)}>
        <Table
          size="middle"
          rowKey="uuid"
          loading={loading}
          dataSource={dataSource}
          pagination={{
            ...pagination,
            total,
            showSizeChanger: true,
            onShowSizeChange: onPaginationChange,
            showQuickJumper: true,
            onChange: onPaginationChange,
          }}
          columns={tableColumnDefs}
          scroll={{ x: 1350 }}
        />
      </ConfigProvider>
    </Page>
  );
});

export default RiskManagerCustomReport;
