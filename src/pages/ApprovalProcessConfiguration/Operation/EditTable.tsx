import _ from 'lodash';
import React, { memo, useEffect, useState, useRef } from 'react';
import { Table2, Select, Form2, Input, SmartTable } from '@/containers';
import { Button, Icon, Tag, Alert, Modal, message } from 'antd';
import GroupSelcet from './GroupSelcet';
import FormItem from 'antd/lib/form/FormItem';
import XLSX from 'xlsx';
import { wkApproveGroupList } from '@/services/auditing';
import AutoSelect from './AutoSelect';

const EditTable = memo<any>(props => {
  const {
    reviewTask,
    showOtherModel,
    otherVisible,
    handleOtherOk,
    handleOtherCancel,
    otherTask,
    onOtherCellFieldsChange,
    getRef,
    warningVisible,
    warningCancel,
    excelData,
    processName,
    setWarningVisible,
    onReviewCellFieldsChange,
    // downloadFormModal,
  } = props;

  const tableE2 = useRef<Table2>(null);

  const showModel = () => {
    showOtherModel();
  };

  const onCellFieldsChange = ({ allFields, changedFields, record, rowIndex }) => {
    onOtherCellFieldsChange({ allFields, changedFields, record, rowIndex });
  };

  const handleReviewCellFieldsChange = ({ allFields, changedFields, record, rowIndex }) => {
    // debugger
    // onReviewCellFieldsChange({ allFields, changedFields, record, rowIndex }, true);
  };

  const handleOk = () => {
    handleOtherOk();
  };

  const handleCancel = () => {
    handleOtherCancel();
  };

  if (getRef) {
    getRef({
      tableE2,
    });
  }

  const downloadFormModal = () => {
    const cols = ['sheet'];
    const _data = cols.map(tab => {
      const tabData = [['审批单号', '审批类型', '发起人', '标题', '发起时间']];
      return _.concat(
        tabData,
        excelData.map(item => {
          return [
            item.processSequenceNum,
            item.processName,
            _.get(item, 'initiator.userName'),
            item.subject,
            item.startTime,
          ];
        })
      );
    });
    const wb = XLSX.utils.book_new();

    cols.forEach((item, index) => {
      const ws = XLSX.utils.aoa_to_sheet(_data[index]);
      XLSX.utils.book_append_sheet(wb, ws, item);
    });
    XLSX.writeFile(wb, `${processName}未完成审批单.xlsx`);
    setWarningVisible(false);
  };

  return (
    <>
      <SmartTable
        dataSource={reviewTask}
        rowKey="taskId"
        pagination={false}
        onCellValueChanged={handleReviewCellFieldsChange}
        columns={[
          {
            title: '节点名称',
            dataIndex: 'taskName',
            editable: record => {
              return false;
            },
            render: (value, record, index, { form, editing }) => {
              return <FormItem>{form.getFieldDecorator({})(<Input editing={false} />)}</FormItem>;
            },
          },
          {
            title: '审批组',
            dataIndex: 'approveGroupList',
            editable: record => {
              return true;
            },
            width: '50%',
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator({
                    rules: [
                      {
                        required: true,
                        message: '至少选择一个审批组',
                      },
                    ],
                  })(<AutoSelect {...{ record, index, form, editing, processName }} />)}
                </FormItem>
              );
            },
          },
        ]}
      />
      <Modal
        title="编辑流程"
        visible={otherVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="保存"
        cancelText="放弃修改"
        width={800}
      >
        <SmartTable
          size="small"
          ref={node => (tableE2.current = node)}
          dataSource={otherTask}
          rowKey="taskId"
          pagination={false}
          onCellFieldsChange={onCellFieldsChange}
          columns={[
            {
              title: '节点名称',
              dataIndex: 'taskName',
              width: 200,
              render: (value, record, index, { form, editing }) => {
                return value;
              },
            },
            {
              title: '审批组',
              dataIndex: 'approveGroupList',
              width: 450,
              render: (value, record, index, { form, editing }) => {
                return (
                  <GroupSelcet record={record} index={index} formData={{ form, editing: true }} />
                );
              },
            },
          ]}
        />
      </Modal>

      <Modal
        visible={warningVisible}
        width={520}
        footer={
          <Button type="primary" onClick={warningCancel}>
            好吧
          </Button>
        }
        closable={false}
      >
        <Alert
          message="该流程下尚有未完成状态的审批单，暂无法修改"
          description={<a onClick={downloadFormModal}>下载这些未完成的审批单</a>}
          type="warning"
          showIcon={true}
          style={{
            border: 'none',
            backgroundColor: '#fff',
          }}
        />
      </Modal>
    </>
  );
});

export default EditTable;
