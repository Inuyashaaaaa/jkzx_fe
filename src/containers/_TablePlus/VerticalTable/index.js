import React, { PureComponent } from 'react';
import lodash from 'lodash';
import classNames from 'classnames';

const defaultComponents = {
  table: 'table',
  header: {
    wrapper: 'thead',
    row: 'tr',
    cell: 'th',
  },
  body: {
    wrapper: 'tbody',
    row: 'tr',
    cell: 'td',
  },
};

class VerticalTable extends PureComponent {
  static defaultProps = {
    components: {},
    dataSource: [],
    columns: [],
  };

  componentDidMount() {}

  getComponents = () => {
    const { components } = this.props;
    return lodash.merge({}, defaultComponents, components);
  };

  render() {
    const {
      columns,
      className,
      dataSource,
      rowKey,
      size,
      bordered,
      onRow,
      rowClassName,
    } = this.props;

    const components = this.getComponents();

    const {
      table: Table,
      header: { wrapper: HeaderWrapper, row: HeaderRow, cell: HeaderCell },
      body: { wrapper: BodyWrapper, row: BodyRow, cell: BodyCell },
    } = components;

    return (
      <div className={classNames(`ant-table-wrapper`, className)}>
        <div
          className={classNames(`ant-table`, `vertical`, {
            'ant-table-middle': size === 'middle',
            'ant-table-small': size === 'small',
            'ant-table-large': size === 'large',
            bordered,
          })}
        >
          <div className="ant-table-content">
            <div className="ant-table-body">
              <Table>
                <HeaderWrapper className="ant-table-thead">
                  <HeaderRow>
                    {columns.map(col => {
                      const { dataIndex, title } = col;
                      return <HeaderCell key={dataIndex}>{title}</HeaderCell>;
                    })}
                  </HeaderRow>
                </HeaderWrapper>
                <BodyWrapper className="ant-table-tbody">
                  {dataSource.map((record, recordIndex) => {
                    const bodyRowProps = onRow?.(record, recordIndex);

                    return (
                      <BodyRow
                        key={record[rowKey]}
                        {...bodyRowProps}
                        vertical
                        className={classNames(
                          bodyRowProps?.className,
                          rowClassName?.(record, recordIndex)
                        )}
                      >
                        {columns.map((col, index) => {
                          const { onCell, dataIndex, render } = col;

                          const text = record[dataIndex];
                          const childrenElement = render?.(text, record, index) || text;
                          const bodyCellProps = onCell?.(record);

                          return (
                            <BodyCell
                              key={dataIndex}
                              {...bodyCellProps}
                              vertical
                              className={bodyCellProps?.className}
                            >
                              {childrenElement}
                            </BodyCell>
                          );
                        })}
                      </BodyRow>
                    );
                  })}
                </BodyWrapper>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VerticalTable;
