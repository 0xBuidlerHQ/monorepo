---
description: "Entiende los wallets, las cuentas, las claves privadas, las firmas, los permisos y la recuperación siguiendo a Alice mientras utiliza sus ETH."
sourceRevision: 4a993e40954aadd3133fb373b787443f0925a96faa33cb459aaf4347c7acc246
title: "Entender los [ Wallets ]"
draft: false
---

Alice ha recibido 0,6 ETH por vender la entrada 42. En [Entender \[ Ethereum \]](/es/learn/ethereum-101) seguimos lo que hicieron la red y el contrato. Ahora abre una aplicación para utilizar lo que ha ganado.

La web le pide conectar un wallet. Poco después, el wallet muestra una solicitud de firma. ¿Conectarlo da a la web control sobre su dinero? ¿Todas las firmas mueven activos? ¿Qué ocurre si pierde el móvil?

Estas preguntas tratan de la frontera entre la cuenta de Alice, su wallet y las aplicaciones que piden permiso para actuar.

## El wallet y la cuenta

Ya vimos que los activos se registran en la blockchain y que las claves autorizan acciones. Un **[wallet](/es/glossary#wallet)** hace utilizable esa relación: muestra los activos de una cuenta, prepara solicitudes y permite producir firmas autorizadas.

La cuenta de Alice es la identidad que la red utiliza para registrar sus ETH. El wallet es la herramienta con la que accede a ella. Desinstalarlo no elimina la cuenta ni su saldo de Ethereum.

Por eso dos aplicaciones de wallet compatibles pueden mostrar la misma cuenta. Leen el mismo registro y utilizan la misma autoridad para firmar; no crean dos copias del dinero.

En el resto del ejemplo, Alice controla sus propias claves. Esto se llama **autocustodia**. Le permite actuar sin que una plataforma apruebe cada retirada, pero proteger y recuperar esa autoridad es su responsabilidad.

## Conectarse a una aplicación

Alice selecciona «Conectar wallet». El wallet le pregunta qué cuenta quiere compartir con la web. Una conexión normal permite a la aplicación conocer esa dirección y solicitar interacciones mediante el wallet.

Conectarse no autoriza por sí solo una transferencia, no revela la clave privada ni concede permiso para gastar tokens. Una web puede consultar la información pública asociada a una dirección cuando la conoce; desconectarse no vuelve privado ese registro público.

Si la aplicación quiere después que Alice firme un mensaje, envíe una transacción o conceda otro permiso, eso es otra solicitud. Algunas interfaces agrupan pasos, así que importa más lo que muestra el wallet que lo que pone el botón de la web.

## Firmar un mensaje o enviar una transacción

Una aplicación puede pedir a Alice que firme un mensaje para iniciar sesión. Un mensaje de acceso bien delimitado identifica el servicio y la finalidad de la solicitud, e incluye datos que limitan su reutilización, como una caducidad y un valor de un solo uso. La firma permite verificar el control de la cuenta.

Una **transacción**, en cambio, pide a la red procesar una operación. La oferta de venta de Alice era una de ellas. El wallet prepara el destino, los ETH adjuntos y las instrucciones para el contrato, y después pide autorización.

Esta distinción no hace inofensivas todas las firmas de mensajes. Algunos mensajes firmados autorizan una orden o un permiso de gasto que otro participante puede presentar después a un contrato. Alice puede estar concediendo autoridad aunque su wallet no esté enviando una transacción en ese momento.

Por eso necesita entender la finalidad, el destinatario, el importe y el alcance de lo que firma. «Iniciar sesión», «autorizar gasto» y «transferir activos» pueden generar una ventana del wallet y autorizar cosas muy distintas.

## Permisos para gastar tokens

Supongamos que una aplicación necesita cobrar tokens de la cuenta de Alice. En lugar de darle su clave, Alice puede conceder a un contrato concreto una **[autorización](/es/glossary#approval)** para gastar un token ERC-20 determinado hasta cierto importe.

Un permiso de **100 unidades** permite a ese contrato transferir hasta esa cantidad según las reglas del token. En una autorización ERC-20 convencional, gastar 60 deja 40. La autorización no deposita los tokens en la aplicación: establece un permiso que puede usarse más tarde.

Algunas interfaces solicitan un permiso muy amplio para evitar nuevas autorizaciones en operaciones futuras. Eso también deja al contrato con mayor autoridad. Alice debe distinguir entre lo que piensa utilizar ahora y lo que el contrato tiene permitido tomar.

El destinatario del permiso es una dirección de contrato, no simplemente el nombre de una web. Un contrato malicioso o vulnerable con permiso de gasto puede poner en riesgo los tokens autorizados. Algunos tokens permiten conceder estos permisos mediante mensajes firmados, así que esa autoridad también puede aparecer en una solicitud de firma.

Desconectar la web no cancela un permiso registrado en la blockchain. Alice tiene que **revocarlo** o reducirlo mediante el mecanismo de permisos del token. Las autorizaciones para entradas y otros NFT siguen sus propias reglas y pueden cubrir una colección entera en lugar de un saldo numérico.

## Frases de recuperación y dispositivos perdidos

Muchos wallets de autocustodia generan una **[frase de recuperación](/es/glossary#recovery-phrase)**, a menudo de 12 o 24 palabras, a partir de la que se reconstruyen claves y cuentas. Es una copia de seguridad del control sobre esas cuentas, no una lista de tokens guardados en la aplicación.

Si Alice pierde el móvil pero conserva la información necesaria, puede restaurar el acceso con un wallet compatible. Restaurar las mismas claves no desactiva el dispositivo perdido: si todavía puede firmar, conserva esa autoridad.

La contraseña de la aplicación o el PIN suelen proteger el acceso local, no sustituir la información de recuperación en otro dispositivo. Alguien que tenga la frase y cualquier secreto adicional necesario puede recuperar la autoridad de firma sin esa contraseña; cambiarla no invalida la frase.

Por eso Alice conserva la recuperación separada del dispositivo que permite recuperar y no la introduce en una aplicación simplemente para conectarse o iniciar sesión. Una web que la reciba puede conseguir el control de las cuentas, no solo el permiso para una operación.

Si se pierden tanto el único acceso para firmar como su copia de seguridad, puede no haber forma de recuperar la cuenta. Otros diseños utilizan mecanismos como varias firmas o contactos de recuperación. No todos los wallets dependen de una frase; importan sus reglas concretas.

## Software, hardware y cuentas en plataformas

Un **wallet de software** funciona en un móvil u ordenador. Si las claves se guardan en ese dispositivo, puede preparar y firmar solicitudes cómodamente, pero depende de la seguridad del dispositivo y del programa.

Un **wallet de hardware** separa la firma en un dispositivo dedicado. Una aplicación compatible prepara la solicitud; el dispositivo conserva las claves y firma después de que Alice confirme. En condiciones normales, la aplicación recibe la firma y no la clave privada.

Esto reduce la exposición a un ordenador comprometido, pero no hace segura cualquier solicitud autorizada. El dispositivo puede firmar una transferencia perjudicial o un permiso de gasto peligroso. Alice debe revisar lo que puede mostrar, y la información de recuperación sigue siendo sensible.

Una cuenta en una **plataforma con custodia** funciona de otra manera. La plataforma controla las claves de los activos que guarda y registra lo que debe a Alice. Su contraseña le permite pedir a la plataforma que actúe; no le da necesariamente control directo de firma sobre una cuenta de Ethereum. La recuperación y las retiradas dependen de las reglas y la disponibilidad del servicio.

## Lo que autoriza Alice

Alice puede distinguir ahora los pasos de una interacción. Conectar comparte una cuenta con la web. Una firma de acceso puede demostrar su control. Una autorización de tokens concede capacidad de gasto a un contrato concreto. Una transacción pide a la red ejecutar una operación.

Estos permisos pueden sobrevivir a la página que los solicitó, mientras que el mecanismo de recuperación determina quién puede recuperar el control general de la cuenta. El wallet ayuda a revisar y autorizar solicitudes; no garantiza que las promesas de una web coincidan con lo que harán sus contratos.

Alice puede explorar aplicaciones financieras sin tratar todas las confirmaciones del wallet como la misma acción. [Entender la \[ DeFi \]](/es/learn/defi-101) sigue cómo reparte lo ganado con la entrada entre staking, préstamos y un token de un proyecto.
