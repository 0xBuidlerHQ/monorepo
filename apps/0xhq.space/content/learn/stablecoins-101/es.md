---
description: "Aprende cómo las stablecoins buscan seguir una moneda, qué respalda tokens como USDC, cómo mantienen su paridad y por qué pueden perderla."
sourceRevision: 632a467c945a456717db2ca29c7bc6f80bdd2618a7f9317645a9f8b24e2d9463
title: "Entender las [ Stablecoins ]"
draft: false
---

En [Entender la \[ DeFi \]](/es/learn/defi-101), Alice cambió parte de los ETH de la venta por 500 USDC. Después tratamos esas unidades como si valieran 500 dólares. Volvamos a esos tokens antes de que los aporte al protocolo de préstamos.

Su wallet puede confirmar que tiene 500 tokens. Pero ¿qué hace que valgan 500 dólares? ¿Bastaría con escribir «un dólar» en un contrato para darle ese valor a cualquier token?

El saldo y el precio de un token son cosas distintas. Para entender el dinero de Alice, tenemos que seguir la conexión entre sus tokens y los dólares que pretenden representar.

## Un valor de referencia

Una **[stablecoin](/es/glossary#stablecoin)** es un token diseñado para seguir un valor de referencia. En una stablecoin de dólar, el objetivo habitual es un dólar estadounidense por unidad. Otras siguen monedas como el euro. El valor que el token intenta mantener se llama **paridad**, o **peg**.

Esto permite fijar el precio de una entrada, pagar o expresar una deuda sin elegir una moneda cuyo precio fluctúe como ETH. Se pretende que 500 unidades sigan valiendo cerca de 500 dólares.

El objetivo no fija el precio automáticamente. Si Alice vende sus tokens, recibe lo que los compradores estén dispuestos a pagar. Mantener el precio cerca de la referencia exige un mecanismo que dé motivos para intercambiar el token cerca de un dólar.

«Estable» también depende de la moneda de referencia. Un token ligado al dólar puede cambiar de valor en euros cuando se mueven los tipos de cambio, y el poder adquisitivo del dólar puede variar con el tiempo.

## Reservas y reembolso

Un modelo común utiliza un emisor que conserva activos fuera de la blockchain para respaldar los tokens. Esos activos son sus **reservas**. Pueden incluir depósitos bancarios y deuda pública a corto plazo, no solo efectivo en una cuenta.

En un ejemplo simplificado, un cliente que cumple los requisitos envía 500 dólares al emisor. Este añade el valor a sus reservas y crea 500 tokens. Crear unidades se llama **acuñar**, o **minting**. Los tokens pueden circular después entre wallets y aplicaciones sin una nueva transferencia bancaria cada vez que cambian de manos.

Cuando un titular autorizado devuelve 500 tokens a cambio de 500 dólares, se produce un **reembolso**. Los tokens devueltos se retiran de circulación, o se **queman**, al realizarse el pago. La emisión y el reembolso conectan la cantidad de tokens con los activos que los respaldan.

Alice consiguió sus tokens mediante un swap, así que su compra no creó necesariamente tokens nuevos ni añadió dólares a las reservas. Transfirió tokens existentes del pool a su dirección. Aportarlos a un protocolo de préstamos también pone tokens existentes a disposición de prestatarios; no crea otra reserva de dólares detrás de ellos.

El reembolso directo depende de las condiciones del emisor y de que el titular cumpla sus requisitos. Alice puede optar por vender en un mercado u otro servicio. Tener el token no le indica, por sí solo, qué vía para obtener dólares tiene disponible.

## Cómo se mantiene el precio cerca de un dólar

Supongamos que el token respaldado por reservas cotiza a **0,98 dólares**, pero determinados operadores pueden reembolsarlo por un dólar. Uno podría comprar 500 unidades por 490 dólares y obtener 500 al devolverlas. La diferencia de diez dólares sería una ganancia potencial antes de costes.

La compra de tokens con descuento genera demanda y el reembolso retira unidades de circulación. Ambos efectos pueden ayudar a acercar el precio de mercado a un dólar.

La oportunidad opuesta aparece si cotiza a **1,02 dólares**. Un participante que pueda crear 500 unidades por 500 dólares podría venderlas por 510. Emitir y vender añade oferta y ayuda a bajar el precio.

Operar para aprovechar una diferencia de precio así se llama **arbitraje**. Alice no necesita hacerlo para que la actividad de otros contribuya a mantener la paridad.

La condición esencial es que la oportunidad sea realmente accesible. Si el reembolso está bloqueado, es demasiado lento o deja de inspirar confianza, un precio bajo puede no atraer suficientes compradores. La paridad depende de un acceso funcional a las reservas, no solo de que el emisor declare un objetivo.

## Distintas formas de respaldar el mismo objetivo

No todas las stablecoins de dólar utilizan una empresa con activos en cuentas bancarias y de inversión.

Otro diseño permite bloquear criptoactivos admitidos en contratos y crear stablecoins contra esa garantía. A diferencia del depósito de Alice en Aave, que presta USDC existentes, esta operación emite unidades nuevas.

Normalmente exige más valor en garantía que stablecoins emitidas, con datos de precios y reglas de liquidación que ayudan a mantener el respaldo. Devolver la deuda emitida retira las unidades correspondientes y libera la garantía según las reglas del protocolo.

Algunos diseños también utilizan como garantía stablecoins respaldadas por reservas, trasladando al nuevo token la dependencia de sus emisores.

Otros, llamados habitualmente **stablecoins algorítmicas**, intentan mantener el objetivo principalmente ajustando la oferta o convirtiendo a otro token, en lugar de contar con reservas independientes suficientes. Si ese otro token pierde valor cuando cae la confianza, el mecanismo puede debilitarse justo cuando los titulares intentan salir. Ajustar la oferta por código no crea activos con los que pagar a todo el mundo.

Los sistemas reales pueden combinar estos enfoques. Algunos ejemplos muestran cómo objetivos similares pueden depender de respaldos diferentes:

- **USDC**, el token de Alice, lo emite **Circle** y busca valer un dólar. Su respaldo incluye depósitos bancarios y deuda pública estadounidense a corto plazo: sigue el modelo de emisor y reservas descrito antes.
- **USDT**, emitido por **Tether**, también busca valer un dólar. Utiliza reservas del emisor, pero con otro emisor, otra composición y otras condiciones de reembolso. USDT y USDC no representan el mismo respaldo por compartir objetivo.
- **DAI y USDS** pertenecen al ecosistema **Sky**, antes MakerDAO. Buscan seguir al dólar mediante un protocolo respaldado por garantías; DAI puede convertirse en USDS en una proporción de uno a uno. El respaldo no se limita a ETH y puede incluir otras stablecoins y exposición a activos externos a la blockchain.
- **USDe**, de **Ethena**, es un dólar sintético. Combina activos de respaldo con posiciones financieras diseñadas para compensar movimientos de precios de criptoactivos. Su estabilidad depende también de esas posiciones y de los mercados utilizados, no simplemente de una reserva de dólares.
- **EURC**, también de **Circle**, busca valer **un euro** y utiliza reservas en euros. La principal diferencia respecto a USDC es la moneda de referencia: un EURC no pretende equivaler a un dólar.

## Cuando se rompe la paridad

Imaginemos que los titulares dudan de las reservas o de que se tramiten los reembolsos. Más personas intentan vender y menos quieren comprar cerca de un dólar. El precio puede caer por debajo del objetivo. Una desviación importante se llama **pérdida de paridad**, o **depeg**.

Si Alice conserva 500 unidades y el precio baja a **0,90 dólares**, valen aproximadamente **450 dólares** a ese precio. La blockchain puede seguir registrando exactamente 500 unidades. No ha fallado al contarlas; ha cambiado su valor de cambio.

La pérdida de paridad puede ser temporal, por ejemplo por una interrupción bancaria o del reembolso, o reflejar una insuficiencia duradera del respaldo. La recuperación no es automática. Incluso unos activos suficientes sobre el papel pueden ser difíciles de convertir rápidamente en pagos si muchos titulares piden reembolsos a la vez.

La distinción también importa para el préstamo de Bob. Deber 400 unidades significa deber esas unidades según las reglas del protocolo, no necesariamente una cantidad permanentemente fija de 400 dólares. Una pérdida de paridad cambia su valor de mercado y puede afectar a prestatarios y proveedores.

## Qué tiene realmente Alice

Sus 500 tokens le dan un activo transferible que pretende seguir al dólar. No son simplemente 500 dólares trasladados de una cuenta bancaria a un wallet.

Con un token respaldado por reservas, su confianza depende de los activos del emisor y de las vías para obtener dólares. Los informes de reservas ayudan a describir el respaldo, pero el saldo en la blockchain no demuestra por sí solo que esos activos existan o sean accesibles. Algunos emisores también pueden congelar transferencias desde determinadas direcciones mediante poderes administrativos del contrato.

El valor de referencia, el respaldo y el precio de mercado son tres piezas distintas que deben seguir funcionando juntas.

Eso es lo que escondía la expresión «500 unidades de stablecoin». La blockchain registra cuántas tiene Alice. El diseño da motivos para valorar cada una cerca de un dólar. La solidez de esa conexión determina hasta qué punto pueden servir como 500 dólares en su próximo pago, intercambio o préstamo.

[Entender las \[ Capas 2 \]](/es/learn/layer-2-101) sigue los USDC de Alice entre redes para explicar los rollups y los puentes.
