---
title: "Comprendre la [ Blockchain ]"
draft: false
sourceRevision: 19c60042c624acbb06c9fe0e770f9bdaba82ce2d3f7ccc38165b24c5ccc89449
---

Alice possède le billet 42 pour un concert. Elle ne peut pas y assister et souhaite le donner à Bob. Si elle lui envoie une photo, elle conserve l’image d’origine. Elle pourrait aussi en envoyer une copie à Charlie.

Qui la salle doit-elle laisser entrer ?

L’image ne permet pas de trancher. On peut copier un fichier numérique sans en priver la personne qui le détenait. Pour transférer un billet, il faut un registre des propriétaires et un moyen de s’accorder sur ses changements.

Suivons ce billet pour comprendre comment une blockchain peut fournir ce registre.

## Un registre partagé des propriétaires

Une entreprise de billetterie classique peut conserver une base de données indiquant « le billet 42 appartient à Alice ». Lorsqu’elle le donne à Bob, l’entreprise met cette entrée à jour. Alice peut toujours posséder une image, mais l’entreprise reconnaît désormais Bob comme propriétaire.

Ce fonctionnement peut très bien convenir. Il donne aussi à une organisation autorité sur le registre. Les clients et les autres applications de billetterie dépendent d’elle pour indiquer correctement les propriétaires et accepter les transferts légitimes.

Supposons que plusieurs applications indépendantes souhaitent utiliser le même registre sans confier tout le contrôle à l’une d’elles. Chacune pourrait en conserver une copie, mais les copies ne suffisent pas à déterminer quels changements accepter. Une application pourrait enregistrer un transfert vers Bob tandis qu’une autre enregistre un transfert vers Charlie.

