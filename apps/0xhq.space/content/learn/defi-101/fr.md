---
description: "Explorez la finance décentralisée : échanges, pools de liquidité, staking, prêts, garanties et liquidation, avec les exemples d’Alice et Bob."
title: "Comprendre la [ DeFi ]"
draft: false
sourceRevision: cc21c923a58498c316f53c9c7c18800e69d55e9523a7cb0084f28d34ac8c8637
---

Alice a vendu le billet 42 à Bob pour **0,6 ETH**. Dans [Comprendre \[ Ethereum \]](/fr/learn/ethereum-101), leur programme a fait en sorte que le paiement et le transfert du billet aient lieu ensemble.

Elle souhaite maintenant faire fructifier cet argent. Plutôt que de tout consacrer à un seul actif ou service, elle décide de le répartir : une partie pour le staking via Lido, une partie pour le prêt via Aave et une partie pour un token de projet qui lui plaît.

Ces choix nous amènent à la **finance décentralisée**, ou **DeFi** : des services financiers construits autour de smart contracts. Suivons ce qu’Alice fait du produit de sa vente, ce qui peut lui rapporter de l’argent et ce qui peut mal se passer. Les montants et les valeurs d’échange servent d’illustration.

## Trois usages pour l’argent de la vente

Alice répartit ses **0,6 ETH en trois parts de 0,2 ETH**. Elle conservera une exposition à l’ETH avec la première, grâce au staking, échangera la deuxième contre un stablecoin qui suit le dollar pour le prêter, et utilisera la troisième pour acheter le token du projet.

