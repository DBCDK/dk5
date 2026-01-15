// <reference types="Cypress" />
/* global cy, Cypress */

const host = Cypress.env("CYPRESS_APP_HOST") || "http://localhost";
const proPort = Cypress.env("CYPRESS_APP_PRO_PORT") || "4015";
const proBaseUrl = `${host}:${proPort}`;
context("Testing the searchresultspage on pro version", () => {
  beforeEach(() => {
    cy.visit(proBaseUrl + "#!/search/geologi/10/0/relevance/dictionary");
  });

  it("CartButton on items should be visble", () => {
    cy.get("#cart-button-55-1").should("be.visible");
    cy.get(".cart-button-container").should("have.length", 4);
  });

  it("Should display the comparer when adding an item", () => {
    cy.get(".comparer--content").should("not.be.visible");

    cy.get("#cart-button-55-1").click();
    cy.get(".comparer--content:visible").should("be.visible");
  });
});
