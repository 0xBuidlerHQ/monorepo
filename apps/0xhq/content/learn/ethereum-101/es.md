---
sourceRevision: fc2bacc0d26ac0cca9060d4c7da8598261b2c71c138c84d0afb539b628be2297
title: "Entender [ Ethereum ]"
draft: false
---

En [Entender la \[ Blockchain \]](/es/learn/blockchain-101), Alice quería darle la entrada 42 a Bob. Ahora imaginemos que prefiere vendérsela.

Enviar la entrada y el dinero por separado plantea un problema. Si Alice transfiere primero, Bob podría no pagar. Si Bob paga primero, Alice podría quedarse la entrada. Quieren un intercambio en el que ambas cosas sucedan juntas.

Vamos a poner su sistema de entradas en Ethereum y seguir la venta. El registro compartido, las firmas y los bloques funcionan como vimos antes. Las preguntas nuevas son qué permite hacer Ethereum al programa, qué pueden utilizar como dinero y por qué usar la red tiene un coste.

## Ethereum y los programas compartidos

El organizador necesita publicar su programa de entradas en un lugar donde Alice, Bob y sus aplicaciones puedan utilizar las mismas reglas. Ethereum ofrece una blockchain pública donde se pueden desplegar smart contracts. Desplegar significa publicar el código y los datos iniciales de un contrato mediante una transacción. El contrato pasa a tener una dirección con la que pueden interactuar las aplicaciones.

Nuestro contrato registra la propiedad. El organizador también incluye una función de venta: el propietario fija un precio y un comprador puede adquirir la entrada a ese precio. Son reglas escritas por el desarrollador; Ethereum no incorpora un servicio de entradas de conciertos.

Ethereum define el entorno que ejecuta esas reglas: la **Ethereum Virtual Machine**, o **EVM**. Se puede entender como un conjunto común de instrucciones para ejecutar contratos, en lugar de un ordenador gestionado por el organizador. Los nodos que comprueban la ejecución aplican esas mismas instrucciones para obtener el mismo resultado.

## Ether, la criptomoneda nativa

Alice y Bob necesitan un activo que el programa pueda transferir como pago.

Ethereum tiene una moneda integrada llamada **ether**, abreviada **ETH**. Las propias reglas de la red registran los saldos de ETH y permiten transferirlo mediante transacciones. ETH es, por tanto, la **criptomoneda nativa** de Ethereum: pertenece al protocolo subyacente y no la crea la aplicación de entradas.

También se habla de «moneda nativa» o «token nativo». Aquí esas expresiones se refieren a ETH. Ethereum es la red; ether es su moneda. Tener ETH no significa tener acciones de una empresa llamada Ethereum.

Alice pone la entrada 42 a la venta por **0,6 ETH**, un precio inventado para el ejemplo. Bob necesita suficientes ETH para la compra y la comisión de red, que calcularemos enseguida.

