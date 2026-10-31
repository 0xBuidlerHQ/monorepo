---
description: "Découvrez les smart contracts, les transferts d’ETH et de tokens, ainsi que les frais de gas sur Ethereum, à travers la vente d’un billet de concert."
title: "Comprendre [ Ethereum ]"
draft: false
sourceRevision: 5fb7f25acf045283bb1bc08825af5b626bda6ae8a85042cae09c8bb9b30748e5
---

Dans [Comprendre la \[ Blockchain \]](/fr/learn/blockchain-101), Alice souhaitait donner le billet 42 à Bob. Imaginons maintenant qu’elle veuille plutôt le lui vendre.

Envoyer le billet et l’argent séparément pose un problème. Si Alice transfère le billet en premier, Bob pourrait ne jamais payer. Si Bob paie en premier, Alice pourrait garder le billet. Ils veulent un échange dans lequel les deux opérations ont lieu ensemble.

Plaçons leur système de billetterie sur Ethereum et suivons cette vente. Le registre partagé, les signatures et les blocs fonctionnent comme dans l’article précédent. Les nouvelles questions concernent ce qu’Ethereum permet à leur programme de faire, ce qui peut servir de monnaie et pourquoi utiliser le réseau a un coût.

## Ethereum et les programmes partagés

L’organisateur a besoin d’un endroit où publier son programme de billetterie pour qu’Alice, Bob et leurs applications utilisent les mêmes règles. Ethereum fournit une blockchain publique sur laquelle les développeurs peuvent déployer des smart contracts. Déployer consiste à publier le code et les informations initiales d’un contrat au moyen d’une transaction. Le contrat dispose alors d’une adresse à laquelle les applications peuvent envoyer des demandes.

Notre contrat de billetterie enregistre les propriétaires. L’organisateur lui ajoute aussi une fonction de vente : un propriétaire peut fixer un prix et un acheteur peut acquérir le billet à ce prix. Le développeur écrit ces règles ; Ethereum ne fournit pas de service de billetterie intégré.

Ethereum définit l’environnement qui exécute ces règles, appelé **Ethereum Virtual Machine**, ou **EVM**. On peut le comprendre comme un ensemble commun d’instructions pour exécuter les contrats, plutôt que comme un ordinateur unique géré par l’organisateur. Les nœuds qui vérifient l’exécution appliquent ce même ensemble d’instructions pour obtenir le même résultat.

## L’ether, la cryptomonnaie native

Alice et Bob ont besoin d’un actif que le programme puisse transférer comme paiement.

Ethereum possède une monnaie intégrée appelée **ether**, abrégée **ETH**. Les règles du réseau lui-même suivent les soldes en ETH et permettent aux transactions d’en transférer. L’ETH est donc la **cryptomonnaie native** d’Ethereum : il relève du protocole sous-jacent, plutôt que d’être créé par l’application de billetterie.

Vous pouvez aussi rencontrer les expressions « coin natif » ou « token natif ». Ici, elles désignent l’ETH. Ethereum est le réseau ; l’ether est sa monnaie. Détenir des ETH ne signifie pas détenir des actions d’une entreprise appelée Ethereum.

Alice met le billet 42 en vente pour **0,6 ETH**, un prix inventé pour notre exemple. Bob doit posséder assez d’ETH pour l’achat et les frais du réseau, que nous calculerons bientôt.

