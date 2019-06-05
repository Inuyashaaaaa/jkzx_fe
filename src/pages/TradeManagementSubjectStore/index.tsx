import { PAGE_SIZE } from '@/constants/component';
import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, SmartTable } from '@/containers';
import Page from '@/containers/Page';
import { mktInstrumentCreate, mktInstrumentsListPaged } from '@/services/market-data-service';
import { Button, Divider, message, Modal } from 'antd';
import _ from 'lodash';
import moment, { isMoment } from 'moment';
import React, { memo, useEffect, useRef, useState } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { createFormControls, searchFormControls } from './services';

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
  const [creating, setCreating] = useState(false);
  const [noData, setNoData] = useState(true);

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
    setNoData(data.page.length === 0 ? true : false);
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

    setCreating(true);
    const { error } = await mktInstrumentCreate(newCreateFormData);
    if (error) {
      message.error('创建失败');
      return;
    }
    message.success('创建成功');
    setCreating(false);

    setCreateVisible(false);
    setCreateFormData({});
    setCreateFormControlsState(createFormControls({}, 'create'));
    setPagination({ current: 1, pageSize: 10 });
    fetchTable({ current: 1, pageSize: 10 });
  };

  const onSearchFormChange = (props, fields, allFields) => {
    const instrumentTypeMap = {
      EQUITY: 'STOCK',
      COMMODITY: 'SPOT',
    };
    const assetClass = fields.assetClass;
    const formData = Form2.getFieldsValue(allFields);
    if (assetClass) {
      formData.instrumentType = assetClass.value ? instrumentTypeMap[assetClass.value] : undefined;
    }
    setSearchFormData(Form2.createFields(formData));
  };

  const onPaginationChange = (current, pageSize) => {
    const next = {
      current,
      pageSize,
    };
    setPagination(next);
    fetchTable(next);
  };

  const switchModal = () => {
    setCreateVisible(!createVisible);
    setCreateFormData({});
    setCreateFormControlsState(createFormControls({}, 'create'));
  };

  const onSearch = () => {
    const next = {
      current: 1,
      pageSize: PAGE_SIZE,
    };
    setPagination(next);
    fetchTable(next);
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
      <SmartTable
        rowKey="instrumentId"
        columns={TABLE_COL_DEFS(fetchTable)}
        loading={loading}
        scroll={{ x: noData ? false : 2300 }}
        dataSource={tableDataSource}
        pagination={{
          ...pagination,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: onPaginationChange,
        }}
      />
      <Modal
        visible={createVisible}
        onOk={onCreate}
        onCancel={switchModal}
        title={'新建标的物'}
        okButtonProps={{ loading: creating }}
      >
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
