/* eslint-disable */
const testCase = '交易管理-交易录入：簿记交易_单鲨_年化';

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
    cy.contains('单鲨').click();

    // 填充字段
    cy.fixture('sharkAnnualBook.json').as('bookData');
    cy.get('@bookData').then(data => {
      const { position, zhPosition } = data;
      // 买卖方向
      cy.get('[data-test=table-1] > :nth-child(4)').click({ force: true });
      cy.get('[role=listbox] > :nth-child(1)').click();
      // 标的物
      cy.get('[data-test=table-1] > :nth-child(6)').as('标的物');
      cy.get('@标的物')
        .click({ force: true })
        .focused()
        .type(position.underlyerInstrumentId)
        .wait(500)
        .type('{enter}');
      cy.wait(2000);
      // 期初价格
      cy.get('[data-test=table-1] > :nth-child(9)').as('期初价格');
      cy.get('@期初价格')
        .click()
        .focused()
        .clear()
        .type(position.initialSpot)
        .wait(500)
        .type('{enter}');
      cy.get('[data-test=table-1] > :nth-child(9)').should('contain', zhPosition.initialSpot);
      // 参与率
      cy.get('[data-test=table-1] > :nth-child(10)').as('参与率');
      cy.get('@参与率')
        .click()
        .focused()
        .type(position.participationRate);
      // 行权价
      cy.get('[data-test=table-1] > :nth-child(12)').as('行权价');
      cy.get('@行权价')
        .click({ force: true })
        .focused()
        .type(position.strike)
        .wait(500)
        .type('{enter}');
      // 起始日
      cy.get('[data-test=table-1] > :nth-child(15)').as('起始日');
      cy.get('@起始日')
        .click()
        .focused()
        .clear()
        .type(Cypress.moment(position.effectiveDate).format('YYYY-MM-DD'))
        .wait(100)
        .type('{enter}');
      // 实际期权费
      cy.get('[data-test=table-1] > :nth-child(19)').as('实际期权费');
      cy.get('@实际期权费')
        .click()
        .focused()
        .type(position.premium);
      // 保底收益
      cy.get('[data-test=table-1] > :nth-child(20)').as('保底收益');
      cy.get('@保底收益')
        .click()
        .focused()
        .clear()
        .type(position.minimumPremium);
      // 合约期权费
      cy.get('[data-test=table-1] > :nth-child(21)').as('合约期权费');
      cy.get('@合约期权费')
        .click()
        .focused()
        .type(position.frontPremium);
      // 名义本金
      cy.get('[data-test=table-1] > :nth-child(23)').as('名义本金');
      cy.get('@名义本金')
        .click()
        .focused()
        .type(position.notionalAmount);
      // 敲出补偿
      cy.get('[data-test=table-1] > :nth-child(27)').as('敲出补偿');
      cy.get('@敲出补偿')
        .click()
        .focused()
        .type(position.upBarrier);
      // 障碍价
      cy.get('[data-test=table-1] > :nth-child(30)').as('障碍价');
      cy.get('@障碍价')
        .click()
        .focused()
        .type(position.barrier);
      // 障碍观察类型
      cy.get('[data-test=table-1] > :nth-child(31)').click();
      cy.get('[role=listbox] > :nth-child(2)').click();
      // 观察日
      cy.get('.ant-form-item-children > .ant-row-flex > .ant-btn')
        .click()
        .wait(200);
      cy.get('.ant-modal-body .ant-btn-primary')
        .last()
        .click()
        .wait(200);
      cy.get('.ant-modal-footer .ant-btn-primary').click();
      // 等效障碍价
      cy.get('[data-test=table-1] > :nth-child(34)').as('等效障碍价');
      cy.get('@等效障碍价')
        .click()
        .focused()
        .type(position.barrierShift);

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
        // .type('单鲨0721001 2019-07-26 14:20:57')
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
      // 类型
      cy.get('[data-test=table-1] > :nth-child(5)').then($div => {
        expect($div).to.have.text(zhPosition.type);
      });
      // 标的物
      cy.get('[data-test=table-1] > :nth-child(6)').should(
        'contain',
        zhPosition.underlyerInstrumentId,
      );
      // 合约乘数
      cy.get('[data-test=table-1] > :nth-child(7)').should(
        'contain',
        zhPosition.underlyerMultiplier,
      );
      // 期初价格
      cy.get('[data-test=table-1] > :nth-child(9)').should('contain', zhPosition.initialSpot);
      // 参与率
      cy.get('[data-test=table-1] > :nth-child(10)').should(
        'contain',
        zhPosition.participationRate,
      );
      //  行权类型
      cy.get('[data-test=table-1] > :nth-child(11)').should('contain', zhPosition.strikeTpye);
      // 行权价
      cy.get('[data-test=table-1] > :nth-child(12)').should('contain', zhPosition.strike);
      // 期限
      cy.get('[data-test=table-1] > :nth-child(14)').should('contain', zhPosition.term);
      // 起始日
      cy.get('[data-test=table-1] > :nth-child(15)').should('contain', zhPosition.effectiveDate);
      cy.get('[data-test=table-1] > :nth-child(16)').should(
        'contain',
        Cypress.moment(position.effectiveDate)
          .subtract(-position.term, 'days')
          .format('YYYY-MM-DD'),
      );
      cy.get('[data-test=table-1] > :nth-child(17)').should(
        'contain',
        Cypress.moment(position.effectiveDate)
          .subtract(-position.term, 'days')
          .format('YYYY-MM-DD'),
      );
      // 权利金类型
      cy.get('[data-test=table-1] > :nth-child(18)').should('contain', zhPosition.premiumType);
      // 实际期权费
      cy.get('[data-test=table-1] > :nth-child(19)').should('contain', zhPosition.premium);
      // 保底收益
      cy.get('[data-test=table-1] > :nth-child(20)').should('contain', zhPosition.minimumPremium);
      // 合约期权费
      cy.get('[data-test=table-1] > :nth-child(21)').should('contain', zhPosition.frontPremium);
      // 名义本金类型
      cy.get('[data-test=table-1] > :nth-child(22)').should(
        'contain',
        zhPosition.notionalAmountType,
      );
      // 名义本金
      cy.get('[data-test=table-1] > :nth-child(23)').should('contain', zhPosition.notionalAmount);
      // 敲出补偿类型
      cy.get('[data-test=table-1] > :nth-child(25)').should('contain', zhPosition.upBarrierType);
      // 补偿支付方式
      cy.get('[data-test=table-1] > :nth-child(26)').should('contain', zhPosition.rebateType);
      // 敲出补偿
      cy.get('[data-test=table-1] > :nth-child(27)').should('contain', zhPosition.upBarrier);
      // 敲出方向
      cy.get('[data-test=table-1] > :nth-child(28)').then($div => {
        expect($div).to.have.text(zhPosition.knockDirection);
      });
      // 障碍价类型
      cy.get('[data-test=table-1] > :nth-child(29)').should('contain', zhPosition.barrierType);
      // 障碍价
      cy.get('[data-test=table-1] > :nth-child(30)').should('contain', zhPosition.barrier);
      // 障碍观察类型
      cy.get('[data-test=table-1] > :nth-child(31)').should('contain', zhPosition.observationType);
      // 观察频率
      cy.get('[data-test=table-1] > :nth-child(32)').should('contain', zhPosition.observationStep);
      // 等效障碍价
      cy.get('[data-test=table-1] > :nth-child(34)').should('contain', zhPosition.barrierShift);
    });
  });
});
