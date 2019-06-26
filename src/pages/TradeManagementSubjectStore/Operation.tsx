/*eslint-disable */
import React, { useRef, useState, memo } from 'react';
import { Popconfirm, Divider, Modal, message } from 'antd';
import { Form2 } from '@/containers';
import { editFormControls } from './services';
import { mktInstrumentCreate, mktInstrumentDelete } from '@/services/market-data-service';
import _ from 'lodash';
import moment, { isMoment } from 'moment';

const Operation = memo<{ record: any; fetchTable: any }>(props => {
  let $form: Form2 = useRef(null);

  const [editVisible, setEditVisible] = useState(false);
  const [editFormControlsState, setEditformControlsState] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [editing, setEditing] = useState(false);

  const onRemove = async () => {
    const { error } = await mktInstrumentDelete({
      instrumentId: props.record.instrumentId,
    });
    if (error) {
      message.error('删除失败');
      return;
    }
    message.success('删除成功');
    props.fetchTable();
  };

  const switchModal = () => {
    const data = _.mapValues(props.record, (value, key) => {
      if ('expirationTime' === key) {
        return moment(value, 'HH:mm:ss');
      }
      if (['maturity', 'expirationDate'].indexOf(key) !== -1) {
        return moment(value);
      }
      return value;
    });
    setEditVisible(!editVisible);
    setEditFormData(Form2.createFields(data));
    setEditformControlsState(editFormControls(props.record, 'edit'));
  };

  const composeInstrumentInfo = modalFormData => {
    modalFormData.expirationDate = modalFormData.expirationDate
      ? moment(modalFormData.expirationDate).format('YYYY-MM-DD')
      : undefined;
    modalFormData.expirationTime = modalFormData.expirationTime
      ? moment(modalFormData.expirationTime).format('HH:mm:ss')
      : undefined;
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

  const onEdit = async () => {
    const rsp = await $form.validate();
    if (rsp.error) return;
    setEditing(false);
    let newEditFormData = Form2.getFieldsValue(editFormData);
    newEditFormData = composeInstrumentInfo(newEditFormData);
    newEditFormData.instrumentInfo.maturity = isMoment(newEditFormData.instrumentInfo.maturity)
      ? moment(newEditFormData.instrumentInfo.maturity).format('YYYY-MM-DD')
      : newEditFormData.instrumentInfo.maturity;
    const { error, data } = await mktInstrumentCreate(newEditFormData);
    setEditing(false);

    if (error) {
      message.error('编辑失败');
      return;
    }
    message.success('编辑成功');
    setEditVisible(false);
    props.fetchTable();
    return;
  };

  const filterFormData = (allFields, fields, columns) => {
    const changed = Form2.getFieldsValue(fields);
    const column = columns.map(item => item.dataIndex);
    const formData = _.pick(Form2.getFieldsValue(allFields), column);
    if (Object.keys(changed)[0] === 'assetClass') {
      return {
        ..._.pick(props.record, ['instrumentId']),
        ...changed,
      };
    }
    if (changed.instrumentType === 'STOCK') {
      return {
        ...formData,
        multiplier: 1,
      };
    }
    return formData;
  };

  const onEditFormChange = (props, fields, allFields) => {
    const columns = editFormControls(Form2.getFieldsValue(allFields), 'edit');
    setEditformControlsState(columns);
    setEditFormData(Form2.createFields(filterFormData(allFields, fields, columns)));
  };

  return (
    <>
      <a href="javascript:;" style={{ color: '#1890ff' }} onClick={switchModal}>
        编辑
      </a>
      <Divider type="vertical" />
      <Popconfirm title="确定要删除吗？" onConfirm={onRemove}>
        <a href="javascript:;" style={{ color: 'red' }}>
          删除
        </a>
      </Popconfirm>
      <Modal
        visible={editVisible}
        onOk={onEdit}
        onCancel={switchModal}
        okButtonProps={{ loading: editing }}
        title={'编辑标的物'}
      >
        <Form2
          ref={node => ($form = node)}
          columns={editFormControlsState}
          dataSource={editFormData}
          onFieldsChange={onEditFormChange}
          footer={false}
        />
      </Modal>
    </>
  );
});

export default Operation;
