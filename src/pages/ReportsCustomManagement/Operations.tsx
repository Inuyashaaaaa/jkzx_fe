import React, { memo, useState } from 'react';
import { Modal, Table } from 'antd';
import XLSX from 'xlsx';
import _ from 'lodash';
import moment from 'moment';

const Operations = memo<any>(props => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { record } = props;
  const tabelData = [];
  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const showModel = () => {
    setVisible(true);
  };

  const downloadFormModal = () => {
    const cols = ['sheet'];
    const colData = cols.map(() => {
      return _.concat(
        [Object.keys(record.reportData[0])],
        (record.reportData || []).map(item => {
          return _.values(item);
        })
      );
    });
    const wb = XLSX.utils.book_new();
    cols.forEach((item, index) => {
      const ws = XLSX.utils.aoa_to_sheet(colData[index]);
      XLSX.utils.book_append_sheet(wb, ws, item);
    });
    XLSX.writeFile(wb, `${record.reportName}.xlsx`);
  };
  return (
    <>
      {/* {
                record.valuationDate === moment().format('YYYY-MM-DD') ? (
                    <a href="javascript:;" style={{ marginRight: 10 }}>
                        重新计算
                    </a>
                ) : null
            } */}
      <a href="javascript:;" onClick={showModel} style={{ marginRight: 10 }}>
        预览
      </a>
      <a href="javascript:;" onClick={downloadFormModal}>
        下载
      </a>
      <Modal
        title={`正在预览 ${record.reportName} （${record.valuationDate}）`}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        width={700}
      >
        <Table
          size="middle"
          rowKey="uuid"
          dataSource={record.reportData || []}
          columns={Object.keys(record.reportData[0]).map(item => {
            return {
              title: item,
              dataIndex: item,
              width: 150,
            };
          })}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          loading={loading}
          scroll={
            record.reportData && record.reportData.length > 0
              ? { x: `${record.reportData.length * 150}px` }
              : { x: false }
          }
        />
      </Modal>
    </>
  );
});

export default Operations;
