import SwitchCell from './cells/SwitchCell';
import { EditableRow } from './rows/FormRow';

class TableManager {
  public rowNodes: Array<{
    node: EditableRow;
    id: string;
  }> = [];

  public cellNodes: {
    [rowId: string]: Array<{
      node: SwitchCell;
      id: string;
    }>;
  } = {};

  public registeRow(rowId: string, rowNode: EditableRow) {
    if (this.rowNodes.findIndex(item => item.id === rowId) === -1) {
      this.rowNodes.push({
        node: rowNode,
        id: rowId,
      });
    } else {
      this.rowNodes = [
        {
          node: rowNode,
          id: rowId,
        },
      ];
    }
  }

  public registeCell(rowId: string, colId: string, cellNode: SwitchCell) {
    if (
      this.cellNodes[rowId] &&
      this.cellNodes[rowId].findIndex(item => item.id === colId) === -1
    ) {
      this.cellNodes[rowId].push({
        node: cellNode,
        id: colId,
      });
    } else {
      this.cellNodes[rowId] = [
        {
          node: cellNode,
          id: colId,
        },
      ];
    }
  }

  public getNextCell(rowId: string, colId: string, isCur = false) {
    if (!this.cellNodes[rowId]) return null;
    const cellIndex = this.cellNodes[rowId].findIndex(item => item.id === colId);
    if (cellIndex !== -1) {
      const nextCell = this.cellNodes[rowId][isCur ? cellIndex : cellIndex + 1];
      if (nextCell) {
        return nextCell.node;
      }
      const rowIndex = this.rowNodes.findIndex(item => item.id === rowId);
      if (rowIndex === -1) {
        return null;
      }
      const nextRow = this.rowNodes[rowIndex + 1];
      if (nextRow) {
        const nextRowFirstCellNode = this.cellNodes[nextRow.id][0];
        if (nextRowFirstCellNode) {
          return this.getNextCell(nextRow.id, nextRowFirstCellNode.id, true);
        }
      }
    }
    return null;
  }
}

export default TableManager;
