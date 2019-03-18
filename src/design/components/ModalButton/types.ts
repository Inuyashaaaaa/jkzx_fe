import { ButtonProps } from 'antd/lib/button';
import { ModalProps } from 'antd/lib/modal';

interface IModalButtonBaseProps {
  onCancel?: IModalButtonCancelHandle;
  onConfirm?: IModalButtonClickHandle;
  /* 模态框内部的元素 */
  content?: React.ReactNode;
  visible?: boolean;
  modalProps?: ModalProps;
  confirmLoading?: boolean;
}

export type ModalButtonBaseProps = IModalButtonBaseProps & ButtonProps;

export interface IModalButtonProps extends IModalButtonBaseProps {}

export type ModalButtonProps = IModalButtonProps & ButtonProps;

export interface ModalButtonState {
  visible?: boolean;
  confirmLoading?: boolean;
}

export type IModalButtonCancelHandle = () => any;

export type IModalButtonClickHandle = () => any;
