// <reference types="Cypress" />
/* global cy, Cypress */

const baseUrl = Cypress.config("baseUrl");
context("Testing reset-to-frontpage functionality", () => {
  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("infobox should be visbible after 5 seconds", () => {
    cy.visit(baseUrl + "#!/hierarchy/10-19");
    cy.get(".reset-to-frontpage--container").should("not.be.visible");
    cy.wait(6000);
    cy.get(".reset-to-frontpage--container").should("be.visible");
  });

  it("infobox should be hidden on frontpage - also after 5 seconds", () => {
    cy.get(".reset-to-frontpage--container").should("not.be.visible");
    cy.wait(6000);
    cy.get(".reset-to-frontpage--container").should("not.be.visible");
  });

  it("should redirect to frontpage after 5 seconds", () => {
    cy.visit(baseUrl + "#!/hierarchy/10-19");
    cy.get(".reset-to-frontpage--container").should("not.be.visible");
    cy.wait(7000);
    cy.get(".reset-to-frontpage--container").should("be.visible");
    cy.wait(7000);
    cy.url().should("not.contain", "hierarchy");
    cy.url().should("eq", baseUrl + "/");
  });
});
