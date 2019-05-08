import { VERTICAL_GUTTER } from '@/constants/global';
import CustomNoDataOverlay from '@/containers/CustomNoDataOverlay';
import DownloadExcelButton from '@/containers/DownloadExcelButton';
import { Form2, Table2 } from '@/design/components';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { rptPositionReportSearchPaged, rptReportNameList } from '@/services/report-service';
import { getMoment } from '@/utils';
import { ConfigProvider, Divider, message, Table } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { memo, useEffect, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';

const ReportsEodPosition = memo<any>(props => {
  const form = useRef<Form2>(null);

  const [markets, setMarkets] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(true);
  const [searchFormData, setSearchFormData] = useState({});
  const [sortField, setSortField] = useState({ orderBy: 'createdAt', order: 'desc' });
  const [total, setTotal] = useState(null);
  const [isMount, setIsMount] = useState(false);
  const [data, setData] = useState([]);

  const onPaginationChange = (current, pageSize) => {
    setPagination({
      current,
      pageSize,
    });
  };

  const onSearchFormChange = (props, fields, allFields) => {
    setSearchFormData(allFields);
  };

  const fetchTable = async (paramsSearchFormData?) => {
    const usedFormData = paramsSearchFormData || searchFormData;
    const formValidateRsp = await form.current.validate();
    if (formValidateRsp.error) {
      return;
    }
    setLoading(true);
    const { error, data } = await rptPositionReportSearchPaged({
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
      ..._.mapValues(Form2.getFieldsValue(usedFormData), (values, key) => {
        if (key === 'valuationDate') {
          return getMoment(values).format('YYYY-MM-DD');
        }
        return values;
      }),
      ...sortField,
    });
    setLoading(false);
    if (error) return;
    if (!data.page.length) {
      message.warning('查询日期内暂无数据');
      setDataSource(data.page);
      setInfo(false);
      setTotal(data.totalCount);
      return;
    }
    setDataSource(data.page);
    setTotal(data.totalCount);
  };

  const onChange = (paramsPagination, filters, sorter) => {
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
          orderBy: 'createdAt',
          order: 'desc',
        });
      }
      return setSortField({
        orderBy: sortField.orderBy,
        order: sortField.order,
      });
    }
    setSortField({
      orderBy: sorter.columnKey,
      order: sorter.order === 'ascend' ? 'asc' : 'desc',
    });
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
    setIsMount(true);
    const { error, data } = await rptReportNameList({
      reportType: 'LIVE_POSITION_INFO',
    });
    if (error) return;
    const _markets = data.map(item => ({
      label: item,
      value: item,
    }));

    setMarkets(_markets);
    const _searchFormData = {
      ...(_markets.length ? { reportName: Form2.createField(_markets[0].value) } : null),
      valuationDate: Form2.createField(moment().subtract(1, 'days')),
    };
    setSearchFormData(_searchFormData);
    fetchTable(_searchFormData);
  });

  useEffect(
    () => {
      if (!isMount) return;
      fetchTable();
    },
    [sortField, pagination]
  );

  useEffect(
    () => {
      setData(
        handleData(
          dataSource,
          TABLE_COL_DEFS.map(item => item.dataIndex),
          TABLE_COL_DEFS.map(item => item.title)
        )
      );
    },
    [dataSource]
  );

  return (
    <PageHeaderWrapper>
      <Form2
        ref={node => (form.current = node)}
        dataSource={searchFormData}
        columns={searchFormControls(markets)}
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
          dataSource: data,
          cols: TABLE_COL_DEFS.map(item => item.title),
          name: '持仓明细',
        }}
      >
        导出Excel
      </DownloadExcelButton>
      <ConfigProvider renderEmpty={!info && (() => <CustomNoDataOverlay />)}>
        <Table2
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
          columns={TABLE_COL_DEFS}
          scroll={{ x: 3320 }}
          onChange={onChange}
        />
      </ConfigProvider>
    </PageHeaderWrapper>
  );
});

export default ReportsEodPosition;
