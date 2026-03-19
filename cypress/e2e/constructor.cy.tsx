/// <reference types="cypress" />

describe('Burger constructor page', () => {
  const accessToken = 'Bearer test-access-token';
  const refreshToken = 'test-refresh-token';

  const TAB_BUN = 'Булки';
  const TAB_FILLINGS = 'Начинки';
  const BUN_NAME = 'Тестовая булка';
  const FILLING_NAME = 'Тестовая начинка';
  const INGREDIENT_DETAILS_TITLE = 'Детали ингредиента';
  const ADD_BUTTON_TEXT = 'Добавить';
  const MODAL_CLOSE_SELECTOR = '[data-cy="modal-close"]';
  const MODAL_OVERLAY_SELECTOR = '[data-cy="modal-overlay"]';
  const ORDER_NUMBER_TEXT = '12345';
  const BUNS_EMPTY_TEXT = 'Выберите булки';
  const FILLINGS_EMPTY_TEXT = 'Выберите начинку';

  const openTab = (tabName: string) => {
    cy.contains(tabName, { timeout: 10000 })
      .closest('.tab')
      .then(($tab) => {
        if (!$tab.hasClass('tab_type_current')) {
          cy.wrap($tab).click();
        }
      });
  };

  const visit = () => cy.visit('/');

  const visitWithAuth = () =>
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', refreshToken);
        win.document.cookie = `accessToken=${encodeURIComponent(accessToken)}; path=/`;
      }
    });

  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    visit();
    cy.wait('@getIngredients');
  });

  it('adds bun and filling into constructor', () => {
    openTab(TAB_BUN);
    cy.contains(BUN_NAME)
      .closest('li')
      .within(() => {
        cy.contains(ADD_BUTTON_TEXT).click();
      });

    openTab(TAB_FILLINGS);
    cy.contains(FILLING_NAME)
      .closest('li')
      .within(() => {
        cy.contains(ADD_BUTTON_TEXT).click();
      });

    cy.contains('Тестовая булка (верх)').should('be.visible');
    cy.contains('Тестовая булка (низ)').should('be.visible');
    cy.contains(FILLING_NAME).should('be.visible');
  });

  it('opens ingredient modal and closes by close button and overlay', () => {
    openTab(TAB_FILLINGS);
    cy.contains(FILLING_NAME).click();
    cy.contains(INGREDIENT_DETAILS_TITLE).should('be.visible');
    cy.contains(FILLING_NAME).should('be.visible');

    cy.get(MODAL_CLOSE_SELECTOR).click();
    cy.contains(INGREDIENT_DETAILS_TITLE).should('not.exist');

    cy.contains(TAB_BUN, { timeout: 10000 }).should('exist');
    openTab(TAB_BUN);
    cy.contains(BUN_NAME).click();
    cy.contains(INGREDIENT_DETAILS_TITLE).should('be.visible');
    cy.get(MODAL_OVERLAY_SELECTOR).click('topLeft', { force: true });
    cy.contains(INGREDIENT_DETAILS_TITLE).should('not.exist');
  });

  it('creates order, shows correct number, closes modal and clears constructor', () => {
    visitWithAuth();
    cy.wait('@getIngredients');

    openTab(TAB_BUN);
    cy.contains(BUN_NAME)
      .closest('li')
      .within(() => {
        cy.contains(ADD_BUTTON_TEXT).click();
      });

    openTab(TAB_FILLINGS);
    cy.contains(FILLING_NAME)
      .closest('li')
      .within(() => {
        cy.contains(ADD_BUTTON_TEXT).click();
      });

    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    cy.contains(ORDER_NUMBER_TEXT).should('be.visible');
    cy.get(MODAL_CLOSE_SELECTOR).click();
    cy.contains(ORDER_NUMBER_TEXT).should('not.exist');

    cy.contains(BUNS_EMPTY_TEXT).should('be.visible');
    cy.contains(FILLINGS_EMPTY_TEXT).should('be.visible');

    cy.clearCookie('accessToken');
    cy.clearLocalStorage('refreshToken');
  });
});

