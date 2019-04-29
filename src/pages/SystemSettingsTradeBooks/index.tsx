import { VERTICAL_GUTTER } from '@/constants/global';
import Form from '@/design/components/Form';
import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { queryAuthDepartmentList } from '@/services/department';
import {
  addNonGroupResource,
  queryNonGroupResource,
  updateNonGroupResource,
} from '@/services/tradeBooks';
import { Button, Modal } from 'antd';
import React, { PureComponent } from 'react';
import { CREATE_FORM_CONTROLS, PAGE_TABLE_COL_DEFS } from './constants';

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
    const res = await updateNonGroupResource(params);
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
      <PageHeaderWrapper>
        <SourceTable
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
        />
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
      </PageHeaderWrapper>
    );
  }
}

export default SystemSettingsTradeBooks;
