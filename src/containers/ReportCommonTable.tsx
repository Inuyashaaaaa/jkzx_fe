import { ConfigProvider, Divider, message, Table } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { memo, useEffect, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import { VERTICAL_GUTTER } from '@/constants/global';
import CustomNoDataOverlay from '@/containers/CustomNoDataOverlay';
import DownloadExcelButton from '@/containers/DownloadExcelButton';
import { Form2, SmartTable } from '@/containers';
import Page from '@/containers/Page';
import { rptReportNameList } from '@/services/report-service';
import { getMoment } from '@/tools';
import { PAGE_SIZE } from '@/constants/component';

const ReportCommonTable = memo<any>(props => {
  const form = useRef<Form2>(null);
  const {
    tableColDefs,
    searchFormControls,
    defaultSort,
    defaultDirection,
    reportType,
    searchMethod,
    downloadName,
    scrollWidth,
    bordered = false,
    colSwitch = [],
    antd,
  } = props;
  const [markets, setMarkets] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(true);
  const [searchFormData, setSearchFormData] = useState({});
  const [sortField, setSortField] = useState({ orderBy: defaultSort, order: defaultDirection });
  const [total, setTotal] = useState(null);
  const [isMount, setIsMount] = useState(false);
  const [data, setData] = useState([]);
  const [excelFormData, setExcelFormData] = useState({});
  const [searchForm, setSearchForm] = useState({});

  const onPaginationChange = (current, pageSize) => {
    if (!pageSize) return;
    setIsMount(true);
    setPagination({
      current,
      pageSize,
    });
  };

  const onSearchFormChange = (param, fields, allFields) => {
    setSearchFormData(allFields);
  };

  const fetchTable = async (paramsSearchFormData?, paramsPagination?) => {
    const usedFormData = paramsSearchFormData || searchForm;
    setExcelFormData(usedFormData);
    const formValidateRsp = await form.current.validate();
    if (formValidateRsp.error) {
      return;
    }
    setLoading(true);
    const { error, data: fetchData } = await searchMethod({
      page: (paramsPagination || pagination).current - 1,
      pageSize: (paramsPagination || pagination).pageSize,
      ..._.mapValues(Form2.getFieldsValue(usedFormData), (values, key) => {
        if (key === 'valuationDate') {
          return getMoment(values).format('YYYY-MM-DD');
        }
        return values;
      }),
      ...sortField,
    });
    setLoading(false);
    if (error) {
      setDataSource([]);
      return;
    }
    if (!fetchData.page.length) {
      message.warning('查询日期内暂无数据');
      setDataSource(fetchData.page);
      setInfo(false);
      setTotal(fetchData.totalCount);
      return;
    }
    setDataSource(fetchData.page);
    setTotal(fetchData.totalCount);
  };

  const onChange = (paramsPagination, filters, sorter) => {
    setIsMount(true);
    if (!sorter.columnKey) {
      const aPagination = {
        current: paramsPagination.current,
        pageSize: paramsPagination.pageSize,
        total: paramsPagination.total,
      };
      const bPagination = {
        ...pagination,
        total,
      };
      if (_.isEqual(aPagination, bPagination)) {
        return setSortField({
          orderBy: defaultSort,
          order: defaultDirection,
        });
      }
      return setSortField({
        orderBy: sortField.orderBy,
        order: sortField.order,
      });
    }
    return setSortField({
      orderBy: sorter.columnKey,
      order: sorter.order === 'ascend' ? 'asc' : 'desc',
    });
  };

  const handleData = (inlineDataSource, cols, headers) => {
    const tempData = [];
    tempData.push(headers);
    const { length } = tempData;
    inlineDataSource.forEach((ds, index) => {
      const newData = [];
      Object.keys(ds).forEach(key => {
        const dsIndex = _.findIndex(cols, k => k === key);
        if (dsIndex >= 0) {
          newData[dsIndex] = ds[key];
        }
      });
      tempData.push(newData);
    });
    return tempData;
  };

  useLifecycles(async () => {
    setIsMount(true);
    const { error, data: reportListData } = await rptReportNameList({
      reportType,
    });
    if (error) return;
    const newMarkets = reportListData.map(item => ({
      label: item,
      value: item,
    }));

    setMarkets(newMarkets);
    const formData = {
      ...(newMarkets.length ? { reportName: Form2.createField(newMarkets[0].value) } : null),
      valuationDate: Form2.createField(moment().subtract(1, 'days')),
    };
    setSearchFormData(formData);
    setExcelFormData(formData);
    setSearchForm(formData);
    if (newMarkets.length && newMarkets.length > 0) {
      fetchTable(formData);
    }
  });

  useEffect(() => {
    if (!isMount) return;
    fetchTable();
  }, [sortField, pagination]);

  useEffect(() => {
    setData(
      handleData(
        dataSource,
        tableColDefs.map(item => item.dataIndex),
        tableColDefs.map(item => item.title),
      ),
    );
  }, [dataSource]);

  return (
    <Page>
      <Form2
        ref={node => {
          form.current = node;
        }}
        dataSource={searchFormData}
        columns={searchFormControls(markets)}
        layout="inline"
        style={{ marginBottom: VERTICAL_GUTTER }}
        submitText="查询"
        onFieldsChange={onSearchFormChange}
        onSubmitButtonClick={() => {
          setIsMount(false);
          setPagination({
            current: 1,
            pageSize: PAGE_SIZE,
          });
          fetchTable(searchFormData, { current: 1, pageSize: PAGE_SIZE });
          setSearchForm(searchFormData);
        }}
        resetable={false}
      />
      <Divider />
      <DownloadExcelButton
        style={{ margin: '10px 0' }}
        key="export"
        type="primary"
        data={{
          searchMethod,
          argument: {
            searchFormData: excelFormData,
            sortField,
          },
          cols: tableColDefs,
          name: downloadName,
          colSwitch,
        }}
      >
        导出Excel
      </DownloadExcelButton>
      <ConfigProvider renderEmpty={!info && (() => <CustomNoDataOverlay />)}>
        <SmartTable
          antd={antd}
          rowKey="uuid"
          loading={loading}
          dataSource={dataSource.map(item => _.omitBy(item, val => val == null))}
          pagination={{
            ...pagination,
            total,
            showSizeChanger: true,
            onShowSizeChange: onPaginationChange,
            showQuickJumper: true,
            onChange: onPaginationChange,
          }}
          columns={tableColDefs}
          onChange={onChange}
          scroll={{ x: scrollWidth }}
        />
      </ConfigProvider>
    </Page>
  );
});

export default ReportCommonTable;
