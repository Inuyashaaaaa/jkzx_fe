import DragableBaseRow from '@/components/_TablePlus/BodyRow/DragableBaseRow';
import DragableBodyRowHOC from '@/components/_TablePlus/BodyRow/DragableBodyRowHOC';
import DropableBodyRowHOC from '@/components/_TablePlus/BodyRow/DropableBodyRowHOC';
import { EditableCell, EditableFormRowHOC } from '@/components/_TablePlus/BodyRow/EditableElements';
import { GeneralRow } from '@/components/_TablePlus/BodyRow/GeneralElements';

const DragableAndEditableBodyRow = DragableBodyRowHOC(EditableFormRowHOC(DragableBaseRow));

const DropableAndDragableAndEditableBodyRow = DropableBodyRowHOC(DragableAndEditableBodyRow);

const DragableBodyRow = DragableBodyRowHOC(DragableBaseRow);

const DropableAndDragableBodyRow = DropableBodyRowHOC(DragableBodyRow);

const EditableBodyRow = EditableFormRowHOC(GeneralRow);

const DropableAndEditableBodyRow = DropableBodyRowHOC(EditableBodyRow);

const DropableGeneralBodyRow = DropableBodyRowHOC(GeneralRow);

const getBodyRow = (editable, dragable, dropable) => {
  if (editable && dragable) {
    if (dropable) {
      return DropableAndDragableAndEditableBodyRow;
    }
    return DragableAndEditableBodyRow;
  }
  if (dragable) {
    if (dropable) {
      return DropableAndDragableBodyRow;
    }
    return DragableBodyRow;
  }
  if (editable) {
    if (dropable) {
      return DropableAndEditableBodyRow;
    }
    return EditableBodyRow;
  }

  if (dropable) {
    return DropableGeneralBodyRow;
  }
  return undefined; // use default
};

const getBodyCell = editable => {
  if (editable) {
    return EditableCell;
  }
  return undefined; // use default
};

export { getBodyCell, getBodyRow };
