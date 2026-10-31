---
title: "Comprendre les [ Layers 2 ]"
draft: false
sourceRevision: 2074bf1539a1ccce992f345ac59af5d409306f0d3c45567bedcd4069f59c570e
---

Alice comprend ce qui garantit les 500 USDC présentés dans [Comprendre les \[ Stablecoins \]](/fr/learn/stablecoins-101). Elle retire 200 de ces USDC de sa position de prêt pour les utiliser dans une autre application.

L’application propose plusieurs réseaux : Ethereum, Arbitrum One, Base et OP Mainnet. Certains affichent des frais de transaction plus faibles. Alice connecte son wallet habituel, sélectionne Arbitrum One et n’y voit aucun USDC.

Son argent n’a pas disparu. Elle consulte un autre réseau. Pour comprendre où se trouvent ses actifs et comment elle peut les utiliser là-bas, examinons les réseaux **Layer 2 d’Ethereum**, généralement appelés **L2**.

## Pourquoi utiliser un autre réseau ?

Le réseau principal d’Ethereum est sa **Layer 1**, ou **L1**. Sa capacité à exécuter des transactions et à enregistrer leurs données est limitée. Lorsque beaucoup de personnes veulent utiliser cette capacité, elles se la disputent à travers les frais de transaction.

Une Layer 2 prend en charge l’exécution sur un réseau distinct tout en utilisant Ethereum pour contribuer à établir et faire respecter les résultats acceptés. L’idée est de traiter davantage d’activité sans demander au réseau principal d’Ethereum d’exécuter individuellement chaque action des utilisateurs.

**Arbitrum One, Base et OP Mainnet** sont des exemples de L2 d’Ethereum. Ce sont des réseaux distincts, avec leur activité et leurs applications, plutôt que trois noms pour un même solde sur Ethereum.

Déplacer le travail vers un autre réseau serait facile si les utilisateurs faisaient simplement confiance à son opérateur. La question importante est de savoir comment Ethereum peut contribuer à sécuriser le résultat. Une réponse courante est le **rollup**.

## Les rollups et le lien avec Ethereum

Un rollup exécute les transactions sur son réseau, puis publie sur Ethereum des données sur des lots d’activité et des engagements sur l’**état** obtenu : les soldes et les données des contrats après ces transactions. Un engagement est une référence compacte à cet état, par exemple un hash.

Un **séquenceur** reçoit généralement les demandes, les ordonne et donne aux utilisateurs une vue rapide du résultat. D’autres nœuds peuvent vérifier l’exécution. Les contrats sur Ethereum et le mécanisme de vérification du rollup déterminent quels résultats peuvent être acceptés pour le règlement.

De nombreuses actions peuvent partager le coût de publication d’un lot sur Ethereum. Avec un environnement d’exécution différent et des données compressées, cela contribue à rendre les transactions sur L2 moins chères. Les frais dépendent toujours du réseau et de la demande ; ils ne sont ni fixes ni systématiquement plus faibles.

Deux grandes approches traitent la validité des résultats. Les **rollups optimistes** permettent de contester les résultats proposés pendant une période définie. Une contestation réussie empêche un résultat invalide d’être accepté. Cela suppose que le mécanisme fonctionne et que des participants puissent l’utiliser.

Les **rollups à preuves de validité**, souvent appelés **ZK-rollups**, soumettent des preuves cryptographiques montrant que le changement d’état proposé respecte les règles. Ethereum vérifie la preuve au lieu de réexécuter chaque action. Leur sécurité dépend toujours de systèmes de preuve corrects, des contrats et de l’accès aux données nécessaires.

Ces mécanismes expliquent ce qu’une L2 apporte au-delà d’une blockchain indépendante peu coûteuse : un moyen de relier son exécution aux règles de règlement d’Ethereum. La protection réelle dépend de la manière dont chaque système est construit et exploité.

## Un wallet, des soldes distincts

Alice peut utiliser la même adresse de wallet sur Ethereum et Arbitrum One. Cela ne crée pas un solde unique partagé entre les réseaux.

Ses 200 USDC sont enregistrés par le contrat USDC sur Ethereum. Sélectionner Arbitrum One demande au wallet de consulter le registre de ce réseau, où Alice ne détient peut-être pas encore d’USDC. Revenir sur Ethereum fait réapparaître le solde initial.

Une application peut également avoir des déploiements différents selon les réseaux. Une pool de prêt sur Ethereum et une autre sur Arbitrum One ne partagent pas automatiquement les dépôts, la liquidité disponible ou les taux parce qu’elles portent le même nom d’application.

