import React from 'react';
import { Row, Button, List, Icon } from 'antd';
import classNames from 'classnames';
import { PureStateComponent } from '@/components/Components';
import TableHeader from '@/components/_ListPlus/TableHeader';
import styles from './index.less';
import { toggleItem, notType } from '@/utils';
import { ListPlus as types } from '@/components/_ListPlus/types';

class ListPlus extends PureStateComponent {
  static propTypes = types;

  static defaultProps = {
    rowKey: 'id',
    width: 250,
    dataSource: [],
    title: '',
    selectedKeys: [],
    loading: false,
    signle: false,
  };

  handleRowRemove = item => {
    const { onRemove, selectedKeys, rowKey } = this.props;
    let result = onRemove?.(item);
    if (notType(result, 'Promise')) {
      result = Promise.resolve(result);
    }
    if (selectedKeys.includes(item[rowKey])) {
      result.then(success => {
        success && this.handleRowSelect(item);
      });
    }
  };

  handleRowSelect = item => {
    const { onSelect, selectedKeys, dataSource, signle, rowKey } = this.props;
    const selectedRows = signle
      ? [item]
      : toggleItem(
          dataSource.filter(it => selectedKeys.includes(it[rowKey])),
          item,
          it => it[rowKey] === item[rowKey]
        );
    const nextSelectedKeys = selectedRows.map(record => record[rowKey]);
    onSelect?.({
      selectedKeys: nextSelectedKeys,
      selectedRows,
    });
  };

  handleSelectAll = () => {
    const { onSelect, dataSource, selectedKeys, rowKey } = this.props;
    const selectedRows =
      selectedKeys.length === dataSource.length
        ? selectedKeys.length === 0
          ? dataSource
          : []
        : dataSource;
    const nextSelectedKeys = selectedRows.map(record => record[rowKey]);
    onSelect?.({
      selectedKeys: nextSelectedKeys,
      selectedRows,
    });
  };

  handleCreate = () => {
    const { onCreate } = this.props;
    onCreate?.();
  };

  render() {
    const {
      className,
      style,
      width,
      pagination,
      selectedKeys,
      formItems,
      dataSource,
      title,
      loading,
      createLoading,
      onCreateDone,
      getFormNode,
      formData,
      visible,
      onCancel,
      onPopover,
      onChange,
      rowKey,
      signle,
    } = this.props;

    return (
      <List
        className={className}
        style={{
          ...style,
          width,
        }}
        bordered
        dataSource={dataSource}
        pagination={pagination}
        loading={{ indicator: <Icon type="loading" spin />, spinning: loading }}
        header={
          <TableHeader
            visible={visible}
            formData={formData}
            loading={createLoading}
            getFormNode={getFormNode}
            title={title}
            formItems={formItems}
            disableSelectAll={selectedKeys.length === dataSource.length}
            disableCreate={loading}
            onCreate={this.handleCreate}
            onCreateDone={onCreateDone}
            onSelect={this.handleSelectAll}
            onCancel={onCancel}
            onPopover={onPopover}
            onChange={onChange}
            hideSelector={signle}
          />
        }
        renderItem={item => {
          return (
            <List.Item
              key={item[rowKey]}
              className={classNames(styles.cell, {
                [styles.selected]: selectedKeys.includes(item[rowKey]),
              })}
              onClick={() => this.handleRowSelect(item)}
            >
              <Row style={{ width: '100%' }} type="flex" justify="space-between" align="middle">
                <span>{item.title}</span>
                <Button
                  loading={item.loading}
                  icon="minus"
                  size="small"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleRowRemove(item);
                  }}
                />
              </Row>
            </List.Item>
          );
        }}
      />
    );
  }
}

export default ListPlus;
