// <reference types="Cypress" />
/* global cy, Cypress */

const baseUrl = Cypress.config("baseUrl");
const proBaseUrl = Cypress.config("baseUrl");
context("Testing the navbar (small screen)", () => {
  beforeEach(() => {
    cy.viewport(320, 568);
  });

  it("It should not display cart on enduser site", () => {
    cy.visit(baseUrl + "#!/hierarchy/40-49");
    cy.get(".hierarchy--navbar--cart").should("not.be.visible");
    cy.get(".hierarchy--navbar--cart .top-bar--cart--count").should(
      "not.be.visible",
    );
  });

  it("It should display cart on pro site", () => {
    cy.visit(proBaseUrl + "#!/hierarchy/40-49");
    cy.get(".hierarchy--navbar--cart").should("be.visible");
    cy.get(".hierarchy--navbar--cart .top-bar--cart--count").should(
      "be.visible",
    );
  });
});
