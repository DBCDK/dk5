// <reference types="Cypress" />
/* global cy, Cypress */

const baseUrl = Cypress.env('APP_HOST') + ':' + Cypress.env('APP_PORT');
const searchValue = 'geografi';
const protocolAndUrl = baseUrl + '/';

context('Testing searchField', () => {
  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('Should render searchField', () => {
    cy.get('[placeholder="Skriv emne"]').should('be.visible');
    cy.get('.search-field').should('have.attr', 'placeholder', 'Skriv emne');
  });

  it('should change url when searching', () => {
    cy.url().should('eq', protocolAndUrl);
    cy.location('href').should('eq', protocolAndUrl);
    cy.location().its('href').should('eq', protocolAndUrl);
    cy.get('.search-field').type(searchValue);
    cy.get('.search-field--button').click();
    cy.url().should('not.eq', protocolAndUrl);
    cy.url().should('contain', searchValue);
  });

  it('should display suggestions', () => {
    cy.get('.search-field').type(searchValue);
    cy.get('.suggestions--suggestion').should('contain', 'geografi');
    cy.get('.suggestions--suggestion').should('contain', 'geografisk');
    cy.get('.suggestions--suggestion').should('contain', 'geografiundervisning');
    cy.get('.suggestions--suggestion').should('not.contain', 'geokemi');
  });

  it('should redirect on suggestion click', () => {
    cy.url().should('eq', protocolAndUrl);
    cy.get('.search-field').type(searchValue);
    cy.get('.suggestions--suggestion').eq(2).click();
    cy.url().should('not.eq', protocolAndUrl);
    cy.url().should('contain', searchValue);
  });

  it('should respond to arrow keys', () => {
    cy.get('.search-field').type(searchValue);
    cy.get('.search-field').type('{downarrow}');
    cy.wait(100);
    cy.get('.search-field').type('{downarrow}');
    cy.wait(100);
    cy.get('.search-field').type('{enter}');
    cy.url().should('not.eq', protocolAndUrl);
    cy.url().should('contain', searchValue);
  });

  it('should insert a . when three or more digits are present in the input field', () => {
    cy.get('.search-field').type('123');
    cy.get('.search-field').should('have.value', '12.3');
  });

});
