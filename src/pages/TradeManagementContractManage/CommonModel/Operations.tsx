import { Dropdown, Icon, Menu, message } from 'antd';
import React, { PureComponent } from 'react';
import router from 'umi/router';
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
import {
  LCM_EVENT_TYPE_MAP,
  LCM_EVENT_TYPE_ZHCN_MAP,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
} from '@/constants/common';
import { allLegTypes } from '@/constants/legColDefs';
import ModalButton from '@/lib/components/_ModalButton2';
import AsianExerciseModal from '@/pages/TradeManagementBookEdit/modals/AsianExerciseModal';
import BarrierIn from '@/pages/TradeManagementBookEdit/modals/BarrierIn';
import ExerciseModal from '@/pages/TradeManagementBookEdit/modals/ExerciseModal';
import ExpirationModal from '@/pages/TradeManagementBookEdit/modals/ExpirationModal';
import FixingModal from '@/pages/TradeManagementBookEdit/modals/FixingModal';
import KnockOutModal from '@/pages/TradeManagementBookEdit/modals/KnockOutModal';
import UnwindModal from '@/pages/TradeManagementBookEdit/modals/UnwindModal';
import { modalFormControls } from '@/pages/TradeManagementBookEdit/services';
import { filterObDays } from '@/pages/TradeManagementBookEdit/utils';
import { trdTradeLCMEventList } from '@/services/general-service';
import { convertTradeApiData2PageData } from '@/services/pages';
import { trdPositionLCMEventTypes, trdTradeLCMEventProcess } from '@/services/trade-service';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import uuidv4 from 'uuid';
import LifeModalTable from '../LifeModalTable';
import PortfolioModalTable from '../PortfolioModalTable';

class Operations extends PureComponent<{ record: any; onSearch: any }> {
  public $unwindModal: UnwindModal;

  public $exerciseModal: ExerciseModal;

  public $expirationModal: ExpirationModal;

  public $knockOutModal: KnockOutModal;

  public $fixingModal: FixingModal;

  public $asianExerciseModal: AsianExerciseModal;

  public $barrierIn: BarrierIn;

  public $modelButton: ModalButton = null;

  public activeRowData: any;

  public state = {
    modalVisible: false,
    lifeTableData: [],
    portfolioModalVisible: false,
    eventTypes: {},
    tableFormData: {},
  };

  public componentDidMount = async () => {
    const item = this.props.record;
    const rsp = await trdPositionLCMEventTypes({
      positionId: item.positionId,
    });
    if (rsp.error) return;
    this.setState({
      eventTypes: {
        ...this.state.eventTypes,
        [item.positionId]: rsp.data,
      },
    });
  };

  public onClick = ({ item, key, keyPath }) => {
    // console.log(item); //MenuItem
    // console.log(key); //key
    // console.log(keyPath); //['key']
    if (key === 'bookEdit') {
      router.push({
        pathname: '/trade-management/book-edit',
        query: {
          id: this.props.record.tradeId,
        },
      });
    }
    if (key === 'searchLifeStyle') {
      this.setState(
        {
          modalVisible: true,
        },
        () => {
          this.fetchOverviewTableData();
        }
      );
    }
    if (key === 'portfolio') {
      this.setState({
        portfolioModalVisible: true,
      });
    }
    if (keyPath.length === 2) {
      const { tableDataSource, tableFormData } = convertTradeApiData2PageData(this.props.record);
      this.setState(
        {
          tableFormData,
        },
        () => {
          this.bindEventAction(key, { rowData: tableDataSource[0] });
        }
      );
    }
  };

  public handleCancelVisible = () => {
    this.setState({
      modalVisible: false,
    });
  };

