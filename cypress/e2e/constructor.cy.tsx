/// <reference types="cypress" />

describe('Burger constructor page', () => {
  const accessToken = 'Bearer test-access-token';
  const refreshToken = 'test-refresh-token';

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
    openTab('Булки');
    cy.contains('Тестовая булка')
      .closest('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    openTab('Начинки');
    cy.contains('Тестовая начинка')
      .closest('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    cy.contains('Тестовая булка (верх)').should('be.visible');
    cy.contains('Тестовая булка (низ)').should('be.visible');
    cy.contains('Тестовая начинка').should('be.visible');
  });

  it('opens ingredient modal and closes by close button and overlay', () => {
    openTab('Начинки');
    cy.contains('Тестовая начинка').click();
    cy.contains('Детали ингредиента').should('be.visible');
    cy.contains('Тестовая начинка').should('be.visible');

    cy.get('[data-cy="modal-close"]').click();
    cy.contains('Детали ингредиента').should('not.exist');

    cy.contains('Булки', { timeout: 10000 }).should('exist');
    openTab('Булки');
    cy.contains('Тестовая булка').click();
    cy.contains('Детали ингредиента').should('be.visible');
    cy.get('[data-cy="modal-overlay"]').click('topLeft', { force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('creates order, shows correct number, closes modal and clears constructor', () => {
    visitWithAuth();
    cy.wait('@getIngredients');

    openTab('Булки');
    cy.contains('Тестовая булка')
      .closest('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    openTab('Начинки');
    cy.contains('Тестовая начинка')
      .closest('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    cy.contains('12345').should('be.visible');
    cy.get('[data-cy="modal-close"]').click();
    cy.contains('12345').should('not.exist');

    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');

    cy.clearCookie('accessToken');
    cy.clearLocalStorage('refreshToken');
  });
});

