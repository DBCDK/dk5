// <reference types="Cypress" />
/* global cy, Cypress */

const baseUrl = Cypress.config("baseUrl");
const proBaseUrl = Cypress.config("baseUrl");
context("Testing frontpage", () => {
  it("Should render frontpage", () => {
    cy.visit(baseUrl);
    cy.get("body").should("contain", "Eller vælg et emne her");
  });

  it("Should render pro frontpage", () => {
    cy.visit(proBaseUrl);
    cy.get("body").should("contain", "DK5 PRO");
  });
});
