---
description: "Aprende cómo los oráculos llevan datos externos a los contratos inteligentes y por qué la calidad de los precios importa para los préstamos DeFi."
sourceRevision: f924086149ccfcbaf6906c004e701b0636ca058d5431a5f282d28ebacca9bd3d
title: "Entender los [ Oráculos ]"
draft: false
---

En [Entender la \[ DeFi \]](/es/learn/defi-101), Bob pidió 400 USDC aportando activos valorados en 1.000 dólares. Su posición podía liquidarse si ese respaldo perdía demasiado valor.

Pero el contrato registra tokens, no etiquetas con precios en dólares. ¿Cómo sabe cuánto valen los ETH de Bob? ¿Qué precio utiliza si los mercados muestran cifras distintas?

Esa es la función de un **oráculo**: proporcionar información que necesita el contrato y que no puede establecer únicamente con sus propios registros. Seguiremos un precio desde el mercado hasta el préstamo de Bob. Los precios y parámetros de riesgo son ilustrativos.

## Lo que puede saber el contrato

El contrato puede consultar cuántos tokens ha aportado Bob y cuánto debe. Son datos de la blockchain. Su valor actual en dólares es otro dato de entrada.

No puede pedir a cada nodo que abra una web y utilice el precio que aparezca. Las webs pueden cambiar entre consultas, dejar de funcionar o devolver respuestas distintas. Los nodos que procesan la misma transacción necesitan datos acordados para obtener el mismo resultado.

