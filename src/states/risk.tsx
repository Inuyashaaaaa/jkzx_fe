import { VERTICAL_GUTTER } from '@/constants/global';
import CustomNoDataOverlay from '@/containers/CustomNoDataOverlay';
import DownloadExcelButton from '@/containers/DownloadExcelButton';
import { Form2 } from '@/design/components';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { rptPositionReportSearchPaged, rptReportNameList } from '@/services/report-service';
import { getMoment } from '@/utils';
import { ConfigProvider, Divider, message, Table, Row } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { memo, useEffect, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import ReloadGreekButton from '@/containers/ReloadGreekButton';
import { socketHOC } from '@/tools/socketHOC';

const Modal = props => {
  const form = useRef<Form2>(null);
  const {
    TABLE_COL_DEFS,
    searchFormControls,
    defaultSort,
    defaultDirection,
    reportType,
    searchMethod,
    downloadName,
    scrollWidth,
  } = props;
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(true);
  const [searchFormData, setSearchFormData] = useState({});
  const [sortField, setSortField] = useState({ orderBy: defaultSort, order: defaultDirection });
  const [total, setTotal] = useState(null);
  const [isMount, setIsMount] = useState(false);
  const [data, setData] = useState([]);

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
    const formValidateRsp = await form.current.validate();
    if (formValidateRsp.error) {
      return;
    }
    setLoading(true);
    const { error, data } = await searchMethod({
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
      ..._.mapValues(Form2.getFieldsValue(usedFormData)),
      ...sortField,
    });
    setLoading(false);
    if (error) return;
    if (!data.page.length) {
      message.warning('当日暂无数据');
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
          orderBy: defaultSort,
          order: defaultDirection,
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
    fetchTable();
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
        columns={searchFormControls()}
        layout="inline"
        style={{ marginBottom: VERTICAL_GUTTER }}
        submitText={'查询'}
        onFieldsChange={onSearchFormChange}
        onSubmitButtonClick={() => fetchTable()}
        resetable={false}
      />
      <Divider />
      <Row type="flex" justify="space-between" style={{ marginBottom: VERTICAL_GUTTER }}>
        <DownloadExcelButton
          key="export"
          type="primary"
          data={{
            dataSource: data,
            cols: TABLE_COL_DEFS.map(item => item.title),
            name: downloadName,
          }}
        >
          导出Excel
        </DownloadExcelButton>
        <ReloadGreekButton fetchTable={fetchTable} id="real_time_valuation_dag" />
      </Row>

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
          columns={TABLE_COL_DEFS}
          onChange={onChange}
          scroll={{ x: scrollWidth }}
        />
      </ConfigProvider>
    </PageHeaderWrapper>
  );
};

export default socketHOC(Modal);
