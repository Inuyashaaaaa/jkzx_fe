import { DOC_MAP, PRODUCTTYPE_ZHCH_MAP } from '@/constants/common';
import { Form2, Input, Table2, Upload } from '@/containers';
import {
  deleteTemplate,
  HREF_UPLOAD_URL,
  queryTemplateList,
  UPLOAD_URL,
} from '@/services/document';
import { getMoment } from '@/tools';
import { getToken } from '@/tools/authority';
import { Alert, Button, Col, Divider, Icon, Modal, notification, Popconfirm, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React, { memo, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';

const CustomerTemplate = memo(props => {
  const [loading, setLoading] = useState(false);
  const [tradeData, setTradeData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [tradeFormData, setTradeFormData] = useState({});
  const [fileList, setFileList] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const { error, data } = await queryTemplateList({
      category: 'CLIENT_TEMPLATE',
    });
    setLoading(false);
    if (error) return;
    setTradeData(data);
  };

  const removeTemplate = async record => {
    const { error } = await deleteTemplate({
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
            dataIndex: 'docType',
            title: '文档类型',
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
                  <a href={`${HREF_UPLOAD_URL}${record.uuid}`} download={`${record.fileName}`}>
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
                method: 'docBctTemplateCreateOrUpdate',
                params: JSON.stringify({
                  uuid: Form2.getFieldValue(tradeFormData.uuid),
                }),
              }}
              beforeUpload={file =>
                checkFileType(file, {
                  mimeTypes: ['XML'],
                  mimeInfos: ['text/xml'],
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
        <Alert message="文件上传只支持XML类型" style={{ marginTop: '20px' }} />
      </Modal>
    </>
  );
});

export default CustomerTemplate;
