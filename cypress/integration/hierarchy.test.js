// <reference types="Cypress" />
/* global cy, Cypress */

const baseUrl = Cypress.config("baseUrl");
context("Testing Hierarchy", () => {
  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("Should render hierarchy", () => {
    cy.get(".category-tiles").should("be.visible");
    cy.get('[href="#!/hierarchy/40-49"]').click();
    cy.get(".selected .dk5").should("be.visible");

    cy.get(".selected .dk5").first().should("have.text", "40-49");
    cy.get(".selected .hierarchy-level .name")
      .first()
      .should("have.text", "Geografi og rejser i alm.");

    cy.get(".selected .level-2").should("have.length", 4);
  });

  it("Click on sublevel", () => {
    cy.visit(baseUrl + "#!/hierarchy/40");
    cy.get(".selected .dk5").should("be.visible");
    cy.get(".selected .dk5").first().should("have.text", "40");
    cy.get(".selected .hierarchy-topics .title-note")
      .eq(2)
      .should("have.text", "Flyveulykker");
  });

  it("Click between levels", () => {
    cy.get(".category-tiles").should("be.visible");
    cy.get('[href="#!/hierarchy/40-49"]').click();
    cy.get(".level-1 > .selected .dk5").first().should("have.text", "40-49");

    cy.get('[href="#!/hierarchy/40"]').click();
    cy.get(".level-2 > .selected").should("be.visible");
    cy.get(".level-2 > .selected .dk5").first().should("have.text", "40");

    cy.get('[href="#!/hierarchy/40.6"]').click();
    cy.get(".level-3 > .selected").should("be.visible");

    cy.get('[href="#!/hierarchy/40-49"]').click();
    cy.get(".level-1 > .selected").should("be.visible");
    cy.get(".level-1 > .selected .dk5").first().should("have.text", "40-49");
  });

  it("Should display the first five aspects only", () => {
    cy.visit(baseUrl + "#!/hierarchy/40");
    cy.get(".selected").should("be.visible");
    cy.get(".selected .hierarchy-topics .title-note:visible").should(
      "have.text",
      "AtlanterhavetBjergeFlyveulykkerGeografiHave",
    );
    cy.get(".selected .hierarchy-topics .title-note:visible").should(
      "not.contain",
      "Lande",
    );
    cy.get(".selected .hierarchy-topics .title-note:visible")
      .eq(0)
      .should("have.text", "Atlanterhavet");
    cy.get(".selected .hierarchy-topics .title-note:visible")
      .eq(4)
      .should("have.text", "Have");
    cy.get(".selected .hierarchy-topics .title-note:visible").should(
      "have.length",
      5,
    );
  });

  it('Should display all aspects when "Vis Flere" is clicked', () => {
    cy.visit(baseUrl + "#!/hierarchy/40");
    cy.get(".selected .hierarchy-topics .title-note:visible").should(
      "have.length.greaterThan",
      0,
    );
    cy.get(".toggle-button").click();
    cy.get(".selected .show .hierarchy-topics").should("be.visible");
    cy.get(".selected .hierarchy-topics .title-note:visible").should(
      "have.length.greaterThan",
      5,
    );
  });

  it('Should hide all but 5 aspects when "Vis Flere" is clicked twice', () => {
    cy.visit(baseUrl + "#!/hierarchy/40");
    cy.get(".selected .hierarchy-topics .title-note:visible").should(
      "have.length.greaterThan",
      0,
    );
    cy.get(".toggle-button").click();
    cy.get(".selected .show .hierarchy-topics").should("be.visible");
    cy.get(".selected .hierarchy-topics .title-note:visible").should(
      "have.length.greaterThan",
      5,
    );
    cy.get(".toggle-button").click();
    cy.get(".selected .show .hierarchy-topics").should("not.be.visible");
    cy.get(".selected .hierarchy-topics .title-note:visible").should(
      "have.length.greaterThan",
      0,
    );
  });
});
