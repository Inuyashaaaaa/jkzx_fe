/* eslint-disable */
const testCase = '交易管理-交易录入：簿记交易_雪球式AutoCall_年化';

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
    cy.contains('雪球式AutoCall').click();

    // 填充字段
    cy.fixture('autocallAnnualBook.json').as('bookData');
    cy.get('@bookData').then(data => {
      const { position, zhPosition } = data;
      // 买卖方向
      cy.get('[data-test=table-1] > :nth-child(3)').click({ force: true });
      cy.get('[role=listbox] > .ant-select-dropdown-menu-item-active').click();

      // 标的物
      cy.get('[data-test=table-1] > :nth-child(4)')
        .click({ force: true })
        .focused()
        .type(position.underlyerInstrumentId)
        .wait(500)
        .type('{enter}');
      cy.wait(2000);
      // 期初价格
      cy.get('[data-test=table-1] > :nth-child(7)')
        .click()
        .focused()
        .clear()
        .type(position.initialSpot)
        .wait(500)
        .type('{enter}');
      cy.get('[data-test=table-1] > :nth-child(7)').should('contain', zhPosition.initialSpot);
      // 参与率
      cy.get('[data-test=table-1] > :nth-child(8)')
        .click()
        .focused()
        .type(position.participationRate);
      // 期限
      cy.get('[data-test=table-1] > :nth-child(10)')
        .click()
        .focused()
        .type(position.term);
      // 起始日
      cy.get('[data-test=table-1] > :nth-child(11)')
        .click()
        .focused()
        .clear()
        .type(Cypress.moment(position.effectiveDate).format('YYYY-MM-DD'))
        .wait(100)
        .type('{enter}');
      // 实际期权费
      cy.get('[data-test=table-1] > :nth-child(15)')
        .click()
        .focused()
        .type(position.premium);
      // 合约期权费
      cy.get('[data-test=table-1] > :nth-child(17)')
        .click()
        .focused()
        .type(position.frontPremium);
      // 名义本金
      cy.get('[data-test=table-1] > :nth-child(19)')
        .click()
        .focused()
        .type(position.notionalAmount);
      // 敲出方向
      cy.get('[data-test=table-1] > :nth-child(21)').click();
      cy.get('[role=listbox]  :nth-child(1)').click();
      // 敲出障碍价
      cy.get('[data-test=table-1] > :nth-child(23)')
        .click()
        .focused()
        .type(position.upBarrier);
      // 逐步调整步长(%)
      cy.get('[data-test=table-1] > :nth-child(24)')
        .click()
        .focused()
        .type(position.step);
      // 收益/coupon(%)
      cy.get('[data-test=table-1] > :nth-child(25)')
        .click()
        .focused()
        .type(position.couponPayment);
      //到期未敲出固定收益
      cy.get('[data-test=table-1] > :nth-child(27)')
        .click()
        .focused()
        .type(position.fixedPayment);
      // 观察日
      cy.get('.ant-form-item-children > .ant-row-flex > .ant-btn')
        .click()
        .wait(200);
      cy.get('.ant-modal-body .ant-btn-primary')
        .last()
        .click()
        .wait(200);
      cy.get('.ant-modal-footer .ant-btn-primary').click();

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
      cy.get('[data-test=table-1] > :nth-child(4)').should('contain', '2054.79');
      cy.get('[data-test=table-1] > :nth-child(5)').should('contain', '-2054.79');
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
      cy.get('@cashFlow').should('contain', '2054.79');

      cy.get('[data-test=data-premium] .ant-form-item-children span').as('premium');
      cy.get('@premium').should('contain', '-2054.79');

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
      cy.contains('合约管理').click();
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
      // 买卖方向
      cy.get('[data-test=table-1] > :nth-child(3)').should('contain', zhPosition.direction);
      // 标的物
      cy.get('[data-test=table-1] > :nth-child(4)').should(
        'contain',
        zhPosition.underlyerInstrumentId,
      );
      // 期初价格
      cy.get('[data-test=table-1] > :nth-child(7)').should('contain', zhPosition.initialSpot);
      // 参与率
      cy.get('[data-test=table-1] > :nth-child(8)').should('contain', zhPosition.participationRate);
      // 期限
      cy.get('[data-test=table-1] > :nth-child(10)').should('contain', zhPosition.term);
      // 起始日
      cy.get('[data-test=table-1] > :nth-child(11)').should('contain', zhPosition.effectiveDate);
      cy.get('[data-test=table-1] > :nth-child(12)').should(
        'contain',
        Cypress.moment(position.effectiveDate)
          .subtract(-position.term, 'days')
          .format('YYYY-MM-DD'),
      );
      cy.get('[data-test=table-1] > :nth-child(13)').should(
        'contain',
        Cypress.moment(position.effectiveDate)
          .subtract(-position.term, 'days')
          .format('YYYY-MM-DD'),
      );
      // 实际期权费
      cy.get('[data-test=table-1] > :nth-child(15)').should('contain', zhPosition.premium);
      // 合约期权费
      cy.get('[data-test=table-1] > :nth-child(17)').should('contain', zhPosition.frontPremium);
      // 名义本金
      cy.get('[data-test=table-1] > :nth-child(19)').should('contain', zhPosition.notionalAmount);
      // 敲出方向
      cy.get('[data-test=table-1] > :nth-child(21)').should('contain', zhPosition.knockDirection);
      // 敲出障碍价
      cy.get('[data-test=table-1] > :nth-child(23)').should('contain', zhPosition.upBarrier);
      // 逐步调整步长(%)
      cy.get('[data-test=table-1] > :nth-child(24)').should('contain', zhPosition.step);
      // 收益/coupon(%)
      cy.get('[data-test=table-1] > :nth-child(25)').should('contain', zhPosition.couponPayment);
      //到期未敲出固定收益
      cy.get('[data-test=table-1] > :nth-child(27)').should('contain', zhPosition.fixedPayment);
      // 观察频率
      cy.get('[data-test=table-1] > :nth-child(30)').should(
        'contain',
        zhPosition.knockOutObservationStep,
      );
    });
  });
});
