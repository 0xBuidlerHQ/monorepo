---
description: "Explora las finanzas descentralizadas: intercambios, pools de liquidez, staking, préstamos, garantías y liquidación, con ejemplos de Alice y Bob."
sourceRevision: cc21c923a58498c316f53c9c7c18800e69d55e9523a7cb0084f28d34ac8c8637
title: "Entender la [ DeFi ]"
draft: false
---

Alice ha vendido la entrada 42 a Bob por **0,6 ETH**. En [Entender \[ Ethereum \]](/es/learn/ethereum-101), su programa hizo que el pago y la transferencia de la entrada ocurrieran juntos.

Ahora quiere poner ese dinero a trabajar. En lugar de dedicarlo todo a un activo o servicio, decide repartirlo: una parte para hacer staking mediante Lido, otra para prestar mediante Aave y otra para un token de un proyecto que le gusta.

Estas decisiones nos llevan a las **finanzas descentralizadas**, o **DeFi**: servicios financieros construidos alrededor de smart contracts. Seguiremos qué hace Alice, qué puede generar rendimiento y qué puede salir mal. Los importes y los valores de cambio son ilustrativos.

## Tres usos para el dinero recibido

Alice divide sus **0,6 ETH en tres partes de 0,2 ETH**. La primera mantendrá la exposición a ETH mediante staking; la segunda se cambiará por una stablecoin vinculada al dólar para prestarla; la tercera servirá para comprar el token del proyecto.

