import { ButtonGroup } from '@/lib/components/_ButtonGroup/types';
import { ButtonPlus } from '@/lib/components/_ButtonPlus/types';
import { array, arrayOf, bool, element, func, object, oneOf, oneOfType, shape } from 'prop-types';

const Direction = shape({
  type: oneOf(['column', 'row']),
  signle: bool,
});

const BatchItem = shape({
  type: oneOf(['some', 'every']),
  direction: oneOfType([arrayOf(Direction), Direction]),
});

const Sections = arrayOf(
  shape({
    placement: oneOf(['topLeft', 'topRight', 'bottomLeft', 'bottomRight']),
    content: oneOfType([
      element,
      shape({
        ...ButtonGroup,
        items: arrayOf(
          shape({
            ...ButtonPlus,
            // 当批量选择行或者列的时候，该 button 为可用状态
            batch: oneOfType([BatchItem, arrayOf(BatchItem), bool]),
            // 当有编辑状态的 cell 出现时候，该 button 为可用状态
            save: bool,
          })
        ),
      }),
    ]),
  })
);

export const TablePlus = {
  columns: arrayOf(
    shape({
      formItem: object,
      resizeable: bool, // width is required
      // @todo 去除对象？record => bool 已经 overvide 了
      editable: oneOfType([bool, func]),
      editing: oneOfType([bool, func]),
      hideSelector: bool,
    })
  ),
  dragable: bool,
  copyable: bool,
  removeable: bool,
  createable: bool,
  onMove: func, // { dragIndex, hoverIndex, dragRow }
  onEdit: func, // { row, field }
  onStartEdit: func, // { row, dataIndex }
  onResize: func, // { column, size }
  onCopy: func,
  onRemove: func,
  onCreate: func,
  dropMenu: arrayOf(element),
  hideSelection: bool,
  sections: Sections,
  createLoading: bool,
  vertical: bool,
  hideTableHead: bool,
};

export const SectionTemplate = {
  sections: Sections,
  selectedRowKeys: array,
  selectedColumnKeys: array,
  columns: array,
};
