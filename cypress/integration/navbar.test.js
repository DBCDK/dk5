// <reference types="Cypress" />
/* global cy, Cypress */

const host = Cypress.env("CYPRESS_APP_HOST") || "http://localhost";
const port = Cypress.env("CYPRESS_APP_PORT") || "4013";
const proPort = Cypress.env("CYPRESS_APP_PRO_PORT") || "4015";
const baseUrl = `${host}:${port}`;
const proBaseUrl = `${host}:${proPort}`;
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