  public bindEventAction = (eventType, params) => {
    const legType = params.rowData[LEG_TYPE_FIELD];

    // 每次操作后及时更新，并保证数据一致性
    this.activeRowData = params.rowData;

    if (eventType === LCM_EVENT_TYPE_MAP.EXPIRATION) {
      return this.$expirationModal.show(
        this.activeRowData,
        this.state.tableFormData,
        this.props.currentUser,
        () => this.props.onSearch()
      );
    }

    if (eventType === LCM_EVENT_TYPE_MAP.KNOCK_IN) {
      return this.$barrierIn.show(
        this.activeRowData,
        this.state.tableFormData,
        this.props.currentUser,
        () => this.props.onSearch()
      );
    }

    if (eventType === LCM_EVENT_TYPE_MAP.OBSERVE) {
      return this.$fixingModal.show(
        this.activeRowData,
        this.state.tableFormData,
        this.props.currentUser,
        () => this.props.onSearch()
      );
    }

    if (eventType === LCM_EVENT_TYPE_MAP.EXERCISE) {
      if (legType === LEG_TYPE_MAP.ASIAN_ANNUAL || legType === LEG_TYPE_MAP.ASIAN_UNANNUAL) {
        const convertedData = filterObDays(convertObservetions(params.rowData));
        if (convertedData.some(item => !item.price)) {
          return message.warn('请先完善观察日价格');
        }

        return this.$asianExerciseModal.show(
          this.activeRowData,
          this.state.tableFormData,
          this.props.currentUser,
          () => this.props.onSearch()
        );
      }

      return this.$exerciseModal.show(
        this.activeRowData,
        this.state.tableFormData,
        this.props.currentUser,
        () => this.props.onSearch()
      );
    }

    if (eventType === LCM_EVENT_TYPE_MAP.UNWIND) {
      if (this.activeRowData[LEG_FIELD.LCM_EVENT_TYPE] === LCM_EVENT_TYPE_MAP.UNWIND) {
        return message.warn(
          `${LCM_EVENT_TYPE_ZHCN_MAP.UNWIND}状态下无法继续${LCM_EVENT_TYPE_ZHCN_MAP.UNWIND}`
        );
      }

      this.$unwindModal.show(
        this.activeRowData,
        this.state.tableFormData,
        this.props.currentUser,
        () => this.props.onSearch()
      );
    }

    if (eventType === LCM_EVENT_TYPE_MAP.ROLL) {
      this.$modelButton.click({
        formControls: modalFormControls({
          info: 'expirationDate',
          name: '到期日',
          input: { type: 'date', startDate: params.rowData.expirationDate },
        }),
        extra: {
          ...params,
          eventType,
        },
      });
    }

    if (eventType === LCM_EVENT_TYPE_MAP.SNOW_BALL_EXERCISE) {
      this.$expirationModal.show(
        this.activeRowData,
        this.state.tableFormData,
        this.props.currentUser,
        () => this.props.onSearch()
      );
    }

    if (eventType === LCM_EVENT_TYPE_MAP.KNOCK_OUT) {
      this.$knockOutModal.show(
        this.activeRowData,
        this.state.tableFormData,
        this.props.currentUser,
        () => this.props.onSearch()
      );
    }
  };

  public fetchOverviewTableData = async () => {
    // this.switchLifeLoading();
    const { error, data } = await trdTradeLCMEventList({
      tradeId: this.props.record.tradeId,
    });
    // this.switchLifeLoading();
    if (error) return;
    const result = [...data];
    result.sort((item1, item2) => {
      return moment(item1.createdAt).valueOf() - moment(item2.createdAt).valueOf();
    });
    this.setState({
      lifeTableData: result.map(item => {
        return {
          ...item,
          uuid: uuidv4(),
        };
      }),
    });
  };

  public handlePortfolioVisible = () => {
    this.setState(
      {
        portfolioModalVisible: false,
      },
      () => {
        this.props.onSearch();
      }
    );
  };

  public loadCommon = () => {
    const item = this.props.record;
    if (!this.state.eventTypes[item.positionId]) return;
    return this.state.eventTypes[item.positionId].map(node => {
      return <MenuItem key={node}>{LCM_EVENT_TYPE_ZHCN_MAP[node]}</MenuItem>;
    });
  };

  public onConfirm = params => {
    return trdTradeLCMEventProcess({
      positionId: params.extra.rowData.id,
      tradeId: this.props.record.tradeId,
      eventType: params.extra.eventType,
      userLoginId: this.props.currentUser.userName,
      eventDetail: {
        underlyerPrice: params.formData.underlyerPrice,
        cashFlow: params.formData.cashFlow,
        expirationDate: params.formData.expirationDate
          ? params.formData.expirationDate.format('YYYY-MM-DD')
          : undefined,
      },
    }).then(rsp => {
      if (rsp.error) return;
      setTimeout(() => {
        message.success('展期成功');
        // this.loadData(true);
      }, 100);
      this.setState({
        visible: true,
      });
      return {
        formData: {},
      };
    });
  };

  public render() {
    return (
      <>
        <Dropdown
          overlay={
            <Menu onClick={this.onClick}>
              <MenuItem key="bookEdit">查看合约详情</MenuItem>
              <MenuItem key="searchLifeStyle">查看生命周期事件</MenuItem>
              <SubMenu key="carryListStyle" title={<span>执行生命周期事件</span>}>
                {this.loadCommon()}
              </SubMenu>
              <MenuItem key="portfolio">加入投资组合</MenuItem>
            </Menu>
          }
        >
          <a className="ant-dropdown-link">
            操作
            <Icon type="down" />
          </a>
        </Dropdown>
        <LifeModalTable
          modalVisible={this.state.modalVisible}
          lifeTableData={this.state.lifeTableData}
          handleCancelVisible={this.handleCancelVisible}
        />
        <PortfolioModalTable
          rowData={this.props.record}
          portfolioModalVisible={this.state.portfolioModalVisible}
          handlePortfolioVisible={this.handlePortfolioVisible}
        />
        <UnwindModal ref={node => (this.$unwindModal = node)} />
        <ExerciseModal
          ref={node => {
            this.$exerciseModal = node;
          }}
        />
        <ExpirationModal ref={node => (this.$expirationModal = node)} />
        <KnockOutModal ref={node => (this.$knockOutModal = node)} />
        <FixingModal
          ref={node => {
            this.$fixingModal = node;
          }}
        />
        <AsianExerciseModal
          ref={node => {
            this.$asianExerciseModal = node;
          }}
        />
        <BarrierIn
          ref={node => {
            this.$barrierIn = node;
          }}
        />
        <ModalButton ref={node => (this.$modelButton = node)} onConfirm={this.onConfirm} />
      </>
    );
  }
}

export default connect(state => ({
  currentUser: (state.user as any).currentUser,
}))(Operations);
