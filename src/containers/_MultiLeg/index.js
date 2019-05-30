/* eslint-disable no-lonely-if */
import EditVerticalTable from '@/containers/EditVerticalTable';
import styles from '@/containers/_MultiLeg/index.less';
import { MultiLeg as types } from '@/containers/_MultiLeg/types';
import StandardForm from '@/containers/_StandardForm';
import { allLeg } from '@/constants/leg';
import { assert, getArray, mapDeep } from '@/tools';
import { Menu } from 'antd';
import lodash from 'lodash';
import React, { Fragment, PureComponent } from 'react';
import { createDataSourceItem } from './utils';

class MultiLeg extends PureComponent {
  static propTypes = types;

  static defaultProps = {
    add: true,
    dataSource: [],
    formItems: [],
    formData: {},
    onFormChange: () => {},
    onLegChange: () => {},
  };

  shouldUpdateCountColumns = true;

  componentWillUpdate = nextProps => {
    const { dataSource } = this.props;
    const dataSourceLenChanged = nextProps.dataSource.length !== dataSource.length;

    dataSource.forEach((dataSourceItem, index) => {
      const nextDataSourceItem = nextProps.dataSource[index];
      const shouldCheckTypes =
        nextDataSourceItem && // 删除时，可能为空
        !!lodash.difference(nextDataSourceItem.$types, dataSourceItem.$types).length;

      if (shouldCheckTypes) {
        this.checkTypes(nextDataSourceItem);
      }
    });

    // leg 类型替换也需要引起 columns 的重新 render
    const dataSourceTypeReplace =
      !dataSourceLenChanged &&
      dataSource.length &&
      !!nextProps.dataSource.find((item, index) => item.$type !== dataSource[index].$type);

    this.shouldUpdateCountColumns = dataSourceLenChanged || dataSourceTypeReplace;
  };

  componentDidMount = () => {
    const { dataSource, getNode } = this.props;
    getNode?.(this);
    dataSource.forEach(dataSourceItem => {
      this.checkTypes(dataSourceItem);
    });
  };

  checkTypes = dataSourceItem => {
    const curLegs = dataSourceItem.$types.map($type =>
      this.getAllLeg().find(item => item.type === $type)
    );

    let repeatColumns = false;
    // 数组中每一项目都和其他项目进行一次比对
    curLegs.reduce((lefts, next) => {
      if (repeatColumns) return;
      repeatColumns = !!lefts.find(leftItem => {
        return !!lodash.intersectionBy(leftItem.columns, next.columns, 'dataIndex').length;
      });
      return lefts.concat(next);
    }, []);
    if (repeatColumns) {
      throw new Error('一条腿拥有的类型之间不可以重复出现同名 dataIndex');
    }
  };

  // 清理本组件对数据的注入信息
  cleanDataSourceItem = targetDataSourceItem => {
    const { extraLeg } = this.props;
    if (extraLeg) {
      // eslint-disable-next-line no-param-reassign
      targetDataSourceItem.$types = lodash.difference(
        targetDataSourceItem.$types,
        getArray(extraLeg).map(leg => leg.type)
      );
    }
  };

  validateForm = cb => {
    this.StandardForm?.validateForm(({ error, values }) => {
      return cb({ error, values });
    });
  };

  merge = (oldItem, newItem) => {
    /* eslint-disable no-param-reassign */
    oldItem.$types = lodash.union(oldItem.$types.concat(newItem.$types));
    if (newItem.options) {
      newItem.$types.forEach($type => {
        oldItem.$option[$type] = newItem.options;
      });
    }
    if (newItem.countValue) {
      newItem.$types.forEach($type => {
        oldItem.$countValue[$type] = newItem.countValue;
      });
    }
    /* eslint-disable */
  };

  injectColumn = (item, legType) => {
    item.$types = [legType]; // column 可以被多个类型所包含
    item.$option = { [legType]: item.options };
    item.$countValue = { [legType]: item.countValue };
    return item;
  };

  injectDataSource = dataSource => {
    const { extraLeg } = this.props;
    if (extraLeg) {
      const extraLegTypes = getArray(extraLeg).map(leg => leg.type);
      return dataSource.map(item => {
        return {
          ...item,
          $types: item.$types.concat(extraLegTypes),
        };
      });
    }
    return dataSource;
  };

