import Form, {
  Form2Props,
  IFormControl,
  IFormStateChangeValueHandle,
} from '@/lib/components/_Form2';
import { judagePromise, securityCall } from '@/lib/utils';
import { Button, Modal, notification } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ModalProps } from 'antd/lib/modal';
import memo from 'memoize-one';
import React, { PureComponent } from 'react';

export interface ModalButtonBaseProps {
  onFormChange?: IFormStateChangeValueHandle;
  formControls?: IFormControl[] | ((formData: {}) => IFormControl[]);
  formProps?: Form2Props;
  modalProps?: ModalProps;
  onCancel?: (event: ModalButtonEvent) => void;
  onConfirm?: (event: ModalButtonEvent) => void;
  modalVisible?: boolean;
  confirmLoading?: boolean;
  formData?: object;
  extra?: any;
  modelContent?: React.ReactNode;
}

export interface ModalButtonEvent {
  extra?: any;
  formData?: object;
  // @todo tableDataSource
}

class ModalButtonBase extends PureComponent<ModalButtonBaseProps & ButtonProps> {
  public $form: WrappedFormUtils = null;

  public onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel(this.getEventData());
    }
  };

  public onConfirm = () => {
    if (this.props.onConfirm) {
      if (this.$form) {
        return this.$form.validateFieldsAndScroll((errors, values) => {
          if (errors) return;
          this.props.onConfirm(this.getEventData());
        });
      }
      return this.props.onConfirm(this.getEventData());
    }
  };

  public getFormData = () =>
    this.props.formData || (this.$form ? this.$form.getFieldsValue() : undefined);

  public getExtra = () => this.props.extra;

  public getEventData = (): ModalButtonEvent => {
    return {
      extra: this.getExtra(),
      formData: this.getFormData(),
    };
  };

  public getRef = node => {
    // @todo check node error
    if (!node) return;
    this.$form = node.props.form;
  };

  public render() {
    const {
      onFormChange,
      formData,
      formControls,
      formProps,
      modalProps,
      onCancel,
      onConfirm,
      modalVisible,
      confirmLoading,
      children,
      modelContent,
      ...buttonProps
    } = this.props;
    return (
      <>
        <Modal
          closable={false}
          {...modalProps}
          visible={modalVisible}
          onCancel={this.onCancel}
          onOk={this.onConfirm}
          confirmLoading={confirmLoading}
        >
          {modelContent || (
            <Form
              controlNumberOneRow={1}
              footer={false}
              {...formProps}
              wrappedComponentRef={this.getRef}
              controls={formControls}
              dataSource={formData}
              onChangeValue={onFormChange}
            />
          )}
        </Modal>
        {children && <Button {...buttonProps}>{children}</Button>}
      </>
    );
  }
}

export type IModalButtonOnSwitchModal = (
  nextVisible?: boolean
) => void | boolean | Promise<boolean>;

export interface ModalButtonState {
  extra?: any;
  formControls?: IFormControl[] | ((formData: any) => IFormControl[]);
  formData?: object;
  modalVisible?: boolean;
  confirmLoading?: boolean;
}

export interface ModalButtonProps extends ModalButtonBaseProps {
  onClick?: (
    event: Event
  ) => ModalButtonEvent | void | boolean | Promise<void | boolean | ModalButtonEvent>;
  onConfirm?: (formData: {}) => void | boolean | object | Promise<void | boolean | object>;
  onCancel?: (formData: {}) => void | boolean | object | Promise<void | boolean | object>;
  onSwitchModal?: IModalButtonOnSwitchModal;
}

// tslint:disable-next-line:max-classes-per-file
class ModalButton extends PureComponent<ModalButtonProps & ButtonProps, ModalButtonState> {
  public state = {
    modalVisible: false,
    confirmLoading: false,
    formControls: [],
    formData: {},
    extra: {},
  };

  public coumtFormControls = memo((formControls, formData) => {
    if (typeof formControls === 'function') {
      return formControls(formData);
    }
    return formControls;
  });

  public switchModal = (nextVisible = !this.state.modalVisible) => {
    const onSwitchModal = this.props.onSwitchModal;

    if (onSwitchModal) {
      return judagePromise(onSwitchModal(nextVisible), () => {
        this.setState({
          modalVisible: nextVisible,
        });
      });
    }

    this.setState({
      modalVisible: nextVisible,
    });
  };

  public controlModalVisible = () => {
    return 'modalVisible' in this.props;
  };

  public controlConfirmLoading = () => {
    return 'confirmLoading' in this.props;
  };

  public onClick = (...args: any[]) => {
    if (this.props.onClick) {
      return judagePromise((this.props.onClick as any)(...args), result => {
        if (result && !this.controlModalVisible()) {
          this.switchModal(true);
        }

        if (typeof result === 'object') {
          this.setState(result);
        }

        return result;
      });
    }

    this.switchModal(true);
  };

  public click = result => {
    return judagePromise(result, result => {
      if (result && !this.controlModalVisible()) {
        this.switchModal(true);
      }

      if (typeof result === 'object') {
        this.setState(result);
      }

      return result;
    });
  };

  public hideModal = () => {
    if (!this.controlModalVisible()) {
      this.switchModal(false);
    }
  };

  public onCancel = (event: ModalButtonEvent) => {
    if (this.props.onCancel) {
      return judagePromise(this.props.onCancel(event), result => {
        this.hideModal();

        return result;
      });
    }

    this.hideModal();
  };

  // @todo tableDataSource extra
  public onConfirm = (event: ModalButtonEvent) => {
    if (this.props.onConfirm) {
      this.switchConfirmLoading(true);

      return securityCall(
        () => this.props.onConfirm(event),
        result => {
          this.switchConfirmLoading(false);

          if (result !== false) {
            this.hideModal();
          }

          if (result !== null && typeof result === 'object') {
            this.setState(result);
          }

          return result;
        },
        error => {
          this.switchConfirmLoading(false);

          notification.warn({
            message: '确认异常',
            description: error.toString(),
          });
        }
      );
    }

    this.hideModal();
  };

  public getModalVisible = () =>
    this.controlModalVisible() ? this.props.modalVisible : this.state.modalVisible;

  public getConfirmLoading = () =>
    this.controlConfirmLoading() ? this.props.confirmLoading : this.state.confirmLoading;

  public getFormControls = () => {
    return this.props.formControls || this.state.formControls;
  };

  public getFormData = () => this.props.formData || this.state.formData;

  public onFormChange = (formData: object, changed: object, oldFormData: object) => {
    let changedValues;
    if (this.props.onFormChange) {
      changedValues = this.props.onFormChange(formData, changed, oldFormData);
    }

    if (!this.props.formData) {
      this.setState({
        formData: changedValues || formData,
      });
    }
  };

  public getExtra = () => this.props.extra || this.state.extra;

  public render() {
    return (
      <ModalButtonBase
        {...this.props}
        onClick={this.onClick}
        modalVisible={this.getModalVisible()}
        confirmLoading={this.getConfirmLoading()}
        formControls={this.coumtFormControls(this.getFormControls(), this.getFormData())}
        formData={this.getFormData()}
        onCancel={this.onCancel}
        onConfirm={this.onConfirm}
        onFormChange={this.onFormChange}
        extra={this.getExtra()}
      />
    );
  }

  private switchConfirmLoading = (loading: boolean) => {
    if (!this.controlConfirmLoading()) {
      this.setState({
        confirmLoading: loading,
      });
    }
  };
}

export default ModalButton;