L’ETH peut servir de paiement lorsqu’un vendeur l’accepte, mais son pouvoir d’achat n’est pas fixe. Les 0,6 ETH d’Alice ne représentent pas une promesse de recevoir un montant précis en euros ou en dollars. L’ETH paie aussi les frais de transaction d’Ethereum, et des participants en immobilisent par le [staking](/fr/glossary#staking) pour contribuer à la sécurité du réseau.

## Les tokens et le billet

Le réseau suit les ETH, mais il ne sait pas ce que représente un billet de concert. Cette signification vient du contrat de billetterie.

Un **[token](/fr/glossary#token)** est un actif représenté et géré par des règles sur une blockchain. Pour un token émis par un contrat, celui-ci enregistre les soldes ou les propriétaires et définit comment ils peuvent changer. Un wallet affiche ces informations ; il ne contient pas un objet distinct qui serait physiquement déplacé.

Le billet 42 possède une identité propre. Il peut correspondre à une place précise ; le remplacer par le billet 43 pourrait donner une autre place à Bob. Un token dont l’identité individuelle compte est **non fongible**. Un **NFT** est un token non fongible. Un système de billetterie peut utiliser **ERC-721**, une interface standard pour vérifier le propriétaire et transférer des tokens identifiés individuellement.

L’adresse du contrat et l’identifiant du billet désignent ensemble notre billet. Un autre contrat pourrait lui aussi émettre un token numéroté 42 sans créer le même billet.

Les tokens qui servent de monnaie fonctionnent autrement. Si Bob paie 1 500 unités du même token de paiement, Alice s’intéresse généralement au montant, pas aux unités individuelles qu’il envoie. Ces unités sont **fongibles** : interchangeables au sein de cet actif. **ERC-20** fournit à ces tokens une interface commune pour les soldes et les transferts. Les standards permettent aux wallets et aux applications de prendre en charge de nombreux actifs sans apprendre une interface différente pour chacun.

L’organisateur pourrait accepter un **[stablecoin](/fr/glossary#stablecoin)**, un token conçu pour suivre une valeur de référence comme le dollar américain. Alice pourrait alors fixer le prix du billet à 1 500 unités.

Pour notre vente, Alice choisit l’ETH. **L’ETH est natif d’Ethereum ; le billet et un token de paiement ERC-20 sont gérés par des contrats exécutés sur Ethereum.** Un token n’a pas besoin de sa propre blockchain.

## Échanger le billet et le paiement ensemble

Alice utilise le contrat de billetterie pour mettre le billet 42 en vente à 0,6 ETH. Nous supposons que ce contrat personnalisé contient les règles de vente et autorise la revente.

L’application de Bob prépare une transaction d’achat adressée à ce contrat. Elle demande d’acheter le billet 42 et joint 0,6 ETH comme paiement. Le contrat vérifie qu’Alice possède toujours le billet, que son offre est active et que Bob a fourni le montant demandé. Si ces vérifications réussissent, son code transfère la propriété à Bob et paie Alice.

Ces opérations font partie d’une même exécution. Si une étape obligatoire échoue, les changements de propriété et de paiement de la transaction sont annulés. Bob ne se retrouve pas à payer Alice alors que ce même achat laisse le billet à Alice. Cette propriété s’appelle **l’atomicité** : les changements de l’échange prennent effet ensemble ou ne prennent pas effet.

Les contrats peuvent aussi appeler d’autres contrats, ce qui permet à une place de marché de combiner paiement et transfert de billet. Cette possibilité de composer des contrats permet aux développeurs de construire des services autour d’actifs existants. Une telle place de marché doit disposer des autorisations nécessaires ; connaître l’adresse du token ne lui permet pas de prendre le billet d’Alice.

L’atomicité s’applique à l’échange programmé. La vente exige toujours un code correct et une salle qui reconnaisse le billet, comme l’expliquait l’article précédent.

## Le gas, la mesure de l’exécution

L’achat de Bob fait exécuter des vérifications au réseau et modifier des informations enregistrées. Un achat plus complexe pourrait demander davantage de travail. Ethereum doit mesurer ce travail et empêcher une demande de s’exécuter sans limite. Faire payer l’exécution rend aussi coûteuse la consommation de la capacité limitée du réseau, y compris pour une personne qui tenterait de le saturer de demandes.

Le **[gas](/fr/glossary#gas)** est l’unité utilisée pour comptabiliser l’exécution. Les différentes opérations ont des coûts en gas différents. L’achat consomme du gas à mesure que ses instructions s’exécutent ; le gas n’est ni le prix du billet ni une seconde monnaie que Bob achète.

Sa transaction précise une **limite de gas**, le nombre maximal d’unités de gas qu’elle peut consommer. Si l’exécution en demande davantage, elle s’arrête et les changements de l’achat sont annulés. Son wallet estime une limite adaptée avant l’envoi. Cette limite est un plafond, pas une prévision selon laquelle chaque unité sera utilisée.

Consulter le propriétaire actuel dans une application ne demande normalement pas à Bob de payer des frais de transaction, puisque cette consultation ne soumet aucun changement à Ethereum. Acheter le billet, si.

## Les frais de gas et le prix du billet

Le gas mesure l’exécution ; un **prix du gas** détermine combien chaque unité coûte en ETH. Pour la transaction d’achat ordinaire de notre exemple :

**Frais de transaction = gas consommé × prix effectif par unité de gas.**

Le prix du gas est souvent exprimé en **gwei**. Un gwei vaut un milliardième d’ETH. Supposons que l’achat consomme **100 000 unités de gas** à un prix effectif de **20 gwei par unité** :

**100 000 × 20 gwei = 2 000 000 gwei = 0,002 ETH.**

Ces nombres servent d’illustration : ce ne sont ni des tarifs actuels ni un coût fixe pour acheter un billet. Bob dépense **0,6 ETH pour le billet d’Alice, plus 0,002 ETH de frais de réseau**. S’il avait 1,1 ETH avant l’achat, il lui reste 0,498 ETH après.

Les frais de gas sont payés en ETH sur le réseau principal d’Ethereum, même lorsque l’actif transféré est un token. Payer le billet avec un stablecoin ne supprimerait pas ces frais en ETH. Un service peut les prendre en charge pour Bob, mais quelqu’un paie toujours les frais sous-jacents.

Le prix effectif du gas comprend des **frais de base**, fixés par le protocole et ajustés en fonction de la demande, ainsi que des **frais de priorité** destinés au validateur qui propose le bloc. Un validateur participe au processus de proposition des blocs et d’accord du réseau Ethereum. La part correspondant aux frais de base est détruite, ou **brûlée**, plutôt que versée au validateur. Bob peut fixer des plafonds de frais ; un plafond qui ne couvre pas les frais de base requis peut laisser sa transaction en attente. Son wallet utilise ces règles de tarification pour préparer son estimation.

Deux choses peuvent donc augmenter les frais : un programme peut consommer davantage de gas, ou chaque unité peut devenir plus chère lorsque la capacité d’exécution est plus demandée. Un billet plus cher ne demande pas automatiquement davantage de gas.

## La vente terminée

Alice enregistre d’abord sa mise en vente par une transaction. Bob vérifie ensuite son achat : le bon contrat de billetterie, le billet 42, le prix de 0,6 ETH et une estimation des frais.

Lorsque l’achat réussit, Bob possède le billet et Alice a reçu 0,6 ETH. Il attend la garantie de règlement présentée dans Comprendre la Blockchain. Son wallet peut afficher son solde en ETH et son billet, même si les règles natives d’Ethereum suivent le premier et le contrat de billetterie suit le second.

Alice et Bob ont utilisé un programme pour relier paiement et propriété. Ethereum fournit l’environnement d’exécution partagé, les contrats définissent les actifs et la vente, l’ETH permet le paiement natif et celui des frais du réseau, et le gas mesure l’exécution que ces frais rémunèrent.

La suite, [Comprendre les \[ Wallets \]](/fr/learn/wallets-101), examine comment Alice se connecte aux applications et ce qu’elle autorise avec son wallet.
