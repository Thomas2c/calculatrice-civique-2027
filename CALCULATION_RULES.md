# Règles de calcul du simulateur politique 2027

Le simulateur ne cherche pas à prédire les élections.
Il explore les conséquences institutionnelles plausibles
des choix politiques et des rapports de force anticipés
par l’utilisateur.

Tous les calculs reposent donc sur :
- les hypothèses de l’utilisateur,
- ses préférences,
- ses anticipations,
- et les compatibilités politiques qu’il imagine.

---

# 1. Présidentiables plausibles

L’utilisateur sélectionne les candidats
qui lui semblent capables d’accéder au second tour.

Cette étape sert à :
- réduire le champ politique,
- construire les scénarios crédibles,
- identifier les acteurs centraux de l’élection.

Ces candidats deviennent :
- les finalistes potentiels,
- les pivots possibles,
- les futurs acteurs des coalitions.

---

# 1 bis. Influence politique réelle

Tous les candidats sont classés
en trois niveaux d’influence :

- faible
- moyenne
- forte

Cette mesure ne représente pas seulement :
- le score électoral,
- mais aussi :
  - le poids parlementaire,
  - la capacité d’agrégation,
  - l’influence médiatique,
  - la capacité à structurer une coalition.

Exemple :
un candidat sans députés
peut malgré tout être classé “fort”
s’il semble capable d’agréger rapidement des soutiens.

Cette influence sert ensuite à pondérer :
- les alliances,
- les coalitions,
- les pivots gouvernementaux.

---

# 2. Acceptables / refusés

L’utilisateur indique :
- les candidats qu’il refuse absolument,
- et ceux qu’il pourrait encore accepter
dans certaines configurations de second tour.

Cette étape sert à mesurer :
- la polarisation,
- l’hostilité agrégée,
- les espaces de coalition possibles.

---

# 3. Duels présidentiels

L’utilisateur indique
qui gagnerait selon lui
chaque duel de second tour.

Le système calcule alors :
- le nombre de duels gagnés,
- la capacité présidentielle,
- les candidats capables d’accéder réellement au pouvoir.

Cette étape mesure :
- la force présidentielle,
- mais pas encore :
  - la capacité à gouverner.

---

# 4. Alliances gouvernementales

L’utilisateur indique
quels candidats pourraient gouverner ensemble.

Cette étape est centrale.

Elle sert à mesurer :
- la possibilité de coalition,
- la stabilité gouvernementale,
- les pivots de majorité,
- les cohabitations possibles.

---

# Alliances simples

Une alliance simple signifie :

"A accepterait potentiellement
de gouverner avec B."

Cela mesure :
- l’ouverture politique,
- la surface de coalition.

---

# Alliances réciproques

Une alliance réciproque existe si :

A accepte B
ET
B accepte A.

Ces alliances valent davantage
car elles représentent :
- une compatibilité politique réelle,
- une capacité plus stable à gouverner ensemble.

---

# Densité mutuelle

Le système mesure également
les compatibilités croisées
entre alliés eux-mêmes.

Exemple :

A ↔ B
B ↔ C
C ↔ A

Cette densité mutuelle
renforce fortement la stabilité potentielle
de la coalition.

---

# Porosité tactique

Le système distingue :
- gouverner ensemble,
- et agir ensemble ponctuellement.

Des partis incompatibles pour gouverner
peuvent malgré tout :
- voter ensemble une motion de censure,
- coordonner une opposition,
- ou construire temporairement une majorité négative.

Cette "porosité tactique"
sert à détecter :
- les oppositions coordonnables,
- les risques de censure,
- les cohabitations possibles.

---

# Poids des alliances

Les alliances sont pondérées
par le niveau d’influence des alliés.

Exemple :
- plusieurs petits alliés
ne valent pas forcément
un grand pivot parlementaire.

Le système combine donc :
- nombre d’alliés,
- poids politique total,
- réciprocité,
- densité mutuelle.

---

# Compatibilités indirectes et continuité tactique

Le système ne mesure pas seulement
les alliances directes entre candidats.

Il mesure également
les compatibilités indirectes
qui apparaissent par enchaînement
dans le graphe politique.

Si :

A ↔ B
B ↔ C
C ↔ D

alors A et D
ne sont pas directement alliés,
mais appartiennent au même espace
de compatibilité tactique.

Cette continuité peut :
- rendre une motion de censure plausible,
- faciliter une coordination parlementaire,
- ou permettre l’émergence progressive
  d’une coalition.

Pondération :

- alliance réciproque directe : +3
- alliance simple directe : +1
- compatibilité indirecte via 1 intermédiaire : +0.5
- compatibilité indirecte via 2 intermédiaires : +0.25

Plus deux acteurs sont éloignés
dans le réseau d’alliances,
plus leur compatibilité tactique
devient faible.

Cette continuité sert à mesurer :
- la porosité tactique,
- les oppositions compatibles,
- les risques de censure,
- les cohabitations plausibles,
- et la capacité du système politique
  à produire des coordinations
  de proche en proche.

Si les oppositions peuvent
se coordonner indirectement
sur environ deux tiers du spectre politique,
le système considère qu’une motion
de censure devient plausible.

Dans ce cas,
le scénario n’est pas classé
comme gouvernement stable,
même s’il existe des soutiens directs.

Le pivot gouvernemental
n’est donc pas seulement
celui qui possède le plus
d’alliances directes :
il est aussi celui qui réduit
les distances entre plusieurs blocs politiques.

---

# Indicateurs principaux

Pour chaque candidat,
le système calcule notamment :

## Nombre d’alliés
Surface politique potentielle.

## Poids total des alliés
Force politique réelle de la coalition.

## Alliances réciproques
Solidité des relations politiques.

## Alliances mutuelles croisées
Densité systémique de la coalition.

## Hostilité agrégée
Capacité des oppositions
à se coordonner contre le candidat.

## Taux de réciprocité systémique
Capacité d’un acteur
à devenir un centre stable de coalition.

---

# Pivot gouvernemental

Le pivot gouvernemental
n’est pas forcément le président.

C’est :
- l’acteur le plus compatible,
- le plus agrégateur,
- celui autour duquel
une majorité peut le plus facilement se structurer.

Le pivot peut être :
- le président lui-même,
- un Premier ministre potentiel,
- un leader de coalition,
- ou aucun acteur,
dans les situations de fragmentation totale.

---

# Situations institutionnelles finales

Le simulateur produit ensuite
des scénarios institutionnels plausibles :

## Coalition avec le président
Le président semble capable
de construire une coalition stable.

## Présidence isolée
Le président dispose
de peu d’alliances solides.

## Parlement fragmenté
Aucune majorité claire ne se dégage.

## Cohabitation probable
Une majorité alternative
semble capable de gouverner contre le président.

## Gouvernement minoritaire survivant
Le président est minoritaire,
mais aucune coalition alternative stable
ne semble capable de le remplacer.

---

# Neutralité du simulateur

Le simulateur ne juge pas
si une situation est :
- bonne,
- mauvaise,
- stable,
- souhaitable.

Il cherche uniquement
à rendre visibles
les conséquences institutionnelles plausibles
des rapports de force imaginés par l’utilisateur.

Certaines configurations peuvent favoriser :
- la coalition,
- le compromis,
- la cohabitation,
- le conflit institutionnel,
- le référendum,
- une réforme constitutionnelle,
- ou une logique de présidence autonome.