Chaque service repose sur un **[protocole](/fr/glossary#protocol)** : les règles et les contrats qui le mettent en œuvre. L’application qu’Alice utilise l’aide à préparer ses demandes ; les contrats enregistrent sa position et déterminent ce qui peut arriver aux actifs.

Cette répartition distingue les récompenses possibles du staking, les intérêts du prêt et une variation du prix du token de projet. Suivons chaque partie.

## Les swaps et les pools de liquidité

Pour la partie destinée au prêt, Alice échange d’abord **0,2 ETH contre 500 USDC**. L’USDC est un **[stablecoin](/fr/glossary#stablecoin)** conçu pour suivre le dollar américain. Échanger un actif contre un autre s’appelle un **[swap](/fr/glossary#swap)**.

Les USDC doivent venir de quelque part. Dans un échange fondé sur une pool, d’autres participants déposent des actifs dans un contrat qui les rend disponibles pour les swaps. Ces dépôts constituent une **[pool de liquidité](/fr/glossary#liquidity-pool)** ; les déposants sont des **fournisseurs de liquidité**. Ici, ils mettent des actifs à disposition pour permettre à Alice d’échanger ses ETH contre des USDC.

Lorsque le swap réussit, la pool reçoit l’actif envoyé par Alice et transfère les USDC à son adresse. Une partie des frais d’échange revient aux fournisseurs de liquidité, parce que leurs actifs ont rendu l’opération possible. Des services comme Uniswap utilisent des pools de cette manière.

Apporter de la liquidité est donc une autre façon de chercher un rendement : percevoir les frais des échanges qui utilisent les actifs fournis. Mais ces échanges modifient aussi les actifs de la position du fournisseur. Les frais peuvent ne pas compenser les pertes par rapport à la simple conservation des actifs initiaux. Alice utilise la pool pour échanger son argent ; dans cet exemple, elle ne devient pas elle-même fournisseuse de liquidité.

## Le staking d’ETH avec Lido

Alice engage sa première part de **0,2 ETH** via Lido. Pour comprendre le rendement possible, regardons à quoi servent ces ETH.

Ethereum utilise le **[staking](/fr/glossary#staking)** pour sécuriser son réseau. Des validateurs engagent des ETH et participent à la proposition et à la vérification des blocs. Une participation correcte peut produire des récompenses ; des défaillances et certaines violations des règles peuvent entraîner des pénalités. Les récompenses rémunèrent la participation à la sécurité du réseau, plutôt que des intérêts versés par un emprunteur.

Lido regroupe les ETH des utilisateurs et les dirige vers des validateurs gérés par des opérateurs participants. Alice peut ainsi participer sans faire fonctionner elle-même un validateur. Avec ce service de staking mutualisé, elle reçoit du **stETH**, un token qui représente sa part des ETH mis en staking et des résultats associés. Son solde en stETH s’ajuste pour refléter les récompenses ou les pénalités attribuées, après les frais du protocole.

Comme cette position est représentée par un token transférable, on parle de **staking liquide**. Alice peut conserver son stETH, le transférer ou l’utiliser dans des applications compatibles pendant que les ETH sous-jacents participent au staking.

Ce token ne rend pas les ETH sous-jacents immédiatement récupérables. Passer par le processus de retrait de Lido peut demander une attente. Vendre le stETH sur un marché est une autre possibilité, au prix que les acheteurs acceptent de payer. Alice reste exposée aux variations du prix de l’ETH ainsi qu’aux risques liés aux validateurs et aux contrats.

## Prêter des USDC via Aave

Alice fournit les **500 USDC** de son swap à **Aave**, un protocole de prêt. Son dépôt porte sur l’USDC ; Aave est le service qui rend ces actifs disponibles pour les emprunteurs et enregistre sa créance sur la pool.

Les emprunteurs paient des intérêts, dont une partie revient aux fournisseurs comme Alice. Le taux évolue selon la demande d’emprunt et les actifs disponibles. Son rendement vient du prêt, contrairement aux récompenses du réseau qui alimentent sa position en stETH.

Supposons que Bob veuille emprunter **400 USDC** sans vendre les ETH qui lui restent. Il fournit **0,4 ETH**, valorisés à **1 000 dollars** dans cet exemple, comme **[collatéral](/fr/glossary#collateral)**. Le principe rappelle celui du prêt lombard en finance traditionnelle : emprunter en donnant des actifs en garantie plutôt que de les vendre. Les règles du protocole déterminent si ce collatéral permet l’emprunt demandé.

Bob reçoit des USDC de la pool de prêt et doit rembourser ce montant avec des intérêts. Si son collatéral perd trop de valeur par rapport à sa dette, sa position peut être **[liquidée](/fr/glossary#liquidation)** : un autre participant rembourse de la dette et reçoit une partie de son collatéral selon les règles du protocole. Ce mécanisme protège la pool en faisant respecter la garantie des prêts, sans pouvoir éliminer toutes les pertes possibles.

Alice ne choisit pas personnellement Bob et ne négocie pas son taux. Elle fournit des actifs à un marché partagé. Elle peut demander un retrait, mais la récupération de ses actifs dépend d’une liquidité disponible suffisante. Sa position dépend aussi des contrats d’Aave et du maintien de la valeur cible de l’USDC.

## Acheter le token d’un projet

Avec sa dernière part de **0,2 ETH**, Alice achète le token d’un projet qu’elle suit. Le même type de swap permet d’échanger ses ETH contre ce token.

Supposons que le projet utilise son token pour permettre aux détenteurs de voter sur certaines décisions ou d’accéder à un service. Ces usages peuvent intéresser Alice, mais ils n’en font pas automatiquement une action d’entreprise ni un droit à percevoir des bénéfices. Les droits dépendent des règles réelles du projet.

Son attente principale est ici une éventuelle hausse du prix. Si elle revend le token plus cher qu’elle ne l’a acheté, elle réalise une plus-value. Le simple fait de le détenir ne produit pas automatiquement des intérêts ou des récompenses de staking, et son prix peut baisser même si le projet continue de fonctionner.

## Comprendre l’origine du gain

Alice peut maintenant identifier l’origine de chaque gain potentiel. Il vient de l’activité des validateurs d’Ethereum pour le staking, des emprunteurs pour le prêt et du prix que de futurs acheteurs accepteront de payer pour le token de projet. Les fournisseurs de liquidité, eux, perçoivent des frais d’échange.

Un **[APR ou APY](/fr/glossary#apr-and-apy)** exprime un taux sur une année ; l’APY tient compte des gains réinvestis. Un taux variable ne promet pas le même rendement pendant toute une année.

Une deuxième question se pose : un gain mesuré dans quelle unité ? Le solde en stETH d’Alice pourrait augmenter alors que l’ETH baisse en dollars. Son solde en USDC pourrait produire des intérêts alors que chaque USDC vaut moins que le dollar qu’il est censé suivre. Davantage d’unités et une valeur totale supérieure ne sont pas nécessairement le même résultat.

## Diversifier en gardant le fil

Alice a transformé un paiement en trois positions : des ETH en staking représentés par du stETH, une position de prêt en USDC et un token de projet. Elle peut identifier ce que chacune représente, ce qui pourrait produire un gain et comment en sortir.

Répartir son argent réduit sa dépendance à une seule position, mais ne rend pas les positions indépendantes. Elles partagent des dépendances envers Ethereum et les smart contracts, et les prix des cryptoactifs peuvent baisser ensemble. Lido et Aave ont aussi leurs propres règles et mécanismes d’administration ; utiliser un réseau ouvert ne supprime pas le besoin de comprendre les services qui y sont construits.

La DeFi permet à Alice de combiner ces services à partir d’actifs et de programmes sur un réseau partagé. L’habitude utile consiste à suivre ce que fait son argent : sécuriser un réseau, financer des emprunteurs, alimenter des échanges ou acheter un actif dans l’espoir d’une hausse de prix. Chaque activité possède sa propre source de gain et sa propre manière de perdre de l’argent.

La suite, [Comprendre les \[ Stablecoins \]](/fr/learn/stablecoins-101), examine ce qui relie les 500 USDC d’Alice aux 500 dollars qu’ils sont censés représenter.
