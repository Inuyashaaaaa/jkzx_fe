import {
  arrayOf,
  bool,
  element,
  func,
  oneOf,
  number,
  object,
  oneOfType,
  shape,
  string,
} from 'prop-types';
import { FormControl } from '@/lib/components/_FormControl/types';

export const FormPlus = {
  dataSource: object,
  initalDataSource: object,
  items: arrayOf(
    shape({
      ...FormControl,
      labelCol: oneOfType([number, object]),
      wrapperCol: oneOfType([number, object]),
      label: string,
    })
  ),
  onChange: func,
  cellNumberOneRow: number,
  labelCol: oneOfType([number, object]),
  wrapperCol: oneOfType([number, object]),
  width: oneOfType([number, string]),
  onSave: func,
  saveText: string,
  resetText: string,
  footer: oneOfType([element, bool]),
  saveLoading: bool,
  saveButtonProps: object,
  resetable: bool,
  onReset: func,
  initialDataSource: object,
  getFormRef: func,
  compact: bool, // 最后一行是否和下面的内容之间存在间隔
  actionPlacement: oneOf(['offset', 'left', 'right']), // 定义 footer 中 actionButton 的水平方向
};