  selectCountColumns = injectedDataSource => {
    const { dataSource, extraLeg } = this.props;

    if (!this.shouldUpdateCountColumns) {
      return this.countColumns;
    }

    this.countColumns = [];
    injectedDataSource.forEach(dataItem => {
      assert(dataItem.$types, 'dataSource[] 内的元素必须存在 $types 字段，描述所属 leg 类型.');

      const findLegs = this.getAllLeg().filter(leg => dataItem.$types.includes(leg.type));

      findLegs.forEach(findLeg => {
        const { type: legType } = findLeg;

        const injectColumns = findLeg.columns.map(item => {
          return this.injectColumn(
            {
              ...item,
              children: item.children?.map(it => {
                return this.injectColumn({ ...it }, legType);
              }),
            },
            legType
          );
        });

        injectColumns.forEach(columnItem => {
          // 1. 2个都是集合
          // 2. 2个都是元素
          // 3. old 是集合，new 是元素
          // 4. old 是元素，new 是集合 --- 报错
          // 5. 没找到 -- 直接 push
          const oldColumns = this.countColumns.filter(item => {
            return (
              (item.children && item.children.some(it => it.name === columnItem.name)) ||
              (columnItem.children && columnItem.children.some(it => it.name === item.name)) ||
              item.name === columnItem.name
            );
          });

          if (oldColumns.length) {
            oldColumns.forEach(oldColumn => {
              // old 是集合
              // 指定 column 被多少 type 的 leg 所共有
              // children 下所有的子节点同样挂载 type 信息
              if (oldColumn.children) {
                // 集合内部一定是元素，只支持一级嵌套
                // new 是集合 || new 是元素
                if (!columnItem.children && oldColumn.name === columnItem.name) {
                  throw new Error('集合和元素不可以同名');
                }

                // new 是集合
                if (columnItem.children) {
                  columnItem.children.forEach(columItemChild => {
                    const oldChildColumn = oldColumn.children.find(item => {
                      return item.name === columItemChild.name;
                    });
                    if (oldChildColumn) {
                      this.merge(oldChildColumn, columItemChild);
                    } else {
                      oldColumn.children.push(columItemChild);
                    }
                  });
                } else {
                  // new 是元素
                  const findOldColumItemChild = oldColumn.children.find(
                    columItemChild => columItemChild.name === columnItem.name
                  );

                  this.merge(findOldColumItemChild, columnItem);
                }
              } else {
                // old 是元素
                // new 是集合
                if (columnItem.children) {
                  if (oldColumn.name === columnItem.name) {
                    throw new Error('集合和元素不可以同名');
                  }

                  const findColumItemChild = columnItem.children.find(
                    columItemChild => columItemChild.name === oldColumn.name
                  );

                  this.merge(findColumItemChild, oldColumn);

                  // countColumns 里面可能存在多个和 columnItem.children 重合的元素
                  // 对应这个判断  (columnItem.children && columnItem.children.some(it => it.name === item.name))
                  // 先把它的数据 merge 到 findColumItemChild 上面，然后从 countColumns 中删除
                  // 如果还有其他重复到数据，交给下一次逻辑循环
                  // 如果只有一个重复，那么情况就是 old 是元素，且唯一，而 new 是集合，直接 merge 之后，替换它
                  const totalOldColumns = this.countColumns.filter(item =>
                    columnItem.children.some(it => it.name === item.name)
                  );
                  // 删除老的 元素，把替换成集合
                  const index = this.countColumns.indexOf(oldColumn);
                  if (totalOldColumns.length > 1) {
                    this.countColumns.splice(index, 1);
                  } else {
                    this.countColumns.splice(index, 1, columnItem);
                  }
                } else {
                  // new 是元素
                  this.merge(oldColumn, columnItem);
                }
              }
            });
          } else {
            // 没找到
            this.countColumns.push(columnItem);
          }
        });
      });
    });
    this.countColumns = lodash.unionBy(this.countColumns, item => item.name);

    return this.countColumns;
  };

  getAllLeg = () => {
    return this.props.legs || allLeg;
  };

  handleReplaceRow = ({ dataSourceItem, index, type }) => {
    this.handleDataSourceItemChange({
      dataSourceItem,
      action: 'replace',
      options: { index, type },
    });
  };

  handleAddLeg = event => {
    this.handleDataSourceItemChange({
      action: 'add',
      options: { type: event.key },
    });
  };

  handleRepalceType = ({ type, dataSourceItem, index }) => {
    return this.handleDataSourceItemChange({
      action: 'replace',
      dataSourceItem: {
        ...dataSourceItem,
      },
      options: {
        type,
        index,
      },
    });
  };