Cada servicio se rige por un **[protocolo](/es/glossary#protocol)**: las reglas y los contratos que lo implementan. La aplicación ayuda a preparar las solicitudes; los contratos registran su posición y determinan qué puede ocurrir con los activos.

El reparto distingue entre posibles recompensas de staking, intereses de préstamos y variaciones del precio del token. Veamos cada parte.

## Swaps y pools de liquidez

Para la parte destinada a préstamos, Alice cambia primero **0,2 ETH por 500 USDC**. USDC es una **[stablecoin](/es/glossary#stablecoin)** diseñada para seguir el dólar estadounidense. Cambiar un activo por otro es un **[swap](/es/glossary#swap)**.

Esos USDC tienen que proceder de algún sitio. En un intercambio basado en pools, otros participantes depositan activos en un contrato que los pone a disposición de los intercambios. Los depósitos forman un **[pool de liquidez](/es/glossary#liquidity-pool)**; quienes depositan son **proveedores de liquidez**. Sus activos permiten a Alice cambiar ETH por USDC.

Cuando se completa el swap, el pool recibe el activo de Alice y envía USDC a su dirección. Parte de la comisión va a los proveedores porque sus activos hicieron posible el intercambio. Servicios como Uniswap utilizan pools de esta manera.

Aportar liquidez es otra forma de buscar rendimiento: cobrar comisiones por los intercambios que utilizan esos activos. Pero las operaciones también cambian la composición de la posición del proveedor. Las comisiones pueden no compensar las pérdidas frente a conservar los activos originales. Alice utiliza el pool para cambiar su dinero; en este ejemplo no aporta liquidez.

## Hacer staking de ETH con Lido

Alice aporta sus primeros **0,2 ETH** a través de Lido. Para entender el posible rendimiento, hay que ver qué ayudan a hacer esos ETH.

Ethereum utiliza el **[staking](/es/glossary#staking)** para proteger la red. Los validadores comprometen ETH y participan en la propuesta y comprobación de bloques. Participar correctamente puede generar recompensas; los fallos y ciertas infracciones pueden provocar penalizaciones. Las recompensas remuneran la participación en la seguridad, no son intereses pagados por un prestatario.

Lido reúne ETH de usuarios y los dirige a validadores gestionados por operadores participantes. Alice puede participar sin operar su propio validador. Mediante el servicio recibe **stETH**, un token que representa su participación en los ETH en staking y sus resultados. Su saldo de stETH se ajusta para reflejar las recompensas o penalizaciones asignadas, descontando la comisión del protocolo.

Como la posición está representada por un token transferible, se llama **staking líquido**. Alice puede conservar stETH, transferirlo o utilizarlo en aplicaciones compatibles mientras los ETH subyacentes participan en staking.

El token no hace que esos ETH se puedan retirar inmediatamente. La retirada mediante Lido puede exigir esperar. Vender stETH en un mercado es otra vía, al precio que los compradores acepten. Alice sigue expuesta al precio de ETH y a los riesgos de los validadores y los contratos.

## Prestar USDC mediante Aave

Alice aporta los **500 USDC** del swap a **Aave**, un protocolo de préstamos. El depósito está denominado en USDC; Aave es el servicio que pone esos activos a disposición de prestatarios y registra el derecho de Alice sobre el pool.

Los prestatarios pagan intereses, una parte de los cuales llega a proveedores como Alice. El tipo cambia según la demanda de préstamos y los activos disponibles. Su rendimiento procede de prestar, a diferencia de las recompensas de red de stETH.

Supongamos que Bob quiere pedir **400 USDC** sin vender sus ETH restantes. Aporta **0,4 ETH**, valorados aquí en **1.000 dólares**, como **[garantía](/es/glossary#collateral)**. Se parece a un préstamo lombardo en las finanzas tradicionales: pedir prestado contra unos activos en lugar de venderlos. Las reglas del protocolo determinan si la garantía permite el préstamo solicitado.

Bob recibe USDC del pool y debe esa cantidad más intereses. Si la garantía pierde demasiado valor frente a la deuda, la posición puede ser **[liquidada](/es/glossary#liquidation)**: otro participante paga parte de la deuda y recibe parte de la garantía según las reglas del protocolo. Esto protege al pool al hacer cumplir el respaldo de los préstamos, aunque no elimina todas las pérdidas posibles.

Alice no elige personalmente a Bob ni negocia su tipo. Aporta a un mercado compartido. Puede solicitar una retirada, pero recibir los activos depende de que haya liquidez suficiente. Su posición también depende de los contratos de Aave y de que USDC mantenga el valor previsto.

## Comprar el token de un proyecto

Con los últimos **0,2 ETH**, Alice compra el token de un proyecto que sigue. El mismo tipo de swap permite cambiar sus ETH por ese token.

Supongamos que permite votar determinadas decisiones o acceder a un servicio. Esos usos pueden interesarle, pero no lo convierten automáticamente en una acción de una empresa ni en un derecho a beneficios. Los derechos dependen de las reglas reales del proyecto.

Su expectativa principal es que el precio pueda subir. Si lo vende por más de lo que pagó, obtiene una ganancia. Conservarlo no genera automáticamente intereses ni recompensas de staking, y el precio puede bajar aunque el proyecto siga funcionando.

## Entender el rendimiento

Alice puede preguntarse de dónde procede cada posible ganancia. Del trabajo de los validadores de Ethereum en el staking, de los prestatarios en los préstamos y de lo que futuros compradores quieran pagar por el token. Los proveedores de liquidez, por su parte, reciben comisiones de intercambio.

Una **[APR o APY](/es/glossary#apr-and-apy)** expresa un tipo anual; la APY incluye la reinversión de ganancias. Un tipo variable no promete el mismo rendimiento durante todo un año.

Hay otra pregunta: ¿rendimiento medido en qué? El saldo de stETH puede aumentar mientras ETH cae en dólares. Sus USDC pueden generar intereses mientras cada unidad cotiza por debajo del dólar previsto. Tener más unidades y tener más valor total no son necesariamente el mismo resultado.

## Diversificar sin perder el hilo

Alice ha convertido un pago en tres posiciones: ETH en staking representados por stETH, un préstamo de USDC y un token de proyecto. Puede identificar qué representa cada una, de dónde podría venir una ganancia y cómo salir.

Repartir el dinero reduce la dependencia de una sola posición, pero no las hace independientes. Comparten dependencias de Ethereum y los smart contracts, y los precios de los criptoactivos pueden caer juntos. Lido y Aave tienen además sus propias reglas y formas de administración; una red abierta no evita tener que entender los servicios que funcionan sobre ella.

DeFi permite combinar estos servicios con activos y programas de una red compartida. Conviene seguir qué está haciendo el dinero: proteger una red, financiar prestatarios, facilitar intercambios o comprar un activo esperando que suba. Cada actividad tiene su fuente de rendimiento y su manera de perder dinero.

[Entender las \[ Stablecoins \]](/es/learn/stablecoins-101) examina qué conecta los 500 USDC de Alice con los 500 dólares que pretenden representar.
