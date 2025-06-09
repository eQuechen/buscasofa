import { Given, When, Then, BeforeAll } from "@badeball/cypress-cucumber-preprocessor";

let testUser;

BeforeAll(() => {
  testUser = {
    username: `testuser${Date.now()}`,
    email: `test${Date.now()}@mail.com`,
    password: 'Test1234!'
  };

  cy.visit('/registro');
  cy.get('input[name="username"]').type(testUser.username);
  cy.get('input[name="email"]').type(testUser.email);
  cy.get('input[name="password"]').type(testUser.password);
  cy.get('form').submit();
  cy.wait(2500);
  cy.contains(/usuario registrado correctamente|registro exitoso/i, { timeout: 5000 }).should('exist');
});
// Step definition para enviar comentarios.
Given('el usuario ha iniciado sesión correctamente', () => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(testUser.email);
  cy.get('input[name="password"]').type(testUser.password);
  cy.get('button[type="submit"]').click();
  cy.wait(2500);
  cy.contains(/bienvenido|login correcto/i, { timeout: 5000 }).should('exist');
});

Given('está en la página de comentarios de una estación', () => {
  cy.window().then((win) => {
    cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb) => {
      cb({ coords: { latitude: 0, longitude: 0 } });
    });
  });
  cy.get('a.mapa').click();
  cy.contains('Mapa').should('exist');
  cy.get('.leaflet-marker-icon').should('have.length.greaterThan', 0);
  cy.get('.leaflet-marker-icon').not('.leaflet-marker-draggable').first().scrollIntoView().click({ force: true });
  cy.contains('Comentarios de los usuarios').should('exist');
});

When('la página carga completamente', () => {
  cy.get('.comments-section').should('exist');
});

Then('el usuario debe ver un botón con el texto "Enviar" en el formulario de comentarios', () => {
  cy.get('form.comment-form button[type="submit"]').should('contain', 'Enviar');
});

When('escribe un comentario válido y pulsa el botón "Enviar"', () => {
  cy.get('textarea[placeholder="Escribe tu comentario..."]').type('Este es un comentario de prueba');
  cy.wait(1000);
  cy.get('form.comment-form button[type="submit"]').click();
  cy.wait(2500);
});

Then('el nuevo comentario aparece en la lista de comentarios', () => {
  cy.get('.comments-list').contains('Este es un comentario de prueba').should('be.visible');
});

// Step definition para editar comentarios.
Given('ha creado un comentario previamente que va a editar', () => {
  cy.get('textarea[placeholder="Escribe tu comentario..."]').type('Este es un comentario de prueba y DEBE editarse');
  cy.wait(1000);
  cy.get('form.comment-form button[type="submit"]').click();
  cy.wait(2500);
  cy.get('.comments-list').contains('Este es un comentario de prueba y DEBE editarse').should('be.visible');
});

Then('el usuario debe ver un botón con el texto "Editar" junto a sus propios comentarios', () => {
  cy.get('.comments-list .comment-row').contains('Este es un comentario de prueba y DEBE editarse').parent().find('button.editar-comentario').should('contain', 'Editar');
});

When('pulsa el botón "Editar" junto a su comentario', () => {
  cy.get('.comments-list .comment-row').contains('Este es un comentario de prueba y DEBE editarse').parent().find('button.editar-comentario').click();
});

When('modifica el texto del comentario y pulsa "Guardar"', () => {
  cy.get('form.edit-comment-form textarea').clear().type('Comentario EDITADO');
  cy.wait(1000);
  cy.get('form.edit-comment-form button[type="submit"]').click();
  cy.wait(2500);
});

Then('el comentario actualizado aparece en la lista de comentarios', () => {
  cy.get('.comments-list').should('contain', 'Comentario EDITADO');
});

// Step definition para eliminar comentarios.
Given('ha creado un comentario previamente que va a eliminar', () => {
  cy.get('textarea[placeholder="Escribe tu comentario..."]').type('Este es un comentario de prueba y DEBE eliminarse');
  cy.wait(1000);
  cy.get('form.comment-form button[type="submit"]').click();
  cy.wait(2500);
  cy.get('.comments-list').contains('Este es un comentario de prueba y DEBE eliminarse').should('be.visible');
});

When('pulsa el botón "Eliminar" junto a su comentario', () => {
  cy.get('.comments-list .comment-row')
    .contains('Este es un comentario de prueba y DEBE eliminarse')
    .parent()
    .find('button.eliminar-comentario')
    .click();
    cy.wait(2500);
});

When('confirma la eliminación', () => {
  cy.get('.modal-confirm').should('be.visible');
  cy.get('.modal-confirm button.confirm').click();
  cy.wait(2500);
});

Then('el comentario ya no aparece en la lista de comentarios', () => {
  cy.get('.comments-list').should('not.contain', 'Este es un comentario de prueba y DEBE eliminarse');
});