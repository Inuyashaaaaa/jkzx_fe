import { Affix, Alert, Button, message, Modal, Row } from 'antd';
import _ from 'lodash';
import React, { memo, useRef, useState } from 'react';
import router from 'umi/router';
import moment from 'moment';
import { FORM_EDITABLE_STATUS } from '@/constants/global';
import { LEG_ENV } from '@/constants/legs';
import { Form2, ModalButton, Upload } from '@/containers';
import BookingBaseInfoForm from '@/containers/BookingBaseInfoForm';
import CashExportModal from '@/containers/CashExportModal';
import MultilLegCreateButton from '@/containers/MultiLegsCreateButton';
import {
  UPLOAD_URL,
  wkAttachmentProcessInstanceModify,
  wkProcessGet,
  wkValidProcessCanStart,
  wkProcessInstanceCreate,
} from '@/services/approval';
import { convertTradePageData2ApiData, createLegDataSourceItem } from '@/services/pages';
import { getToken } from '@/tools/authority';
import { ILeg } from '@/types/leg';
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

  const handelTrdTradeCreate = async () => {
    const newCreateFormData = Form2.getFieldsValue(createFormData);
    Object.keys(newCreateFormData).forEach(item => {
      if (!_.endsWith(item, 'Date')) {
        newCreateFormData[item] = _.trim(newCreateFormData[item]);
      }
    });
    const trade = convertTradePageData2ApiData(
      tableData.map(item => Form2.getFieldsValue(item)),
      newCreateFormData,
      currentUser.username,
      LEG_ENV.BOOKING,
    );

    // 发起审批
    const { error: _error, data: _data } = await wkProcessInstanceCreate({
      processName: '交易录入',
      processData: {
        trade,
        validTime: '2018-01-01T10:10:10',
      },
    });

    if (_error) return true;
    if (!_data.processInstanceId) {
      setTableData([]);

      setCashModalVisible(true);
      message.success('簿记成功');
      return true;
    }
    message.success('已进入流程');
    setCreateModalVisible(false);

    // 发起审批成功关联附件
    if (attachmentId) {
      const { error: aerror, data: adata } = await wkAttachmentProcessInstanceModify({
        attachmentId,
        processInstanceId: _data.processInstanceId,
      });
      if (aerror) return true;
    }
    return false;
  };

  const transactionHandleOk = async () => {
    setTransactionModalVisible(false);
    const error = await handelTrdTradeCreate();
    if (!error) {
      router.push('/approval-process/process-manangement');
    }
  };

  const transactionHandleCancel = () => {
    setTransactionModalVisible(false);
  };

  const [fileList, setFileList] = useState([]);
  return (
    <Affix offsetTop={0} onChange={affixs => setAffix(affixs)}>
      <Row
        type="flex"
        justify="space-between"
        style={{
          background: '#fff',
          borderBottom: affix ? '1px solid #ddd' : 'none',
          padding: affix ? '20px 0' : 0,
        }}
      >
        <MultilLegCreateButton
          isPricing={false}
          env={LEG_ENV.BOOKING}
          key="create"
          handleAddLeg={(leg: ILeg) => {
            if (!leg) return;

            setTableData(pre =>
              pre.concat({
                ...createLegDataSourceItem(leg, LEG_ENV.BOOKING),
                ...leg.getDefaultData(LEG_ENV.BOOKING),
              }),
            );
          }}
        />

        <ModalButton
          disabled={_.isEmpty(tableData)}
          key="完成簿记"
          type="primary"
          loading={createTradeLoading}
          onClick={async () => {
            if (tableData.length === 0) {
              message.warn('缺少交易结构');
              return;
            }

            const rsps = await tableEl.current.table.validate();
            if (rsps.some(item => item.errors)) {
              return;
            }
            setCreateModalVisible(true);
            setCreateFormData(Form2.createFields({ tradeDate: moment() }));
          }}
          modalProps={{
            title: '创建簿记',
            visible: createModalVisible,
            onOk: async () => {
              const res = await currentCreateFormRef.validate();
              if (res.error) return;
              const createFormDataSource = Form2.getFieldsValue(createFormData);
              Object.keys(createFormDataSource).forEach(item => {
                if (!_.endsWith(item, 'Date')) {
                  createFormDataSource[item] = _.trim(createFormDataSource[item]);
                }
              });
              const trade = convertTradePageData2ApiData(
                tableData.map(item => Form2.getFieldsValue(item)),
                createFormDataSource,
                currentUser.username,
                LEG_ENV.BOOKING,
              );
              const { error: _error, data: _data } = await wkValidProcessCanStart({
                processName: '交易录入',
                data: {
                  trade,
                },
              });
              if (_error) return;
              // 是否可以发起审批
              if (_data === true) {
                setTransactionModalVisible(true);
                return;
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
            showIcon
            type="info"
            message="您提交的交易需要通过审批才能完成簿记。请上传相关材料后发起审批。"
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
              onChange={list => {
                setFileList(list);
                if (!list || list.length <= 0) return;
                if (list[0].status === 'done') {
                  setAttachmentId(list[0].response.result.attachmentId);
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

export default ActionBar;
