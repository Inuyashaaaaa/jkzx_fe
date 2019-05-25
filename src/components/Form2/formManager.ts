import SwitchCell from './cells/SwitchCell';

class FormManager {
  public cellNodes: Array<{
    node: SwitchCell;
    id: string;
  }> = [];

  public registeCell(colId: string, cellNode: SwitchCell) {
    if (this.cellNodes) {
      if (this.cellNodes.findIndex(item => item.id === colId) === -1) {
        this.cellNodes.push({
          node: cellNode,
          id: colId,
        });
      }
    } else {
      this.cellNodes = [
        {
          node: cellNode,
          id: colId,
        },
      ];
    }
  }

  public deleteCell(colId: string) {
    const index = this.cellNodes.findIndex(item => item.id === colId);
    if (index !== -1) {
      this.cellNodes.splice(index, 1);
    }
  }

  public getNextCell(colId: string, isCur = false) {
    if (!this.cellNodes) return null;
    const cellIndex = this.cellNodes.findIndex(item => item.id === colId);
    if (cellIndex !== -1) {
      const nextCell = this.cellNodes[isCur ? cellIndex : cellIndex + 1];
      if (nextCell) {
        return nextCell.node;
      }
    }
    return null;
  }
}

export default FormManager;
