import React, { memo, useState } from 'react';
import { Table2, Form2, Input, Upload } from '@/containers';
import { PRODUCTTYPE_ZHCH_MAP, DOC_MAP } from '@/constants/common';
import { Divider, Popconfirm, Button, Modal, Icon, notification, Row, Col, Alert } from 'antd';
import {
  queryTemplateList,
  deleteTemplate,
  docPoiTemplateList,
  HREF_UPLOAD_URL,
  UPLOAD_URL,
  COMFIRM_POI_URL,
  docPoiTemplateDelete,
} from '@/services/document';
import useLifecycles from 'react-use/lib/useLifecycles';
import FormItem from 'antd/lib/form/FormItem';
import { getToken } from '@/tools/authority';
import { getMoment } from '@/tools';
import _ from 'lodash';

const TradingTemplate = memo(props => {
  const [loading, setLoading] = useState(false);
  const [tradeData, setTradeData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [tradeFormData, setTradeFormData] = useState({});
  const [fileList, setFileList] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const { error, data } = await docPoiTemplateList();
    setLoading(false);
    if (error) return;
    const newData = [...data];
    newData.sort((item1, item2) => {
      const data1 = item1.docType + item1.tradeType;
      const data2 = item2.docType + item2.tradeType;
      return data1.localeCompare(data2);
    });
    setTradeData(newData);
  };

  const removeTemplate = async record => {
    const { error } = await docPoiTemplateDelete({
      uuid: record.uuid,
    });
    if (error) return;
    fetchData();
  };

  const showModal = record => {
    const data = _.mapValues(_.pick(record, ['uuid', 'tradeType', 'docType']), (value, key) => {
      if (key === 'tradeType') {
        return PRODUCTTYPE_ZHCH_MAP[value];
      }
      if (key === 'docType') {
        return DOC_MAP[value];
      }
      return value;
    });

    setTradeFormData(Form2.createFields(data));
    setFileList([]);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const onConfirm = () => {
    fetchData();
    setVisible(false);
  };

  const checkFileType = (file, data) => {
    const infos = (data && data.mimeInfos) || [];
    const types = (data && data.mimeTypes) || [];
    if (infos.length === 0 || types.length === 0) {
      return true;
    }
    const type = (file && file.type) || '';
    if (infos.includes(type)) {
      return true;
    }
    notification.error({
      message: `文件上传只支持${types.join(',')}类型`,
    });
    return false;
  };

  const onUploadStatusChanged = info => {
    if (info[0].status) {
      setFileList(info);

      if (info[0].status === 'done') {
        notification.success({
          message: '模板上传成功',
        });
        fetchData();
        setVisible(false);
      }
      if (info[0].status === 'error') {
        notification.error({
          message: '模板上传失败',
        });
      }
    }
  };

  useLifecycles(() => {
    fetchData();
  });

  return (
    <>
      <Table2
        loading={loading}
        columns={[
          {
            dataIndex: 'tradeType',
            title: '交易类型',
            render: (value, record, index) => PRODUCTTYPE_ZHCH_MAP[value],
          },
          {
            dataIndex: 'docType',
            title: '交易类型',
            render: (value, record, index) => DOC_MAP[value],
          },
          {
            dataIndex: 'fileName',
            title: '模板',
          },
          {
            dataIndex: 'updatedAt',
            title: '模板更新时间',
            render: (value, record, index) => getMoment(value).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            dataIndex: '操作',
            title: '操作',
            render: (value, record, index) => {
              const isValid = !!record.fileName;

              return isValid ? (
                <div>
                  <a href={`${COMFIRM_POI_URL}${record.uuid}`} download={`${record.fileName}`}>
                    查看
                  </a>
                  <Divider type="vertical" />
                  <Popconfirm title="新文件将会替换旧文件" onConfirm={() => showModal(record)}>
                    <a>更新</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <Popconfirm title="确定要删除吗？" onConfirm={() => removeTemplate(record)}>
                    <a>删除</a>
                  </Popconfirm>
                </div>
              ) : (
                <div>
                  <a onClick={() => showModal(record)}>上传</a>
                </div>
              );
            },
          },
        ]}
        rowKey="uuid"
        dataSource={tradeData}
      />
      <Modal
        visible={visible}
        title="上传模板"
        maskClosable={false}
        onOk={onConfirm}
        onCancel={hideModal}
        footer={false}
      >
        <Form2
          dataSource={tradeFormData}
          footer={false}
          columns={[
            {
              dataIndex: 'tradeType',
              title: '交易类型',
              render: (val, record, index, { form, editing }) => {
                return <FormItem>{form.getFieldDecorator({})(<Input editing={false} />)}</FormItem>;
              },
            },
            {
              dataIndex: 'docType',
              title: '文档类型',
              render: (val, record, index, { form, editing }) => {
                return <FormItem>{form.getFieldDecorator({})(<Input editing={false} />)}</FormItem>;
              },
            },
          ]}
        />
        <Row type="flex" justify="center">
          <Col>
            <Upload
              name="file"
              maxLen={1}
              action={UPLOAD_URL}
              headers={{
                Authorization: `Bearer ${getToken()}`,
              }}
              data={{
                method: 'docPoiTemplateCreateOrUpdate',
                params: JSON.stringify({
                  uuid: Form2.getFieldValue(tradeFormData.uuid),
                }),
              }}
              beforeUpload={file =>
                checkFileType(file, {
                  mimeTypes: ['DOC', 'DOCX'],
                  mimeInfos: [
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  ],
                })
              }
              onChange={info => onUploadStatusChanged(info)}
              value={fileList}
            >
              <Button>
                <Icon type="upload" />
                上传文件
              </Button>
            </Upload>
          </Col>
        </Row>
        <Alert message="文件上传只支持doc,docx类型" style={{ marginTop: '20px' }} />
      </Modal>
    </>
  );
});

export default TradingTemplate;
