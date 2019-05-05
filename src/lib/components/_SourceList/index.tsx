import { assertType, judagePromise, toggleItem } from '@/lib/utils';
import { Omit } from '@/lib/viewModel';
import { Button, Col, Input, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import List, { ListProps } from 'antd/lib/list';
import { ModalProps } from 'antd/lib/modal';
import { RowProps } from 'antd/lib/row';
import classnames from 'classnames';
import produce from 'immer';
import React, { CSSProperties, PureComponent } from 'react';
import Form, { Form2Props, IFormControl } from '../_Form2';
import Loading from '../_Loading2';
import ModalButton from '../_ModalButton';
import './index.less';

export interface SourceListProps extends Omit<ListProps, 'dataSource' | 'loading' | 'renderItem'> {
  dataSource?: object[];
  title?: string;
  createText?: string;
  createFormControls?: IFormControl[];
  onSearch?: (value: any) => void | any[];
  onFetch?: () => any[] | Promise<any[]>;
  onCreate?: (modalFormData?: object) => boolean | Promise<boolean | object>;
  modalContent?: React.ReactNode;
  style?: CSSProperties;
  createFormProps?: Form2Props;
  rowKey: string;
  rowSelection?: 'single' | 'multiple';
  selectable?: boolean;
  onRemove?: (rowData: any, index: number) => void | boolean | Promise<void | boolean>;
  loading?: boolean;
  renderItem?: (rowData: any, index: number) => any;
  selectedRowKeys?: string[];
  onSelectRow?: (selectedRowKeys: string[], selectedRows: any[]) => void;
  createable?: boolean;
  removeable?: boolean;
}

export interface ListHeaderProps {
  buttonText?: string;
  title?: string;
  onCreate?: (modalFormData?: object) => boolean | Promise<boolean | object>;
  formControls?: IFormControl[];
  modalContent?: React.ReactNode;
  formProps?: Form2Props;
  modalProps?: ModalProps;
  hideCreateButton?: boolean;
}

export interface RenderItemProps extends RowProps {
  selected?: boolean;
  removeLoading?: boolean;
  onRemove?: (event: any) => void;
  hideRemove?: boolean;
}

class RenderItem extends PureComponent<RenderItemProps> {
  public onRemove = event => {
    event.preventDefault();
    event.stopPropagation();
    if ('onRemove' in this.props) {
      this.props.onRemove(event);
    }
  };

  public render() {
    const { selected, removeLoading, children, onRemove, hideRemove, ...rest } = this.props;
    return (
      <Row
        {...rest}
        type="flex"
        justify="space-between"
        className={classnames('tongyu-source-list-render-item', { selected })}
      >
        {children}
        {!hideRemove && (
          <Button size="small" type="danger" loading={removeLoading} onClick={this.onRemove}>
            删除
          </Button>
        )}
      </Row>
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
class ListHeader extends PureComponent<ListHeaderProps> {
  public static defaultProps = {
    buttonText: '新 建',
  };

  public $form: WrappedFormUtils = null;

  public state = {
    formData: {},
  };

  public onFormChange = values => {
    this.setState({ formData: values });
  };

  public onCreate = () => {
    if (!this.props.onCreate) return false;

    return new Promise(resolve => {
      this.$form.validateFieldsAndScroll((error, values) => {
        if (error) return resolve(false);

        return judagePromise(this.props.onCreate(values), result => {
          resolve(result);
          setTimeout(() => {
            this.setState({
              formData: {},
            });
          }, 0);
        });
      });
    });
  };

  public getRef = element => {
    if (!element) return;
    this.$form = element.props.form;
  };

  public render() {
    const {
      modalContent,
      formProps,
      hideCreateButton,
      formControls,
      buttonText,
      modalProps,
    } = this.props;
    return (
      <Row type="flex" justify="space-between" align="middle">
        <Col>{this.props.title}</Col>
        <Col>
          {!hideCreateButton && (
            <ModalButton
              buttonText={buttonText}
              onModalOk={this.onCreate}
              modalProps={modalProps}
              size="small"
            >
              {modalContent || (
                <Form
                  controlNumberOneRow={1}
                  {...formProps}
                  wrappedComponentRef={this.getRef}
                  controls={formControls}
                  dataSource={this.state.formData}
                  footer={false}
                  onChangeValue={this.onFormChange}
                />
              )}
            </ModalButton>
          )}
        </Col>
      </Row>
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
class SourceList extends PureComponent<SourceListProps> {
  public static defaultProps = {
    rowSelection: 'single',
    selectable: true,
    createable: true,
    removeable: true,
  };

  public $listHeader: ListHeader = null;

  public state = {
    removeLoadings: {},
    selectedRowKeys: [],
    dataSource: [],
    loading: false,
    searchedDataSource: null,
  };

  constructor(props) {
    super(props);
    if (!props.rowKey) {
      throw new Error('SoureList rowKey must be exist!');
    }
  }

  public componentDidMount = () => {
    if (this.onFetch) {
      this.onFetch();
    }
  };

  public onFetch = () => {
    if (typeof this.props.onFetch !== 'function') return;

    this.setState({ loading: true });
    return judagePromise(this.props.onFetch(), result => {
      this.setState({
        loading: false,
        dataSource: assertType(
          Array.isArray(result),
          result,
          [],
          'SourceList onFetch return Array type value!'
        ),
      });
    });
  };

  public bindOnSelectRow = (data, index) => () => this.onSelectRow(data[this.props.rowKey]);

  public onSelectRow = rowId => {
    const { selectable, rowSelection, rowKey } = this.props;
    const selectedRowKeys = this.getSelectedRowKey();
    let next = [];

    if (!selectable) return;

    if (rowSelection === 'single') {
      next = selectedRowKeys[0] === rowId ? [] : [rowId];
    }

    if (rowSelection === 'multiple') {
      next = toggleItem(selectedRowKeys, rowId);
    }

    this.setSelectedRowKey(next);
  };

  public onRemove = (data, index) => event => {
    const { rowKey } = this.props;

    if (!this.props.onRemove) return;

    this.switchRemoveLoading(data[rowKey]);
    return judagePromise(this.props.onRemove(data, index), result => {
      this.switchRemoveLoading(data[rowKey]);
      if (result) {
        if (this.state.dataSource) {
          this.setState(
            produce((state: any) => {
              state.dataSource.splice(index, 1);
            })
          );
        }
        const selectedIndex = this.state.selectedRowKeys.indexOf(data[rowKey]);
        if (selectedIndex !== -1) {
          this.onSelectRow(data[this.props.rowKey]);
        }
      }
    });
  };

  public onCreate = values => {
    if (!this.props.onCreate) return false;

    return judagePromise(this.props.onCreate(values), result => {
      if (!result) return false;
      if (this.state.dataSource) {
        this.setState({
          dataSource: this.state.dataSource.concat(result),
        });
      }
      return true;
    });
  };

  public switchRemoveLoading = key => {
    this.setState(
      produce((state: any) => {
        state.removeLoadings[key] = !state.removeLoadings[key];
      })
    );
  };

  public getLoading = () => {
    if ('loading' in this.props) {
      return this.props.loading;
    }
    return this.state.loading;
  };

  public getSelectedRowKey = () => {
    if ('selectedRowKeys' in this.props) {
      return this.props.selectedRowKeys || [];
    }
    return this.state.selectedRowKeys;
  };

  public setSelectedRowKey = selectedRowKeys => {
    if ('onSelectRow' in this.props) {
      this.props.onSelectRow(selectedRowKeys, this.getSelectedRecord(selectedRowKeys));
    }
    return this.setState({
      selectedRowKeys,
    });
  };

  public getSelectedRecord = selectedRowKeys => {
    return this.state.dataSource.filter(item => selectedRowKeys.includes(item[this.props.rowKey]));
  };

  public getCreateable = (modalContent, createFormControls) => {
    if ('createable' in this.props) {
      return this.props.createable;
    }
    return modalContent || createFormControls;
  };

  public getDataSource = () => {
    return this.props.dataSource || this.state.dataSource;
  };

  public onSearch = value => {
    if (this.props.onSearch) {
      const dataSource = this.props.onSearch(value);
      if (Array.isArray(dataSource) && !this.props.dataSource) {
        return this.setState({ dataSource });
      }
    }

    const reg = new RegExp(value);
    const _data = this.props.dataSource ? this.props.dataSource : this.getDataSource();
    const searchedDataSource = _data.filter(item => reg.test(item[this.props.rowKey]));
    this.setState(
      {
        searchedDataSource,
      },
      () => {
        this.state.selectedRowKeys.forEach(rowId => {
          this.onSelectRow(rowId);
        });
      }
    );
  };

  public getSelectedPanel = (selectedKey, dataSource) => {
    if (!dataSource.length) return undefined;

    return (
      <div style={{ position: this.props.pagination ? 'absolute' : 'initial', bottom: 17 }}>
        {!!selectedKey.length ? (
          <div>
            {selectedKey.length} / {dataSource.length} 项
          </div>
        ) : (
          <div>{dataSource.length} 项</div>
        )}
      </div>
    );
  };

  public render() {
    const {
      onCreate,
      title,
      createFormProps,
      createText,
      createFormControls,
      modalContent,
      renderItem = data => data[rowKey],
      rowKey,
      loading,
      dataSource,
      onFetch,
      rowSelection,
      selectable,
      onRemove,
      onSelectRow,
      createable,
      selectedRowKeys,
      removeable,
      onSearch,
      ...rest
    } = this.props;

    const selectedKey = this.getSelectedRowKey();
    const usedDataSource = this.state.searchedDataSource || this.getDataSource();

    return (
      <List
        bordered={true}
        dataSource={usedDataSource}
        loading={{
          spinning: this.getLoading(),
          indicator: <Loading />,
        }}
        {...rest}
        header={
          <>
            <ListHeader
              hideCreateButton={!this.getCreateable(modalContent, createFormControls)}
              ref={node => (this.$listHeader = node)}
              title={title}
              formProps={createFormProps}
              buttonText={createText}
              formControls={createFormControls}
              modalContent={modalContent}
              onCreate={this.onCreate}
            />
            <Input.Search onSearch={this.onSearch} style={{ marginTop: 10 }} />
          </>
        }
        renderItem={(data, index) => (
          <RenderItem
            onClick={this.bindOnSelectRow(data, index)}
            removeLoading={this.state.removeLoadings[data[rowKey]]}
            selected={selectedKey.indexOf(data[rowKey]) !== -1}
            onRemove={this.onRemove(data, index)}
            hideRemove={!removeable}
          >
            {renderItem(data, index)}
          </RenderItem>
        )}
        footer={this.getSelectedPanel(selectedKey, usedDataSource)}
      />
    );
  }
}

export default SourceList;
