/* eslint-disable */
const testCase = '交易管理-交易录入：簿记交易_远期_年化';

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
    cy.contains('远期').click();

    // 填充字段
    cy.fixture('forwardUnannualBook.json').as('bookData');
    cy.get('@bookData').then(data => {
      const { position } = data;
      // 买卖方向
      cy.get('[data-test=table-1] > :nth-child(3)').click({ force: true });
      cy.get('[role=listbox] > li').then($li => {
        $li.last().click();
      });
      // 标的物
      cy.get('[data-test=table-1] > :nth-child(4)')
        .click({ force: true })
        .focused()
        .type(position.underlyerInstrumentId)
        .wait(500)
        .type('{enter}');
      cy.wait(1500);
      // 期初价格
      cy.get('[data-test=table-1] > :nth-child(7)')
        .click({ force: true })
        .focused()
        .type(position.initialSpot);
      // 行权价
      cy.get('[data-test=table-1] > :nth-child(9)')
        .click({ force: true })
        .focused()
        .type(position.strike);
      // 起始日
      cy.get('[data-test=table-1] > :nth-child(11)')
        .click({ force: true })
        .focused()
        .type(Cypress.moment(position.effectiveDate).format('YYYY-MM-DD'))
        .wait(100)
        .type('{enter}');
      // 实际期权费
      cy.get('[data-test=table-1] > :nth-child(15)')
        .click({ force: true })
        .focused()
        .type(position.premium);
      // 名义本金
      cy.get('[data-test=table-1] > :nth-child(17)')
        .click({ force: true })
        .focused()
        .type(position.notionalAmount);

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

      //确定
      cy.get('.ant-modal-footer .ant-btn-primary')
        .click()
        .wait(1000);

      // 检查现金流弹窗
      cy.get('.ant-modal-content [data-test=table-1] > :nth-child(1)').should(
        'contain',
        position.tradingRival,
      );
      cy.get('.ant-modal-content [data-test=table-1] > :nth-child(2)').should(
        'contain',
        position.tradingId,
      );
      // 不明确年度计息天数
      // cy.get('.ant-modal-content [data-test=table-1] > :nth-child(4)').should(
      //   'contain',
      //   position.notionalAmount*position.premium/100/1,
      // );
      cy.get('.ant-modal-content [data-test=table-1] > :nth-child(6)').should('contain', '开仓');
      cy.get('.ant-modal-content [data-test=table-1] > :nth-child(7)').should('contain', '未处理');
      cy.get('.ant-modal-content [data-test=table-1] > :nth-child(8)').should(
        'contain',
        '资金录入',
      );
    });
  });
});
