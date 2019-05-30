import React from 'react';
import multi from 'classnames';
import FormControl, { selectContentIsChanged } from '@/containers/_FormControl';
import lodash from 'lodash';
import styles from '../index.less';

class Field extends React.Component {
  shouldComponentUpdate = nextProps => {
    const { isHoverCurRow, isLastCell, field, dataSourceItem } = this.props;

    return (
      selectContentIsChanged(
        field,
        nextProps.field,
        dataSourceItem.data,
        nextProps.dataSourceItem.data
      ) || (nextProps.isHoverCurRow && nextProps.isLastCell) !== (isHoverCurRow && isLastCell)
    );
  };

  handleBlur = () => {
    const { dataSourceItem, onCellBlur, field } = this.props;
    onCellBlur(field.name, dataSourceItem.id);
  };

  handleFocus = () => {
    const { dataSourceItem, onCellFocus, field } = this.props;
    onCellFocus(field.name, dataSourceItem.id);
  };

  render() {
    const { form, dataSourceItem, field, isHoverCurRow, isLastCell } = this.props;

    const { rules, $types, ...restField } = field;
    const { dataIndex } = restField;

    if (!dataIndex) {
      throw new Error(`${JSON.stringify(field)} must has dataIndex field.`);
    }

    return (
      <div
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        key={dataIndex + dataSourceItem.id}
        className={multi(styles.commonCell, {
          [styles.lightBottom]: isHoverCurRow && isLastCell,
        })}
      >
        {lodash.intersection($types, dataSourceItem.$types).length ? (
          form.getFieldDecorator(dataIndex, {
            rules,
          })(<FormControl field={restField} formData={dataSourceItem.data} />)
        ) : (
          <div className={styles.emptyContent} />
        )}
      </div>
    );
  }
}

export default Field;
