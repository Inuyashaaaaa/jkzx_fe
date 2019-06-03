import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2 } from '@/containers';
import Page from '@/containers/Page';
import { mktInstrumentCreate, mktInstrumentsListPaged } from '@/services/market-data-service';
import { Button, Divider, message, Modal, Table } from 'antd';
import _ from 'lodash';
import React, { useRef, useState, useEffect, memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { createFormControls, searchFormControls } from './services';
import moment, { isMoment } from 'moment';

const TradeManagementMarketManagement = props => {
  let $form = useRef<Form2>(null);

  const [createFormData, setCreateFormData] = useState({});
  const [searchFormData, setSearchFormData] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tableDataSource, setTableDataSource] = useState([]);
  const [createVisible, setCreateVisible] = useState(false);
  const [createFormControlsState, setCreateFormControlsState] = useState({});

  useEffect(() => {
    fetchTable();
    setCreateFormControlsState(createFormControls({}, 'create'));
  }, []);

  const onReset = () => {
    setPagination({ current: 1, pageSize: 10 });
    setSearchFormData({});
    fetchTable();
  };

  const fetchTable = async (paramsPagination?) => {
    const actualPagination = paramsPagination || pagination;
    setLoading(true);
    const newSearchFormData = _.mapValues(Form2.getFieldsValue(searchFormData), (value, key) => {
      if (key === 'instrumentIds' && (!value || !value.length)) {
        return undefined;
      }
      return value;
    });

    const { error, data } = await mktInstrumentsListPaged({
      page: actualPagination.current - 1,
      pageSize: actualPagination.pageSize,
      ...newSearchFormData,
    });
    setLoading(false);
    if (error) return;
    setTableDataSource(data.page);
    setTotal(data.totalCount);
  };

  const filterFormData = (allFields, fields) => {
    if (Object.keys(fields)[0] === 'assetClass') {
      return {
        ..._.pick(allFields, ['instrumentId']),
        ...fields,
      };
    }
    if (Form2.getFieldValue(fields.instrumentType) === 'STOCK') {
      return {
        ...allFields,
        multiplier: Form2.createField(1),
      };
    }
    return allFields;
  };

  const onCreateFormChange = (props, fields, allFields) => {
    const nextAllFields = {
      ...createFormData,
      ...fields,
    };
    const columns = createFormControls(Form2.getFieldsValue(nextAllFields), 'create');
    setCreateFormControlsState(columns);
    setCreateFormData(filterFormData(nextAllFields, fields));
  };

  const composeInstrumentInfo = modalFormData => {
    modalFormData.expirationDate = moment(modalFormData.expirationDate).format('YYYY-MM-DD');
    modalFormData.expirationTime = moment(modalFormData.expirationTime).format('HH:mm:ss');
    const instrumentInfoFields = [
      'multiplier',
      'name',
      'exchange',
      'maturity',
      'expirationDate',
      'expirationTime',
      'optionType',
      'exerciseType',
      'strike',
      'multiplier',
      'underlyerInstrumentId',
    ];
    let instrumentInfoSomeFields = instrumentInfoFields;
    if (modalFormData.instrumentType === 'INDEX') {
      instrumentInfoSomeFields = ['name', 'exchange'];
    }
    const params = {
      ..._.omit(modalFormData, instrumentInfoFields),
      instrumentInfo: omitNull(_.pick(modalFormData, instrumentInfoSomeFields)),
    };
    return omitNull(params);
  };

  const omitNull = obj => _.omitBy(obj, val => val === null);

  const onCreate = async () => {
    const rsp = await $form.validate();
    if (rsp.error) return;

    let newCreateFormData = Form2.getFieldsValue(createFormData);
    newCreateFormData = composeInstrumentInfo(newCreateFormData);
    newCreateFormData.instrumentInfo.maturity = isMoment(newCreateFormData.instrumentInfo.maturity)
      ? moment(newCreateFormData.instrumentInfo.maturity).format('YYYY-MM-DD')
      : newCreateFormData.instrumentInfo.maturity;
    const { error } = await mktInstrumentCreate(newCreateFormData);
    if (error) {
      message.error('创建失败');
      return;
    }
    message.success('创建成功');
    setCreateVisible(false);
    setCreateFormData({});
    setCreateFormControlsState(createFormControls({}, 'create'));
    setPagination({ current: 1, pageSize: 10 });
    fetchTable({ current: 1, pageSize: 10 });
  };

  const onSearchFormChange = (props, fields, allFields) => {
    const changed = Form2.getFieldsValue(fields);
    const formData = Form2.getFieldsValue(allFields);
    const searchFormData =
      Object.keys(changed)[0] === 'assetClass'
        ? {
            ..._.pick(formData, ['instrumentIds']),
            ...changed,
          }
        : formData;
    setSearchFormData(Form2.createFields(searchFormData));
  };

  const onPaginationChange = (current, pageSize) => {
    setPagination({
      current,
      pageSize,
    });
    fetchTable();
  };

  const switchModal = () => {
    setCreateVisible(!createVisible);
    setCreateFormData({});
    setCreateFormControlsState(createFormControls({}, 'create'));
  };

  const onSearch = () => {
    setPagination({
      current: 1,
      pageSize: 10,
    });
    fetchTable();
  };

  return (
    <Page>
      <Form2
        columns={searchFormControls()}
        dataSource={searchFormData}
        layout={'inline'}
        onSubmitButtonClick={onSearch}
        onResetButtonClick={onReset}
        onFieldsChange={onSearchFormChange}
        submitText={'查询'}
      />
      <Divider />
      <Button style={{ marginBottom: VERTICAL_GUTTER }} type="primary" onClick={switchModal}>
        新建标的物
      </Button>
      <Table
        rowKey="instrumentId"
        columns={TABLE_COL_DEFS(fetchTable)}
        loading={loading}
        dataSource={tableDataSource}
        pagination={{
          ...pagination,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: onPaginationChange,
        }}
      />
      <Modal visible={createVisible} onOk={onCreate} onCancel={switchModal} title={'新建标的物'}>
        <Form2
          ref={node => ($form = node)}
          columns={createFormControlsState}
          dataSource={createFormData}
          onFieldsChange={onCreateFormChange}
          footer={false}
        />
      </Modal>
    </Page>
  );
};
export default memo<any>(TradeManagementMarketManagement);