Les participants ont besoin de règles communes pour vérifier les demandes et s’accorder sur un historique. Une **[blockchain](/fr/glossary#blockchain)** associe un registre partagé à des règles permettant de le maintenir sur un réseau d’ordinateurs. Notre exemple utilise une blockchain capable d’exécuter des programmes ; les fonctions disponibles et les règles de participation varient selon les réseaux.

## Transactions et signatures numériques

Le registre désigne le **[compte](/fr/glossary#account)** d’Alice comme propriétaire du billet. Les comptes utilisent des identifiants appelés **[adresses](/fr/glossary#address)**. Bob communique son adresse à Alice pour qu’elle puisse préciser le destinataire. Les noms Alice et Bob facilitent la lecture de l’exemple ; une adresse ne révèle pas, à elle seule, l’identité d’une personne.

Alice demande : « Transférer le billet 42 à l’adresse de Bob. » Cette instruction est une **[transaction](/fr/glossary#transaction)**. L’envoyer revient à demander au réseau de traiter un changement. Cela ne rend pas immédiatement Bob propriétaire.

Mais n’importe qui pourrait écrire cette instruction. Pour prouver une autorisation, le compte d’Alice utilise deux clés liées mathématiquement. Sa **[clé privée](/fr/glossary#private-key)** reste secrète et permet de créer des signatures. La **[clé publique](/fr/glossary#public-key)** associée permet aux autres de les vérifier.

Son **[portefeuille](/fr/glossary#wallet)** l’aide à examiner la demande et à utiliser sa clé pour créer une **[signature numérique](/fr/glossary#digital-signature)** portant sur ses données. Le réseau vérifie la signature et contrôle que la clé qui signe est autorisée pour son compte. Sa clé privée n’a pas besoin d’être envoyée avec la transaction.

La signature est liée à ce qu’elle a signé. Remplacer l’adresse de Bob par celle de Charlie modifie la demande : cette signature n’est alors plus valide. Connaître la clé publique d’Alice ne permet pas, en pratique, de signer de nouvelles demandes à sa place.

Le portefeuille donne accès au billet ; sa propriété est enregistrée dans le système partagé. Si quelqu’un vole la clé privée d’Alice, il peut signer pour son compte. Le réseau vérifie l’autorisation donnée avec la clé, pas si la personne qui l’utilise est réellement Alice.

## Smart contracts et nœuds

Une demande correctement signée doit encore respecter les règles du billet. Alice doit posséder le billet 42 au moment où le transfert est traité. Signer une demande ne lui donne pas le droit de transférer le billet d’une autre personne.

Certaines blockchains permettent aux développeurs d’écrire des programmes qui définissent les règles d’une application. Un tel programme est appelé **[smart contract](/fr/glossary#smart-contract)**, ou contrat intelligent. Son code et les informations qu’il stocke font partie du système partagé. Notre programme de billetterie vérifie le propriétaire actuel avant d’enregistrer le destinataire comme nouveau propriétaire.

Les ordinateurs participant au réseau sont appelés **[nœuds](/fr/glossary#node)**. Les nœuds qui effectuent une vérification complète contrôlent eux-mêmes les changements proposés, notamment les autorisations et l’exécution du programme. Avec le même registre initial et les mêmes demandes ordonnées, ils doivent obtenir le même résultat. Ils rejettent une mise à jour proposée qui omet une vérification obligatoire ou invente un transfert non autorisé.

La vérification indépendante contribue à la **[décentralisation](/fr/glossary#decentralization)** : la répartition des responsabilités et du contrôle entre les participants. Leur indépendance réelle compte. De nombreux ordinateurs exploités par une organisation peuvent encore lui laisser un contrôle important.

## Blocs et hashes

Les participants doivent proposer une suite d’événements précise. Ils regroupent les transactions en lots ordonnés appelés **[blocs](/fr/glossary#block)**. Chaque bloc proposé identifie le bloc précédent sur lequel il s’appuie. Ses transactions sont traitées à partir du registre produit par cet historique antérieur.

Le transfert d’Alice pourrait apparaître dans l’un de ces blocs. S’il réussit, le registre actuel désigne Bob comme propriétaire. L’historique montre toujours comment le billet lui est parvenu ; changer le propriétaire actuel n’efface pas les transferts précédents.

Pour relier les blocs, le système utilise un **[hash](/fr/glossary#hash)** : une empreinte numérique calculée à partir de données. Des données identiques produisent un hash identique. Modifier les données change presque certainement l’empreinte. Une fonction de hachage cryptographique adaptée rend irréalisable en pratique la recherche délibérée de données différentes ayant la même empreinte.

L’empreinte d’un bloc dépend de son contenu, notamment de sa référence au bloc précédent. Modifier une transaction antérieure change donc les empreintes qui la relient à l’historique suivant. Les anciennes références ne correspondent plus : ces liens rendent les modifications détectables.

Quelqu’un pourrait recalculer les empreintes concernées pour créer un autre historique, cohérent en lui-même. Les hashes révèlent sa différence avec l’original ; ils ne décident pas quel historique tout le monde doit accepter. Le réseau a besoin d’un autre mécanisme pour prendre cette décision.

## Consensus et finalité

Supposons qu’Alice signe une demande donnant le billet 42 à Bob et une autre le donnant à Charlie. Les deux signatures sont authentiques. Chaque demande pourrait réussir si elle était traitée en premier, tant qu’Alice possède encore le billet.

Mais dès qu’un transfert réussit, Alice ne le possède plus. Son autre demande ne peut pas transférer avec succès le même billet. Les règles empêchent les deux transferts de réussir dans un seul historique, mais elles n’indiquent pas à des ordinateurs différents quelle demande passe en premier.

Pourquoi ne pas utiliser l’ordre d’arrivée ? Les messages mettent du temps à circuler. Un nœud peut recevoir d’abord le transfert vers Bob, tandis qu’un autre reçoit d’abord celui vers Charlie. Les deux peuvent respecter la règle de propriété et pourtant aboutir à des conclusions différentes sur le propriétaire.

Le réseau a donc besoin de règles pour choisir entre des propositions concurrentes et établir un historique commun. C’est le **[consensus](/fr/glossary#consensus)**. Des participants peuvent proposer des blocs différents à partir du même historique antérieur ; le consensus détermine quelle branche valide poursuivre.

La vérification et le consensus répondent à deux questions différentes. La vérification contrôle qu’un historique proposé respecte les règles. Le consensus établit quel historique valide les participants acceptent. Choisir un bloc ne peut pas rendre une signature falsifiée valide pour les nœuds qui la vérifient.

Les réseaux utilisent différentes méthodes pour choisir les producteurs de blocs et résister aux manipulations. Certains lient la participation à un travail de calcul ou à des actifs engagés ; d’autres la réservent à des participants approuvés. Leur sécurité dépend de ces règles et de la répartition du contrôle. L’accord n’est pas garanti face à toute attaque ou défaillance du réseau.

Bob doit aussi distinguer un transfert récent d’un transfert considéré comme établi. Un bloc récent peut être remplacé si le réseau choisit une autre branche. La **[finalité](/fr/glossary#finality)** désigne la garantie qu’une mise à jour est établie ; ses conditions et sa solidité dépendent du réseau. L’application de Bob peut montrer la progression vers cette garantie.

## Le déroulement d’une transaction

Supposons que le programme de billetterie permette le transfert d’Alice. Le réseau de notre exemple facture des frais de transaction, qui paient le traitement et contribuent à rendre coûteux le fait de l’inonder de demandes.

1. **Préparer.** Alice sélectionne le billet 42 et l’adresse de Bob. Son application construit une transaction demandant au programme de billetterie de le transférer.
2. **Signer.** Son portefeuille affiche la demande et permet de la signer avec sa clé. La propriété n’a pas encore changé.
3. **Envoyer.** La transaction signée parvient à un nœud et peut être diffusée dans le réseau. Son envoi ne garantit pas son inclusion.
4. **Traiter et vérifier.** Un participant l’inclut dans un bloc proposé. Les nœuds qui effectuent une vérification complète contrôlent le bloc et son exécution. Si Alice possède toujours le billet et que le transfert réussit, le registre obtenu désigne Bob comme propriétaire.
5. **Établir le résultat.** Le consensus détermine si le bloc appartient à l’historique accepté. Bob attend le niveau de garantie prévu par le réseau.

L’application de Bob peut maintenant afficher le propriétaire enregistré et indiquer si le transfert a atteint le niveau de garantie prévu par le réseau.

## Applications, confiance et limites

Leurs applications peuvent lire le même registre des propriétaires et interagir avec le même programme de billetterie. Ils peuvent utiliser des interfaces différentes sans créer des billets différents. Les règles partagées continuent de s’appliquer quelle que soit l’application qui prépare la demande.

Le registre devient ainsi utilisable au-delà d’un seul site. Mais une interface peut toujours afficher des informations périmées ou présenter de façon trompeuse ce qu’une signature autorise. Un réseau partagé ne rend pas chaque application digne de confiance.

Le billet illustre aussi une limite. Le registre peut établir la propriété selon ses règles, mais il ne peut ni prouver que le concert existe ni obliger la salle à laisser entrer Bob. L’organisateur doit reconnaître ce que le registre numérique représente.

D’autres limites demeurent. Des données publiques peuvent exposer l’activité liée à une adresse. Les programmes peuvent contenir des bugs ou accorder des pouvoirs particuliers aux administrateurs. Une signature authentique peut autoriser une erreur, comme envoyer le billet à la mauvaise adresse. Répartir la vérification consomme aussi des ressources de calcul, de stockage et de communication.

Une blockchain est donc une façon d’organiser un registre partagé, pas une obligation pour chaque billetterie. Si tout le monde accepte l’autorité d’une organisation, une base de données classique peut être plus simple. L’avantage particulier ici est de permettre à des participants indépendants de maintenir et de vérifier un historique commun sans confier à une application toute l’autorité sur celui-ci.

## La blockchain dans son ensemble

Copier l’image d’Alice ne pouvait pas établir qui devait ensuite posséder le billet. Le registre partagé apporte cette réponse grâce à plusieurs éléments qui fonctionnent ensemble : les signatures établissent l’autorisation, le programme définit les transferts permis, les nœuds vérifient le traitement et les blocs reliés organisent l’historique. Les règles de consensus et de finalité déterminent l’historique auquel Bob peut se fier.

Bob peut maintenant vérifier un registre des propriétaires accepté par les participants, au lieu de dépendre uniquement de ce qu’affirme Alice ou d’une image.

La suite, [Comprendre \[ Ethereum \]](/fr/learn/ethereum-101), montrera comment un réseau concret met ces idées en pratique.
