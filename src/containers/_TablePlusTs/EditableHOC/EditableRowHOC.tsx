import React, { PureComponent } from 'react';
import { EditableBaseRowProps } from '../types';
// import './index.less';
import WrapRowHOC from './HOC';

export const EditableContext = React.createContext({});

const EditableBaseRowHOC = (OldRow: React.ReactType) =>
  class EditableBaseRow extends PureComponent<EditableBaseRowProps> {
    public state = {
      errors: {},
    };

    // componentDidMount = () => {
    //   const { $editableRows } = this.props;
    //   $editableRows?.push(this);
    // };

    // validateRow = cb => {
    //   const { form, rowId } = this.props;
    //   form.validateFields(errors => {
    //     if (errors) {
    //       this.setState({ errors });
    //     }
    //     cb?.([rowId, errors]);
    //   });
    // };

    // // when cell changed
    // cleanError = colIndex => {
    //   const { errors } = this.state;
    //   this.setState({
    //     errors: {
    //       ...errors,
    //       [colIndex]: false,
    //     },
    //   });
    // };

    public render() {
      // const { form, onEditCell, editable, $editableRows, rowId, ...props } = this.props;
      // const { errors } = this.state;
      //
      const { form, ...restProps } = this.props;
      return (
        //   <EditableContext.Provider value={{ form, errors, cleanError: this.cleanError }}>
        <EditableContext.Provider value={{ form }}>
          {React.createElement(OldRow, {
            ...restProps,
          })}
        </EditableContext.Provider>
      );
    }
  };

export default (OldRow: React.ReactType) => WrapRowHOC(EditableBaseRowHOC(OldRow));
