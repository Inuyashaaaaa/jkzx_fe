import React from 'react';
import { Row, Button, List, Icon } from 'antd';
import classNames from 'classnames';
import { PureStateComponent } from '@/lib/components/_Components';
import TableHeader from '@/lib/components/_ListTable/TableHeader';
import styles from './index.less';
import { toggleItem, notType } from '@/lib/utils';
import { ListTableBase as types } from '@/lib/components/_ListTable/types';

class ListTableBase extends PureStateComponent {
  static propTypes = types;

  static defaultProps = {
    width: 250,
    dataSource: [],
    title: '',
    selectedIds: [],
    loading: false,
  };

  handleCellRemove = item => {
    const { onRemove, selectedIds } = this.props;
    let result = onRemove?.(item);
    if (notType(result, 'Promise')) {
      result = Promise.resolve(result);
    }
    if (selectedIds.includes(item.id)) {
      result.then(success => {
        success && this.handleCellSelect(item);
      });
    }
  };

  handleCellSelect = item => {
    const { onSelect, selectedIds, dataSource } = this.props;
    onSelect?.(
      toggleItem(
        dataSource.filter(it => selectedIds.includes(it.id)),
        item,
        it => it.id === item.id
      )
    );
  };

  handleSelect = () => {
    const { onSelect, dataSource, selectedIds } = this.props;
    onSelect?.(
      selectedIds.length === dataSource.length
        ? selectedIds.length === 0
          ? dataSource
          : []
        : dataSource
    );
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
      selectedIds,
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
            disableSelectAll={selectedIds.length === dataSource.length}
            disableCreate={loading}
            onCreate={this.handleCreate}
            onCreateDone={onCreateDone}
            onSelect={this.handleSelect}
            onCancel={onCancel}
            onPopover={onPopover}
            onChange={onChange}
          />
        }
        renderItem={item => {
          return (
            <List.Item
              key={item.id}
              className={classNames(styles.cell, {
                [styles.selected]: selectedIds.includes(item.id),
              })}
              onClick={() => this.handleCellSelect(item)}
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
                    this.handleCellRemove(item);
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

export default ListTableBase;
