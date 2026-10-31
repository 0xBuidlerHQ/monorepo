---
description: "Comprenez les wallets, les comptes, les clés privées, les signatures, les autorisations et la récupération en suivant Alice qui utilise ses ETH."
title: "Comprendre les [ Wallets ]"
draft: false
sourceRevision: 4a993e40954aadd3133fb373b787443f0925a96faa33cb459aaf4347c7acc246
---

Alice a reçu 0,6 ETH en vendant le billet 42. Dans [Comprendre \[ Ethereum \]](/fr/learn/ethereum-101), nous avons suivi ce que le réseau et le contrat de billetterie faisaient. Elle ouvre maintenant une application pour utiliser l’argent de la vente.

Le site lui demande de connecter un wallet. Un instant plus tard, le wallet affiche une demande de signature. La connexion donne-t-elle au site le contrôle de son argent ? Toute signature déplace-t-elle des actifs ? Et si elle perd son téléphone ?

Ces questions concernent la frontière entre le compte d’Alice, son wallet et les applications qui lui demandent une autorisation d’agir.

## Le wallet et le compte

Les articles précédents ont établi que les actifs sont enregistrés sur la blockchain et que les clés autorisent les actions. Un **[wallet](/fr/glossary#wallet)** rend cette relation utilisable : il affiche les actifs d’un compte, prépare des demandes et permet de produire les signatures autorisées.

Le compte d’Alice est l’identité que le réseau utilise pour enregistrer ses ETH. Son wallet est l’outil par lequel elle y accède. Désinstaller cet outil ne supprime pas le compte et ne retire pas son solde d’Ethereum.

Cela explique aussi pourquoi deux applications de wallet compatibles peuvent afficher le même compte. Elles consultent le même registre et utilisent la même autorité de signature ; elles ne créent pas deux copies de l’argent.

Pour la suite de l’exemple, Alice utilise un wallet dont elle contrôle elle-même les clés. On parle d’**autogarde**, ou **self-custody**. Elle peut agir sans qu’une plateforme approuve chaque retrait, mais la protection et la récupération de ce pouvoir relèvent aussi de sa responsabilité.

## Se connecter à une application

Alice sélectionne « Connecter le wallet ». Celui-ci lui demande quel compte elle souhaite partager avec le site. Une connexion ordinaire permet à l’application de connaître cette adresse et de demander des interactions par l’intermédiaire du wallet.

La connexion seule n’autorise pas un transfert, ne révèle pas la clé privée et n’accorde pas le droit de dépenser des tokens. Un site peut consulter les informations publiques de la blockchain associées à une adresse dès qu’il la connaît ; se déconnecter ne peut pas rendre ce registre public à nouveau privé.

Si l’application demande ensuite à Alice de signer un message, d’envoyer une transaction ou d’accorder une autre permission, c’est une demande supplémentaire. Certaines interfaces regroupent plusieurs étapes : le contenu affiché par le wallet compte donc davantage que le texte du bouton sur le site.

## Signer un message ou envoyer une transaction

Une application peut demander à Alice de signer un message pour se connecter à son service. Un message de connexion correctement délimité indique le service et l’objet de la demande, avec des informations qui limitent sa réutilisation, comme une expiration et une valeur à usage unique. La signature permet au service de vérifier le contrôle du compte.

Une **transaction** demande au réseau de traiter une opération. La mise en vente du billet d’Alice en était une. Le wallet prépare sa destination, les éventuels ETH joints et les instructions destinées à un contrat, puis lui demande de l’autoriser.

Cette distinction ne rend pas toutes les signatures de messages inoffensives. Certains messages signés autorisent un ordre ou un pouvoir de dépense qu’un autre participant pourra ensuite soumettre à un contrat. Alice peut céder une autorité alors même que son wallet n’envoie pas de transaction à cet instant.

Elle doit donc comprendre l’objet, le destinataire, le montant et la portée de ce qu’elle signe. « Se connecter au service », « autoriser une dépense » et « transférer des actifs » peuvent tous provoquer une demande dans le wallet tout en autorisant des choses très différentes.

## Les autorisations de dépense des tokens

Supposons qu’une application doive prélever des tokens de paiement sur le compte d’Alice pour effectuer une opération. Plutôt que de lui donner sa clé, elle peut accorder à un contrat précis une **[autorisation](/fr/glossary#approval)** de dépenser un token ERC-20 donné jusqu’à un montant défini.

Une autorisation de **100 unités** permet à ce contrat de transférer jusqu’à ce montant selon les règles du token. Avec une autorisation ERC-20 classique, une dépense de 60 laisse 40 unités autorisées. L’autorisation ne dépose pas elle-même les tokens dans l’application ; elle établit une permission utilisable plus tard.

Certaines interfaces demandent une autorisation très élevée pour éviter de la renouveler à chaque opération. Cela laisse aussi au contrat un pouvoir plus large. Alice doit distinguer le montant qu’elle souhaite utiliser maintenant de celui que le contrat est autorisé à prélever.

Le bénéficiaire de ce pouvoir est une adresse de contrat, pas simplement un nom de site. Un bénéficiaire malveillant, ou un contrat vulnérable disposant d’une autorisation, peut mettre les tokens concernés en danger. Certains tokens permettent ces autorisations par des messages signés : ce pouvoir peut donc aussi se présenter dans une demande de signature.

Déconnecter le site n’annule pas une autorisation enregistrée sur la blockchain. Alice doit la **révoquer** ou la réduire par le mécanisme de permission du token. Les autorisations des billets et des autres NFT suivent leurs propres règles et peuvent parfois couvrir une collection entière plutôt qu’un solde numérique.

## Les phrases de récupération et les appareils perdus

De nombreux wallets en autogarde génèrent une **[phrase de récupération](/fr/glossary#recovery-phrase)**, souvent de 12 ou 24 mots, à partir de laquelle les clés de signature et les comptes peuvent être reconstitués. C’est une sauvegarde du contrôle de ces comptes, pas une liste de tokens contenus dans l’application.

Si Alice perd son téléphone mais possède les informations de récupération nécessaires, elle peut rétablir l’accès avec un wallet compatible. Restaurer les mêmes clés ne désactive pas l’appareil perdu : s’il peut encore signer, il conserve ce pouvoir.

Le mot de passe de l’application ou le code PIN de l’appareil protège généralement l’accès local, plutôt que de remplacer les informations de récupération sur un autre appareil. Une personne qui possède la phrase et tout secret supplémentaire nécessaire peut retrouver le pouvoir de signature sans ce mot de passe ; changer le mot de passe de l’application n’invalide pas la phrase.

Alice conserve donc les informations de récupération séparément de l’appareil qu’elles permettent de restaurer et ne les saisit pas dans une application simplement pour connecter son wallet ou accéder à un service. Un site qui les reçoit peut obtenir le contrôle des comptes, pas seulement une permission pour une opération.

Si l’unique accès de signature et sa sauvegarde sont tous deux perdus, il peut ne plus exister de moyen de récupérer le compte. D’autres wallets utilisent des mécanismes différents, comme plusieurs signataires ou des contacts de récupération ; tous ne reposent pas sur une phrase, et leurs règles réelles de récupération comptent.

## Logiciel, hardware wallet et compte sur une plateforme

Un **wallet logiciel** fonctionne sur un téléphone ou un ordinateur. Avec les clés conservées sur cet appareil, il permet de préparer et signer les demandes facilement, tout en dépendant de la sécurité de l’appareil et du logiciel.

Un **hardware wallet** sépare la signature dans un appareil dédié. Une application compatible prépare la demande, tandis que l’appareil conserve les clés et signe après confirmation d’Alice. En fonctionnement normal, l’application reçoit la signature plutôt que la clé privée.

Cela réduit l’exposition à un ordinateur compromis, mais ne rend pas une demande autorisée sûre. Un hardware wallet peut tout de même signer un transfert nuisible ou une autorisation de dépense dangereuse. Alice doit examiner ce que l’appareil peut afficher, et ses informations de récupération restent sensibles.

Un compte sur une **plateforme de garde** fonctionne autrement. La plateforme contrôle les clés des actifs qu’elle conserve et enregistre ce qu’elle doit à Alice. Son mot de passe lui permet de demander à la plateforme d’agir ; il ne lui donne pas nécessairement un pouvoir de signature direct sur un compte Ethereum. La récupération et les retraits dépendent des règles et de la disponibilité du service.

## Ce qu’Alice autorise

Alice peut maintenant distinguer les étapes d’une interaction. La connexion partage un compte avec le site. Une signature de connexion peut établir le contrôle de ce compte. Une autorisation de token donne un pouvoir de dépense à un bénéficiaire précis. Une transaction demande au réseau d’exécuter une opération.

Ces permissions peuvent survivre à la page qui les a demandées, tandis que le mécanisme de récupération détermine qui peut reprendre le contrôle global du compte. Son wallet l’aide à examiner et autoriser les demandes ; il ne garantit pas que les promesses du site correspondent à ce que feront ses contrats.

Avec ces distinctions, Alice peut aborder les applications financières sans considérer chaque confirmation du wallet comme la même action. La suite, [Comprendre la \[ DeFi \]](/fr/learn/defi-101), suit sa répartition de l’argent du billet entre staking, prêt et token de projet.
