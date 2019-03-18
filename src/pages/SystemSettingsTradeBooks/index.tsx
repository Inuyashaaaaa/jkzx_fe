import SourceTable from '@/lib/components/_SourceTable';
import Table from '@/lib/components/_Table2';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { queryAuthDepartmentList } from '@/services/department';
import {
  addNonGroupResource,
  deleteNonGroupResource,
  queryNonGroupResource,
  updateNonGroupResource,
} from '@/services/tradeBooks';
import { notification } from 'antd';
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
  public $table: Table = null;

  public initialFetchTableData = null;

  public state = {
    formData: {},
    rowData: [],
    loading: false,
    canSave: false,
    saveLoading: false,
    loading: false,
    books: [],
  };

  public componentDidMount() {
    this.fetchTable();
  }

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });
    // const data = await queryNonGroupResource({});
    // const departments = await queryAuthDepartmentList({});
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
      books: currentBooks,
      loading: false,
    });
  };

  public onRemove = async id => {
    // console.log(id);
    const { rowData } = id;
    const res = await deleteNonGroupResource({
      resourceType: rowData.resourceType,
      resourceName: rowData.resourceName,
    });
    if (res.error) {
      return false;
    } else {
      notification.success({
        message: '删除成功',
      });
      this.fetchTable();
    }
    return true;
  };

  public onCreateBook = event => {
    const { createFormData } = event;
    const params = { resourceType: 'BOOK', ...createFormData };
    return addNonGroupResource(params).then(rp => {
      if (rp.error) return false;
      this.fetchTable();
      return true;
    });
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

  public render() {
    const { books, loading } = this.state;
    return (
      <PageHeaderWrapper>
        <SourceTable
          loading={loading}
          searchable={false}
          removeable={true}
          saveDisabled={true}
          rowKey={'id'}
          dataSource={books}
          tableColumnDefs={PAGE_TABLE_COL_DEFS}
          onCreate={this.onCreateBook}
          onSave={this.onSave}
          createFormControls={CREATE_FORM_CONTROLS}
          createText="新建交易簿"
          tableProps={{
            autoSizeColumnsToFit: true,
            onCellValueChanged: this.handleCellValueChanged,
          }}
          onRemove={this.onRemove}
        />
      </PageHeaderWrapper>
    );
  }
}

export default SystemSettingsTradeBooks;
