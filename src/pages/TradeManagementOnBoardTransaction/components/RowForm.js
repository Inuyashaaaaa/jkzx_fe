import React, { PureComponent } from 'react';
import { Button, DatePicker, Select } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default class RowForm extends PureComponent {
  constructor(props) {
    super(props);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    this.state = {
      startDate: moment(yesterday),
      endDate: moment(today),
      date: moment(yesterday),
      code: [],
    };
  }

  queryData = () => {
    const { handleQuery } = this.props;
    handleQuery(Object.assign({}, this.state));
  };

  resetData = () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    this.setState({
      startDate: moment(yesterday),
      endDate: moment(today),
      code: [],
    });
  };

  render() {
    const { startDate, endDate, date, code } = this.state;
    const flexStyle = { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' };
    const commonStyle = {
      ...flexStyle,
      paddingRight: 30,
      marginTop: 10,
    };
    const { mode, codeOptions } = this.props;
    const isFlow = mode === 'flow';
    return (
      <div style={{ ...commonStyle, flexWrap: 'wrap', paddingTop: 10, paddingBottom: 30 }}>
        {isFlow && (
          <div style={commonStyle}>
            <div style={{ color: '#333333' }}>选择日期：</div>
            <RangePicker
              value={[startDate, endDate]}
              onChange={newValue =>
                this.setState({
                  startDate: newValue[0],
                  endDate: newValue[1],
                })
              }
            />
          </div>
        )}
        {isFlow && (
          <div style={commonStyle}>
            <div style={{ color: '#333333' }}>合约代码：</div>
            <Select
              showSearch
              mode="multiple"
              placeholder="请输入内容搜索"
              value={code}
              onChange={newValue => this.setState({ code: newValue })}
              style={{ width: 200 }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {codeOptions.map(item => (
                <Option value={item}>{item}</Option>
              ))}
            </Select>
          </div>
        )}
        {!isFlow && (
          <div style={commonStyle}>
            <div style={{ color: '#333333' }}>选择日期：</div>
            <DatePicker
              value={date}
              onChange={newValue =>
                this.setState({
                  date: newValue,
                })
              }
            />
          </div>
        )}
        <Button onClick={this.queryData} type="primary" style={{ marginTop: 10 }}>
          查询
        </Button>
        {isFlow && (
          <Button onClick={this.resetData} style={{ marginTop: 10, marginLeft: 20 }}>
            重置
          </Button>
        )}
      </div>
    );
  }
}
