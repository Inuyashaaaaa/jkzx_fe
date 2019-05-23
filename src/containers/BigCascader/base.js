import React from 'react';
import { Row, Col } from 'antd';
import { notType } from '@/tools';
import { PureStateComponent } from '@/containers/Components';
import ListTable from '@/containers/_ListTable';
import { BigCascaderBase as types } from '@/containers/BigCascader/types';
import './index.less';

class BigCascaderBase extends PureStateComponent {
  static propTypes = types;

  static defaultProps = {
    material: [],
    value: {},
    prefixCls: 'tongyu-big-cascader',
  };

  handleRemove = (event, item) => {
    const { onRemove } = this.props;
    return onRemove?.({
      ...event,
      id: item.id,
    });
  };

  handleCreate = (event, item) => {
    const { onCreate, value } = this.props;
    let result = onCreate?.({
      ...event,
      id: item.id,
    });

    if (notType(result, 'Promise')) {
      result = Promise.resolve(result);
    }

    return result.then(success => {
      if (success) return value;
    });
  };

  handleSelect = (event, item) => {
    const { onChange, value } = this.props;
    return onChange?.(
      {
        ...value,
        [item.id]: event.map(it => it.id),
      },
      item
    );
  };

  handleGetNode = (node, item) => {
    const { getNode } = this.props;
    getNode?.({ node, item });
  };

  render() {
    const { material, commonFormItems, value, prefixCls } = this.props;

    return (
      <Row gutter={12} type="flex" justify="flex-start" align="top">
        {material.map(item => {
          return (
            <Col key={item.id}>
              <ListTable
                className={`${prefixCls}-table`}
                style={{ marginBottom: 5 }}
                formItems={commonFormItems}
                {...item}
                getNode={node => this.handleGetNode(node, item)}
                selectedIds={value[item.id]}
                onRemove={event => this.handleRemove(event, item)}
                onCreate={event => this.handleCreate(event, item)}
                onSelect={event => this.handleSelect(event, item)}
              />
            </Col>
          );
        })}
      </Row>
    );
  }
}

export default BigCascaderBase;
