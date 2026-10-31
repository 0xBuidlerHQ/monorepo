---
sourceRevision: 19c60042c624acbb06c9fe0e770f9bdaba82ce2d3f7ccc38165b24c5ccc89449
title: "Entender la [ Blockchain ]"
draft: false
---

Alice tiene la entrada 42 para un concierto. Como no puede ir, quiere dársela a Bob. Si le envía una fotografía, ella conserva la imagen original. También podría enviarle otra copia a Charlie.

¿A quién debería dejar entrar la sala?

La imagen no permite resolver esa duda. Un archivo digital se puede copiar sin quitárselo a quien lo tenía antes. Para transferir una entrada necesitamos un registro de propiedad y una forma de ponernos de acuerdo sobre sus cambios.

Sigamos esta entrada para entender cómo una blockchain puede proporcionar ese registro.

## Un registro de propiedad compartido

Una empresa de entradas puede mantener una base de datos que diga «la entrada 42 pertenece a Alice». Cuando ella se la da a Bob, la empresa actualiza el registro. Alice puede conservar una imagen, pero la empresa reconoce ahora a Bob como propietario.

Este sistema puede funcionar bien. También otorga a una organización la autoridad sobre el registro. Los clientes y las demás aplicaciones dependen de que comunique correctamente la propiedad y acepte las transferencias legítimas.

Supongamos que varias aplicaciones independientes quieren utilizar el mismo registro sin dejarlo bajo el control exclusivo de ninguna. Cada una podría conservar una copia, pero las copias no determinan qué cambios hay que aceptar. Una aplicación podría registrar una transferencia a Bob y otra una transferencia a Charlie.

