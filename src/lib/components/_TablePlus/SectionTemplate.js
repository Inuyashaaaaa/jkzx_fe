import React, { PureComponent } from 'react';
import { SectionTemplate as types } from '@/lib/components/_TablePlus/types';
import { isType, wrapType } from '@/lib/utils';
import ButtonGroup from '@/lib/components/_ButtonGroup';
import { Row } from 'antd';
import classNames from 'classnames';
import memoizeOne from 'memoize-one';

class SectionTemplate extends PureComponent {
  static propTypes = types;

  static defaultProps = {
    selectedRowKeys: [],
    selectedColumnKeys: [],
  };

  countButtonDisabledStatus = memoizeOne(
    (type, signle = false, selectedColumnKeys, selectedRowKeys) => {
      return type === 'column'
        ? signle
          ? selectedColumnKeys.length !== 1
          : selectedColumnKeys.length === 0
        : signle
        ? selectedRowKeys.length !== 1
        : selectedRowKeys.length === 0;
    }
  );

  getBatch = batch => {
    if (batch === true) {
      batch = {
        type: 'some',
        direction: [
          {
            type: 'column',
            signle: false,
          },
          {
            type: 'row',
            signle: false,
          },
        ],
      };
    }
    return batch;
  };

  getElement = section => {
    const { selectedRowKeys, selectedColumnKeys, columns } = this.props;

    if (!section) return <div />;

    const { content } = section;

    if (React.isValidElement(content)) {
      return React.Children.only(content);
    }

    if (isType(content, 'Object')) {
      const { items, ...rest } = content;
      return (
        <ButtonGroup
          {...rest}
          items={items
            .map(item => {
              const { batch, ...restItem } = item;

              if (!batch) return restItem;

              const { type, direction } = this.getBatch(batch);

              return {
                ...restItem,
                disabled: !wrapType(direction, Array, [direction])
                  .map(
                    batchItem =>
                      !this.countButtonDisabledStatus(
                        batchItem.type,
                        batchItem.signle,
                        selectedColumnKeys,
                        selectedRowKeys
                      )
                  )
                  [type](available => available),
              };
            })
            .map(item => {
              const { save, ...restItem } = item;
              if (!save) return restItem;

              return {
                ...restItem,
                // 找到 columns 中存在的 editing 状态
                // col.editing: bool | object
                disabled: !columns.find(col => {
                  return isType(col.editing, Object)
                    ? Object.keys(col.editing).find(id => col.editing[id])
                    : col.editing;
                }),
              };
            })}
        />
      );
    }
  };

  render() {
    const { children, sections, pagination } = this.props;
    if (!sections) return children;

    const topLeftSection = sections.find(item => item.placement === 'topLeft');
    const topRightSection = sections.find(item => item.placement === 'topRight');
    const bottomLeftSection = sections.find(item => item.placement === 'bottomLeft');
    const bottomRightSection = sections.find(item => item.placement === 'bottomRight');

    return (
      <>
        {(topLeftSection || topRightSection) && (
          <Row className="tongyu-table-plus-top-action" type="flex" justify="space-between">
            {this.getElement(topLeftSection)}
            {this.getElement(topRightSection)}
          </Row>
        )}
        {children}
        {(bottomLeftSection || bottomRightSection) && (
          <Row
            className={classNames('tongyu-table-plus-bottom-action', {
              rise: pagination !== false,
            })}
            type="flex"
            justify="space-between"
          >
            {this.getElement(bottomLeftSection)}
            {this.getElement(bottomRightSection)}
          </Row>
        )}
      </>
    );
  }
}

export default SectionTemplate;
