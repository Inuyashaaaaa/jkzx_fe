import { Form2, ModalButton, Upload } from '@/components';
import { IFormField } from '@/components/type';
import { LEG_FIELD, LEG_ID_FIELD, LEG_INJECT_FIELDS, PREMIUM_TYPE_MAP } from '@/constants/common';
import { COMPUTED_LEG_FIELD_MAP, FORM_EDITABLE_STATUS } from '@/constants/global';
import { LEG_ENV } from '@/constants/legs';
import { BOOKING_FROM_PRICING } from '@/constants/trade';
import BookingBaseInfoForm from '@/containers/BookingBaseInfoForm';
import CashExportModal from '@/containers/CashExportModal';
import MultilLegCreateButton from '@/containers/MultiLegsCreateButton';
import MultiLegTable from '@/containers/MultiLegTable';
import { IMultiLegTableEl } from '@/containers/MultiLegTable/type';
import Page from '@/containers/Page';
import {
  UPLOAD_URL,
  wkAttachmentProcessInstanceModify,
  wkProcessGet,
  wkProcessInstanceCreate,
} from '@/services/approval';
import { convertTradePageData2ApiData, createLegDataSourceItem } from '@/services/pages';
import { getLegByRecord } from '@/tools';
import { ILeg } from '@/types/leg';
import { insert, remove, uuid } from '@/utils';
import { getToken } from '@/utils/authority';
import { Affix, Alert, Button, Divider, Menu, message, Modal, Row } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useRef, useState } from 'react';
import router from 'umi/router';
import './index.less';

const ActionBar = memo<any>(props => {
  const { setTableData, tableData, tableEl, currentUser } = props;
  const [affix, setAffix] = useState(false);
  const [createTradeLoading, setCreateTradeLoading] = useState(false);
  let currentCreateFormRef = useRef<Form2>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createFormData, setCreateFormData] = useState({});
  const [cashModalVisible, setCashModalVisible] = useState(false);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);

  const [attachmentId, setAttachmentId] = useState(null);
  const handleCancel = () => {
    setCashModalVisible(false);
    setCreateFormData({});
  };

  const transactionHandleOk = () => {
    setTransactionModalVisible(false);
    handelTrdTradeCreate();
    router.push('/approval-process/process-manangement');
  };

  const transactionHandleCancel = () => {
    setTransactionModalVisible(false);
  };

  const handelTrdTradeCreate = async () => {
    const _createFormData = Form2.getFieldsValue(createFormData);
    Object.keys(_createFormData).forEach(item => {
      if (!_.endsWith(item, 'Date')) {
        _createFormData[item] = _.trim(_createFormData[item]);
      }
    });
    const trade = convertTradePageData2ApiData(
      tableData.map(item => Form2.getFieldsValue(item)),
      _createFormData,
      currentUser.username,
      LEG_ENV.BOOKING
    );

    // 发起审批
    const { error: _error, data: _data } = await wkProcessInstanceCreate({
      processName: '交易录入',
      processData: {
        trade,
        validTime: '2018-01-01T10:10:10',
      },
    });

    if (_error) return;
    if (_data.processInstanceId) {
      message.success('已进入流程');
    } else {
      setTableData([]);

      setCashModalVisible(true);
      message.success('簿记成功');
    }
    setCreateModalVisible(false);

    // 发起审批成功关联附件
    if (attachmentId) {
      const { error: aerror, data: adata } = await wkAttachmentProcessInstanceModify({
        attachmentId,
        processInstanceId: _data.processInstanceId,
      });
      if (aerror) return;
    }
  };

  const [fileList, setFileList] = useState([]);
  return (
    <Affix offsetTop={0} onChange={affix => setAffix(affix)}>
      <Row
        type="flex"
        justify="space-between"
        style={{
          background: '#fff',
          borderBottom: affix ? '1px solid #ddd' : 'none',
          padding: affix ? '20px 0' : 0,
        }}
      >
        <Button.Group>
          <MultilLegCreateButton
            isPricing={false}
            key="create"
            handleAddLeg={(leg: ILeg) => {
              if (!leg) return;

              setTableData(pre =>
                pre.concat({
                  ...createLegDataSourceItem(leg, LEG_ENV.BOOKING),
                  ...leg.getDefaultData(LEG_ENV.BOOKING),
                })
              );
            }}
          />
          <ModalButton
            key="完成簿记"
            type="primary"
            loading={createTradeLoading}
            onClick={async () => {
              if (tableData.length === 0) {
                return message.warn('缺少交易结构');
              }

              const rsps = await tableEl.current.table.validate();
              if (rsps.some(item => item.errors)) {
                return;
              }
              setCreateModalVisible(true);
            }}
            modalProps={{
              title: '创建簿记',
              visible: createModalVisible,
              onOk: async () => {
                const res = await currentCreateFormRef.validate();
                if (res.error) return;
                const { error: _error, data: _data } = await wkProcessGet({
                  processName: '交易录入',
                });
                if (_error) return;
                if (_data.status) {
                  return setTransactionModalVisible(true);
                }

                handelTrdTradeCreate();
              },
              onCancel: () => setCreateModalVisible(false),
              children: (
                <BookingBaseInfoForm
                  currentCreateFormRef={node => {
                    currentCreateFormRef = node;
                  }}
                  editableStatus={FORM_EDITABLE_STATUS.EDITING_NO_CONVERT}
                  createFormData={createFormData}
                  setCreateFormData={setCreateFormData}
                />
              ),
            }}
          >
            完成簿记
          </ModalButton>
        </Button.Group>
      </Row>

      <CashExportModal
        visible={cashModalVisible}
        trade={Form2.getFieldsValue(createFormData)}
        convertVisible={handleCancel}
      />
      <Modal
        title="发起审批"
        visible={transactionModalVisible}
        onOk={transactionHandleOk}
        onCancel={transactionHandleCancel}
      >
        <div style={{ margin: '20px' }}>
          <Alert
            showIcon={true}
            type="info"
            message={'您提交的交易需要通过审批才能完成簿记。请上传相关材料后发起审批。'}
          />
          <p style={{ margin: '20px', textAlign: 'center' }}>
            <Upload
              maxLen={1}
              action={UPLOAD_URL}
              data={{
                method: 'wkAttachmentUpload',
                params: JSON.stringify({}),
              }}
              headers={{ Authorization: `Bearer ${getToken()}` }}
              onRemove={() => {
                message.info('请重新选择上传文件');
                return false;
              }}
              onChange={fileList => {
                setFileList(fileList);
                if (!fileList || fileList.length <= 0) return;
                if (fileList[0].status === 'done') {
                  setAttachmentId(fileList[0].response.result.attachmentId);
                }
              }}
              value={fileList}
            />
          </p>
        </div>
      </Modal>
    </Affix>
  );
});

