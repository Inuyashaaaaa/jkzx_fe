import { Button, message, Modal, Row, TreeSelect } from 'antd';
import React, { PureComponent } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { VERTICAL_GUTTER } from '@/constants/global';
import { SmartTable, Form2, Input } from '@/containers';
import Form from '@/containers/Form';
import Page from '@/containers/Page';
import { queryAuthDepartmentList } from '@/services/department';
import { trdTradeListByBook } from '@/services/general-service';
import {
  addNonGroupResource,
  queryNonGroupResource,
  updateNonGroupResource,
} from '@/services/tradeBooks';
import { CREATE_FORM_CONTROLS } from './constants';
import Operation from './Operation';

function departmentsTreeData(departments) {
  function getChild(params) {
    if (params.children) {
      return {
        title: params.departmentName,
        value: params.id,
        key: params.id,
        children: params.children.map(item => getChild(item)),
      };
    }
    return {
      title: params.departmentName,
      value: params.id,
      key: params.id,
    };
  }
  return departments && getChild(departments);
}

function findDepartment(departs, departId) {
  let hint = {};
  function inner(d) {
    if (d.id === departId) {
      hint = d;
      return;
    }
    const { children } = d;
    if (children && children.length > 0) {
      const target = children.find(c => c.id === departId);
      if (target) {
        hint = target;
        return;
      }
      children.forEach(c => inner(c));
    }
  }
  inner(departs);
  return hint;
}

class SystemSettingsTradeBooks extends PureComponent {
  public initialFetchTableData = null;

  public $form: Form2 = null;

  public state = {
    loading: false,
    books: [],
    visible: false,
    createFormData: {},
    confirmLoading: false,
    departments: [],
  };

  public componentDidMount() {
    this.fetchTable();
  }

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });
    const requests = () => Promise.all([queryNonGroupResource(), queryAuthDepartmentList()]);
    const [tradeBooks, departments] = await requests();
    if (tradeBooks.error || departments.error) {
      this.setState({
        loading: false,
      });
      return false;
    }
    const books = tradeBooks.data || [];
    const currentBooks = books.map(book => {
      const result = findDepartment(departments.data, book.departmentId);
      // book.departmentName = result.departmentName;
      return { ...book, departmentName: result.departmentName };
    });
    return this.setState({
      books: currentBooks.sort((a, b) => a.resourceName.localeCompare(b.resourceName)),
      loading: false,
      departments: departments.data || [],
    });
  };

  public onCreateBook = async () => {
    const res = await this.$form.validate();
    if (res.error) {
      return;
    }

    this.setState({ confirmLoading: true });
    const createFormData = Form2.getFieldsValue(this.state.createFormData);
    const params = { resourceType: 'BOOK', ...createFormData };
    const { error, data } = await addNonGroupResource(params);
    this.setState({ confirmLoading: false });
    if (error) return;
    this.setState({
      visible: false,
      createFormData: {},
    });
    this.fetchTable();
  };

  public handleCellValueChanged = async e => {
    const { data, newValue, oldValue } = e;
    const params = {
      resourceType: 'BOOK',
      resourceName: oldValue,
      newResourceName: newValue,
    };
    const trdTradeListByBookRsp = await trdTradeListByBook({
      bookName: oldValue,
    });
    if (trdTradeListByBookRsp.error) {
      return;
    }
    if (trdTradeListByBookRsp.data.length) {
      message.error('该交易簿下已存在交易，不允许修改');
      this.fetchTable();
      return;
    }
    const res = await updateNonGroupResource(params);
    if (res.error) {
      message.error('修改失败');
      return;
    }
    message.success('修改成功');
  };

  public switchModal = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
      createFormData: {},
    });
  };

  // public onValueChange = params => {
  //   this.setState({
  //     createFormData: params.values,
  //   });
  // };

  public onValueChange = (props, fields, allFields) => {
    const { createFormData } = this.state;
    this.setState({
      createFormData: {
        ...createFormData,
        ...fields,
      },
    });
  };

  public render() {
    const { books, loading } = this.state;
    return (
      <Page>
        <Row>
          <Button
            type="primary"
            style={{ marginBottom: VERTICAL_GUTTER }}
            onClick={this.switchModal}
          >
            新建交易簿
          </Button>
        </Row>
        <SmartTable
          dataSource={books}
          columns={[
            {
              title: '名称',
              dataIndex: 'resourceName',
            },
            {
              title: '部门',
              dataIndex: 'departmentName',
            },
            {
              title: '创建时间',
              dataIndex: 'createTime',
            },
            {
              title: '操作',
              render: (text, record, index) => (
                <Operation record={text} fetchTable={this.fetchTable} />
              ),
            },
          ]}
          rowKey="resourceName"
          loading={loading}
        />
        <Modal
          title="新建交易簿"
          onOk={this.onCreateBook}
          onCancel={this.switchModal}
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
        >
          {/* <Form
            footer={false}
            controlNumberOneRow={1}
            dataSource={this.state.createFormData}
            controls={CREATE_FORM_CONTROLS}
            onValueChange={this.onValueChange}
          /> */}
          <Form2
            ref={node => {
              this.$form = node;
            }}
            dataSource={this.state.createFormData}
            onFieldsChange={this.onValueChange}
            footer={false}
            columns={[
              {
                title: '交易簿名称',
                dataIndex: 'resourceName',
                render: (val, record, index, { form }) => (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [
                        {
                          required: true,
                          message: '交易簿名称为必填项',
                        },
                      ],
                    })(<Input />)}
                  </FormItem>
                ),
              },
              {
                title: '部门',
                dataIndex: 'departmentId',
                render: (val, record, index, { form }) => (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [
                        {
                          required: true,
                          message: '部门为必填项',
                        },
                      ],
                    })(
                      <TreeSelect
                        treeData={departmentsTreeData(this.state.departments)}
                        treeDefaultExpandAll
                      />,
                    )}
                  </FormItem>
                ),
              },
            ]}
          />
        </Modal>
      </Page>
    );
  }
}

export default SystemSettingsTradeBooks;
