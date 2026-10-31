---
description: "Entiende las redes de capa 2 de Ethereum, los rollups, los puentes y la liquidación siguiendo a Alice al mover USDC entre redes."
sourceRevision: 2ae2377c800ed8d8b36f092c4293b8f7a70db6b051e55720c6b3d8f730551da7
title: "Entender las [ Capas 2 ]"
draft: false
---

Alice entiende qué respalda los 500 USDC de [Entender las \[ Stablecoins \]](/es/learn/stablecoins-101). Retira 200 de su posición de préstamo para utilizarlos en otra aplicación.

La aplicación ofrece varias redes: Ethereum, Arbitrum One, Base y OP Mainnet. Algunas muestran comisiones inferiores. Alice conecta su wallet habitual, elige Arbitrum One y no ve ningún USDC.

El dinero no ha desaparecido. Está mirando otra red. Para entender dónde están sus activos y cómo usarlos allí, veamos las **redes de capa 2** de Ethereum, normalmente llamadas **L2**.

## Por qué utilizar otra red

La red principal de Ethereum es su **capa 1**, o **L1**. Tiene una capacidad limitada para ejecutar transacciones y registrar sus datos. Cuando muchas personas quieren utilizarla, compiten por ella mediante las comisiones.

Una capa 2 ejecuta las operaciones en una red separada y utiliza Ethereum para ayudar a establecer y hacer cumplir los resultados aceptados. La idea es procesar más actividad sin que la red principal ejecute individualmente cada acción del usuario.

**Arbitrum One, Base y OP Mainnet** son ejemplos de L2 de Ethereum. Son redes distintas con actividad y aplicaciones propias, no tres nombres para el mismo saldo de Ethereum.

Trasladar el trabajo a otra red sería fácil si los usuarios confiaran sin más en su operador. La pregunta importante es cómo puede Ethereum ayudar a proteger el resultado. Una respuesta habitual es el **rollup**.

## Los rollups y su conexión con Ethereum

Un rollup ejecuta transacciones en su propia red y publica en Ethereum datos sobre lotes de actividad y compromisos sobre el **estado** resultante: los saldos y datos de los contratos después de esas transacciones. Un compromiso es una referencia compacta al estado, como un hash.

Un **secuenciador** suele recibir y ordenar las solicitudes y dar al usuario una visión rápida del resultado. Otros nodos pueden comprobar la ejecución. Los contratos en Ethereum y el mecanismo de verificación del rollup determinan qué resultados pueden aceptarse para la liquidación.

Muchas acciones comparten el coste de publicar un lote en Ethereum. Junto con otro entorno de ejecución y la compresión de datos, esto ayuda a abaratar las transacciones L2. Las comisiones siguen dependiendo de la red y la demanda; no son fijas ni siempre inferiores.

Dos enfoques principales gestionan la validez. Los **rollups optimistas** permiten impugnar resultados durante un periodo definido. Una impugnación válida impide aceptar un resultado inválido. Dependen de que el sistema de impugnaciones funcione y sea accesible.

Los **rollups de validez**, conocidos como **ZK-rollups**, presentan pruebas criptográficas de que el cambio de estado cumple las reglas. Ethereum verifica la prueba en lugar de ejecutar otra vez cada acción. La seguridad sigue dependiendo de sistemas de prueba y contratos correctos, y del acceso a los datos necesarios.

Estos mecanismos explican lo que aporta una L2 frente a una blockchain independiente barata: una conexión entre su ejecución y las reglas de liquidación de Ethereum. La protección real depende del diseño y la operación de cada sistema.

## Un wallet con saldos separados

Alice puede utilizar la misma dirección en Ethereum y Arbitrum One. Eso no crea un saldo único compartido entre redes.

Sus 200 USDC están registrados por el contrato USDC de Ethereum. Elegir Arbitrum One pide al wallet que lea los registros de esa red, donde Alice puede no tener USDC todavía. Volver a Ethereum muestra el saldo original.