  handleDataSourceItemChange = ({ dataSourceItem, action, options = {} }) => {
    const { index, direction, type: $type } = options;
    const { onLegChange, dataSource } = this.props;

    // when add is null
    dataSourceItem && this.cleanDataSourceItem(dataSourceItem);

    let nextDataSource;

    if (action === 'change') {
      nextDataSource = dataSource.map(item => {
        if (item.id === dataSourceItem.id) {
          return dataSourceItem;
        }
        return item;
      });
    } else if (action === 'add') {
      const newone = allLeg.find(item => item.type === $type);
      nextDataSource = dataSource.concat(
        createDataSourceItem({
          leg: newone,
          title: newone.name + Math.random(),
        })
      );
    } else if (action === 'copy') {
      nextDataSource = [...dataSource];
      nextDataSource.splice(
        index + 1,
        0,
        createDataSourceItem({
          data: dataSourceItem.data,
          leg: this.getAllLeg().find(item => item.type === dataSourceItem.$type),
          title: `${dataSourceItem.$title.replace(/\[副本.*\]/, '')}[副本${lodash.random(
            0,
            10000
          )}]`,
        })
      );
    } else if (action === 'remove') {
      nextDataSource = dataSource.filter(item => item.id !== dataSourceItem.id);
    } else if (action === 'replace') {
      const nextLeg = this.getAllLeg().find(item => item.type === $type);
      const allNextLegDataIndex = lodash.flattenDeep(
        mapDeep(nextLeg.columns, item => item.dataIndex, 'children')
      );
      nextDataSource = [...dataSource];
      nextDataSource.splice(
        index,
        1,
        createDataSourceItem({
          // 保留替换 leg 和当前 leg 类型之间公用的 dataIndex
          data: lodash.pick(dataSourceItem.data, allNextLegDataIndex),
          leg: nextLeg,
          title: nextLeg.name + lodash.random(0, 10000),
        })
      );
    } else if (action === 'move') {
      nextDataSource = [...dataSource];

      if (direction === 'left') {
        const isFirst = nextDataSource[0].id === dataSourceItem.id;
        if (isFirst) return;
        nextDataSource.splice(index, 1);
        nextDataSource.splice(index - 1, 0, dataSourceItem);
      }

      if (direction === 'right') {
        const isLast = nextDataSource[nextDataSource.length - 1].id === dataSourceItem.id;
        if (isLast) return;
        nextDataSource.splice(index, 1);
        nextDataSource.splice(index + 1, 0, dataSourceItem);
      }
    } else {
      throw new Error(`${action} is not defined.`);
    }

    onLegChange({ dataSource: nextDataSource, action, direction });
  };

  render() {
    const {
      formData,
      formItems,
      onFormChange,
      add,
      dataSource,
      rowMenu,
      extraRowMenuItems,
      node,
    } = this.props;

    // 通过 dataSource 和 this.getAllLeg() 计算得到的
    const injectedDataSource = this.injectDataSource(dataSource);
    const countColumns = this.selectCountColumns(injectedDataSource);

    return (
      <Fragment>
        {formData && (
          <StandardForm
            className={styles.standardForm}
            getNode={node => {
              this.StandardForm = node;
            }}
            dataSource={formData}
            items={formItems}
            onChange={onFormChange}
            footer={false}
          />
        )}
        <EditVerticalTable
          add={add}
          node={node}
          createrMenu={
            <Menu onClick={this.handleAddLeg}>
              {this.getAllLeg().map(leg => {
                return <Menu.Item key={leg.type}>{leg.name}</Menu.Item>;
              })}
            </Menu>
          }
          rowMenu={rowMenu}
          extraRowMenuItems={({ dataSourceItem, index }) => {
            return [
              <Menu.SubMenu
                key="replace"
                title="替换"
                onClick={event =>
                  this.handleRepalceType({ type: event.key, dataSourceItem, index })
                }
              >
                {this.getAllLeg()
                  .filter(leg => {
                    return leg.type !== dataSourceItem.$type;
                  })
                  .map(leg => {
                    return <Menu.Item key={leg.type}>{leg.name}</Menu.Item>;
                  })}
              </Menu.SubMenu>,
            ];
          }}
          columns={countColumns}
          dataSource={injectedDataSource}
          onEdit={this.handleDataSourceItemChange}
        />
      </Fragment>
    );
  }
}

export default MultiLeg;
export { createDataSourceItem };
