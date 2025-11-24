// <reference types="Cypress" />
/* global cy, Cypress, expect */

const proBaseUrl = Cypress.config("baseUrl");
context("Testing cart on pro site (small screen)", () => {
  beforeEach(() => {
    cy.viewport(320, 568);
    cy.visit(proBaseUrl);
  });

  it("It should add item to cart", () => {
    cy.visit(`${proBaseUrl}#!/hierarchy/40-49`);
    // same test twice - first as .then (like a promise)
    cy.get(".hierarchy--navbar--cart .top-bar--cart--count").then((cc) => {
      expect(cc.text()).to.eq("0");
    });
    // and then as a more friendly one-liner
    cy.get(".hierarchy--navbar--cart .top-bar--cart--count").should(
      "have.text",
      "0",
    );

    cy.get("#cart-button-48").click();
    cy.get(".hierarchy--navbar--cart .top-bar--cart--count").should(
      "have.text",
      "1",
    );
  });

  it("It should add two items to cart and remove the first one", () => {
    cy.visit(`${proBaseUrl}#!/hierarchy/40-49`);
    cy.get(".hierarchy--navbar--cart .top-bar--cart--count").should(
      "have.text",
      "0",
    );
    cy.get("#cart-button-48").click();
    cy.get(".hierarchy--navbar--cart .top-bar--cart--count").should(
      "have.text",
      "1",
    );
    cy.get("#cart-button-41").click();
    cy.get(".hierarchy--navbar--cart .top-bar--cart--count").should(
      "have.text",
      "2",
    );
    cy.get("#cart-button-48").click();
    cy.get(".hierarchy--navbar--cart .top-bar--cart--count").should(
      "have.text",
      "1",
    );
  });

  it("It should display the comparer overlay when the cart is clicked", () => {
    cy.visit(`${proBaseUrl}#!/hierarchy/40-49`);
    cy.get("#cart-button-48").click();
    cy.get("#item-index-48").should("not.be.visible");
    cy.get(".hierarchy--navbar--cart .top-bar--cart").click();
    cy.get("#item-index-48").should("be.visible");
  });

  it("It should remove the item from cart", () => {
    cy.visit(`${proBaseUrl}#!/hierarchy/40-49`);
    cy.get("#cart-button-48").click();
    cy.get(".hierarchy--navbar--cart .top-bar--cart").click();
    cy.get("#item-index-48 #cart-button-48").click();
    cy.get("#item-index-48").should("not.be.visible");
  });
});
