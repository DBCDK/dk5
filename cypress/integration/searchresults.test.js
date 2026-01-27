// <reference types="Cypress" />
/* global cy, Cypress */

const baseUrl = Cypress.config("baseUrl");
context("Testing the searchresultspage on normal version", () => {
  beforeEach(() => {
    cy.visit(baseUrl + "#!/search/geologi/10/0/relevance/dictionary");
  });

  it("No CartButtons items should be visible", () => {
    cy.get(".cart-button-container").should("have.length", 0);
  });

  it("Should not display the comparer", () => {
    cy.get("body").find(".comparer--content").should("not.exist");
    cy.get("body").find("#comparer--content").should("not.exist");
  });
});
