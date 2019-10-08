/* eslint-disable */
// http://confluence.tongyu.tech:8090/pages/resumedraft.action?draftId=27590725&draftShareId=3f6f159e-6e18-4b16-8b45-1f64cf579f3d
// / <reference types="Cypress" />
const testCase = '交易管理-交易录入:簿记交易成功_凤凰式autocall_年化（OTMS-6514）';
const timeStamp = new Date().getTime();
describe(testCase, () => {
  beforeEach(() => {
    debugger;
    cy.fixture('users.json')
      .then(users => {
        const settings = JSON.parse(Cypress.env('settings'));
        window.localStorage.setItem(settings.tokenField, JSON.stringify(users.admin));
      })
      .as('users');
  });

  it('交易录入：簿记交易', () => {
    //进入交易录入界面
    cy.visit('/', { timeout: 10000 });
    cy.get('.ant-menu-submenu-title')
      .contains('交易管理')
      .as('option1');
    cy.get('@option1').click();
    cy.contains('交易录入').click();
    cy.url().should('include', '/trade-management/booking');

    cy.contains('添加期权结构').click();
    //添加期权结构
    cy.fixture('modelPhoenix.json').as('modelPhoenix');
    cy.get('@modelPhoenix').then(data => {
      const { position, book } = data;
      cy.contains(position.struType).click();
      //买卖方向
      cy.get('[data-test=table-1] > :nth-child(3)').click({ force: true });
      cy.get('.ant-select-dropdown-menu > :nth-child(1)').as('optionType');
      cy.get('@optionType').click({ force: true });

      //标的物
      cy.get('[data-test=table-1] > :nth-child(4)').as('marker');
      cy.get('@marker')
        .click({ force: true })
        .focused()
        .type(position.marker)
        .wait(1000)
        .type('{enter}');

      //期初价格
      cy.get('[data-test=table-1] > :nth-child(7)').as('initialPrice');
      cy.get('@initialPrice')
        .click({ force: true })
        .focused()
        .clear()
        .type(position.initialPrice)
        .wait(1000)
        .type('{enter}');

      //起始日
      cy.get('[data-test=table-1] > :nth-child(11)').as('effectiveDate');
      cy.get('@effectiveDate')
        .click()
        .focused()
        .clear()
        .type(position.effectiveDate)
        .wait(500)
        .type('{enter}');

      //实际权期费
      cy.get('[data-test=table-1] > :nth-child(15)').as('premium');
      cy.get('@premium')
        .click()
        .focused()
        .type(position.premium)
        .wait(200)
        .type('{enter}');

      //名义本金
      cy.get('[data-test=table-1] > :nth-child(19)').as('principal');
      cy.get('@principal')
        .click()
        .focused()
        .type(position.principal)
        .wait(500)
        .type('{enter}');

      //交易数量
      cy.get('[data-test=table-1] > :nth-child(20)').as('tradCapacity');
      cy.get('@tradCapacity').should('contain', position.tradCapacity);

      //敲出方向
      cy.get('[data-test=table-1] > :nth-child(21)').click();
      cy.get('.ant-select-dropdown-menu > :nth-child(1)').as('direction');
      cy.get('@direction').click();

      //敲出障碍价
      cy.get('[data-test=table-1] > :nth-child(23)').as('barrier');
      cy.get('@barrier')
        .click()
        .focused()
        .type(position.barrier)
        .wait(500)
        .type('{enter}');

      //coupon障碍
      cy.get('[data-test=table-1] > :nth-child(24)').as('coupon');
      cy.get('@coupon')
        .click()
        .focused()
        .type(position.coupon)
        .wait(500)
        .type('{enter}');

      //收益/coupon(%)
      cy.get('[data-test=table-1] > :nth-child(25)').as('prifitCpoupon');
      cy.get('@prifitCpoupon')
        .click()
        .focused()
        .type(position.prifitCpoupon)
        .wait(500)
        .type('{enter}');

      //敲出/coupon观察日
      cy.get('[data-test=table-1] > :nth-child(27)').as('out/couponWatchDate');
      cy.get('@out/couponWatchDate').click();
      cy.contains('批量生成观察日').click();
      cy.get('.ant-modal-footer > .ant-btn-primary').click();

      //敲入障碍价
      cy.get('[data-test=table-1] > :nth-child(29)').as('enterBarrier');
      cy.get('@enterBarrier')
        .click()
        .focused()
        .type(position.enterBarrier)
        .wait(500)
        .type('{enter}');

      //敲入期权类型
      cy.get('[data-test=table-1] > :nth-child(30)').click();
      cy.get('.ant-select-dropdown-menu > :nth-child(1)').as('enterOptionType');
      cy.get('@enterOptionType').click();

      //敲入期权行权价
      cy.get('[data-test=table-1] > :nth-child(32)').as('enterOptionStrike');
      cy.get('@enterOptionStrike')
        .click()
        .focused()
        .type(position.enterOptionStrike)
        .wait(500)
        .type('{enter}');

      //敲入观察频率
      cy.get('[data-test=table-1] > :nth-child(33)').click();
      cy.get('.ant-select-dropdown-menu > :nth-child(1)').as('enterObservationStep');
      cy.get('@enterObservationStep').click();

      //完成簿记
      cy.get('[data-test=FinishBookkeeping]').as('finishBook');
      cy.get('@finishBook').click();

      //交易簿  tradingBook
      cy.get('[data-test=tradingBook]').as('tradingBook');
      cy.get('@tradingBook')
        .click()
        .focused()
        .type(book.tradingBook)
        .wait(500)
        .type('{enter}');

      //交易编号
      cy.get('[data-test=tradingNumber]').as('tradingId');
      cy.get('@tradingId')
        .click({ force: true })
        .focused()
        .type(book.tradingId + timeStamp)
        .wait(200)
        .type('{enter}');

      //交易对手  tradingRival
      cy.get('[data-test=tradingRival]').as('tradingRival');
      cy.get('@tradingRival')
        .click()
        .focused()
        .type(book.tradingRival)
        .wait(500)
        .type('{enter}');

      //交易日  tradingDate
      cy.get('[data-test=tradingDate]').as('tradingDate');
      cy.get('@tradingDate')
        .click()
        .focused()
        .clear()
        .type(book.tradingDate)
        .wait(500)
        .type('{enter}');

      //备注  tradingNote
      cy.get('[data-test=tradingNote]').as('tradingNote');
      cy.get('@tradingNote')
        .click()
        .focused()
        .type(book.tradingNote)
        .wait(200)
        .type('{enter}')
        .blur();

      //确定  暂时没找到
      cy.get('.ant-modal-footer > div > .ant-btn-primary')
        .click()
        .wait(1000);

      //现金流字段检测
      cy.get('[data-test=table-1] > :nth-child(1)').as('formTradRival');
      cy.get('@formTradRival').should('contain', book.tradingRival);
      cy.get('[data-test=table-1] > :nth-child(2)').should('contain', book.tradingId + timeStamp);
      cy.get('[data-test=table-1] > :nth-child(3)').should('contain', book.tradingRival);
      cy.get('[data-test=table-1] > :nth-child(4)').should('contain', book.cashFlow);
      cy.get('[data-test=table-1] > :nth-child(5)').should('have.contain', book.premium);
      cy.get('[data-test=table-1] > :nth-child(6)').should('contain', book.lcmEventType);
      cy.get('[data-test=table-1] > :nth-child(7)').should('contain', '未处理');
      cy.get('[data-test=table-1] > :nth-child(8)').as('inputFund');
      cy.get('@inputFund').should('contain', '资金录入');
      cy.get('@inputFund').click();

      //台账资金录入界面字段检测

      //交易对手
      cy.get(
        '[data-test=data-legalName] > .ant-row > .ant-col-16 > .ant-form-item-control > .ant-form-item-children > span',
      ).as('legalName');
      cy.get('@legalName').should('contain', book.tradingRival);

      //交易编号
      cy.get(
        '[data-test=data-tradeId] > .ant-row > .ant-col-16 > .ant-form-item-control > .ant-form-item-children > span',
      ).as('tradeId');
      cy.get('@tradeId').should('contain', book.tradingId + timeStamp);

      //方向
      cy.get(
        '[data-test=data-direction] > .ant-row > .ant-col-16 > .ant-form-item-control > .ant-form-item-children > span',
      ).as('direction');
      cy.get('@direction').should('contain', position.isBusiness);

      //生命周期事件
      cy.get(
        '[data-test=data-lcmEventType] > .ant-row > .ant-col-16 > .ant-form-item-control > .ant-form-item-children > span',
      ).as('lcmEventType');
      cy.get('@lcmEventType').should('contain', book.lcmEventType);

      //现金流
      cy.get(
        '[data-test=data-cashFlow] > .ant-row > .ant-col-16 > .ant-form-item-control > .ant-form-item-children > span',
      ).as('cashFlow');
      cy.get('@cashFlow').should('contain', book.cashFlow);

      //期权费
      cy.get(
        '[data-test=data-premium] > .ant-row > .ant-col-16 > .ant-form-item-control > .ant-form-item-children > span',
      ).as('premium');
      cy.get('@premium').should('contain', book.premium);

      //资金事件类型
      cy.get(
        '[data-test=data-event] > .ant-select-selection__rendered > .ant-select-selection-selected-value',
      ).as('prickEvent');
      cy.get('@prickEvent').should('contain', '权利金变更');
      cy.get('@prickEvent').click();
      cy.get('.ant-select-dropdown-menu > :nth-child(3)')
        .last()
        .as('events');
      cy.get('@events').click();
    });
  });

  it('合约管理：查看详情，检测字段', () => {
    cy.visit('/');
    cy.get('.ant-menu-submenu-title')
      .contains('交易管理')
      .as('option1');
    cy.get('@option1').click();
    cy.contains('合约管理').click();
    cy.url().should('include', '/trade-management/contract-manage');
    //数据对比
    cy.fixture('modelPhoenix.json').as('modelPhoenix');
    cy.get('@modelPhoenix').then(data => {
      const { date, book } = data;

      //对交易编号进行搜索
      cy.get('[data-test=contract-tradeId]').as('contractTradeId');
      cy.get('@contractTradeId')
        .click()
        .focused()
        .type(book.tradingId + timeStamp)
        .wait(500)
        .type('{enter}');
      cy.get('.ant-form .ant-btn-primary').click();

      //进入最新创建的交易
      cy.get(
        `.ant-table-body-inner > .ant-table-fixed > .ant-table-tbody > [data-row-key="${book.tradingId}${timeStamp}_0"] > .tongyu-table-cell > [data-test=details]`,
      ).as('seeDetails');
      cy.get('@seeDetails').click();
      //结构类型struType
      // each对dom结构进行迭代
      cy.get('[data-test=table-1] > *').each(($el, index, $list) => {
        if (index < 35) {
          cy.wrap($el).should('contain', date[index]);
        }
      });
    });
  });
});
