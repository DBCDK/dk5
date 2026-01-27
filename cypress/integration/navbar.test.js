// <reference types="Cypress" />
/* global cy, Cypress */

const host = Cypress.env("APP_HOST") || "http://localhost";
const port = Cypress.env("APP_PORT") || "3000";
const proPort = Cypress.env("APP_PRO_PORT") || "3001";
const baseUrl = `${host}:${port}`;
const proBaseUrl = `${host}:${proPort}`;
context("Testing the navbar (small screen)", () => {
  beforeEach(() => {
    cy.viewport(320, 568);
  });

  it("It should not display cart on enduser site", () => {
    cy.visit(baseUrl + "#!/hierarchy/40-49");
    cy.get("body").find(".hierarchy--navbar--cart").should("not.exist");
  });

  it("It should display cart on pro site", () => {
    cy.visit(proBaseUrl + "#!/hierarchy/40-49");
    cy.get(".hierarchy--navbar--cart").should("be.visible");
    cy.get(".hierarchy--navbar--cart .top-bar--cart--count").should(
      "be.visible",
    );
  });
});
