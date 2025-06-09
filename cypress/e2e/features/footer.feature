Feature: Footer

  Scenario: El usuario no autenticado ve todos los nombres de los autores en el Footer
    Given el usuario navega a la home
    Then debería ver el nombre "Emilio Brahim Quechen Romero" en el footer
    And debería ver el nombre "Ana Isabel Díaz Roig" en el footer