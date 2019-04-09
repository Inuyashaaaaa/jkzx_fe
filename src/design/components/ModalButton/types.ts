import { ButtonProps } from 'antd/lib/button';
import { ModalProps } from 'antd/lib/modal';
import { Omit } from '../common/types';

interface IModalButtonBaseProps {
  /* 模态框内部的元素 */
  content?: React.ReactNode;
  modalProps?: Omit<ModalProps, 'onCancel' | 'onOk'> & {
    onCancel?: IModalButtonCancelHandle;
    onOk?: IModalButtonClickHandle;
  };
}

export type ModalButtonBaseProps = IModalButtonBaseProps & ButtonProps;

export interface IModalButtonProps extends IModalButtonBaseProps {}

export type ModalButtonProps = IModalButtonProps & ButtonProps;

export interface ModalButtonState {
  visible?: boolean;
  confirmLoading?: boolean;
}

export type IModalButtonCancelHandle = () => void;

export type IModalButtonClickHandle = () => void | Promise<any>;
