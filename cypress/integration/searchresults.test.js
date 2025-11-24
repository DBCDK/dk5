// <reference types="Cypress" />
/* global cy, Cypress */

const baseUrl = Cypress.config("baseUrl");
context("Testing the searchresultspage on normal version", () => {
  beforeEach(() => {
    cy.visit(baseUrl + "#!/search/geologi/10/0/relevance/dictionary");
  });

  it("No CartButtons items should be visible", () => {
    cy.get("#cart-button-55").should("not.be.visible");
    cy.get(".cart-button-container").should("have.length", 0);
  });

  it("Should not display the comparer", () => {
    cy.get(".comparer--content").should("not.be.visible");
    cy.get("#comparer--content").should("not.be.visible");
  });
});