Una aplicación también puede tener despliegues distintos en cada red. Un pool de préstamos en Ethereum y otro en Arbitrum One no comparten automáticamente depósitos, liquidez o tipos por utilizar el mismo nombre.

Para identificar un activo, Alice necesita ahora **la red y el contrato del token**. Un símbolo conocido no basta. Para disponer del activo en otra red necesita un proceso de transferencia entre ambas.

## Puentes y transferencias entre redes

Un **puente** coordina la transferencia de un activo o mensaje entre redes. No saca físicamente un token de la base de datos de una blockchain para meterlo en otra.

En un diseño común, un contrato bloquea tokens en la red de origen. Cuando el destino acepta la prueba del depósito, emite una representación correspondiente. Volver por ese puente invierte el proceso: se destruye la representación y se liberan los activos bloqueados según sus reglas.

Otro enfoque utiliza al emisor del activo. Para USDC, el **Cross-Chain Transfer Protocol** de Circle, o **CCTP**, quema unidades en origen y emite USDC nativos en un destino compatible después de que Circle certifique la quema. Evita crear un token que represente USDC bloqueados en un puente tradicional, pero mantiene la dependencia de la infraestructura y autorización de Circle.

Alice elige una ruta compatible para los USDC nativos que acepta la aplicación de destino. Una vez completada, la cantidad está disponible en Arbitrum One, no se puede gastar a la vez en ambas redes.

La ruta importa. El puente del rollup, uno de terceros y el protocolo de un emisor pueden tener verificaciones, plazos y poderes administrativos distintos. Elegir la red de destino no determina por sí solo la seguridad de la transferencia.

## Tokens nativos y versiones transferidas por puentes

En Arbitrum One, **USDC nativo** y **USDC.e** muestran por qué importa el activo exacto. Circle emite USDC nativo directamente en esa red. USDC.e representa USDC de Ethereum mediante un puente y depende de ese respaldo.

Ambos buscan el mismo valor en dólares, pero tienen contratos y dependencias distintos. Un servicio puede aceptar uno y no el otro. Sus precios y la liquidez para intercambiarlos también pueden diferir.

Aquí, «USDC nativo» significa emitido directamente por Circle en esa red. No significa que sea su moneda nativa en el sentido de que ETH lo es de Ethereum.

Alice comprueba qué versión utiliza la aplicación. Si recibe una versión de puente y se espera USDC nativo, cambiar su nombre en pantalla no los hace intercambiables; necesita una conversión compatible u otra ruta.

Tiene que entender tanto qué respalda el valor en dólares como la conexión de ese token concreto con dicho respaldo.

## Confirmaciones rápidas y liquidación final

Una vez recibidos los USDC adecuados, Alice puede usar la aplicación en Arbitrum One. El secuenciador puede mostrar rápidamente el resultado mientras la publicación y liquidación en Ethereum ocurren después.

Ver ese resultado rápido no equivale a completar una retirada a Ethereum. La retirada estándar por el puente de un rollup optimista puede requerir varios días por el proceso de impugnación. Un servicio más rápido puede adelantar activos en destino, introduciendo sus propias necesidades de liquidez y confianza. Una transferencia del emisor puede seguir otro proceso.

Las L2 también difieren en quién opera el secuenciador, quién puede actualizar contratos y qué pueden hacer los usuarios si el operador no responde. Apoyarse en Ethereum no elimina esos detalles. Una red también puede ser compatible con sus aplicaciones sin ser un rollup de Ethereum.

La dirección de Alice sigue siendo la misma, pero la transferencia cambió dónde están registrados sus 200 USDC. El puente o proceso del emisor conecta los registros de activos; la verificación del rollup conecta la ejecución con Ethereum.

Unas comisiones inferiores hacen prácticas más operaciones, pero son solo una parte del sistema. Importa dónde se registran los activos, qué versión tiene Alice y qué reglas le permiten utilizarlos o salir de la red.

[Entender los \[ Oráculos \]](/es/learn/oracles-101) vuelve al préstamo de Bob para explicar cómo obtienen los contratos precios y otra información externa.
