import { Omit } from '@/lib/viewModel';
import { Col, Row } from 'antd';
import { CascaderOptionType } from 'antd/lib/cascader';
import produce from 'immer';
import _ from 'lodash';
import memo from 'memoize-one';
import React, { PureComponent } from 'react';
import { IFormControl } from '../_Form2';
import Loading from '../_Loading2';
import SourceList, { SourceListProps } from '../_SourceList';

export interface CascaderSourceListItemProps
  extends Omit<
    SourceListProps,
    'dataSource' | 'createFormControls' | 'rowKey' | 'onCreate' | 'onSelectRow'
  > {
  createFormControls?: IFormControl[] | ((value: object) => IFormControl[]);
  onCreate?: (modalFormData?: object, values?: string[][]) => boolean | Promise<boolean | object>;
  onSelectRow?: (selectedRowKeys: string[], index: number) => void;
}

export interface CascaderSourceListProps {
  options?: CascaderOptionType[];
  list?: CascaderSourceListItemProps[];
  value?: string[][];
  width?: number | string;
  loading?: boolean;
  onChange?: (value: string[][]) => void;
  createable?: boolean;
  removeable?: boolean;
  onSearch?: (value: any, index: number, dataSourceItem: any) => void;
  sort?: boolean;
}

class CascaderSourceList extends PureComponent<CascaderSourceListProps> {
  public static defaultProps = {
    list: [],
    options: [],
    width: 350,
    loading: false,
  };

  public state = {
    value: [],
    searchedDataSources: [],
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

  public countNodes = memo((list, options, sort) => {
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

  public bindSelectRow = (index, onSelectRow) => selectedRowKeys => {
    if (onSelectRow) {
      onSelectRow(selectedRowKeys, index);
    }

    this.onChange(this.getNextSelectedRowKeys(this.getValue(), index, selectedRowKeys));

    this.setState(
      produce((state: any) => {
        _.range(index + 1, this.props.list.length).forEach(index => {
          if (!_.isEmpty(state.searchedDataSources[index])) {
            state.searchedDataSources[index] = undefined;
          }
        });
      })
    );
  };

  public onChange = nextValue => {
    if ('onChange' in this.props) {
      this.props.onChange(nextValue);
    }

    this.setState({
      value: nextValue,
    });
  };

  public getNextSelectedRowKeys = (value, index, selectedRowKeys) => {
    value = value.slice(0, index + 1);
    value[index] = selectedRowKeys;
    return value;
  };

  public getCreateFormControls = createFormControls => {
    return typeof createFormControls === 'function'
      ? createFormControls(this.getValue())
      : createFormControls;
  };

  public getCreateable = index => {
    if ('createable' in this.props) {
      return this.props.createable;
    }

    if (index === 0) return true;

    const preIndex = index - 1;

    const preListSelectedRowKeys = this.getValue()[preIndex];
    return !!(preListSelectedRowKeys && preListSelectedRowKeys.length);
  };

  public defaultRenderItem = data => {
    return data.label;
  };

  public bindCreate = onCreate => curFormData => {
    if (onCreate) {
      return onCreate(curFormData, this.getValue());
    }
    return undefined;
  };

  public getValue = () => {
    if ('value' in this.props) {
      return this.props.value || [];
    }
    return this.state.value;
  };

  public bindSearch = (index, dataSourceItem) => value => {
    if (this.props.onSearch) {
      const dataSource = this.props.onSearch(value, index, dataSourceItem);
      if (Array.isArray(dataSource)) {
        return this.setState(
          produce(
            (state: any) => {
              state.searchedDataSources[index] = dataSource;
            },
            () => {
              this.onChange(this.getNextSelectedRowKeys(this.getValue(), index, []));
            }
          )
        );
      }
    }

    const reg = new RegExp(value);
    const dataSource = dataSourceItem.filter(item => reg.test(item.label));
    return this.setState(
      produce(
        (state: any) => {
          state.searchedDataSources[index] = dataSource;
        },
        () => {
          this.onChange(this.getNextSelectedRowKeys(this.getValue(), index, []));
        }
      )
    );
  };

  public render() {
    const { list, width, options, loading, removeable, sort } = this.props;
    const nodes = this.countNodes(list, options, sort);

    return (
      <Loading loading={loading}>
        <Row type="flex" justify="start" gutter={24}>
          {list.map((listItem, index) => {
            const {
              style,
              onCreate,
              onSearch,
              onSelectRow,
              createFormControls,
              ...rest
            } = listItem;
            const dataSource = this.getListDataSource(index, this.getValue(), nodes);
            if (sort && listItem.title !== 'Position') {
              dataSource.sort((a, b) => {
                return b.label.toString().localeCompare(a.label.toString());
              });
            }
            if (sort && listItem.title === 'Position') {
              dataSource.sort((a, b) => {
                return b.data.expiry.toString().localeCompare(a.data.expiry.toString());
              });
            }
            return (
              <Col key={index}>
                <SourceList
                  onSearch={this.bindSearch(index, dataSource)}
                  removeable={removeable}
                  createable={this.getCreateable(index)}
                  renderItem={this.defaultRenderItem}
                  {...rest}
                  rowKey="value"
                  style={{ width, ...style }}
                  dataSource={this.state.searchedDataSources[index] || dataSource}
                  onSelectRow={this.bindSelectRow(index, onSelectRow)}
                  selectedRowKeys={this.getValue()[index]}
                  createFormControls={this.getCreateFormControls(createFormControls)}
                  onCreate={this.bindCreate(onCreate)}
                />
              </Col>
            );
          })}
        </Row>
      </Loading>
    );
  }
}

export default CascaderSourceList;
