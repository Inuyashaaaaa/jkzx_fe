import { PureStateComponent } from '@/components/Components';
import ListTableBase from '@/components/_ListTable/base';
import { ListTable as types } from '@/components/_ListTable/types';
import { isType, notType } from '@/utils';
import React from 'react';

class ListTable extends PureStateComponent {
  static propTypes = types;

  static defaultProps = {
    autoFetch: true,
  };

  state = {
    selectedIds: [],
    dataSource: [],
    loading: false,
    createLoading: false,
    visible: false,
    formData: {},
  };

  fetchCount = 0;

  componentDidMount = () => {
    const { dataSource, getNode, autoFetch } = this.props;
    getNode?.(this);
    if (autoFetch && isType(dataSource, 'Function')) {
      this.fetch();
    }
  };

  fetch = params => {
    // eslint-disable-next-line no-plusplus
    const fetchCount = ++this.fetchCount;

    const { dataSource } = this.props;
    if (notType(dataSource, 'Function')) return;

    const result = dataSource(params);

    if (notType(result, 'Promise')) {
      return this.setState({
        dataSource: result,
        loading: false,
      });
    }

    this.setState(
      {
        loading: true,
      },
      () => {
        result
          .then(data => {
            if (fetchCount < this.fetchCount) return;

            this.setState({
              dataSource: data,
              loading: false,
            });
          })
          .catch(err => {
            console.err(err);
            this.setState({ loading: false });
          });
      }
    );
  };

  cancelFetch = () => {
    // eslint-disable-next-line no-plusplus
    this.fetchCount++;
  };

  handleFormChange = field => {
    const { name, value } = field;
    const { onChange, formData } = this.props;
    if (!formData) {
      const { formData: stateFormData } = this.state;
      this.setState({
        formData: {
          ...stateFormData,
          [name]: value,
        },
      });
    }
    onChange?.(field);
  };

  handleCellRemove = item => {
    const { onRemove } = this.props;
    return onRemove?.(item);
  };

  handleCellSelect = item => {
    const { onSelect } = this.props;
    onSelect?.(item);
  };

  handleSelect = items => {
    const { onSelect, selectedIds: propsSelectedIds } = this.props;

    if (!propsSelectedIds) {
      this.setState({
        selectedIds:
          // 全选
          items.map(item => item.id),
      });
    }
    onSelect?.(items);
  };

  handleCreate = () => {
    const { onCreate, dataSource } = this.props;

    if (!onCreate) return;

    this.$form.validateForm(({ error, values }) => {
      if (error) return;

      let result = onCreate?.(values);

      if (notType(result, 'Promise')) {
        result = Promise.resolve(result);
      }

      this.setState({ createLoading: true }, () => {
        result
          .then(success => {
            this.setState({ createLoading: false });

            if (success) {
              this.setState({
                visible: false,
                formData: {},
              });
              if (isType(dataSource, 'Function')) {
                this.fetch(success);
              }
            }
          })
          .catch(err => {
            console.error(err);
            this.setState({
              createLoading: false,
            });
          });
      });
    });
  };

  handleGetFormNode = form => {
    this.$form = form;
  };

  handlePopover = (...args) => {
    const { onPopover } = this.props;
    this.switchVisible();
    onPopover?.(args);
  };

  handleCancel = (...args) => {
    const { onCancel } = this.props;
    this.switchVisible();
    onCancel?.(args);
  };

  changeDataItemLoading = (removeItem, loading) => {
    const { dataSource } = this.state;
    const next = dataSource.map(item => {
      if (item.id === removeItem.id) {
        return {
          ...item,
          loading,
        };
      }
      return item;
    });

    return next;
  };

  handleRemove = removeItem => {
    const { onRemove } = this.props;
    if (!onRemove) return;
    let result = onRemove?.(removeItem);

    if (notType(result, 'Promise')) {
      result = Promise.resolve(result);
    }

    this.setState(
      {
        dataSource: this.changeDataItemLoading(removeItem, true),
      },
      () => {
        result
          .then(success => {
            const nextDataSource = this.changeDataItemLoading(removeItem, false);
            this.setState({
              dataSource: nextDataSource,
            });
            if (success) {
              this.setState({
                dataSource: nextDataSource.filter(item => item.id !== removeItem.id),
              });
            }
            // important !
            return success;
          })
          .catch(error => {
            console.error(error);
            this.setState({
              dataSource: this.changeDataItemLoading(removeItem, false),
            });
          });
      }
    );

    // important !
    return result;
  };

  switchVisible = () => {
    const { visible } = this.props;
    if (visible === undefined) {
      const { visible: stateVisible } = this.state;
      this.setState({
        visible: !stateVisible,
      });
    }
  };

  getProxyState = () => {
    const { state, props } = this;
    return {
      selectedIds: props.selectedIds || state.selectedIds,
      dataSource: isType(props.dataSource, 'Function') ? state.dataSource : props.dataSource,
      loading: props.loading === undefined ? state.loading : props.loading,
      createLoading: props.createLoading === undefined ? state.createLoading : props.createLoading,
      visible: props.visible === undefined ? state.visible : props.createLoading,
      formData: props.formData || state.formData,
    };
  };

  render() {
    const {
      selectedIds,
      dataSource,
      loading,
      createLoading,
      formData,
      visible,
    } = this.getProxyState();

    return (
      <ListTableBase
        {...this.props}
        createLoading={createLoading}
        formData={formData}
        visible={visible}
        loading={loading}
        dataSource={dataSource}
        getFormNode={this.handleGetFormNode}
        selectedIds={selectedIds}
        onSelect={this.handleSelect}
        onCreate={this.handleCreate}
        onChange={this.handleFormChange}
        onCancel={this.handleCancel}
        onPopover={this.handlePopover}
        onRemove={this.handleRemove}
      />
    );
  }
}

export default ListTable;