ETH sirve como pago si el vendedor lo acepta, pero su poder adquisitivo no es fijo. Los 0,6 ETH de Alice no garantizan una cantidad concreta de euros o dólares. ETH también paga las comisiones de Ethereum, y los participantes comprometen ETH mediante el [staking](/es/glossary#staking) para ayudar a proteger la red.

## Los tokens y la entrada

La red registra ETH, pero no sabe qué significa una entrada de concierto. Ese significado procede del contrato de entradas.

Un **[token](/es/glossary#token)** es un activo representado y gestionado mediante reglas en una blockchain. Cuando lo emite un contrato, este registra los saldos o la propiedad y define cómo pueden cambiar. Un wallet muestra esa información; no contiene un objeto independiente que se mueva físicamente.

La entrada 42 tiene su propia identidad. Puede representar un asiento concreto; cambiarla por la entrada 43 podría darle a Bob otro asiento. Un token cuya identidad individual importa es **no fungible**. Un **NFT** es un token no fungible. El sistema puede utilizar **ERC-721**, una interfaz estándar para consultar la propiedad y transferir tokens identificados individualmente.

La dirección del contrato y el identificador de la entrada identifican conjuntamente nuestra entrada. Otro contrato podría emitir un token número 42 sin que fuera la misma entrada.

Los tokens que funcionan como dinero son distintos. Si Bob paga 1.500 unidades del mismo token de pago, Alice suele interesarse por la cantidad, no por qué unidades concretas recibe. Son **fungibles**: intercambiables dentro de ese activo. **ERC-20** les proporciona una interfaz común para saldos y transferencias. Los estándares permiten a los wallets y aplicaciones admitir muchos activos sin aprender una interfaz distinta para cada uno.

El organizador podría aceptar una **[stablecoin](/es/glossary#stablecoin)**, un token diseñado para seguir un valor de referencia como el dólar estadounidense. Alice podría fijar el precio en 1.500 unidades.

Para nuestra venta, Alice elige ETH. **ETH es nativo de Ethereum; la entrada y un token de pago ERC-20 se gestionan mediante contratos ejecutados en Ethereum.** Un token no necesita su propia blockchain.

## Intercambiar la entrada y el pago a la vez

Alice utiliza el contrato para poner la entrada 42 a la venta por 0,6 ETH. Suponemos que este contrato específico incluye las reglas de venta y permite revender.

La aplicación de Bob prepara una transacción de compra dirigida al contrato. Solicita la entrada 42 y adjunta 0,6 ETH. El contrato comprueba que Alice siga siendo propietaria, que la oferta esté activa y que Bob haya aportado el importe requerido. Si todo se cumple, su código transfiere la propiedad a Bob y paga a Alice.

Estas operaciones forman parte de una sola ejecución. Si falla un paso obligatorio, se revierten los cambios de propiedad y de pago de la transacción. Bob no acaba pagando a Alice mientras ella conserva la entrada en esa misma compra. Esta propiedad se llama **atomicidad**: los cambios del intercambio se aplican juntos o no se aplican.

Los contratos también pueden llamar a otros contratos, lo que permite a un mercado combinar el pago y la transferencia de entradas. Esta capacidad de composición permite crear servicios alrededor de activos existentes. El mercado necesita los permisos correspondientes; conocer la dirección del token no le permite apropiarse de la entrada de Alice.

La atomicidad se aplica al intercambio programado. La venta sigue necesitando código correcto y una sala que acepte la entrada, como vimos antes.

## El gas como medida de ejecución

La compra hace que la red ejecute comprobaciones y actualice datos. Una compra más compleja podría requerir más trabajo. Ethereum necesita medirlo e impedir que una solicitud se ejecute sin límite. Cobrar por la ejecución también hace costoso consumir la capacidad limitada de la red, incluso para quien intenta saturarla.

El **[gas](/es/glossary#gas)** es la unidad que mide la ejecución. Cada operación tiene un coste en gas. La compra consume gas conforme se ejecutan sus instrucciones; no es el precio de la entrada ni una segunda moneda que Bob deba comprar.

La transacción especifica un **límite de gas**, el máximo de unidades que puede consumir. Si la ejecución necesita más, se detiene y se revierten los cambios de la compra. El wallet estima un límite adecuado antes del envío. Es un techo, no una predicción de que se utilizarán todas las unidades.

Consultar al propietario actual desde una aplicación normalmente no exige una comisión de transacción a Bob, porque no solicita un cambio en Ethereum. Comprar la entrada sí.

## Las comisiones de gas y el precio de la entrada

El gas mide la ejecución; el **precio del gas** determina cuántos ETH cuesta cada unidad. Para esta transacción ordinaria de compra:

**Comisión de transacción = gas utilizado × precio efectivo por unidad de gas.**

El precio suele expresarse en **gwei**. Un gwei es una milmillonésima parte de ETH. Supongamos que la compra utiliza **100.000 unidades de gas** a **20 gwei por unidad**:

**100.000 × 20 gwei = 2.000.000 gwei = 0,002 ETH.**

Son cifras ilustrativas, no una cotización actual ni un coste fijo por comprar entradas. Bob gasta **0,6 ETH en la entrada y 0,002 ETH en comisiones**. Si tenía 1,1 ETH, después conserva 0,498 ETH.

En la red principal de Ethereum, la comisión se paga en ETH aunque se transfiera un token. Pagar la entrada con una stablecoin no eliminaría esa comisión. Un servicio puede cubrirla por Bob, pero alguien sigue pagando el coste subyacente.

El precio efectivo incluye una **comisión base**, que el protocolo ajusta según la demanda, y una **comisión de prioridad** para el validador que propone el bloque. Un validador participa en la propuesta de bloques y el proceso de acuerdo de Ethereum. La parte de la comisión base se destruye, o se **quema**, en lugar de pagarse al validador. Bob puede fijar topes de comisión; si no cubren la comisión base necesaria, la transacción puede quedarse esperando. Su wallet utiliza estas reglas para estimar el coste.

La comisión puede subir porque el programa consume más gas o porque cada unidad se encarece al aumentar la demanda de ejecución. Una entrada más cara no exige automáticamente más gas.

## La venta completada

Alice registra primero su oferta mediante una transacción. Bob revisa después la compra: el contrato correcto, la entrada 42, el precio de 0,6 ETH y la comisión estimada.

Si la compra se completa, Bob es propietario de la entrada y Alice ha recibido 0,6 ETH. Bob espera la garantía de liquidación explicada en el artículo sobre blockchain. Su wallet puede mostrar su saldo de ETH y la entrada, aunque las reglas nativas de Ethereum registran el primero y el contrato de entradas registra la segunda.

Han utilizado un programa para unir pago y propiedad. Ethereum proporciona el entorno de ejecución compartido; los contratos definen los activos y la venta; ETH sirve como pago nativo y para las comisiones; el gas mide la ejecución que esas comisiones pagan.

El siguiente artículo, [Entender los \[ Wallets \]](/es/learn/wallets-101), explica cómo Alice se conecta a las aplicaciones y qué autoriza mediante su wallet.
