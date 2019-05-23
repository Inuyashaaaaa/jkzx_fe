import { Col, Row } from 'antd';
import _ from 'lodash';
import memo from 'memoize-one';
import React, { PureComponent } from 'react';
import Loading from '../Loading';
import SourceList from '../SourceList';
import { CascaderSourceListBaseProps } from './types';

class CascaderSourceListBase extends PureComponent<CascaderSourceListBaseProps> {
  public static defaultProps = {
    list: [],
    options: [],
    width: 350,
    loading: false,
    value: [],
  };

  // 下标从 0 开始，表示从 1 开始的不同层级的所有 node
  public getListDataSource = memo((index, value, nodes) => {
    if (index === 0) return nodes[0];

    const preListIndex = index - 1;

    const preRowKey = 'value';

    if (value[preListIndex] && value[preListIndex].length === 0) {
      return [];
    }

    return _.flatten(
      nodes[index - 1]
        .filter(item =>
          value[preListIndex] ? value[preListIndex].indexOf(item[preRowKey]) !== -1 : false
        )
        .map(parent => parent.children)
    );
  });

  public countNodes = memo((list, options) => {
    const nodes = [];
    // list 长度和 option 深度得手动保证一致，暂不做验证，提高效率
    const deep = list.length;

    _.range(deep).forEach(curDeep => {
      if (curDeep === 0) {
        nodes[curDeep] = options;
        return;
      }
      nodes[curDeep] = _.flatten(nodes[curDeep - 1].map(item => item.children));
    });

    return nodes;
  });

  public getNextSelectedRowKeys = (value, index, selectedRowKeys) => {
    value = value.slice(0, index + 1);
    value[index] = selectedRowKeys;
    return value;
  };

  public getCreateable = index => {
    if ('createable' in this.props) {
      return this.props.createable;
    }

    if (index === 0) return true;

    const preIndex = index - 1;

    const preListSelectedRowKeys = this.props.value[preIndex];
    return !!(preListSelectedRowKeys && preListSelectedRowKeys.length);
  };

  public defaultRenderItem = params => {
    return params.rowData.label;
  };

  public bindSelectRow = index => params => {
    if (!this.props.onChange) return;
    return this.props.onChange(
      this.getNextSelectedRowKeys(this.props.value, index, params.selectedRowKeys)
    );
  };

  public bindRemove = index => async params => {
    if (!this.props.onRemove) return;
    return this.props.onRemove({
      ...params,
      index,
    });
  };

  public bindCreate = index => async params => {
    if (!this.props.onCreate) return;
    return this.props.onCreate({
      ...params,
      index,
    });
  };

  public render() {
    const { list, width, options, loading, removeable, value } = this.props;

    const nodes = this.countNodes(list, options);

    return (
      <Loading loading={loading}>
        <Row type="flex" justify="start" gutter={24}>
          {list.map((listItem, index) => {
            const { style, ...rest } = listItem;
            const dataSource = this.getListDataSource(index, value, nodes);
            return (
              <Col key={index}>
                <SourceList
                  removeable={removeable}
                  createable={this.getCreateable(index)}
                  renderItem={this.defaultRenderItem}
                  {...rest}
                  rowKey="value"
                  style={{ width, ...style }}
                  dataSource={dataSource}
                  selectedRowKeys={value[index]}
                  onCreate={this.bindCreate(index)}
                  onRemove={this.bindRemove(index)}
                  onSelectRow={this.bindSelectRow(index)}
                />
              </Col>
            );
          })}
        </Row>
      </Loading>
    );
  }
}

export default CascaderSourceListBase;
