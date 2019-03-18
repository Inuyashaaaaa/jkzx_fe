import React from 'react';
import { PureStateComponent } from '@/lib/components/_Components';
import { Row, Col, Icon, Button } from 'antd';
import StandardTable from '@/lib/components/_StandardTable';
import StandardForm from '@/lib/components/_StandardForm';
import { SearchTableBase as types } from '@/lib/components/_SearchTable/type';
import styles from './index.less';

class SearchTableBase extends PureStateComponent {
  static propTypes = types;

  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
    };
  }

  componentDidMount() {
    this.props.node?.(this);
  }

  handleStandardTableEdit = event => {
    const { onEdit } = this.props;
    onEdit?.(event);
  };

  handleStandardTableChange = (pagination, filterArg, sorter) => {
    const { onTableChange } = this.props;
    onTableChange?.(pagination, filterArg, sorter);
  };

  handleFormReset = () => {
    const { onFormReset } = this.props;
    onFormReset?.();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleGetFormNode = node => {
    this.$form = node;
  };

  handleSearch = e => {
    e.preventDefault();

    this.$form?.validateForm(({ error, values }) => {
      if (error) return;
      const { onSearch } = this.props;
      onSearch?.(values);
    });
  };

  handleCreate = event => {
    const { onCreate } = this.props;
    onCreate?.(event);
  };

  handleBatchRemove = event => {
    const { onRemove } = this.props;
    onRemove?.(event);
  };

  handleExtraBtnClick = event => {
    const { createBtn, removeBtn, onBtnClick } = this.props;

    if (createBtn && event.name === createBtn.name) {
      return this.handleCreate(event);
    }

    if (removeBtn && event.name === removeBtn.name) {
      return this.handleBatchRemove(event);
    }

    onBtnClick?.(event);
  };

  getExtra = () => {
    const { advancedFormItems } = this.props;
    const { expandForm } = this.state;

    const extra = (
      <Row type="flex" align="middle" justify="end" gutter={8}>
        <Col>
          <Button onClick={this.handleSearch} type="primary" htmlType="submit">
            查询
          </Button>
        </Col>
        <Col>
          <Button onClick={this.handleFormReset}>重置</Button>
        </Col>
        {advancedFormItems && (
          <Col>
            <a onClick={this.toggleForm}>
              {expandForm ? '收起' : '展开'} <Icon type={expandForm ? 'up' : 'down'} />
            </a>
          </Col>
        )}
      </Row>
    );
    return extra;
  };

  handleFormChange = field => {
    const { onFormChange } = this.props;
    onFormChange?.(field);
  };

  handleGetTableNode = node => {
    const { getTableNode } = this.props;
    getTableNode?.(node);
  };

  render() {
    const {
      columns,
      removeBtn,
      section,
      createBtn,
      selectedRowKeys,
      selectedColumnKeys,
      pagination,
      dataSource,
      formData,
      loading,
      getFormNode,
      formItems,
      advancedFormItems,
      chunkSize,
      labelCol,
      wrapperCol,
      ...tableProps
    } = this.props;

    const { expandForm } = this.state;

    let afterBtnItems = [];
    if (createBtn) {
      afterBtnItems.push({
        type: 'primary',
        ...createBtn,
      });
    }
    if (removeBtn) {
      afterBtnItems.push({
        type: 'danger',
        ...removeBtn,
      });
    }
    if (section) {
      // eslint-disable-next-line no-console
      console.assert(
        !createBtn && !removeBtn,
        'SearchTableBase: 定义 btnItems 是与 createBtn 或 removeBtn 互斥的，同时定义2者，只保留 btnItems'
      );
      afterBtnItems = section;
    }

    return (
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>
          <StandardForm
            getNode={this.handleGetFormNode}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            chunkSize={chunkSize}
            items={expandForm ? advancedFormItems : formItems}
            dataSource={formData}
            onChange={this.handleFormChange}
            footer={false}
          />
        </div>
        <StandardTable
          {...tableProps}
          dataSource={dataSource}
          extra={this.getExtra()}
          section={afterBtnItems}
          onBtnClick={this.handleExtraBtnClick}
          selectedRowKeys={selectedRowKeys}
          selectedColumnKeys={selectedColumnKeys}
          loading={loading}
          pagination={pagination}
          columns={columns}
          onSelect={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
          onEdit={this.handleStandardTableEdit}
          getTableNode={this.handleGetTableNode}
        />
      </div>
    );
  }
}

export default SearchTableBase;