Un **[oráculo](/es/glossary#oracle)** conecta una fuente de información con la aplicación que la utiliza. Para un precio, puede recopilar observaciones del mercado, combinarlas y entregar un informe que el contrato pueda comprobar y utilizar.

## De las observaciones al precio de referencia

Supongamos que la garantía de Bob es **0,4 ETH**. Con un precio de referencia de **2.500 dólares por ETH**, el protocolo la valora en **1.000 dólares**.

No existe un único precio universal de ETH escrito en algún lugar. Los mercados pueden mostrar precios ligeramente diferentes, con distinta liquidez y actividad. Una fuente de precios necesita un método para elegir observaciones y combinarlas.

Como ejemplo sencillo, aceptamos tres observaciones: **2.490, 2.500 y 2.510 dólares**. Un sistema que toma el valor central, la **mediana**, comunicaría 2.500. Esto reduce la influencia de una observación anormalmente alta o baja frente a depender de una sola fuente. No convierte en fiable cualquier conjunto de fuentes.

Redes de oráculos como **Chainlink** pueden combinar información en varias etapas, incluidos proveedores de datos y nodos informadores. El método depende de la fuente de precios. Otros diseños utilizan precios ya registrados en mercados de la blockchain, a veces promediados durante un periodo.

Importan la independencia y la calidad de los datos. Diez participantes copiando una fuente poco fiable no ofrecen diez perspectivas independientes. Un mercado pequeño cuyo precio sea fácil de mover puede ser inadecuado para valorar un préstamo mucho mayor.

## Publicar un precio utilizable

En una configuración común, los participantes envían actualizaciones a un contrato de oráculo. El sistema comprueba que el informe cumple las reglas de autorización y aceptación. Un contrato de precios pone después la respuesta aceptada a disposición de otros contratos.

Cuando Bob pide prestado, devuelve dinero o se enfrenta a una liquidación, el protocolo consulta la fuente configurada y utiliza esa respuesta para valorar los activos. El precio de la pantalla de Bob no es necesariamente el que utiliza el contrato.

Aave, por ejemplo, utiliza infraestructura de oráculos para obtener valores de activos en sus mercados. Las fuentes elegidas y cualquier lógica adicional forman parte de la configuración. No todos los activos necesitan el mismo tipo de precio o dato de conversión.

Otros diseños entregan un informe firmado junto con la transacción que lo necesita, en lugar de depender solo de una respuesta publicada antes. En ambos casos, la aplicación debe saber qué informes acepta y cómo interpretarlos.

Una firma válida identifica a un informador autorizado. No demuestra por sí sola que el precio comunicado sea correcto.

## Un precio también tiene una fecha

Supongamos que el último precio aceptado era 2.500 dólares, pero el mercado ha caído mucho desde entonces. Un informe antiguo correctamente firmado puede seguir siendo una mala base para un préstamo nuevo.

Una fuente necesita algo más que una cifra. La fecha de actualización ayuda a decidir si sigue siendo suficientemente reciente. Algunas fuentes, incluidas muchas de Chainlink, se actualizan cuando el precio se mueve lo suficiente o transcurre un intervalo configurado. Eso no significa que cada movimiento aparezca instantáneamente en la blockchain.

La aplicación necesita reglas para informes ausentes o demasiado antiguos. Puede rechazar una operación o pausar parte del servicio en lugar de utilizar un precio que no cumpla sus condiciones. Los límites adecuados dependen del activo y la aplicación.

Una interrupción de red también importa. En una L2, la caída del secuenciador puede impedir actuar a los usuarios mientras los mercados externos siguen moviéndose. Las aplicaciones pueden comprobar el estado de la red y prever un periodo de recuperación antes de reanudar operaciones sensibles. Importan tanto el precio como las condiciones para reaccionar a él.

## El efecto del precio en el préstamo de Bob

Volvamos a los **0,4 ETH** y a la **deuda de 400 USDC**. Suponemos que USDC vale un dólar y que la posición tiene un **umbral de liquidación del 80 %**. Es un umbral inventado que determina cuándo se permite liquidar; no es el límite para pedir un préstamo nuevo ni una descripción de los parámetros actuales de Aave.

A 2.500 dólares por ETH, la garantía vale 1.000 dólares. El 80 % son 800, así que la deuda de 400 está por debajo del umbral.

Si el precio aceptado baja a **1.200 dólares por ETH**, el contrato valora la garantía en **480 dólares**. El 80 % son **384 dólares**, menos que la deuda de 400. Según nuestra regla, la posición ya puede liquidarse.

El oráculo proporcionó el precio. El contrato aplicó la regla del préstamo. Después, un participante puede enviar una transacción de liquidación; actualizar el precio no significa que el propio oráculo tome los ETH de Bob.

Un precio incorrectamente bajo puede hacer liquidable una posición suficientemente respaldada. Uno demasiado alto puede permitir un endeudamiento excesivo o retrasar liquidaciones mientras crecen las pérdidas. También hay que valorar el activo prestado: suponer que cada USDC vale siempre un dólar puede resultar falso durante una pérdida de paridad.

La selección de fuentes, la frecuencia de actualización y la configuración afectan a activos reales. Incluso un precio correcto en una moneda equivocada o para otro token puede producir un resultado incorrecto si la aplicación lo interpreta mal.

## Dónde reside la confianza

Un contrato puede aplicar sus reglas exactamente y aun así producir resultados perjudiciales por datos erróneos. Distribuir la ejecución entre ordenadores no elimina la necesidad de examinar de dónde vienen esos datos.

Fuentes independientes, una agregación robusta, comprobaciones de antigüedad y límites ante valores inusuales reducen ciertos riesgos. Nada convierte al oráculo en una garantía universal de verdad. Algunos sistemas también permiten a administradores sustituir una fuente o pausar su uso, añadiendo otra dependencia.

El principio va más allá de los precios. Un programa de entradas puede usar un informe sobre la cancelación de un concierto para aplicar una devolución. Sigue dependiendo de quién comunica la cancelación y de qué hace el contrato con el informe.

El préstamo de Bob concreta la distinción: la blockchain registra garantía y deuda, el oráculo aporta el dato de valoración y el contrato decide qué significa para su posición. Entender un oráculo consiste en seguir ese recorrido, no en tratar una cifra dentro de un contrato como un hecho que la blockchain descubrió por sí misma.
