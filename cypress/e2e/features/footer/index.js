/// <reference types="Cypress" />
import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('el usuario navega a la home', () => {
    cy.visit('/');
});

Then('debería ver el nombre {string} en el footer', (name) => {
    cy.get('div').contains(name).should('be.visible');
});