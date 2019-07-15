import { Button, Divider, message, Modal } from 'antd';
import _ from 'lodash';
import moment, { isMoment } from 'moment';
import React, { memo, useEffect, useRef, useState, useCallback } from 'react';
import { PAGE_SIZE } from '@/constants/component';
import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, SmartTable } from '@/containers';
import Page from '@/containers/Page';
import { mktInstrumentCreate, mktInstrumentsListPaged } from '@/services/market-data-service';
import { TABLE_COL_DEFS } from './tools';
import { createFormControls, searchFormControls } from './services';

const TradeManagementMarketManagement = props => {
  let $form = useRef<Form2>(null);

  const defaultPagination = {
    pageSize: PAGE_SIZE,
    current: 1,
  };

  const [searchFormData, setSearchFormData] = useState({});
  const [searchForm, setSearchForm] = useState({});
  const [createFormData, setCreateFormData] = useState({});
  const [pagination, setPagination] = useState(defaultPagination);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tableDataSource, setTableDataSource] = useState([]);
  const [createVisible, setCreateVisible] = useState(false);
  const [createFormControlsState, setCreateFormControlsState] = useState({});
  const [creating, setCreating] = useState(false);
  const [noData, setNoData] = useState(true);

  const fetchTable = useCallback(async (paramsPagination?, formData?, useSearchForm = false) => {
    const actualPagination = paramsPagination || pagination;
    setLoading(true);
    const newSearchFormData = _.mapValues(
      Form2.getFieldsValue(formData || searchForm),
      (value, key) => {
        if (key === 'instrumentIds' && (!value || !value.length)) {
          return undefined;
        }
        return value;
      },
    );

    const { error, data } = await mktInstrumentsListPaged({
      page: actualPagination.current - 1,
      pageSize: actualPagination.pageSize,
      ...newSearchFormData,
    });
    setLoading(false);
    if (error) return;
    if (useSearchForm) {
      setSearchForm(searchFormData);
    }
    setTableDataSource(data.page);
    setTotal(data.totalCount);
    setNoData(data.page.length === 0);
  });

  const filterFormData = (allFields, fields) => {
    if (fields.assetClass) {
      return {
        ..._.pick(allFields, ['instrumentId', 'name']),
        ...fields,
      };
    }

    const instrumentType = Form2.getFieldValue(fields.instrumentType);
    if (instrumentType === 'STOCK') {
      return {
        ...allFields,
        multiplier: Form2.createField(1),
      };
    }
    return allFields;
  };

  const optionInstrumentType = ['FUTURES_OPTION', 'STOCK_OPTION', 'INDEX_OPTION'];

  const onCreateFormChange = (p, fields, allFields) => {
    const nextAllFields = {
      ...createFormData,
      ...fields,
    };
    const instrumentType = Form2.getFieldValue(fields.instrumentType);
    if (optionInstrumentType.indexOf(instrumentType) !== -1) {
      nextAllFields.expirationTime = Form2.createField(moment('15:00:00', 'HH:mm:ss'));
    }
    const columns = createFormControls(Form2.getFieldsValue(nextAllFields), 'create');
    setCreateFormControlsState(columns);
    setCreateFormData(filterFormData(nextAllFields, fields));
  };

  const omitNull = obj => _.omitBy(obj, val => val === null);

  const composeInstrumentInfo = formData => {
    const modalFormData = formData;
    if (optionInstrumentType.indexOf(modalFormData.instrumentType) !== -1) {
      modalFormData.expirationDate = moment(modalFormData.expirationDate).format('YYYY-MM-DD');
      modalFormData.expirationTime = moment(modalFormData.expirationTime).format('HH:mm:ss');
    }
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
      'tradeCategory',
      'tradeUnit',
      'unit',
    ];
    const params = {
      ..._.omit(modalFormData, instrumentInfoFields),
      instrumentInfo: omitNull(_.pick(modalFormData, instrumentInfoFields)),
    };
    return omitNull(params);
  };

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
    setCreating(false);

    if (error) {
      message.error('创建失败');
      return;
    }
    message.success('创建成功');

    setCreateVisible(false);
    setCreateFormData({});
    setCreateFormControlsState(createFormControls({}, 'create'));
    setPagination(defaultPagination);
    fetchTable(defaultPagination);
  };

  const onSearchFormChange = (p, fields, allFields) => {
    if (fields.assetClass) {
      return setSearchFormData({
        ..._.omit(searchFormData, ['instrumentType']),
        ...fields,
      });
    }
    return setSearchFormData(allFields);
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
    setPagination(defaultPagination);
    fetchTable(defaultPagination, searchFormData, true);
  };

  const onReset = () => {
    setPagination(defaultPagination);
    setSearchFormData({});
    fetchTable(defaultPagination, {}, true);
  };

  useEffect(() => {
    fetchTable(null, {});
    setCreateFormControlsState(createFormControls({}, 'create'));
  }, []);

  return (
    <Page>
      <Form2
        columns={searchFormControls()}
        dataSource={searchFormData}
        layout="inline"
        onSubmitButtonClick={onSearch}
        onResetButtonClick={onReset}
        onFieldsChange={onSearchFormChange}
        submitText="查询"
      />
      <Divider />
      <Button style={{ marginBottom: VERTICAL_GUTTER }} type="primary" onClick={switchModal}>
        新建标准合约
      </Button>
      <SmartTable
        rowKey="instrumentId"
        columns={TABLE_COL_DEFS(() => fetchTable(null, searchForm, false))}
        loading={loading}
        scroll={{ x: noData ? false : 2300 }}
        dataSource={tableDataSource}
        pagination={{
          ...pagination,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: onPaginationChange,
          onShowSizeChange: onPaginationChange,
        }}
      />
      <Modal
        visible={createVisible}
        onOk={onCreate}
        onCancel={switchModal}
        title="新建标的物"
        okButtonProps={{ loading: creating }}
      >
        <Form2
          ref={node => {
            $form = node;
          }}
          columns={createFormControlsState}
          dataSource={createFormData}
          onFieldsChange={onCreateFormChange}
          footer={false}
        />
      </Modal>
    </Page>
  );
};
export default memo(TradeManagementMarketManagement);