const TradeManagementBooking = props => {
  const { location, currentUser } = props;
  const { query } = location;
  const { from } = query;

  const getPricingPermium = record => {
    return Form2.getFieldValue(record[LEG_FIELD.PREMIUM_TYPE]) === PREMIUM_TYPE_MAP.CNY
      ? record[COMPUTED_LEG_FIELD_MAP.PRICE]
      : record[COMPUTED_LEG_FIELD_MAP.PRICE_PER];
  };

  const [tableData, setTableData] = useState(
    from === BOOKING_FROM_PRICING
      ? (props.pricingData.tableData || []).map(item => {
          const leg = getLegByRecord(item);
          if (!leg) return item;
          const omits = _.difference(
            leg.getColumns(LEG_ENV.PRICING).map(item => item.dataIndex),
            leg.getColumns(LEG_ENV.BOOKING).map(item => item.dataIndex)
          );

          const pricingPermium = getPricingPermium(item);
          const permium =
            pricingPermium == null ? undefined : Math.abs(Form2.getFieldValue(pricingPermium));

          return {
            ...createLegDataSourceItem(leg, LEG_ENV.BOOKING),
            ...leg.getDefaultData(LEG_ENV.BOOKING),
            ..._.omit(item, [...omits, ...LEG_INJECT_FIELDS]),
            [LEG_FIELD.PREMIUM]: Form2.createField(permium),
          };
        })
      : []
  );

  const tableEl = useRef<IMultiLegTableEl>(null);
  return (
    <Page>
      <ActionBar
        setTableData={setTableData}
        tableData={tableData}
        tableEl={tableEl}
        currentUser={currentUser}
      />
      <Divider />
      <MultiLegTable
        tableEl={tableEl}
        env={LEG_ENV.BOOKING}
        onCellFieldsChange={params => {
          const { record } = params;
          const leg = getLegByRecord(record);

          setTableData(pre => {
            const newData = pre.map(item => {
              if (item[LEG_ID_FIELD] === params.rowId) {
                return {
                  ...item,
                  ...params.changedFields,
                };
              }
              return item;
            });
            if (leg.onDataChange) {
              leg.onDataChange(
                LEG_ENV.BOOKING,
                params,
                newData[params.rowIndex],
                newData,
                (colId: string, loading: boolean) => {
                  tableEl.current.setLoadings(params.rowId, colId, loading);
                },
                tableEl.current.setLoadingsByRow,
                (colId: string, newVal: IFormField) => {
                  setTableData(pre =>
                    pre.map(item => {
                      if (item[LEG_ID_FIELD] === params.rowId) {
                        return {
                          ...item,
                          [colId]: newVal,
                        };
                      }
                      return item;
                    })
                  );
                },
                setTableData
              );
            }
            return newData;
          });
        }}
        dataSource={tableData}
        getContextMenu={params => {
          return (
            <Menu
              onClick={event => {
                if (event.key === 'copy') {
                  setTableData(pre => {
                    const next = insert(pre, params.rowIndex, {
                      ..._.cloneDeep(params.record),
                      [LEG_ID_FIELD]: uuid(),
                    });
                    return next;
                  });
                }
                if (event.key === 'remove') {
                  setTableData(pre => {
                    const next = remove(pre, params.rowIndex);
                    return next;
                  });
                }
              }}
            >
              <Menu.Item key="copy">复制</Menu.Item>
              <Menu.Item key="remove">删除</Menu.Item>
            </Menu>
          );
        }}
      />
    </Page>
  );
};

export default memo(
  connect(state => ({
    currentUser: (state.user as any).currentUser,
    pricingData: state.pricingData,
  }))(TradeManagementBooking)
);
