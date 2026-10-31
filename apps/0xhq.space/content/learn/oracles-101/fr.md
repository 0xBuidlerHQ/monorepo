---
title: "Comprendre les [ Oracles ]"
draft: false
sourceRevision: 423d54ae78f2b72b950e0d7c5b8fbcd05ed0fbb795f336625edc3912d2154cd8
---

Dans [Comprendre la \[ DeFi \]](/fr/learn/defi-101), Bob a emprunté 400 USDC contre des actifs valant 1 000 dollars. Sa position pouvait être liquidée si cette garantie perdait trop de valeur.

Mais le contrat enregistre des tokens, pas des étiquettes de prix en dollars attachées à chacun. Comment connaît-il la valeur des ETH de Bob ? Quel prix doit-il utiliser lorsque plusieurs marchés affichent des nombres différents ?

C’est le rôle d’un **oracle** : fournir une information dont un contrat a besoin, mais qu’il ne peut pas établir à partir de ses propres données. Suivons un prix depuis le marché jusqu’à la position de prêt de Bob. Tous les prix et paramètres de risque de l’exemple sont illustratifs.

## Ce que le contrat peut savoir

Le contrat de prêt peut lire combien de tokens Bob a fournis et combien il doit. Ces montants font partie des données de la blockchain. Leur valeur actuelle en dollars constitue une autre information.

Il ne peut pas simplement demander à chaque nœud d’ouvrir un site et d’utiliser le prix qui s’y affiche. Les sites peuvent changer entre deux demandes, devenir indisponibles ou renvoyer des réponses différentes. Les nœuds qui traitent une même transaction ont besoin de données d’entrée communes pour obtenir le même résultat.

