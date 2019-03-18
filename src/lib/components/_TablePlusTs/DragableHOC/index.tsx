import { TableComponents } from 'antd/lib/table';
import _ from 'lodash';
import memo from 'memoize-one';
import React, { PureComponent } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
// import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { AntdTableProps, DragableProps, InjectDragbleBaseRowProps, IOnRow } from '../types';
import DrableRowHOC from './DrableRowHOC';

const getRow = (old: React.ReactType) => {
  return DrableRowHOC(old);
};

const getComponents = memo((oldComponents: TableComponents) => {
  const { body = {} } = oldComponents;
  const { row = 'tr' } = body;
  return {
    ...oldComponents,
    body: {
      ...body,
      row: getRow(row),
      cell: 'div',
      wrapper: 'div',
    },
    table: 'div',
  };
});

export const EditableContext = React.createContext({});

const DragableHOC = (options = {}) => (Table: React.ComponentClass<AntdTableProps>) =>
  class DragableTable extends PureComponent<DragableProps> {
    public static defaultProps = {
      onRow: () => {},
      onMove: () => {},
      components: {},
      dragable: true,
      rowKey: 'key',
    };

    public onMove = (dragIndex, hoverIndex, dragId, hoverId) => {
      const { dataSource, onMove } = this.props;
      onMove(dragIndex, hoverIndex, dragId, hoverId, dataSource[dragIndex]);
    };

    public getOnRow = (oldOnRow: IOnRow<{}>, vertical, rowKey, dragable, onMove, components) => {
      const { body = {} } = components;

      return (record, index): InjectDragbleBaseRowProps => {
        return {
          ...oldOnRow(record, index),
          index,
          vertical,
          onMove: this.onMove,
          // DND dont supoort dynamic wrap
          dragable,
          rowId: record[rowKey],
        };
      };
    };

    public onDragEnd(result) {
      // dropped outside the list
      if (!result.destination) {
        return;
      }

      // const items = reorder(
      //   this.state.items,
      //   result.source.index,
      //   result.destination.index
      // );

      // this.setState({
      //   items,
      // });
    }

    public render() {
      const { components, onRow, onMove, dragable, vertical, ...restProps } = this.props;
      const { rowKey } = restProps;

      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef}>
                <Table
                  {...restProps}
                  onRow={this.getOnRow(onRow, vertical, rowKey, dragable, onMove, components)}
                  components={getComponents(components)}
                />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      );
    }
  };

export default DragableHOC;
