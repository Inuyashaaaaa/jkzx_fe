/* eslint-disable */
// http://confluence.tongyu.tech:8090/pages/resumedraft.action?draftId=27590725&draftShareId=3f6f159e-6e18-4b16-8b45-1f64cf579f3d
// / <reference types="Cypress" />
const testCase = '交易管理-交易定价：对【单鲨】结构试定价成功（OTMS-6330）';
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
    //进入交易定价界面
    cy.visit('/', { timeout: 10000 });
    cy.get('.ant-menu-submenu-title')
      .contains('交易管理')
      .as('option1');
    cy.get('@option1').click();
    cy.contains('交易定价').click();
    cy.url().should('include', '/trade-management/pricing');

    cy.contains('添加期权结构').click();
    //添加期权结构
    cy.fixture('sharkPrice.json').as('sharkPrice');
    cy.get('@sharkPrice').then(data => {
      const { position, date } = data;
      cy.contains(position.struType).click();

      cy.get('[data-test=table-1] > :nth-child(1)')
        .first()
        .should('contain', position.struType);
      cy.get('[data-test=table-1] > :nth-child(2)')
        .first()
        .should('contain', position.isYear);

      //买卖方向 isBusiness
      cy.get('[data-test=table-1] > :nth-child(3)')
        .first()
        .as('isBusiness');
      cy.get('@isBusiness').click({ force: true });
      cy.get('.ant-select-dropdown-menu > :nth-child(1)').as('optionType');
      cy.get('@optionType').click({ force: true });

      //标的物  marker
      cy.get('[data-test=table-1] > :nth-child(5)')
        .first()
        .as('marker');
      cy.get('@marker')
        .click({ force: true })
        .focused()
        .type(position.marker)
        .wait(500)
        .type('{enter}');
      // .then(($marker) => {
      //     return new Promise.delay(1000)
      // });

      //期初价格
      cy.get('[data-test=table-1] > :nth-child(7)')
        .first()
        .as('initialPrice');
      cy.get('@initialPrice')
        .click({ force: true })
        .focused()
        .clear()
        .wait(200)
        .type(position.initialPrice)
        .wait(500)
        .type('{enter}');

      //行权价  strike
      cy.get('[data-test=table-1] > :nth-child(10)')
        .first()
        .as('strike');
      cy.get('@strike')
        .click({ force: true })
        .focused()
        .type(`${position.strike}{enter}`);

      //起始日
      cy.get('[data-test=table-1] > :nth-child(12)')
        .first()
        .as('effectiveDate');
      cy.get('@effectiveDate')
        .click()
        .focused()
        .clear()
        .type(position.effectiveDate)
        .wait(500)
        .type('{enter}');

      //名义本金  principal
      cy.get('[data-test=table-1] > :nth-child(15)')
        .first()
        .as('principal');
      cy.get('@principal')
        // .wait(500)
        .click()
        .focused()
        .type(`${position.principal}{enter}`);

      //检测交易数量
      cy.get('[data-test=table-1] > :nth-child(16)')
        .first()
        .as('tradCapacity');
      cy.get('@tradCapacity').should('contain', position.tradCapacity);

      //敲出补偿 compensate
      cy.get('[data-test=table-1] > :nth-child(18)')
        .first()
        .as('compensate');
      cy.get('@compensate')
        .click()
        .focused()
        .type(`${position.compensate}{enter}`);

      //障碍价  barrier
      cy.get('[data-test=table-1] > :nth-child(21)')
        .first()
        .as('barrier');
      cy.get('@barrier')
        .click()
        .focused()
        .type(position.barrier)
        .wait(500)
        .type('{enter}');

      //检测类型与障碍价方向是否正确
      cy.get('[data-test=table-1] > :nth-child(4)')
        .first()
        .should('contain', position.type);

      cy.get('[data-test=table-1] > :nth-child(19)')
        .first()
        .should('contain', position.direction);

      //障碍观察类型 rubType
      cy.get('[data-test=table-1] > :nth-child(22)')
        .first()
        .as('rubType');
      cy.get('@rubType').click();
      cy.get('.ant-select-dropdown-menu > :nth-child(2)').as('optionType2');
      cy.get('@optionType2').click();

      //障碍频率observationStep
      cy.get('[data-test=table-1] > :nth-child(23)')
        .first()
        .as('observationStep');
      cy.get('@observationStep').click();
      cy.get('.ant-select-dropdown-menu > :nth-child(2)').click();

      //观察日
      cy.get('[data-test=table-1] > :nth-child(24)')
        .first()
        .as('watchDate');
      cy.get('@watchDate').click();
      cy.contains('批量生成观察日').click();
      cy.get('.ant-modal-footer > .ant-btn-primary').click();

      //等效障碍价  equalBarrier
      cy.get('[data-test=table-1] > :nth-child(25)')
        .first()
        .as('equalBarrier');
      cy.get('@equalBarrier')
        .click()
        .focused()
        .type(position.equalBarrier)
        .wait(500)
        .type('{enter}');

      //试定价
      cy.get('[data-test=试定价]').click();

      // cy.get('[data-test=table-1] > *').each(($el, index, $list) => {
      //   if(index >= 29) {
      //     cy.wrap($el).should('contain',date[index-29])
      //   }
      // })
    });
  });
});
