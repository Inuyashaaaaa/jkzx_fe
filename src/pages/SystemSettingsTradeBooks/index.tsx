import { VERTICAL_GUTTER } from '@/constants/global';
import Form from '@/containers/Form';
import SourceTable from '@/containers/SourceTable';
import Page from '@/containers/Page';
import { queryAuthDepartmentList } from '@/services/department';
import {
  addNonGroupResource,
  queryNonGroupResource,
  updateNonGroupResource,
} from '@/services/tradeBooks';
import { Button, Modal, message, Row, Table } from 'antd';
import React, { PureComponent } from 'react';
import { CREATE_FORM_CONTROLS, PAGE_TABLE_COL_DEFS } from './constants';
import { trdTradeListByBook } from '@/services/general-service';
import { Form2, Select } from '@/containers';
import FormItem from 'antd/lib/form/FormItem';
import Operation from './Operation';

function findDepartment(departs, departId) {
  let hint = {};
  function inner(d) {
    if (d.id === departId) {
      hint = d;
      return;
    }
    const children = d.children;
    if (children && children.length > 0) {
      const target = children.find(c => c.id === departId);
      if (target) {
        hint = target;
        return;
      } else {
        children.forEach(c => inner(c));
      }
    }
  }
  inner(departs);
  return hint;
}

class SystemSettingsTradeBooks extends PureComponent {
  public $table: SourceTable = null;

  public initialFetchTableData = null;

  public state = {
    rowData: [],
    loading: false,
    books: [],
    visible: false,
    createFormData: {},
    confirmLoading: false,
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
      book.departmentName = result.departmentName;
      return { departmentName: result.departmentName, ...book };
    });
    this.setState({
      books: currentBooks.sort((a, b) => {
        return a.resourceName.localeCompare(b.resourceName);
      }),
      loading: false,
    });
  };

  public onCreateBook = async () => {
    this.setState({ confirmLoading: true });
    const createFormData = this.state.createFormData;
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
    this.setState({
      visible: !this.state.visible,
      createFormData: {},
    });
  };

  public onValueChange = params => {
    this.setState({
      createFormData: params.values,
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
        <Table
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
              render: (text, record, index) => {
                return <Operation record={text} fetchTable={this.fetchTable} />;
              },
            },
          ]}
          rowKey="resourceName"
          size="middle"
          loading={loading}
        />
        {/* <SourceTable
          loading={loading}
          rowKey={'id'}
          dataSource={books}
          columnDefs={PAGE_TABLE_COL_DEFS(this.fetchTable)}
          onCellValueChanged={this.handleCellValueChanged}
          header={
            <Button
              type="primary"
              style={{ marginBottom: VERTICAL_GUTTER }}
              onClick={this.switchModal}
            >
              新建交易簿
            </Button>
          }
        /> */}
        <Modal
          title="新建交易簿"
          onOk={this.onCreateBook}
          onCancel={this.switchModal}
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
        >
          <Form
            footer={false}
            controlNumberOneRow={1}
            dataSource={this.state.createFormData}
            controls={CREATE_FORM_CONTROLS}
            onValueChange={this.onValueChange}
          />
        </Modal>
      </Page>
    );
  }
}

export default SystemSettingsTradeBooks;