Los participantes necesitan reglas comunes para comprobar las solicitudes y acordar un historial. Una **[blockchain](/es/glossary#blockchain)** combina un registro compartido con reglas para mantenerlo en una red de ordenadores. Nuestro ejemplo utiliza una blockchain que admite programas; las funciones disponibles y las reglas de participación varían según la red.

## Transacciones y firmas digitales

El registro identifica la **[cuenta](/es/glossary#account)** de Alice como propietaria de la entrada. Las cuentas utilizan identificadores llamados **[direcciones](/es/glossary#address)**. Bob comparte su dirección para que Alice indique el destinatario. Los nombres facilitan la explicación; una dirección no revela por sí sola la identidad de alguien.

Alice solicita: «Transfiere la entrada 42 a la dirección de Bob». Esa instrucción es una **[transacción](/es/glossary#transaction)**. Enviarla pide a la red que procese un cambio. No convierte inmediatamente a Bob en propietario.

Cualquiera podría escribir esa instrucción. Para demostrar la autorización, la cuenta de Alice utiliza dos claves relacionadas matemáticamente. Su **[clave privada](/es/glossary#private-key)** es secreta y crea firmas. La **[clave pública](/es/glossary#public-key)** correspondiente permite verificarlas.

Su **[wallet](/es/glossary#wallet)** le ayuda a revisar la solicitud y a utilizar su clave para crear una **[firma digital](/es/glossary#digital-signature)** sobre sus datos. La red comprueba la firma y que esa clave esté autorizada para la cuenta. La clave privada no necesita enviarse junto con la transacción.

La firma está ligada a lo firmado. Sustituir la dirección de Bob por la de Charlie cambia la solicitud y hace que la firma deje de ser válida. Conocer la clave pública de Alice no permite firmar de forma viable nuevas solicitudes en su nombre.

El wallet permite acceder a la entrada; la propiedad está registrada en el sistema compartido. Si alguien roba la clave privada de Alice, puede firmar como su cuenta. La red verifica la autorización mediante la clave, no que la persona que la utiliza sea realmente Alice.

## Smart contracts y nodos

Una solicitud correctamente firmada también debe respetar las reglas de la entrada. Alice tiene que ser propietaria de la entrada 42 cuando se procese la transferencia. Firmar una solicitud no le da permiso para transferir una entrada ajena.

Algunas blockchains permiten escribir programas que definen las reglas de una aplicación. Estos programas se llaman **[smart contracts](/es/glossary#smart-contract)**. Su código y sus datos forman parte del sistema compartido. Nuestro programa de entradas comprueba el propietario actual antes de registrar al destinatario como nuevo propietario.

Los ordenadores que participan en la red se llaman **[nodos](/es/glossary#node)**. Los que verifican todas las reglas comprueban por sí mismos los cambios propuestos, incluida la autorización y la ejecución del programa. Con el mismo registro inicial y las mismas solicitudes ordenadas, deben obtener el mismo resultado. Rechazan una actualización que se salte una comprobación o invente una transferencia no autorizada.

La verificación independiente contribuye a la **[descentralización](/es/glossary#decentralization)**: repartir la responsabilidad y el control entre participantes. Su independencia real importa. Muchos ordenadores gestionados por una sola organización pueden dejarle un control considerable.

## Bloques y hashes

Los participantes necesitan proponer una secuencia precisa de acontecimientos. Agrupan las transacciones en lotes ordenados llamados **[bloques](/es/glossary#block)**. Cada bloque propuesto identifica el bloque anterior sobre el que se construye. Sus transacciones se procesan a partir del registro resultante de ese historial.

La transferencia de Alice puede aparecer en uno de esos bloques. Si se completa, el registro actual muestra a Bob como propietario. El historial sigue mostrando cómo llegó la entrada hasta él; cambiar al propietario no borra las transferencias anteriores.

Para conectar los bloques, el sistema utiliza un **[hash](/es/glossary#hash)**: una huella digital calculada a partir de datos. Los mismos datos producen el mismo hash. Cambiarlos modifica casi con total seguridad esa huella. Un hash criptográfico adecuado hace inviable encontrar deliberadamente datos distintos que produzcan la misma huella.

La huella de un bloque depende de su contenido, incluida la referencia al bloque anterior. Alterar una transacción antigua cambia las huellas que la conectan con el historial posterior. Las referencias originales dejan de coincidir y permiten detectar la alteración.

Alguien podría recalcular las huellas afectadas para crear otro historial internamente coherente. Los hashes muestran que difiere del original, pero no deciden qué historial debe aceptar todo el mundo. La red necesita otro mecanismo para ello.

## Consenso y finalidad

Supongamos que Alice firma una solicitud para dar la entrada 42 a Bob y otra para dársela a Charlie. Ambas firmas son auténticas. Cualquiera de las solicitudes podría completarse si se procesa primero, mientras Alice aún tiene la entrada.

Pero, una vez completada una transferencia, Alice deja de ser propietaria. Su otra solicitud ya no puede transferirla. Las reglas impiden que ambas transferencias se completen en un mismo historial, pero no indican a los distintos ordenadores cuál llega primero.

¿Por qué no utilizar la hora de llegada? Los mensajes tardan en viajar. Un nodo puede recibir primero la transferencia a Bob y otro la de Charlie. Ambos pueden respetar la regla de propiedad y llegar a conclusiones distintas.

La red necesita reglas para elegir entre propuestas rivales y establecer un historial común. Eso es el **[consenso](/es/glossary#consensus)**. Los participantes pueden proponer bloques distintos basados en el mismo historial anterior; el consenso determina qué rama válida se continúa.

La verificación y el consenso responden a preguntas distintas. La verificación comprueba que el historial respete las reglas. El consenso establece qué historial válido aceptan los participantes. Elegir un bloque no convierte una firma falsificada en válida para los nodos que la comprueban.

Las redes utilizan métodos distintos para seleccionar a quienes producen bloques y resistir la manipulación. Algunas vinculan la participación al trabajo computacional o a activos comprometidos; otras la limitan a participantes aprobados. La seguridad depende de esas reglas y de la distribución del control. El acuerdo no está garantizado ante cualquier ataque o fallo de red.

Bob también debe distinguir entre ver una transferencia reciente y considerarla definitiva. Un bloque reciente puede ser sustituido si la red elige otra rama. La **[finalidad](/es/glossary#finality)** describe la garantía de que una actualización ha quedado asentada; sus condiciones y su solidez dependen de la red. La aplicación de Bob puede mostrar el progreso hacia esa garantía.

## El recorrido de una transacción

Supongamos que el programa permite la transferencia de Alice. La red del ejemplo cobra comisiones por transacción para pagar el procesamiento y encarecer la saturación de la red con solicitudes.

1. **Preparar.** Alice selecciona la entrada 42 y la dirección de Bob. Su aplicación construye una transacción que pide al programa transferirla.
2. **Firmar.** El wallet muestra la solicitud y permite firmarla con su clave. La propiedad todavía no ha cambiado.
3. **Enviar.** La transacción firmada llega a un nodo y puede propagarse por la red. El envío no garantiza su inclusión.
4. **Procesar y verificar.** Un participante la incluye en un bloque propuesto. Los nodos verificadores comprueban el bloque y su ejecución. Si Alice sigue siendo propietaria y la transferencia se completa, el registro resultante identifica a Bob como propietario.
5. **Establecer el resultado.** El consenso determina si el bloque pertenece al historial aceptado. Bob espera la garantía de liquidación que proporciona la red.

La aplicación de Bob puede mostrar ahora el propietario registrado y si la transferencia ha alcanzado esa garantía.

## Aplicaciones, confianza y límites

Las aplicaciones pueden leer el mismo registro e interactuar con el mismo programa de entradas. Pueden ofrecer interfaces distintas sin crear entradas distintas. Las reglas compartidas se aplican independientemente de la aplicación que prepare la solicitud.

Esto hace que el registro sea útil más allá de una web. Pero una interfaz puede mostrar información desactualizada o tergiversar lo que autoriza una firma. Una red compartida no hace fiables todas las aplicaciones.

La entrada también muestra un límite. El registro puede establecer la propiedad según sus reglas, pero no demostrar que el concierto exista ni obligar a la sala a admitir a Bob. El organizador debe reconocer lo que representa el registro digital.

Hay otros límites. Los registros públicos pueden revelar actividad ligada a una dirección. Los programas pueden contener errores o conceder poderes especiales a administradores. Una firma auténtica puede autorizar un error, como enviar la entrada a una dirección equivocada. Distribuir la verificación también consume recursos de cálculo, almacenamiento y comunicación.

Una blockchain es una forma de organizar un registro compartido, no una necesidad para cualquier sistema de entradas. Si todos aceptan la autoridad de una organización, una base de datos convencional puede ser más sencilla. La ventaja aquí es que participantes independientes puedan mantener y comprobar un historial común sin dejar la autoridad exclusiva en manos de una aplicación.

## La blockchain en conjunto

Copiar la imagen de Alice nunca podía establecer quién debía tener la entrada después. El registro compartido responde mediante varias piezas que funcionan juntas: las firmas establecen la autorización, el programa define las transferencias permitidas, los nodos comprueban el procesamiento y los bloques enlazados organizan el historial. El consenso y las reglas de liquidación determinan en qué historial puede confiar Bob.

Bob puede consultar un registro de propiedad acordado en lugar de depender únicamente de la palabra de Alice o de una imagen.

El siguiente artículo, [Entender \[ Ethereum \]](/es/learn/ethereum-101), explica cómo una red concreta pone en práctica estas ideas.