Pour Alice, identifier un actif exige désormais **le réseau et le contrat du token**. Un symbole familier ne suffit pas. Pour rendre des actifs disponibles sur un autre réseau, elle a besoin d’un processus de transfert entre les deux.

## Les bridges et les transferts entre réseaux

Un **bridge**, ou pont, coordonne un transfert d’actifs ou un message entre réseaux. Il ne déplace pas physiquement un token de la base de données d’une blockchain vers une autre.

Dans un modèle courant, un contrat bloque des tokens sur le réseau de départ. Lorsque le réseau d’arrivée accepte la preuve de ce dépôt, il y émet une représentation correspondante. Revenir par ce bridge inverse le processus : la représentation est détruite et les actifs bloqués peuvent être libérés selon les règles du pont.

Une autre approche passe par l’émetteur de l’actif. Pour l’USDC, le **Cross-Chain Transfer Protocol** de Circle, ou **CCTP**, brûle des unités sur le réseau de départ et émet des USDC natifs sur une destination compatible après que Circle a attesté la destruction. Cela évite de créer un token représentant des USDC bloqués dans un bridge classique, mais conserve une dépendance envers l’infrastructure et l’autorisation de Circle.

Alice choisit un trajet compatible avec les USDC natifs acceptés par son application d’arrivée. Lorsque le processus est terminé, le montant transféré est disponible sur Arbitrum One, plutôt que dépensable simultanément sur les deux réseaux.

Le trajet compte. Le bridge propre au rollup, un bridge tiers et un protocole de transfert de l’émetteur peuvent avoir des méthodes de vérification, des délais et des pouvoirs administratifs différents. Choisir le réseau d’arrivée ne détermine pas à lui seul la sécurité du transfert.

## Les tokens natifs et les versions bridgées

Sur Arbitrum One, les **USDC natifs** et les **USDC.e** illustrent pourquoi la version exacte compte. Les USDC natifs sont émis par Circle sur ce réseau. Les USDC.e sont une représentation bridgée d’USDC provenant d’Ethereum, garantie par l’intermédiaire du bridge concerné.

Ils visent la même valeur en dollars, mais reposent sur des contrats et des dépendances différents. Un service peut accepter l’un et pas l’autre. Leurs prix et la liquidité disponible pour les échanger peuvent aussi différer.

Ici, « USDC natif » signifie émis directement par Circle sur le réseau. Cela ne signifie pas que l’USDC est la monnaie native du réseau au sens où l’ETH est la monnaie native d’Ethereum.

Alice vérifie donc quelle version l’application utilise. Si elle reçoit une version bridgée alors que l’application attend de l’USDC natif, changer son nom affiché ne rend pas les deux interchangeables ; il lui faut une conversion compatible ou un autre trajet de transfert.

Alice doit donc comprendre à la fois ce qui garantit la valeur en dollars et comment ce token précis est relié à cette garantie.

## La confirmation rapide et le règlement final

Après avoir reçu les USDC appropriés, Alice peut utiliser l’application sur Arbitrum One. Le séquenceur peut lui montrer rapidement le résultat de sa transaction, tandis que la publication et le règlement sur Ethereum interviennent plus tard.

Voir ce résultat rapide est différent de terminer un retrait vers Ethereum. Un retrait standard par le bridge propre à un rollup optimiste peut demander plusieurs jours pour laisser se dérouler la contestation des résultats. Un service plus rapide peut avancer des actifs à destination, en ajoutant ses propres conditions de liquidité et de confiance. Un transfert par l’émetteur peut encore suivre un autre processus.

Les L2 diffèrent aussi par les personnes qui exploitent leur séquenceur, celles qui peuvent mettre à jour leurs contrats et les possibilités de sortie si un opérateur ne répond plus. S’appuyer sur Ethereum ne fait pas disparaître ces détails. Un réseau peut aussi être compatible avec les applications Ethereum sans être un rollup d’Ethereum.

L’adresse d’Alice est restée identique, mais le transfert a changé l’endroit où ses 200 USDC sont enregistrés. Le bridge ou le processus de l’émetteur relie les registres des actifs ; le mécanisme de vérification du rollup relie l’exécution à Ethereum.

Des frais plus faibles rendent davantage d’usages possibles, mais ne constituent qu’une partie de cet ensemble. Ce qui compte, c’est où les actifs d’Alice sont enregistrés, quelle version elle détient et quelles règles lui permettent de les utiliser ou de quitter le réseau.

La suite, [Comprendre les \[ Oracles \]](/fr/learn/oracles-101), reprend le prêt de Bob pour expliquer comment les contrats obtiennent des prix et d’autres informations extérieures.
