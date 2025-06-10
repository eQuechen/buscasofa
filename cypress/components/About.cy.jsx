/// <reference types="Cypress" />
// import React from 'react'
import AboutView from '@/views/AboutView.jsx'

describe('<AboutView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AboutView />).then(() => {
      cy.get('h1').should('contain', 'Acerca de nosotros')
      cy.get('#info').should('contain', 'Somos el equipo nº').contains(/[1-30]/)
    })  
  })
})