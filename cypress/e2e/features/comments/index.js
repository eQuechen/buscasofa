import { Given, When, Then, BeforeAll, Before } from "@badeball/cypress-cucumber-preprocessor";

let testUser;
let otherUser;

// Registro de testUser
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
  cy.contains(/usuario registrado correctamente|registro exitoso/i, { timeout: 5000 })
    .should('exist');
});

// Registro de otherUser
Before({ tags: "@otroUsuario" }, () => {
  otherUser = {
    username: `otheruser${Date.now()}`,
    email: `other${Date.now()}@mail.com`,
    password: 'Test1234!'
  };

  cy.visit('/registro');
  cy.get('input[name="username"]').type(otherUser.username);
  cy.get('input[name="email"]').type(otherUser.email);
  cy.get('input[name="password"]').type(otherUser.password);
  cy.get('form').submit();
  cy.wait(2500);
  cy.contains(/usuario registrado correctamente|registro exitoso/i, { timeout: 5000 })
    .should('exist');
});

// Step definition para enviar comentarios.
Given('el usuario {string} ha iniciado sesión correctamente', (usuario) => {
  let user;
  if (usuario === 'principal') {
    user = testUser;
  } else if (usuario === 'secundario') {
    user = otherUser;
  } else {
    throw new Error('Usuario no reconocido en el step');
  }
  cy.visit('/login');
  cy.get('input[name="email"]').type(user.email);
  cy.get('input[name="password"]').type(user.password);
  cy.get('button[type="submit"]').click();
  cy.wait(2500);
  cy.contains(/bienvenido|login correcto/i, { timeout: 5000 })
    .should('exist');
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
  cy.get('.leaflet-marker-icon').not('.leaflet-marker-draggable')
    .first()
    .scrollIntoView()
    .click({ force: true });
  cy.contains('Comentarios de los usuarios').should('exist');
});

When('la página carga completamente', () => {
  cy.get('.comments-section').should('exist');
});

Then('el usuario debe ver un botón con el texto "Enviar" en el formulario de comentarios', () => {
  cy.get('form.comment-form button[type="submit"]').should('contain', 'Enviar');
});

When('escribe un comentario válido y pulsa el botón "Enviar"', () => {
  cy.get('textarea[placeholder="Escribe tu comentario..."]')
    .type('Este es un comentario de prueba');
  cy.wait(1000);
  cy.get('form.comment-form button[type="submit"]').click();
  cy.wait(2500);
});

Then('el nuevo comentario aparece en la lista de comentarios', () => {
  cy.get('.comments-list')
    .contains('Este es un comentario de prueba')
    .should('be.visible');
});

// Step definition para editar comentarios.
Given('ha creado un comentario previamente que va a editar', () => {
  cy.get('textarea[placeholder="Escribe tu comentario..."]')
    .type('Este es un comentario de prueba y DEBE editarse');
  cy.wait(1000);
  cy.get('form.comment-form button[type="submit"]').click();
  cy.wait(2500);
  cy.get('.comments-list')
    .contains('Este es un comentario de prueba y DEBE editarse')
    .should('be.visible');
});

Then('el usuario debe ver un botón con el texto "Editar" junto a sus propios comentarios', () => {
  cy.get('.comments-list .comment-row')
    .contains('Este es un comentario de prueba y DEBE editarse')
    .parent()
    .find('button.editar-button')
    .should('contain', 'Editar');
});

When('pulsa el botón "Editar" junto a su comentario', () => {
  cy.get('.comments-list .comment-row')
    .contains('Este es un comentario de prueba y DEBE editarse')
    .parent()
    .find('button.editar-button')
    .click();
});

When('modifica el texto del comentario y pulsa "Guardar"', () => {
  cy.get('form.edit-comment-form textarea')
    .clear()
    .type('Comentario EDITADO');
  cy.wait(1000);
  cy.get('form.edit-comment-form button[type="submit"]')
    .click();
  cy.wait(2500);
});

Then('el comentario actualizado aparece en la lista de comentarios', () => {
  cy.get('.comments-list')
    .should('contain', 'Comentario EDITADO');
});

// Step definition para eliminar comentarios.
Given('ha creado un comentario previamente que va a eliminar', () => {
  cy.get('textarea[placeholder="Escribe tu comentario..."]')
    .type('Este es un comentario de prueba y DEBE eliminarse');
  cy.wait(1000);
  cy.get('form.comment-form button[type="submit"]')
    .click();
  cy.wait(2500);
  cy.get('.comments-list')
    .contains('Este es un comentario de prueba y DEBE eliminarse')
    .should('be.visible');
});

When('pulsa el botón "Eliminar" junto a su comentario', () => {
  cy.get('.comments-list .comment-row')
    .contains('Este es un comentario de prueba y DEBE eliminarse')
    .parent()
    .find('button.eliminar-button')
    .click();
  cy.wait(2500);
});

When('confirma la eliminación', () => {
  cy.get('.modal-confirm').should('be.visible');
  cy.get('.modal-confirm button.confirm').click();
  cy.wait(2500);
});

Then('el comentario ya no aparece en la lista de comentarios', () => {
  cy.get('.comments-list li').contains(testUser.username)
  cy.get('.comments-list')
    .should('not.contain', 'Este es un comentario de prueba y DEBE eliminarse');
});

// Step definition para responder a comentarios.
Given('existe al menos un comentario de otro usuario', () => {
  cy.get('.comments-list li')
    .contains(testUser.username)
    .should('have.length.greaterThan', 0);
  cy.wait(1000);
});

When('pulsa el botón "Responder" junto a ese comentario', () => {
  cy.get('.comments-list li')
    .contains(testUser.username).first()
    .parents('li').first()
    .find('button.responder-button')
    .should('be.visible')
    .click();
  cy.wait(2500);
});

When('escribe una respuesta válida y pulsa el botón "Enviar respuesta"', () => {
  cy.get('form.reply-form textarea')
    .type('Esta es una respuesta de prueba');
  cy.wait(1000);
  cy.get('form.reply-form button[type="submit"]')
    .click();
  cy.wait(2500);
});

Then('la respuesta aparece anidada debajo del comentario original', () => {
  cy.get('.comments-list li') 
    .contains(otherUser.username) 
    .parents('li') 
    .find('ul') 
    .should('contain', 'Esta es una respuesta de prueba');
});

Then('el comentario propio del usuario aparece destacado', () => {
  cy.get('.comments-list li').each(($el) => {
    const username = $el.find('strong').text().trim();
    if (username === otherUser.username) {
      cy.wrap($el).should('have.class', 'own-comment');
    }
  });
});
