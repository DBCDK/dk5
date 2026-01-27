// <reference types="Cypress" />
/* global cy, Cypress */

const host = Cypress.env("APP_HOST") || "http://localhost";
const proPort = Cypress.env("APP_PRO_PORT") || "3001";
const proBaseUrl = `${host}:${proPort}`;
context("Testing the searchresultspage on pro version", () => {
  beforeEach(() => {
    cy.visit(proBaseUrl + "#!/search/geologi/10/0/relevance/dictionary");
  });

  it("CartButton on items should be visble", () => {
    cy.get(".cart-button-container").should("have.length.greaterThan", 0);
    cy.get(".cart-button-container").first().should("be.visible");
  });

  it("Should display the comparer when adding an item", () => {
    cy.get(".comparer--content").should("not.be.visible");
    cy.get(".cart-button-container").first().click();
    cy.get(".comparer--content:visible").should("be.visible");
  });
});
