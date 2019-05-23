import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import CascaderSourceList from '@/containers/_CascaderSourceList';
import Form, { IFormControl } from '@/containers/_Form2';
import Page from '@/containers/Page';
import { delay } from '@/tools';
import { Col, Row } from 'antd';
import memo from 'memoize-one';
import React, { PureComponent } from 'react';

// const OPTION_KEY  = '期权类型'
// const SUBJECT_KEY = '标的物'
// const DATE_KEY = '到期日'
// const POSITION_KEY = 'Position'

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
            children: [
              {
                value: 'xihu2',
                label: 'West Lake2',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
            children: [],
          },
        ],
      },
    ],
  },
];

class PricingSettingsPricingEnvironment extends PureComponent {
  public state = {
    loading: false,
    nodes: [],
    formData: {},
  };

  public getOptions = memo(nodes => {
    // return arr2tree(
    //   nodes,
    //   [OPTION_KEY, SUBJECT_KEY, DATE_KEY, POSITION_KEY],
    //   [OPTION_KEY, SUBJECT_KEY, DATE_KEY, POSITION_KEY]
    // );
    // console.log(nodes);
    return options;
  });

  public onSubmit = () => delay(1000, true);

  public getFormControls = formData => {
    const PDE: IFormControl[] = [
      {
        dataIndex: 'PDE-精度',
        control: {
          label: 'PDE-精度',
        },
        input: INPUT_NUMBER_DIGITAL_CONFIG,
      },
    ];

    const MonteCarlo: IFormControl[] = [
      {
        dataIndex: 'MonteCarlo-模拟路径数',
        control: {
          label: 'MonteCarlo-模拟路径数',
        },
        input: INPUT_NUMBER_DIGITAL_CONFIG,
      },
      {
        dataIndex: 'MonteCarlo-步长',
        control: {
          label: 'MonteCarlo-步长',
        },
        input: {
          type: 'select',
          options: [
            {
              label: '7D',
              value: '7D',
            },
          ],
        },
      },
    ];

    const extraFormItems = {
      PDE,
      MonteCarlo,
    };

    return [
      {
        dataIndex: '模板',
        control: {
          label: '模板',
        },
      },
      {
        dataIndex: 'mx',
        control: {
          label: '模型',
        },
        input: {
          type: 'select',
          options: [
            {
              label: 'PDE',
              value: 'PDE',
            },
            {
              label: 'Monte Carlo',
              value: 'MonteCarlo',
            },
          ],
        },
      },
      ...(extraFormItems[formData.mx] || []),
      {
        control: {
          label: '基础合约',
        },
        dataIndex: '基础合约',
      },
      {
        control: {
          label: '对冲合约',
        },
        dataIndex: '对冲合约',
        input: {
          type: 'select',
          options: [
            {
              label: 'A',
              value: 'A',
            },
            {
              label: 'B',
              value: 'B',
            },
          ],
        },
      },
      {
        control: {
          label: '定价价格',
        },
        input: {
          type: 'select',
          options: [
            {
              label: 'A',
              value: 'A',
            },
            {
              label: 'B',
              value: 'B',
            },
          ],
        },
        dataIndex: '定价价格',
      },
      {
        control: {
          label: '波动率曲面分组',
        },
        dataIndex: '波动率曲面分组',
        input: {
          type: 'select',
          options: [
            {
              label: 'A',
              value: 'A',
            },
            {
              label: 'B',
              value: 'B',
            },
          ],
        },
      },
      {
        control: {
          label: '无风险利率曲线分组',
        },
        dataIndex: '无风险利率曲线分组',
        input: {
          type: 'select',
          options: [
            {
              label: 'A',
              value: 'A',
            },
            {
              label: 'B',
              value: 'B',
            },
          ],
        },
      },
      {
        control: {
          label: '分红曲线分组',
        },
        dataIndex: '分红曲线分组',
        input: {
          type: 'select',
          options: [
            {
              label: 'A',
              value: 'A',
            },
            {
              label: 'B',
              value: 'B',
            },
          ],
        },
      },
    ];
  };

  public onChangeFormData = values => {
    this.setState({ formData: values });
  };

  public render() {
    return (
      <Page>
        <Row type="flex" justify="space-between" align="top">
          <Col sm={18} xs={24}>
            {/* <BigCascader {...bigCascaderProps} /> */}
            <CascaderSourceList
              removeable={false}
              width={250}
              createable={false}
              loading={this.state.loading}
              options={this.getOptions(this.state.nodes)}
              list={[
                {
                  title: '期权类型',
                  rowSelection: 'single',
                },
                {
                  title: '标的物',
                  rowSelection: 'single',
                },
                {
                  title: '到期日',
                  rowSelection: 'multiple',
                },
                {
                  title: 'Position',
                  rowSelection: 'multiple',
                },
              ]}
            />
          </Col>
          <Col sm={6} xs={24}>
            <Form
              labelSpace={10}
              controlNumberOneRow={1}
              dataSource={this.state.formData}
              controls={this.getFormControls(this.state.formData)}
              onChangeValue={this.onChangeFormData}
              onSubmit={this.onSubmit}
            />
          </Col>
        </Row>
      </Page>
    );
  }
}

export default PricingSettingsPricingEnvironment;
