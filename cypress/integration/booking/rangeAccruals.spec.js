/* eslint-disable */
const testCase = '交易管理-交易录入：字段检查_区间累积';

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
    cy.contains('区间累积').click();

    // 字段检查
    cy.fixture('rangeAccrualsBook.json').as('bookData');
    cy.get('@bookData').then(data => {
      const { fields, position } = data;
      // fields.forEach((current, index) => {
      //   cy.get(`.ant-table-thead > tr > :nth-child(${index + 1})`).should('contain', current);
      // })

      // 字段内容检查
      //结构类型
      cy.get('[data-test=table-1] > :nth-child(1)').should('contain', position.LEG_META);
      //是否年化
      cy.get('[data-test=table-1] > :nth-child(2)').should('contain', position.annualized);
      cy.get('[data-test=table-1] > :nth-child(2)').click({ force: true });
      cy.get('[role=listbox] > li').then($li => {
        expect($li).to.have.length(2);
        expect($li.first()).to.contain('年化');
        expect($li.last()).to.contain('年化');
      });
      // 年度计息天数
      cy.get('[data-test=table-1] > :nth-child(3)').should('contain', position.daysInYear);
      // 买卖方向
      cy.get('[data-test=table-1] > :nth-child(4)').should('contain', position.direction);
      cy.get('[data-test=table-1] > :nth-child(4)').click({ force: true });
      cy.get('[role=listbox] > li').then($li => {
        expect($li).to.have.length(2);
        expect($li.first()).to.contain('买');
        expect($li.last()).to.contain('卖');
      });
      // 标的物
      cy.get('[data-test=table-1] > :nth-child(5)').should(
        'contain',
        position.underlyerInstrumentId,
      );
      cy.get('[data-test=table-1] > :nth-child(5)').click({ force: true });
      cy.wait(500);
      cy.get('[role=listbox] > li').then($li => {
        if ($li.length < 1) {
          throw new Error('Did not find 1 element');
        }
        $li.first().click();
      });
      // cy.get('[data-test=table-1] > :nth-child(5)').type('A1909.DCE');

      // 参与率
      cy.get('[data-test=table-1] > :nth-child(9)').should('contain', position.participationRate);
      // 结算方式
      cy.get('[data-test=table-1] > :nth-child(10)').should('contain', position.specifiedPrice);
      cy.get('[data-test=table-1] > :nth-child(10)').click({ force: true });
      cy.get('[role=listbox] > li').then($li => {
        expect($li).to.have.length(2);
        expect($li.first()).to.contain('收盘价');
        expect($li.last()).to.contain('平均价');
        $li.first().click();
      });
      // 期限
      cy.get('[data-test=table-1] > :nth-child(11)').should('contain', position.term + '天');
      // 起始日
      cy.get('[data-test=table-1] > :nth-child(12)').should(
        'contain',
        Cypress.moment().format('YYYY-MM-DD'),
      );
      // 到期日
      cy.get('[data-test=table-1] > :nth-child(13)').should(
        'contain',
        Cypress.moment()
          .subtract(-position.term, 'days')
          .format('YYYY-MM-DD'),
      );
      // 结算日
      cy.get('[data-test=table-1] > :nth-child(14)').should(
        'contain',
        Cypress.moment()
          .subtract(-position.term, 'days')
          .format('YYYY-MM-DD'),
      );
      // 权利金类型
      cy.get('[data-test=table-1] > :nth-child(15)').should('contain', position.premiumType);
      cy.get('[data-test=table-1] > :nth-child(15)').click({ force: true });
      cy.get('[role=listbox] > li').then($li => {
        expect($li).to.have.length(2);
        expect($li.first()).to.contain('百分比');
        expect($li.last()).to.contain('人民币');
        $li.first().click();
      });
      // 实际期权费
      cy.get('[data-test=table-1] > :nth-child(16)').should('contain', position.premium);
      // 保底收益
      cy.get('[data-test=table-1] > :nth-child(17)').should('contain', position.minimumPremium);
      // 合约期权费
      cy.get('[data-test=table-1] > :nth-child(18)').should('contain', position.frontPremium);
      // 区间收益类型
      cy.get('[data-test=table-1] > :nth-child(19)').should('contain', position.EARNINGS_TYPE);
      // 区间收益
      cy.get('[data-test=table-1] > :nth-child(20)').should('contain', position.EARNINGS);
      // 名义本金类型
      cy.get('[data-test=table-1] > :nth-child(21)').should('contain', position.notionalAmountType);
      cy.get('[data-test=table-1] > :nth-child(21)').click({ force: true });
      cy.get('[role=listbox] > li').then($li => {
        expect($li).to.have.length(2);
        expect($li.first()).to.contain('手数');
        expect($li.last()).to.contain('人民币');
        $li.first().click();
      });
      // 名义本金
      cy.get('[data-test=table-1] > :nth-child(22)').should('contain', position.notionalAmount);
      // 障碍价类型
      cy.get('[data-test=table-1] > :nth-child(24)').should('contain', position.barrierType);
      cy.get('[data-test=table-1] > :nth-child(24)').click({ force: true });
      cy.get('[role=listbox] > li').then($li => {
        expect($li).to.have.length(2);
        expect($li.first()).to.contain('人民币');
        expect($li.last()).to.contain('百分比');
        $li.first().click();
      });
      // 观察频率
      cy.get('[data-test=table-1] > :nth-child(27)').should('contain', position.observationStep);
      cy.get('[data-test=table-1] > :nth-child(27)').click({ force: true });
      cy.get('[role=listbox] > li').then($li => {
        expect($li).to.have.length(6);
        expect($li.first()).to.contain('每交易日');
        expect($li.first().next()).to.contain('每周');
        expect(
          $li
            .first()
            .next()
            .next(),
        ).to.contain('每月');
        expect(
          $li
            .first()
            .next()
            .next()
            .next(),
        ).to.contain('每季度');
        expect(
          $li
            .first()
            .next()
            .next()
            .next()
            .next(),
        ).to.contain('每半年');
        expect($li.last()).to.contain('每年');
        $li.first().click();
      });
      // 观察日
      cy.get('[data-test=table-1] > :nth-child(28) button').click();
      cy.wait(100);
      cy.contains('观察日编辑');
    });
  });
});
