Feature: Comentarios de usuario registrado

Scenario: El usuario registrado puede crear un comentario
  Given el usuario "principal" ha iniciado sesión correctamente
  And está en la página de comentarios de una estación
  When escribe un comentario válido y pulsa el botón "Enviar"
  Then el nuevo comentario aparece en la lista de comentarios

Scenario: El usuario registrado puede editar su propio comentario
  Given el usuario "principal" ha iniciado sesión correctamente
  And está en la página de comentarios de una estación
  And ha creado un comentario previamente que va a editar
  When pulsa el botón "Editar" junto a su comentario
  And modifica el texto del comentario y pulsa "Guardar"
  Then el comentario actualizado aparece en la lista de comentarios

Scenario: El usuario registrado puede eliminar su propio comentario
  Given el usuario "principal" ha iniciado sesión correctamente
  And está en la página de comentarios de una estación
  And ha creado un comentario previamente que va a eliminar
  When pulsa el botón "Eliminar" junto a su comentario
  And confirma la eliminación
  Then el comentario ya no aparece en la lista de comentarios

@otroUsuario
Scenario: El usuario registrado puede responder a un comentario de otro usuario
  Given el usuario "secundario" ha iniciado sesión correctamente
  And está en la página de comentarios de una estación
  And existe al menos un comentario de otro usuario
  When pulsa el botón "Responder" junto a ese comentario
  And escribe una respuesta válida y pulsa el botón "Enviar respuesta"
  Then la respuesta aparece anidada debajo del comentario original

Scenario: El usuario registrado puede diferenciar sus comentarios del resto
  Given el usuario "secundario" ha iniciado sesión correctamente
  And está en la página de comentarios de una estación
  And existe al menos un comentario de otro usuario
  When escribe un comentario válido y pulsa el botón "Enviar"
  Then el comentario propio del usuario aparece destacado