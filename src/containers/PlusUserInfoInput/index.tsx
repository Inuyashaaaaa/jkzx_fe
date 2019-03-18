import { InputPolym } from '@/design/components/Form/Input/InputPolym';
import { remove } from '@/design/utils';
import { Button, Col, DatePicker, Icon, Input, Row } from 'antd';
import moment, { isMoment } from 'moment';
import React from 'react';

class PlusUserInfoInput extends InputPolym<any> {
  public formatValue = (value): string => {
    return (value || []).map(item => item.join(',')).join(';');
  };

  public formatChangeEvent = event => {
    return {
      origin: event,
      normal: event,
    };
  };

  public parseValue = value => {
    return (value || []).map(item => {
      if (typeof item.tradeAuthorizerIdExpiryDate === 'string') {
        return {
          ...item,
          tradeAuthorizerIdExpiryDate: moment(item.tradeAuthorizerIdExpiryDate, 'YYYY-MM-DD'),
        };
      }
      return item;
    });
  };

  public bindOnChange = (field, index, onChange) => val => {
    if (!onChange) return;
    const value = this.props.value || [];

    if (field === 'tradeAuthorizerIdExpiryDate') {
      val = isMoment(val) ? val.format('YYYY-MM-DD') : val;
    }
    if (
      field === 'tradeAuthorizerName' ||
      field === 'tradeAuthorizerIdNumber' ||
      field === 'tradeAuthorizerPhone'
    ) {
      val = val.target.value;
    }

    onChange(
      value.map((item, iindex) => {
        if (iindex === index) {
          return {
            ...item,
            [field]: val,
          };
        }
        return item;
      })
    );
  };

  public onAddButtonClick = () => {
    const value = this.props.value || [];
    this._onChange(value.concat({}));
  };

  public bindRemoveButtonClick = index => () => {
    const value = this.props.value || [];
    this._onChange(remove(value, index));
  };

  public renderEditing(props, onChange) {
    const { value } = props;
    return (
      <div>
        {value.map((item, index) => {
          return (
            <Row key={index} type="flex" align="middle" style={{ position: 'relative' }}>
              <Col>
                <Input.Group compact={true}>
                  <Input
                    style={{ width: '25%' }}
                    value={item.tradeAuthorizerName}
                    placeholder="姓名"
                    onChange={this.bindOnChange('tradeAuthorizerName', index, onChange)}
                  />
                  <Input
                    style={{ width: '25%' }}
                    value={item.tradeAuthorizerIdNumber}
                    placeholder="身份证号"
                    onChange={this.bindOnChange('tradeAuthorizerIdNumber', index, onChange)}
                  />
                  <DatePicker
                    style={{ width: '25%' }}
                    value={item.tradeAuthorizerIdExpiryDate}
                    placeholder="证件有效期"
                    onChange={this.bindOnChange('tradeAuthorizerIdExpiryDate', index, onChange)}
                  />
                  <Input
                    style={{ width: '25%' }}
                    value={item.tradeAuthorizerPhone}
                    placeholder="联系电话"
                    onChange={this.bindOnChange('tradeAuthorizerPhone', index, onChange)}
                  />
                </Input.Group>
              </Col>
              {value.length > 1 ? (
                <Icon
                  style={{
                    fontSize: 16,
                    display: 'block',
                    position: 'absolute',
                    right: -25,
                    zIndex: 999,
                  }}
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={this.bindRemoveButtonClick(index)}
                />
              ) : null}
            </Row>
          );
        })}
        <Button
          onClick={this.onAddButtonClick}
          type="dashed"
          icon="plus"
          style={{
            width: '100%',
            display: 'block',
          }}
        >
          添加交易授权人
        </Button>
      </div>
    );
  }
}

export default PlusUserInfoInput;
