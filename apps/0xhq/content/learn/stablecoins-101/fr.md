---
title: "Comprendre les [ Stablecoins ]"
draft: false
sourceRevision: bec98a83b468fac8210476f13b9c9b777a44f986c09a84a43193f44c75dc059d
---

Dans [Comprendre la \[ DeFi \]](/fr/learn/defi-101), Alice a échangé une partie des ETH de la vente de son billet contre 500 USDC. Nous avons ensuite considéré que ces unités valaient 500 dollars. Revenons à ces tokens avant qu’Alice les fournisse au protocole de prêt.

Son wallet peut confirmer qu’elle détient 500 tokens. Mais qu’est-ce qui leur donne une valeur de 500 dollars ? Suffirait-il d’écrire « un dollar » dans un contrat pour donner cette valeur à n’importe quel token ?

Le solde d’un token et son prix sont deux choses différentes. Pour comprendre l’argent d’Alice, suivons le lien entre les tokens qu’elle détient et les dollars dont ils sont censés suivre la valeur.

## Une valeur de référence

Un **[stablecoin](/fr/glossary#stablecoin)** est un token conçu pour suivre une valeur de référence. Pour un stablecoin dollar, la cible habituelle est un dollar américain par unité. D’autres stablecoins suivent des monnaies comme l’euro. La valeur de référence qu’un token cherche à maintenir est appelée son **ancrage**, ou **peg**.

Cela rend un stablecoin dollar utile pour fixer le prix d’un billet, effectuer un paiement ou exprimer une dette sans choisir une monnaie dont le prix fluctue comme celui de l’ETH. Un prix de 500 unités est censé rester proche de 500 dollars.

Cette cible ne fixe pas automatiquement le prix. Si Alice vend ses tokens, elle reçoit ce que les acheteurs acceptent de payer. Maintenir ce prix près de la cible exige un mécanisme qui donne aux participants une raison d’échanger le token autour d’un dollar.

« Stable » s’entend aussi par rapport à la monnaie de référence. Un token qui suit le dollar peut changer de valeur en euros lorsque le taux de change évolue, et le pouvoir d’achat du dollar peut varier dans le temps.

## Les réserves et le remboursement

Un modèle courant repose sur un émetteur qui détient des actifs en dehors de la blockchain pour garantir les tokens qu’il crée. Ces actifs constituent ses **réserves**. Elles peuvent comprendre des dépôts bancaires et de la dette publique à court terme, plutôt qu’uniquement de l’argent disponible sur un compte.

Dans un exemple simplifié, un client éligible verse 500 dollars à l’émetteur. Celui-ci ajoute cette valeur à ses réserves et crée 500 tokens. Cette création d’unités s’appelle le **minting**, ou émission. Les tokens peuvent ensuite circuler entre wallets et applications sans qu’un nouveau virement bancaire accompagne chaque changement de propriétaire.

Lorsqu’un détenteur éligible restitue 500 tokens contre 500 dollars, il s’agit d’un **remboursement**, appelé **redemption**. Les tokens remboursés sont retirés de la circulation, ou **brûlés**, tandis que le paiement correspondant est effectué. L’émission et le remboursement relient le nombre de tokens aux actifs qui les garantissent.

Alice a acquis ses tokens par un swap : son achat n’a donc pas nécessairement créé de nouveaux tokens ni ajouté de dollars aux réserves de l’émetteur. Il a transféré des tokens existants de la pool vers son adresse. Les fournir à un protocole de prêt rend également des tokens existants disponibles pour les emprunteurs ; cela ne crée pas une autre réserve de dollars derrière eux.

L’accès au remboursement direct dépend des conditions de l’émetteur et de l’éligibilité du détenteur. Alice peut plutôt vendre ses tokens sur une plateforme d’échange ou passer par un autre service. Détenir un token ne lui indique pas, à lui seul, quel chemin vers les dollars lui est accessible.

## Comment le prix reste proche d’un dollar

Supposons que le token garanti par des réserves s’échange à **0,98 dollar**, alors que des participants éligibles peuvent toujours le faire rembourser à un dollar. L’un d’eux pourrait acheter 500 unités pour 490 dollars et les faire rembourser pour 500 dollars. La différence de dix dollars constitue un gain potentiel avant les coûts.

L’achat des tokens à prix réduit crée une demande, tandis que le remboursement retire des unités de la circulation. Les deux peuvent contribuer à ramener le prix du marché vers un dollar.

L’occasion inverse peut apparaître si le token s’échange à **1,02 dollar**. Un participant capable de créer 500 unités pour 500 dollars pourrait les vendre pour 510 dollars. L’émission et la vente ajoutent des tokens disponibles sur le marché, ce qui contribue à faire baisser le prix.

Profiter d’un tel écart de prix s’appelle faire de **l’arbitrage**. Alice n’a pas besoin de le pratiquer elle-même pour que l’activité d’autres participants contribue à maintenir l’ancrage.

La condition importante est que cette possibilité soit réellement accessible. Si le remboursement est bloqué, trop lent ou n’inspire plus confiance, un prix bas peut ne pas attirer suffisamment d’acheteurs. L’ancrage dépend d’un accès fonctionnel aux réserves, pas seulement d’une cible annoncée par l’émetteur.

## Plusieurs manières de garantir la même cible

Tous les stablecoins dollar ne reposent pas sur une entreprise qui conserve des actifs en dollars dans des comptes bancaires et des placements.

Un autre modèle permet aux participants de bloquer des cryptoactifs acceptés dans des contrats et de créer des stablecoins contre ce collatéral. Contrairement au dépôt d’Alice sur Aave, qui prête des USDC existants, cette opération émet de nouvelles unités.

Le système exige généralement une valeur de garantie supérieure à celle des stablecoins émis, avec des sources de prix et des règles de liquidation pour maintenir cette couverture. Le remboursement de la dette émise retire les unités correspondantes de la circulation et libère le collatéral selon les règles du protocole.

Certains modèles utilisent aussi des stablecoins garantis par des réserves comme collatéral, transmettant ainsi leurs dépendances envers les émetteurs au nouveau token.

D’autres modèles, souvent appelés **stablecoins algorithmiques**, cherchent à soutenir la cible principalement par des ajustements de l’offre ou une conversion vers un autre token, plutôt que par des réserves indépendantes suffisantes. Si cet autre token perd de la valeur lorsque la confiance baisse, le mécanisme peut se fragiliser précisément au moment où les détenteurs cherchent à sortir. Un code qui ajuste l’offre ne crée pas les actifs nécessaires pour rembourser tout le monde.

Les systèmes réels peuvent combiner ces approches. Quelques exemples montrent comment des tokens aux cibles proches peuvent reposer sur des garanties différentes :

- **USDC**, le token qu’Alice détient, est émis par **Circle** et vise un dollar. Sa couverture comprend des dépôts bancaires et de la dette publique américaine à court terme : il suit le modèle de l’émetteur et des réserves présenté plus haut.
- **USDT**, émis par **Tether**, vise lui aussi un dollar. Il repose également sur des réserves détenues par un émetteur, mais l’émetteur, la composition des réserves et les conditions de remboursement diffèrent. USDT et USDC ne représentent donc pas les mêmes garanties simplement parce qu’ils suivent le dollar.
- **DAI et USDS** appartiennent à l’écosystème **Sky**, anciennement MakerDAO. Ils visent le dollar à travers un protocole garanti par du collatéral ; le DAI peut être converti en USDS à raison d’une unité pour une unité. Leur couverture ne se limite pas à l’ETH et peut comprendre d’autres stablecoins et des expositions à des actifs hors blockchain.
- **USDe**, d’**Ethena**, est un dollar synthétique. Il combine des actifs de garantie avec des positions financières conçues pour compenser les variations de prix des cryptoactifs. Sa stabilité dépend donc aussi de ces positions et des plateformes utilisées, plutôt que d’une simple réserve de dollars.
- **EURC**, également émis par **Circle**, vise **un euro** et utilise des réserves en euros. Sa différence principale avec l’USDC est la monnaie de référence : un EURC n’est pas censé valoir un dollar.

## Quand l’ancrage se rompt

Imaginons que les détenteurs doutent du montant des réserves ou de la possibilité d’obtenir un remboursement. Davantage de personnes cherchent à vendre le token, tandis que moins d’acheteurs acceptent de payer près d’un dollar. Son prix peut passer sous la cible. Un écart important par rapport à l’ancrage s’appelle un **depeg**, ou décrochage.

Si Alice détient toujours 500 unités et que le prix du marché tombe à **0,90 dollar**, elles valent désormais environ **450 dollars** à ce prix. La blockchain peut continuer d’enregistrer exactement 500 unités. Elle n’a pas mal compté ses tokens ; leur valeur d’échange a changé.

Un décrochage peut être temporaire, par exemple lorsque l’accès aux banques ou au remboursement est perturbé, ou refléter un manque durable d’actifs pour couvrir les tokens. Le retour à la cible n’est pas automatique. Même des actifs suffisants sur le papier peuvent être difficiles à transformer rapidement en paiements lorsque beaucoup de détenteurs demandent un remboursement.

La même distinction compte pour le prêt de Bob. Devoir 400 unités d’un stablecoin signifie devoir ces unités selon les règles du protocole, pas automatiquement devoir un montant de 400 dollars fixé pour toujours. Un décrochage modifie leur valeur de marché et peut affecter les positions des emprunteurs et des fournisseurs.

## Ce qu’Alice détient réellement

Les 500 tokens d’Alice lui donnent un actif transférable qui vise à suivre le dollar. Ce ne sont pas simplement 500 dollars déplacés d’un compte bancaire vers un wallet.

Avec un token garanti par des réserves, sa confiance repose sur les actifs de l’émetteur et les moyens par lesquels les détenteurs peuvent obtenir des dollars. Les rapports de réserves aident à décrire cette couverture, mais le solde d’Alice sur la blockchain ne prouve pas à lui seul que ces actifs existent ou sont accessibles. Certains émetteurs peuvent aussi bloquer les transferts de certaines adresses grâce à des pouvoirs administratifs dans le contrat du token.

La valeur de référence, les actifs de garantie et le prix du marché sont trois éléments distincts qui doivent continuer à fonctionner ensemble.

Voilà ce que cachait l’expression « 500 unités de stablecoin ». La blockchain enregistre combien Alice en détient. Le modèle du stablecoin donne aux participants des raisons de valoriser chaque unité près d’un dollar. La solidité de ce lien détermine dans quelle mesure ces 500 unités peuvent servir de 500 dollars pour son prochain paiement, échange ou prêt.

La suite, [Comprendre les \[ Layers 2 \]](/fr/learn/layer-2-101), suit les USDC d’Alice entre les réseaux pour expliquer les rollups et les bridges.
