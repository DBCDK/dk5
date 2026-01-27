// <reference types="Cypress" />
/* global cy, Cypress */

const host = Cypress.env("APP_HOST") || "http://localhost";
const proPort = Cypress.env("APP_PRO_PORT") || "3001";
const proBaseUrl = `${host}:${proPort}`;
context("Testing cart on pro site (desktop)", () => {
  beforeEach(() => {
    cy.viewport(1000, 700);
    cy.visit(proBaseUrl);
  });

  it("It should display cart", () => {
    cy.get(".top-bar--container .top-bar--cart").should("be.visible");
    cy.get(".top-bar--container .top-bar--cart--count").should("be.visible");
  });

  it("It should add item to cart", () => {
    cy.visit(`${proBaseUrl}#!/hierarchy/40-49`);
    cy.get(".top-bar--container .top-bar--cart--count").should(
      "have.text",
      "0",
    );
    cy.get("#cart-button-48").click();
    cy.get(".top-bar--container .top-bar--cart--count").should(
      "have.text",
      "1",
    );
  });

  it("It should add two items to cart and remove the first one", () => {
    cy.visit(`${proBaseUrl}#!/hierarchy/40-49`);
    cy.get(".top-bar--container .top-bar--cart--count").should(
      "have.text",
      "0",
    );
    cy.get("#cart-button-48").click();
    cy.get(".top-bar--container .top-bar--cart--count").should(
      "have.text",
      "1",
    );
    cy.get("#cart-button-41").click();
    cy.get(".top-bar--container .top-bar--cart--count").should(
      "have.text",
      "2",
    );
    cy.get("#cart-button-48").click();
    cy.get(".top-bar--container .top-bar--cart--count").should(
      "have.text",
      "1",
    );
  });

  it("It should display the selected item in the comparer", () => {
    cy.visit(`${proBaseUrl}#!/hierarchy/40-49`);
    cy.get("#cart-button-48").click();
    cy.get("#item-index-48").should("be.visible");
  });

  it("It should remove the item from cart", () => {
    cy.visit(`${proBaseUrl}#!/hierarchy/40-49`);
    cy.get("#cart-button-48").click();

    // remove item from cart
    cy.get("#item-index-48 #cart-button-48").should("exist").click();
    cy.get("#item-index-48").should("not.exist");
  });
});