Un **[oracle](/fr/glossary#oracle)** relie une source d’information à l’application qui l’utilise. Pour un oracle de prix, cela peut comprendre la collecte d’observations de marché, leur regroupement et la transmission d’un rapport que le contrat peut vérifier et utiliser.

## Des observations de marché à un prix de référence

Supposons que le collatéral de Bob soit constitué de **0,4 ETH**. Avec un prix de référence de **2 500 dollars par ETH**, le protocole de prêt lui attribue une valeur de **1 000 dollars**.

Il n’existe pas un prix universel de l’ETH inscrit quelque part dans le monde. Plusieurs plateformes peuvent afficher des prix légèrement différents, avec une liquidité et une activité différentes. Un flux de prix a besoin d’une méthode pour choisir les observations retenues et les combiner.

Pour un exemple simple, supposons que trois observations acceptées donnent **2 490, 2 500 et 2 510 dollars**. Un système qui retient la valeur du milieu, appelée **médiane**, publierait 2 500 dollars. Une observation anormalement haute ou basse pèse ainsi moins que si l’on acceptait une source unique. Cela ne rend pas n’importe quel groupe de sources digne de confiance.

Des réseaux d’oracles comme **Chainlink** peuvent combiner les informations à plusieurs niveaux, notamment chez les fournisseurs de données et les nœuds qui publient les rapports. La méthode exacte dépend du flux. D’autres modèles utilisent des prix déjà enregistrés sur des marchés onchain, parfois moyennés sur une période.

L’indépendance et la qualité des données comptent. Dix participants qui reprennent une même source peu fiable ne donnent pas dix observations indépendantes. Le prix d’un petit marché facile à déplacer peut aussi être inadapté pour valoriser un prêt beaucoup plus important.

## Publier un prix utilisable par le contrat

Dans une organisation courante, des participants soumettent les mises à jour de prix à un contrat d’oracle. Le système vérifie qu’un rapport respecte ses règles d’autorisation et d’acceptation. Un contrat de flux rend ensuite la réponse acceptée disponible aux autres contrats.

Lorsque Bob emprunte, rembourse ou fait l’objet d’une liquidation, le protocole de prêt consulte le flux configuré et utilise sa réponse pour valoriser les actifs concernés. Le prix affiché sur l’écran de Bob n’est pas nécessairement celui que le contrat utilise.

Aave, par exemple, utilise une infrastructure d’oracles pour obtenir les valeurs des actifs de ses marchés de prêt. Les flux choisis et les éventuelles règles de prix supplémentaires font partie de sa configuration. Tous les actifs n’utilisent pas nécessairement le même type de flux de prix ou de taux de conversion.

D’autres modèles d’oracle apportent un rapport signé avec la transaction qui en a besoin, plutôt que de s’appuyer uniquement sur une réponse publiée auparavant. Dans les deux cas, l’application doit savoir quels rapports elle accepte et comment les interpréter.

Une signature de rapport valide identifie un participant autorisé à le publier. Elle ne prouve pas à elle seule que le prix de marché annoncé est correct.

## Un prix a aussi une date

Supposons que le dernier prix accepté de l’ETH soit de 2 500 dollars, mais que le marché ait fortement baissé depuis. Un ancien rapport correctement signé peut rester une mauvaise base pour un nouveau prêt.

Un flux a donc besoin de plus qu’un nombre. L’information sur sa dernière mise à jour aide l’application à déterminer s’il est assez récent pour être utilisé. Certains flux, dont de nombreux flux de prix Chainlink, déclenchent une mise à jour lorsque le prix a suffisamment varié ou qu’un délai configuré s’est écoulé. Cela ne signifie pas que chaque mouvement du marché apparaît instantanément sur la blockchain.

L’application de prêt doit définir quoi faire lorsqu’un rapport manque ou devient trop ancien. Elle peut refuser une opération ou suspendre une partie du service plutôt que de continuer avec un prix qui ne respecte plus ses conditions. Les limites adaptées dépendent de l’actif et de l’application.

Une perturbation du réseau peut aussi compter. Sur une Layer 2, une panne du séquenceur peut empêcher les utilisateurs d’agir alors que les marchés continuent d’évoluer ailleurs. Les applications peuvent vérifier l’état du réseau et prévoir une période de reprise avant de réactiver des opérations sensibles. Le prix et les conditions dans lesquelles les utilisateurs peuvent y réagir comptent tous deux.

## L’effet du prix sur le prêt de Bob

Reprenons les **0,4 ETH** de Bob et sa **dette de 400 USDC**. Pour ce calcul, supposons que l’USDC vaille un dollar et que la position ait un **seuil de liquidation de 80 %**. Ce seuil illustratif détermine quand la liquidation est permise ; il ne correspond ni à la limite pour contracter un nouvel emprunt ni aux réglages actuels d’Aave.

À 2 500 dollars par ETH, le collatéral vaut 1 000 dollars. Quatre-vingts pour cent de cette valeur représentent 800 dollars : la dette de 400 dollars reste donc sous la limite de liquidation.

Si le prix accepté tombe à **1 200 dollars par ETH**, le contrat valorise le collatéral à **480 dollars**. Quatre-vingts pour cent représentent **384 dollars**, moins que la dette de 400 dollars. Selon notre règle, la position devient liquidable.

L’oracle a fourni le prix. Le contrat de prêt a appliqué la règle de l’emprunt. Un participant peut ensuite soumettre une transaction de liquidation ; la mise à jour du prix ne signifie pas que l’oracle prélève lui-même les ETH de Bob.

Un prix trop bas par erreur peut faire apparaître une position suffisamment garantie comme liquidable. Un prix trop haut peut permettre des emprunts excessifs ou retarder la liquidation pendant que les pertes augmentent. Le protocole doit aussi valoriser l’actif emprunté : supposer que chaque USDC vaut toujours un dollar peut devenir incorrect lors d’un décrochage.

Le choix des sources, le rythme des mises à jour et la configuration ont donc un effet sur des actifs réels. Même un prix correct exprimé dans la mauvaise monnaie ou concernant le mauvais token peut produire un résultat erroné si l’application l’interprète mal.

## Où se trouve la confiance

Un contrat de prêt peut appliquer exactement ses règles et produire malgré tout des résultats nuisibles à partir de mauvaises données. Répartir l’exécution entre de nombreux ordinateurs ne supprime pas le besoin d’examiner l’origine de ces données.

Plusieurs sources indépendantes, un regroupement robuste des observations, des contrôles de fraîcheur et des limites sur les valeurs inhabituelles peuvent réduire certains risques. Aucun de ces mécanismes ne transforme l’oracle en garantie universelle de vérité. Certains systèmes donnent aussi à des administrateurs le pouvoir de remplacer une source ou de suspendre son utilisation, ce qui ajoute une dépendance.

Le même principe dépasse les prix. Un programme de billetterie pourrait utiliser un rapport d’oracle sur l’annulation d’un concert pour appliquer une règle de remboursement. Il dépendrait toujours de la personne ou du système autorisé à annoncer cette annulation et de ce que le contrat fait du rapport.

Le prêt de Bob rend la distinction concrète : la blockchain enregistre son collatéral et sa dette, l’oracle fournit l’information de valorisation et le contrat de prêt détermine ce que cette information implique pour sa position. Comprendre un oracle consiste à suivre tout ce chemin, plutôt qu’à traiter un nombre dans un contrat comme un fait découvert par la blockchain elle-même.
