import React, { memo, useState, useRef, useEffect } from 'react';
import { Divider } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { Form2, SmartTable } from '@/containers';
import { authSysLogList } from '@/services/role';
import { errorSearchFormControls, errorTableColDefs } from './constants';

const PAGE_SIZE = 15;

const ErrorLog = memo(props => {
  const getInitFotrmData = () => ({
    operationDate: [moment().subtract(30, 'day'), moment()],
    // username: '',
    // operation: '',
  });

  const initPagination = {
    current: 1,
    pageSize: PAGE_SIZE,
  };
  const $form = useRef<Form2>(null);
  const [loading, setLoading] = useState(false);
  const [searchFormData, setSearchFormData] = useState({
    ...Form2.createFields(getInitFotrmData()),
  });
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(null);
  const [pagination, setPagination] = useState(initPagination);
  const [preFormData, setPreFormData] = useState({
    ...Form2.createFields(getInitFotrmData()),
  });

  const fetchTable = async (paramsSearchFormData, paramsPagination, getNew) => {
    const res = await $form.current.validate();
    if (res.error) {
      return;
    }
    const formData = Form2.getFieldsValue(paramsSearchFormData);
    setLoading(true);
    const { data, error } = await authSysLogList({
      page: (paramsPagination || pagination).current - 1,
      pageSize: (paramsPagination || pagination).pageSize,
      startDate: moment(formData.operationDate[0]).format('YYYY-MM-DD'),
      endDate: moment(formData.operationDate[1]).format('YYYY-MM-DD'),
      username: formData.username ? formData.username : '',
      operation: formData.operation ? formData.operation : '',
    });
    setLoading(false);
    if (error) {
      return;
    }
    if (getNew) {
      setPreFormData(paramsSearchFormData);
    }
    setDataSource(data.page);
    setTotal(data.totalCount);
  };

  const onSearchFormChange = (param, fields, allFields) => {
    setSearchFormData({
      ...searchFormData,
      ...fields,
    });
  };

  const onPaginationChange = (current, pageSize) => {
    if (!pageSize) return;
    setPagination({
      current,
      pageSize,
    });
    fetchTable(
      preFormData,
      {
        current,
        pageSize,
      },
      false,
    );
  };

  const onReset = () => {
    fetchTable(Form2.createFields(getInitFotrmData()), initPagination, true);
    setSearchFormData(Form2.createFields(getInitFotrmData()));
    setPagination(initPagination);
  };

  useEffect(() => {
    fetchTable(searchFormData, pagination, false);
  }, []);

  return (
    <>
      <Form2
        ref={node => {
          $form.current = node;
        }}
        dataSource={searchFormData}
        columns={errorSearchFormControls}
        layout="inline"
        submitText="查询"
        onFieldsChange={onSearchFormChange}
        onSubmitButtonClick={() => {
          setPagination(initPagination);
          setPreFormData(Form2.createFields(searchFormData));
          fetchTable(searchFormData, initPagination, true);
        }}
        onResetButtonClick={onReset}
      />
      <Divider />
      <SmartTable
        rowKey={(record, index) => index}
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
        columns={errorTableColDefs}
        scroll={{ x: 1500 }}
      />
    </>
  );
});

export default ErrorLog;
