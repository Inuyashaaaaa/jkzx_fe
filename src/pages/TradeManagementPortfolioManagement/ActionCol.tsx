import LoadingButton from '@/components/LoadingButton';
import PopconfirmButton from '@/components/PopconfirmButton';
import Form from '@/design/components/Form';
import ModalButton from '@/design/components/ModalButton';
import { trdPortfolioDelete, trdPortfolioUpdate } from '@/services/trade-service';
import { Button, Popconfirm, Row } from 'antd';
import React, { PureComponent } from 'react';
import { RESOURCE_FORM_CONTROLS } from '.';

class ActionCol extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      formData: props.params.data,
    };
  }

  public onChange = async () => {
    const { error, data } = await trdPortfolioUpdate({
      uuid: this.props.params.data.uuid,
      portfolioName: this.state.formData.portfolioName,
    });
    if (error) return;
    return () => {
      this.props.reload();
    };
  };

  public onRemove = async () => {
    const { params } = this.props;
    const { error, data } = await trdPortfolioDelete({
      portfolioName: params.data.portfolioName,
    });
    if (error) return;
    return () => {
      this.props.reload();
    };
  };

  public onValueChange = async params => {
    this.setState({
      formData: params.values,
    });
  };

  public render() {
    const { params } = this.props;
    return (
      <Row type="flex" align="middle" style={{ height: params.context.rowHeight }}>
        <Button.Group>
          <ModalButton
            type="primary"
            size="small"
            content={
              <Form
                footer={false}
                dataSource={this.state.formData}
                controls={RESOURCE_FORM_CONTROLS}
                onValueChange={this.onValueChange}
              />
            }
            onConfirm={this.onChange}
          >
            修改
          </ModalButton>
          <PopconfirmButton
            type="danger"
            size="small"
            onConfirm={this.onRemove}
            popconfirmProps={{
              onConfirm: this.onRemove,
              title: '确认删除?',
            }}
          >
            删除
          </PopconfirmButton>
        </Button.Group>
      </Row>
    );
  }
}

export default ActionCol;
