/* eslint-disable */
const testCase = '交易管理-交易录入：簿记交易_双鲨_年化';

describe(testCase, () => {
  before(() => {
    cy.fixture('users.json')
      .then(users => {
        const settings = JSON.parse(Cypress.env('settings'));
        window.localStorage.setItem(settings.tokenField, JSON.stringify(users.admin));
      })
      .as('users');
  });

  it(testCase, () => {
    cy.visit('/', { timeout: 10000 });
    cy.get('.ant-menu-submenu-title')
      .contains('交易管理')
      .as('option1');
    cy.get('@option1').click();
    cy.contains('交易录入').click();
    cy.url().should('include', '/trade-management/booking');

    cy.contains('添加期权结构').click();
    cy.contains('双鲨').click();

    // 填充字段
    cy.fixture('doubleSharkFinAnnualBook.json').as('bookData');
    cy.get('@bookData').then(data => {
      const { position, zhPosition } = data;
      // 是否年化
      cy.get('[data-test=table-1] > :nth-child(2)').click({ force: true });
      cy.get('[role=listbox] > :nth-child(1)').click();
      // 买卖方向
      cy.get('[data-test=table-1] > :nth-child(4)').click({ force: true });
      cy.get('[role=listbox] > :nth-child(1)').click();
      // 标的物
      cy.get('[data-test=table-1] > :nth-child(5)').as('标的物');
      cy.get('@标的物')
        .click({ force: true })
        .focused()
        .type(position.underlyerInstrumentId)
        .wait(500)
        .type('{enter}');
      cy.wait(2000);
      // 期初价格
      cy.get('[data-test=table-1] > :nth-child(8)').as('期初价格');
      cy.get('@期初价格')
        .click()
        .focused()
        .clear()
        .type(position.initialSpot)
        .wait(500)
        .type('{enter}');
      cy.get('[data-test=table-1] > :nth-child(8)').should('contain', zhPosition.initialSpot);
      // 参与率
      cy.get('[data-test=table-1] > :nth-child(9)').as('低参与率');
      cy.get('@低参与率')
        .click()
        .focused()
        .type(position.lowParticipationRate);
      cy.get('[data-test=table-1] > :nth-child(10)').as('高参与率');
      cy.get('@高参与率')
        .click()
        .focused()
        .type(position.highParticipationRate);
      // 行权价
      cy.get('[data-test=table-1] > :nth-child(12)').as('低行权价');
      cy.get('@低行权价')
        .click({ force: true })
        .focused()
        .type(position.lowStrike)
        .wait(500)
        .type('{enter}');
      cy.get('[data-test=table-1] > :nth-child(12)').should('contain', zhPosition.lowStrike);

      cy.get('[data-test=table-1] > :nth-child(13)').as('高行权价');
      cy.get('@高行权价')
        .click({ force: true })
        .focused()
        .type(position.highStrike)
        .wait(500)
        .type('{enter}');
      cy.get('[data-test=table-1] > :nth-child(13)').should('contain', zhPosition.highStrike);
      // 期限
      cy.get('[data-test=table-1] > :nth-child(15)').as('期限');
      cy.get('@期限')
        .click()
        .focused()
        .clear()
        .type(Cypress.moment(position.term).format('YYYY-MM-DD'))
        .wait(100)
        .type('{enter}');
      // 起始日
      cy.get('[data-test=table-1] > :nth-child(16)').as('起始日');
      cy.get('@起始日')
        .click()
        .focused()
        .clear()
        .type(Cypress.moment(position.effectiveDate).format('YYYY-MM-DD'))
        .wait(100)
        .type('{enter}');
      // 到期日
      cy.get('[data-test=table-1] > :nth-child(17)').as('到期日');
      cy.get('@到期日')
        .click()
        .focused()
        .clear()
        .type(Cypress.moment(position.expirationDate).format('YYYY-MM-DD'))
        .wait(100)
        .type('{enter}');
      // 结算日
      cy.get('[data-test=table-1] > :nth-child(18)').as('结算日');
      cy.get('@结算日')
        .click()
        .focused()
        .clear()
        .type(Cypress.moment(position.settlementDate).format('YYYY-MM-DD'))
        .wait(100)
        .type('{enter}');
      // 实际期权费
      cy.get('[data-test=table-1] > :nth-child(20)').as('实际期权费');
      cy.get('@实际期权费')
        .click()
        .focused()
        .type(position.premium);
      // 保底收益
      cy.get('[data-test=table-1] > :nth-child(21)').as('保底收益');
      cy.get('@保底收益')
        .click()
        .focused()
        .type(position.minimumPremium);
      // 合约期权费
      cy.get('[data-test=table-1] > :nth-child(22)').as('合约期权费');
      cy.get('@合约期权费')
        .click()
        .focused()
        .type(position.frontPremium);
      // 名义本金类型
      cy.get('[data-test=table-1] > :nth-child(23)').click({ force: true });
      cy.get('[role=listbox] > :nth-child(2)').click();
      // 名义本金
      cy.get('[data-test=table-1] > :nth-child(24)').as('名义本金');
      cy.get('@名义本金')
        .click()
        .focused()
        .type(position.notionalAmount);
      // 敲出补偿
      cy.get('[data-test=table-1] > :nth-child(27)').as('低敲出补偿');
      cy.get('@低敲出补偿')
        .click()
        .focused()
        .type(position.lowRebate);
      cy.get('[data-test=table-1] > :nth-child(28)').as('高敲出补偿');
      cy.get('@高敲出补偿')
        .click()
        .focused()
        .type(position.highRebate);
      // 障碍价
      cy.get('[data-test=table-1] > :nth-child(30)').as('低障碍价');
      cy.get('@低障碍价')
        .click()
        .focused()
        .type(position.lowBarrier);
      cy.get('[data-test=table-1] > :nth-child(31)').as('高障碍价');
      cy.get('@高障碍价')
        .click()
        .focused()
        .type(position.highBarrier);
      // 障碍观察类型
      cy.get('[data-test=table-1] > :nth-child(32)').click();
      cy.get('[role=listbox] > :nth-child(1)').click();

      // 簿记表格填写
      //完成簿记
      cy.get('[data-test=FinishBookkeeping]').as('finishBook');
      cy.get('@finishBook').click();

      //交易簿
      cy.get('[data-test=tradingBook]').as('tradingBook');
      cy.get('@tradingBook')
        .click()
        .focused()
        .type(position.tradingBook)
        .wait(500)
        .type('{enter}');

      const tradingId = `${position.tradingId} ${Cypress.moment().format('YYYY-MM-DD HH:mm:ss')}`;
      //交易编号
      cy.get('[data-test=tradingNumber]').as('tradingId');
      cy.get('@tradingId')
        .click()
        .focused()
        .type(`${tradingId}{enter}`);

      //交易对手  tradingRival
      cy.get('[data-test=tradingRival]').as('tradingRival');
      cy.get('@tradingRival')
        .click()
        .focused()
        .type(position.tradingRival)
        .wait(500)
        .type('{enter}');

      //交易日  tradingDate
      cy.get('[data-test=tradingDate]').as('tradingDate');
      cy.get('@tradingDate')
        .click()
        .focused()
        .clear()
        .type(position.tradingDate)
        .wait(500)
        .type('{enter}');

      //备注  tradingNote
      cy.get('[data-test=tradingNote]').as('tradingNote');
      cy.get('@tradingNote')
        .click()
        .focused()
        .type(position.tradingNote)
        .wait(200)
        .type('{enter}')
        .blur();

      //确定
      cy.get('.ant-modal-footer .ant-btn-primary')
        .click()
        .wait(1000);

      // 检查现金流弹窗
      cy.get('[data-test=table-1] > :nth-child(1)').as('formTradRival');
      cy.get('@formTradRival').should('contain', position.tradingRival);
      cy.get('[data-test=table-1] > :nth-child(2)').should('contain', tradingId);
      // cy.get('[data-test=table-1] > :nth-child(3)').should('contain', book.tradingRival);
      cy.get('[data-test=table-1] > :nth-child(4)').should('contain', position.cashFlow);
      cy.get('[data-test=table-1] > :nth-child(5)').should('contain', -position.cashFlow);
      cy.get('[data-test=table-1] > :nth-child(6)').should('contain', '开仓');
      cy.get('[data-test=table-1] > :nth-child(7)').should('contain', '未处理');
      cy.get('.ant-modal-content [data-test=table-1] > :nth-child(8)').should(
        'contain',
        '资金录入',
      );

      // 检查台账资金录入弹窗
      cy.get('.ant-modal-body [data-test=table-1] a')
        .click()
        .wait(200);
      cy.get('[data-test=data-tradeId] .ant-form-item-children span').as('tradeId');
      cy.get('@tradeId').should('contain', tradingId);

      cy.get('[data-test=data-direction] .ant-form-item-children span').as('direction');
      cy.get('@direction').should('contain', zhPosition.direction);

      cy.get('[data-test=data-lcmEventType] .ant-form-item-children span').as('lcmEventType');
      cy.get('@lcmEventType').should('contain', '开仓');

      cy.get('[data-test=data-cashFlow] .ant-form-item-children span').as('cashFlow');
      cy.get('@cashFlow').should('contain', position.cashFlow);

      cy.get('[data-test=data-premium] .ant-form-item-children span').as('premium');
      cy.get('@premium').should('contain', -position.cashFlow);

      // 检查合约详情
      cy.visit('/', { timeout: 10000 });
      cy.get('.ant-menu-submenu-title')
        .contains('交易管理')
        .as('option1');
      cy.get('@option1').click();
      cy.contains('合约管理').click();
      cy.url().should('include', '/trade-management/contract-manage');
      cy.wait(2000);
      cy.get('[data-test=table-1]:nth-of-type(1)');

      // 检查合约详情
      cy.get('.ant-menu-submenu-title')
        .contains('交易管理')
        .as('option1');
      cy.get('@option1').click();
      cy.contains('合约管理').click({ force: true });
      cy.url().should('include', '/trade-management/contract-manage');
      cy.wait(2000);
      cy.get('[data-test=contract-tradeId]').as('contractTradeId');
      cy.get('@contractTradeId')
        .click()
        .focused()
        .type(tradingId)
        .wait(1000)
        .type('{enter}');
      cy.get('.ant-form .ant-btn-primary').click({ force: true });
      cy.wait(1000);
      cy.get('.ant-table-fixed-right [data-test=details]').click();
      cy.url().should('include', '/trade-management/book-edit');
      // 详情字段检查

      //结构类型
      cy.get('[data-test=table-1] > :nth-child(1)').should('contain', zhPosition.LEG_META);
      //是否年化
      cy.get('[data-test=table-1] > :nth-child(2)').should('contain', zhPosition.annualized);
      //年度计息天数
      cy.get('[data-test=table-1] > :nth-child(3)').should('contain', zhPosition.daysInYear);
      // 买卖方向
      cy.get('[data-test=table-1] > :nth-child(4)').should('contain', zhPosition.direction);
      // 标的物
      cy.get('[data-test=table-1] > :nth-child(5)').should(
        'contain',
        zhPosition.underlyerInstrumentId,
      );
      // 合约乘数
      cy.get('[data-test=table-1] > :nth-child(6)').should(
        'contain',
        zhPosition.underlyerMultiplier,
      );
      // 期初价格
      cy.get('[data-test=table-1] > :nth-child(8)').should('contain', zhPosition.initialSpot);
      // 参与率
      cy.get('[data-test=table-1] > :nth-child(9)').should(
        'contain',
        zhPosition.lowParticipationRate,
      );
      cy.get('[data-test=table-1] > :nth-child(10)').should(
        'contain',
        zhPosition.highParticipationRate,
      );
      //  行权类型
      cy.get('[data-test=table-1] > :nth-child(11)').should('contain', zhPosition.strikeTpye);
      // 行权价
      cy.get('[data-test=table-1] > :nth-child(12)').should('contain', zhPosition.lowStrike);
      cy.get('[data-test=table-1] > :nth-child(13)').should('contain', zhPosition.highStrike);
      // 期限
      cy.get('[data-test=table-1] > :nth-child(15)').should('contain', zhPosition.term);
      // 起始日
      cy.get('[data-test=table-1] > :nth-child(16)').should('contain', zhPosition.effectiveDate);
      cy.get('[data-test=table-1] > :nth-child(17)').should('contain', zhPosition.expirationDate);
      cy.get('[data-test=table-1] > :nth-child(18)').should('contain', zhPosition.settlementDate);
      // 权利金类型
      cy.get('[data-test=table-1] > :nth-child(19)').should('contain', zhPosition.premiumType);
      // 实际期权费
      cy.get('[data-test=table-1] > :nth-child(20)').should('contain', zhPosition.premium);
      // 保底收益
      cy.get('[data-test=table-1] > :nth-child(21)').should('contain', zhPosition.minimumPremium);
      // 合约期权费
      cy.get('[data-test=table-1] > :nth-child(22)').should('contain', zhPosition.frontPremium);
      // 名义本金类型
      cy.get('[data-test=table-1] > :nth-child(23)').should(
        'contain',
        zhPosition.notionalAmountType,
      );
      // 名义本金
      cy.get('[data-test=table-1] > :nth-child(24)').should('contain', zhPosition.notionalAmount);
      // 交易数量
      cy.get('[data-test=table-1] > :nth-child(25)').should('contain', zhPosition.tradeNumber);
      // 补偿支付方式
      cy.get('[data-test=table-1] > :nth-child(26)').should('contain', zhPosition.rebateType);
      // 敲出补偿
      cy.get('[data-test=table-1] > :nth-child(27)').should('contain', zhPosition.lowRebate);
      cy.get('[data-test=table-1] > :nth-child(28)').should('contain', zhPosition.highRebate);
      // 障碍价类型
      cy.get('[data-test=table-1] > :nth-child(29)').should('contain', zhPosition.barrierType);
      // 障碍价
      cy.get('[data-test=table-1] > :nth-child(30)').should('contain', zhPosition.lowBarrier);
      cy.get('[data-test=table-1] > :nth-child(31)').should('contain', zhPosition.highBarrier);
      // 障碍观察类型
      cy.get('[data-test=table-1] > :nth-child(32)').should('contain', zhPosition.observationType);
    });
  });
});
