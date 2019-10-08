/* eslint-disable */
// http://confluence.tongyu.tech:8090/pages/resumedraft.action?draftId=27590725&draftShareId=3f6f159e-6e18-4b16-8b45-1f64cf579f3d
// / <reference types="Cypress" />
const testCase = '交易管理-交易录入:添加期权结构(亚式)&完成簿记（OTMS-6409）';
describe(testCase, () => {
  before(() => {
    debugger;
    cy.fixture('users.json')
      .then(users => {
        const settings = JSON.parse(Cypress.env('settings'));
        window.localStorage.setItem(settings.tokenField, JSON.stringify(users.admin));
      })
      .as('users');
  });

  it(testCase, () => {
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
    cy.fixture('modelAsian.json').as('modelAsian');
    cy.get('@modelAsian').then(data => {
      const { position } = data;
      cy.contains(position.struType).click();

      //买卖方向
      cy.get('[data-test=table-1] > :nth-child(4)').click();
      cy.get('.ant-select-dropdown-menu-item-active').as('optionType');
      cy.get('@optionType').click();

      //类型
      cy.get('[data-test=table-1] > :nth-child(5)').click();
      cy.get('.ant-select-dropdown-menu-item-active').as('type');
      cy.get('@type').click();

      //标的物
      cy.get('[data-test=table-1] > :nth-child(6)').as('marker');
      cy.get('@marker')
        .click()
        .focused()
        .type(position.marker)
        .wait(1000)
        .type('{enter}');

      //实际权期费
      cy.get('[data-test=table-1] > :nth-child(19)').as('premium');
      cy.get('@premium')
        .click()
        .focused()
        .type(`${position.premium}{enter}`);

      //保底收益
      cy.get('[data-test=table-1] > :nth-child(20)').as('minipremium');
      cy.get('@minipremium')
        .click()
        .focused()
        .type(`${position.minipremium}{enter}`);

      //名义本金
      cy.get('[data-test=table-1] > :nth-child(23)').as('principal');
      cy.get('@principal')
        .click()
        .focused()
        .type(position.principal)
        .wait(500)
        .type('{enter}');
      //观察日
      cy.get('[data-test=table-1] > :nth-child(26)').as('watch');
      cy.get('@watch').click();
      cy.get('.ant-calendar-picker-input').as('watchDate');
      cy.get('@watchDate')
        .click()
        .focused()
        .clear()
        .type(position.watchDate)
        .wait(500)
        .type('{enter}');

      cy.get('.ant-btn-group > .ant-btn').click();
      cy.get('.ant-modal-footer > .ant-btn-primary').click();
    });

    //完成簿记
    cy.fixture('bookModal.json').as('bookModal');
    cy.get('@bookModal').then(data => {
      const { position } = data;
      //完成簿记 FinishBookkeeping
      cy.get('[data-test=FinishBookkeeping]').as('finishBook');
      cy.get('@finishBook').click();

      //交易簿  tradingBook
      cy.get('[data-test=tradingBook]').as('tradingBook');
      cy.get('@tradingBook')
        .click()
        .focused()
        .type(position.tradingBook)
        .wait(500)
        .type('{enter}');

      //交易编号
      cy.get('[data-test=tradingNumber]').as('tradingId');
      cy.get('@tradingId')
        .click()
        .focused()
        .type(`${position.tradingId}{enter}`);

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

      //确定  暂时没找到
      cy.get('.ant-modal-footer > div > .ant-btn-primary')
        .click()
        .wait(1000);
    });
  });
});
