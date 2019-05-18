import React from 'react';
import { isType, notType } from '@/utils';
import lodash from 'lodash';
import Loading from '@/components/_Loading';
import { PureStateComponent } from '@/components/Components';
import BigCascaderBase from '@/components/BigCascader/base';
import { BigCascader as types } from '@/components/BigCascader/types';

class BigCascader extends PureStateComponent {
  static propTypes = types;

  static defaultProps = {
    material: [],
  };

  state = {
    value: {},
    material: [],
    loading: false,
  };

  $nodes = {};

  fetchCount = 0;

  componentDidMount = () => {
    this.fetch();
  };

  fetch = () => {
    // eslint-disable-next-line no-plusplus
    const fetchCount = ++this.fetchCount;
    const { material } = this.props;
    if (notType(material, 'Function')) {
      return this.fetchFirstListTable(material);
    }

    let result = material();

    if (notType(result, 'Promise')) {
      result = Promise.resolve(result);
    }

    this.setState(
      {
        loading: true,
      },
      () => {
        result
          .then(data => {
            if (fetchCount < this.fetchCount) return;

            this.setState(
              {
                material: data,
                loading: false,
              },
              () => {
                this.fetchFirstListTable(data);
              }
            );
          })
          .catch(err => {
            console.err(err);
            this.setState({ loading: false });
          });
      }
    );
  };

  fetchFirstListTable = material => {
    // fetch first ListTable
    const { value: next } = this.getProxyState();
    this.$nodes[(material[0]?.id)]?.fetch(next);
  };

  handleChange = (value, curListTable) => {
    const { onChange, value: propsValue } = this.props;
    const { material } = this.getProxyState();

    const index = material.findIndex(item => item.id === curListTable.id);
    const restListTableIds = material.slice(index + 1).map(item => item.id);

    if (propsValue === undefined) {
      this.setState(
        {
          // 清空剩余 List 的所选内容
          value: lodash.mapValues(value, (val, key) => {
            if (restListTableIds.includes(lodash.toNumber(key))) {
              return [];
            }
            return val;
          }),
        },
        () => {
          const { value: next } = this.getProxyState();
          // 拉取更新剩余 List
          restListTableIds.forEach(id => {
            return this.$nodes[id]?.fetch(next);
          });
        }
      );
    }

    return onChange?.(value);
  };

  /**
   * 将所有 ListTable 的 node 存储下来，以便调用其 fetch api
   *
   * @memberof BigCascader
   */
  handleGetNode = ({ node, item }) => {
    const { getNode } = this.props;
    this.$nodes[item.id] = node;

    return getNode?.({ node, item });
  };

  getProxyState = () => {
    const { props, state } = this;
    return {
      value: props.value || state.value,
      material: isType(props.material, 'Function') ? state.material : props.material,
    };
  };

  render() {
    const { material, value } = this.getProxyState();
    const { loading } = this.state;

    return loading ? (
      <Loading />
    ) : (
      <BigCascaderBase
        {...this.props}
        value={value}
        material={material.map(item => {
          return {
            ...item,
            autoFetch: false,
          };
        })}
        onChange={this.handleChange}
        getNode={this.handleGetNode}
      />
    );
  }
}

export default BigCascader;
