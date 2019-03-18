import React, { PureComponent } from 'react';
import { Button, Popover, Row, DatePicker, Col } from 'antd';
import moment from 'moment';
import multi from 'classnames';
import styles from './index.less';

// value = [{ value, key}]
// format
class ToolEditor extends PureComponent {
  static defaultProps = {
    value: [],
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleDateChange = (date, dateString, index) => {
    const { onChange, value, format } = this.props;
    const nextValue = [...value];
    nextValue.splice(index, 1, {
      ...value[index],
      value: date ? date.format(format) : undefined,
    });
    onChange(nextValue);
  };

  handleActionItem = (action, index) => {
    const { onChange, value } = this.props;
    const nextValue = [...value];
    if (action === 'plus') {
      nextValue.splice(index, 0, {
        ...value[index],
        key: new Date().getTime(),
      });
    }
    if (action === 'delete') {
      nextValue.splice(index, 1);
    }
    onChange(nextValue);
  };

  handleSwitchVisiable = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  render() {
    const { value, format } = this.props;
    const { visible } = this.state;
    const content = (
      <div>
        {value.map((item, index) => {
          return (
            <Row
              className={multi(styles.row, {
                [styles.last]: index === value.length - 1,
              })}
              key={item.key}
              type="flex"
              justify="space-between"
            >
              <Col>
                <DatePicker
                  size="small"
                  onChange={(date, dateString) => this.handleDateChange(date, dateString, index)}
                  value={item.value && moment(item.value, format)}
                />
              </Col>
              <Col>
                <Button
                  size="small"
                  onClick={() => this.handleActionItem('plus', index)}
                  icon="plus"
                />
                <Button
                  size="small"
                  type="danger"
                  onClick={() => this.handleActionItem('delete', index)}
                  icon="delete"
                />
              </Col>
            </Row>
          );
        })}
      </div>
    );
    return value.length ? (
      <Popover
        overlayClassName={styles.card}
        // title={
        //   <Row type="flex" justify="end">
        //     <Button shape="circle" size="small" icon="close" onClick={this.handleSwitchVisiable} />
        //   </Row>
        // }
        visible={visible}
        content={content}
        trigger="click"
      >
        <div className={styles.moreBtnWrap}>
          <Button
            className={styles.moreBtn}
            type="primary"
            size="small"
            onClick={this.handleSwitchVisiable}
          >
            check more...
          </Button>
        </div>
      </Popover>
    ) : (
      <div className={styles.noData} />
    );
  }
}

export default ToolEditor;
