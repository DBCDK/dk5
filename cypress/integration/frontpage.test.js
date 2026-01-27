// <reference types="Cypress" />
/* global cy, Cypress */

const host = Cypress.env("CYPRESS_APP_HOST") || "http://localhost";
const port = Cypress.env("CYPRESS_APP_PORT") || "3000";
const proPort = Cypress.env("CYPRESS_APP_PRO_PORT") || "3001";
const baseUrl = `${host}:${port}`;
const proBaseUrl = `${host}:${proPort}`;
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
