function calculerStrategie() {

  const candidatsPresidentiables =
    candidats.filter(c =>
      preselection.includes(c.id)
    );

  const strategie =
    document.getElementById(
      "strategie"
    );

  const conclusion =
    document.getElementById(
      "vote-utile-final"
    );

  const indicateurs =
    calculerIndicateursInstitutionnels(
      candidats
    );

  const resultats =
    candidatsPresidentiables
      .map(
        candidat => {

          const potentiel =
            potentielsSecondTour[
              candidat.id
            ] ?? 50;

          const donnees =
            indicateurs[
              candidat.id
            ];

          return {
            ...donnees,
            potentiel,
            capacitePresidentielle:
              (donnees.duelsGagnes * 3)
              + potentiel
          };

        }
      )
      .sort(
        (a, b) =>
          b.scorePivot
          - a.scorePivot
      );

  strategie.innerHTML =
    construireTableauInstitutionnel(
      resultats
    );

  afficherLectureInstitutionnelle(
    conclusion,
    candidatsPresidentiables,
    candidats,
    indicateurs,
    resultats
  );

}

function construireTableauInstitutionnel(
  resultats
) {

  let html = `

    <div style="
      margin-bottom:20px;
    ">

      <div style="
        font-size:28px;
        font-weight:bold;
        margin-bottom:15px;
      ">

        5.1 Scores des présidentiables plausibles

      </div>

      <div style="
        line-height:1.5;
        font-size:15px;
      ">

        Ces scores affichent uniquement
        les candidats que vous jugez capables
        d’accéder au second tour.
        Ils rendent visibles les rapports de force
        produits par vos hypothèses :
        influence, alliances, réciprocité,
        densité de coalition, continuité tactique
        et hostilité agrégée.

      </div>

    </div>

    <table class="tableau-scores">

      <tr>
        <th align="left">Candidat</th>
        <th>${construireEnteteAide("Influence", "Influence politique estimée : faible signifie peu de relais politiques ; moyenne, une capacité de négociation réelle ; forte, une capacité à structurer une coalition au-delà de son camp.")}</th>
        <th>${construireEnteteAide("Duels", "Nombre de duels présidentiels que ce candidat semble capable de gagner selon vos hypothèses.")}</th>
        <th>${construireEnteteAide("Potentiel", "Probabilité estimée d’accéder au second tour selon vos hypothèses.")}</th>
        <th>${construireEnteteAide("Capacité présidentielle", "Mesure la capacité à gagner, atteindre l’Élysée et dominer les scénarios de second tour. Elle ne mesure pas encore la capacité à gouverner durablement.")}</th>
        <th>${construireEnteteAide("Alliés", "Nombre de candidats avec lesquels ce candidat pourrait potentiellement gouverner.")}</th>
        <th>${construireEnteteAide("Poids alliés", "Poids politique cumulé des alliés potentiels. Tous les alliés ne disposent pas de la même influence politique.")}</th>
        <th>${construireEnteteAide("Réciproques", "Nombre d’alliances mutuelles : A accepte B et B accepte A. Ces alliances sont généralement plus stables politiquement.")}</th>
        <th>${construireEnteteAide("Densité alliés", "Mesure les liens entre les alliés eux-mêmes. Si A, B et C sont tous reliés entre eux, la densité est forte.")}</th>
        <th>${construireEnteteAide("Continuité indirecte", "Mesure les compatibilités indirectes dans le réseau politique. Des chaînes d’alliances peuvent rendre une coalition, une censure ou une coordination plus plausible.")}</th>
        <th>${construireEnteteAide("Hostilité", "Mesure la capacité des oppositions à se coordonner contre ce candidat. Une forte hostilité augmente le risque de censure, de blocage ou de cohabitation.")}</th>
        <th>${construireEnteteAide("Score pivot", "Mesure la capacité globale à devenir un centre de coalition, un pivot gouvernemental ou un Premier ministre plausible. Il combine alliances, poids politique, réciprocité, continuité et hostilité.")}</th>
      </tr>

  `;

  resultats.forEach(
    resultat => {

      let couleur = "";

      if (
        refus.includes(
          resultat.candidat.id
        )
      ) {

        couleur =
          "#ffb3b3";

      }

      else if (
        acceptables.includes(
          resultat.candidat.id
        )
      ) {

        couleur =
          "#b7f0b7";

      }

      html += `

        <tr style="
          background:${couleur};
        ">

          <td>${resultat.candidat.nom}</td>
          <td align="center">${resultat.influence}</td>
          <td align="center">${resultat.duelsGagnes}</td>
          <td align="center">${resultat.potentiel}%</td>
          <td align="center">${resultat.capacitePresidentielle}</td>
          <td align="center">${resultat.nombreAllies}</td>
          <td align="center">${resultat.poidsTotalAllies}</td>
          <td align="center">${resultat.alliancesReciproques}</td>
          <td align="center">${Math.round(resultat.densiteMutuelle * 100)}%</td>
          <td align="center">${resultat.continuiteSoutiens.toFixed(1)}</td>
          <td align="center">${resultat.hostiliteAgregee}</td>
          <td align="center">
            <strong>
              ${resultat.scorePivot.toFixed(1)}
            </strong>
          </td>

        </tr>

      `;

    }
  );

  html += `</table>`;

  return html;

}

function construireEnteteAide(
  libelle,
  aide
) {

  return `
    <span class="entete-aide">
      <span>${libelle}</span>
      <button
        type="button"
        class="icone-aide"
        aria-label="${aide}"
      >
        ?
      </button>
      <span class="tooltip-aide" role="tooltip">
        ${aide}
      </span>
    </span>
  `;

}

function calculerScoresVictoire(
  candidatsVisibles
) {

  const scoresVictoire = {};

  candidatsVisibles.forEach(c => {

    scoresVictoire[c.id] = 0;

  });

  for (
    const cle in pronostics
  ) {

    const vainqueurId =
      pronostics[cle];

    if (
      scoresVictoire[
        vainqueurId
      ] !== undefined
    ) {

      scoresVictoire[
        vainqueurId
      ]++;

    }

  }

  return scoresVictoire;

}

function afficherLectureInstitutionnelle(
  container,
  candidatsPresidentiables,
  _candidatsAnalyses,
  indicateurs,
  resultats
) {

  const visualisation =
    construireCarteGouvernementStable(
      candidatsPresidentiables,
      indicateurs,
      resultats
    );

  container.innerHTML =
    `

    <h2>
      5.3 Pour qui voter au premier tour selon ces scores et vos préférences
    </h2>

    <p>
      Si votre objectif est qu’un candidat acceptable
      devienne Premier ministre ou président d’une coalition
      favorable, il peut être rationnel de soutenir
      au premier tour celui qui peut devenir le pivot
      gouvernemental le plus stable.
    </p>

    <p>
      Un scénario peut donc être favorable même si votre candidat
      acceptable n’est pas élu président : il peut malgré tout
      devenir le pivot gouvernemental autour duquel une coalition
      stable se construit. Dans ces cas, voter pour lui au premier
      tour peut renforcer sa capacité de négociation et son rôle
      futur dans le gouvernement.
    </p>

    <p>
      Un scénario est écarté si l’opposition parlementaire
      peut se coordonner indirectement sur au moins
      deux tiers du spectre politique,
      sauf quand vous avez déclaré que le président
      pouvait gouverner directement par majorité
      ou par coalition.
    </p>

    <p>
      Voici les noms qui ressortent de vos hypothèses :
    </p>

    ${visualisation}

    `;

}

function construireCarteGouvernementStable(
  candidatsPresidentiables,
  indicateurs,
  resultats
) {

  const pivotsAcceptables =
    resultats.filter(
      resultat =>
        acceptables.includes(
          resultat.candidat.id
        )
    );

  if (
    pivotsAcceptables.length === 0
  ) {

    return `
      <div class="carte-stabilite">
        <h3>
          Gouvernement stable
        </h3>

        <p>
          Sélectionnez d’abord au moins un candidat acceptable
          pour faire apparaître les scénarios où un gouvernement
          pourrait se structurer autour de lui.
        </p>
      </div>
    `;

  }

  const scenarios =
    candidatsPresidentiables
      .map(president =>
        trouverMeilleurScenarioAcceptable(
          president,
          indicateurs,
          resultats,
          pivotsAcceptables
        )
      )
      .filter(
        scenario =>
          scenario !== null
          && scenario.estViable
      )
      .sort(
        (a, b) =>
          b.scoreScenario
          - a.scoreScenario
      );

  if (
    scenarios.length === 0
  ) {

    return `
      <div class="carte-stabilite">
        <h3>
          Gouvernement stable
        </h3>

        <p>
          Aucun scénario favorable ne se dégage pour le moment :
          vos candidats acceptables ne semblent pas encore produire
          de gouvernement stable, ou les oppositions peuvent
          se coordonner indirectement sur une part trop large
          du spectre politique.
        </p>
      </div>
    `;

  }

  const scenariosTresFavorables =
    scenarios.filter(
      scenario =>
        !refus.includes(
          scenario.president.id
        )
    );

  const autresScenariosFavorables =
    scenarios.filter(
      scenario =>
        refus.includes(
          scenario.president.id
        )
        && acceptables.includes(
          scenario.pivot.candidat.id
        )
    );

  const scenariosProchesPivotAcceptable =
    candidatsPresidentiables
      .map(president =>
        rechercherPivotAcceptablePresqueStable(
          president,
          candidats,
          indicateurs
        )
      )
      .filter(Boolean);

  return `
    <div class="carte-stabilite">
      <h3>
        Scénarios très favorables à vos acceptables
      </h3>

      <p>
        Ces scénarios correspondent aux cas où le président élu
        n’est pas dans vos refus, et où un candidat acceptable
        peut former le pivot gouvernemental stable.
      </p>

      ${construireListeScenariosStables(
        scenariosTresFavorables
      )}

      ${construireAutresScenariosFavorables(
        autresScenariosFavorables
      )}

      ${construireScenariosProchesPivotAcceptable(
        scenariosProchesPivotAcceptable
      )}
    </div>
  `;

}

function construireScenariosProchesPivotAcceptable(
  scenarios
) {

  if (
    scenarios.length === 0
  ) {
    return "";
  }

  return `
    <div class="scenarios-presque-stables">
      <h3>
        Gouvernements instables proches d’un pivot acceptable
      </h3>

      <p>
        Ces scénarios ne sont pas classés comme coalitions stables.
        Ils signalent seulement des configurations où un président
        élu refusé paraît isolé, tandis qu’un pivot acceptable
        semble proche de pouvoir agréger une coalition alternative.
      </p>

      <div class="cartes-stabilite">
        ${scenarios.map(scenario =>
          construireCarteScenarioPresqueStable(
            scenario
          )
        ).join("")}
      </div>
    </div>
  `;

}

function construireCarteScenarioPresqueStable(
  scenario
) {

  return `
    <article class="scenario-presque-stable">
      <div class="candidat-stabilite-entete">
        <strong>
          ${scenario.pivot.candidat.nom}
        </strong>
        <span>
          Pivot acceptable potentiel
        </span>
      </div>

      <div class="scenario-ligne">
        Président élu :
        <strong>
          ${scenario.president.nom}
        </strong>
        <span class="badge-refus">refusé</span>
      </div>

      <div class="lecture-stabilite">
        Selon vos hypothèses, le président élu semble disposer
        d’un gouvernement fragile et politiquement isolé.
        Cependant, un pivot gouvernemental alternatif semble
        proche de pouvoir émerger.
      </div>

      <p>
        Ce candidat acceptable pourrait devenir un pivot
        gouvernemental crédible si certaines alliances
        supplémentaires émergeaient dans cet espace parlementaire.
      </p>

      <div class="barre-comparaison">
        <div class="barre-libelle">
          <span>Poids estimé manquant</span>
          <span>${scenario.pourcentageManquant}%</span>
        </div>
        <div class="barre-fond">
          <div
            class="barre-remplissage barre-attention"
            style="width:${Math.min(100, scenario.pourcentageManquant)}%"
          ></div>
        </div>
        <div class="barre-detail">
          poids actuel ${scenario.poidsActuel.toFixed(1)}
          · seuil estimé ${scenario.poidsCible.toFixed(1)}
          · densité ${Math.round(scenario.densiteMutuelle * 100)}%
          · continuité ${scenario.continuiteSoutiens.toFixed(1)}
          · continuité du bloc ${Math.round(scenario.tauxContinuite * 100)}%
        </div>
      </div>

      <p>
        Certains candidats non alliés au président élu pourraient
        encore renforcer cette coalition, améliorer la continuité
        des alliances ou stabiliser une majorité alternative.
      </p>

      <div class="acteurs-disponibles">
        <strong>
          Acteurs encore disponibles susceptibles de renforcer
          ce pivot gouvernemental :
        </strong>
        <ul>
          ${scenario.acteursDisponibles.map(acteur =>
            `
            <li>
              ${acteur.candidat.nom}
              <span>
                poids ${acteur.poids}
                · liens ${acteur.liensAvecAllies}
              </span>
            </li>
            `
          ).join("")}
        </ul>
      </div>

      <p class="retour-alliance">
        Vous pouvez retourner dans la section “Alliances gouvernementales”
        pour explorer quelles alliances supplémentaires pourraient
        renforcer cette coalition et modifier sa stabilité parlementaire.
      </p>
    </article>
  `;

}

function construireListeScenariosStables(
  scenarios
) {

  if (
    scenarios.length === 0
  ) {

    return `
      <p>
        Aucun scénario très favorable ne se dégage pour le moment.
      </p>
    `;

  }

  return `
    <div class="cartes-stabilite">
      ${scenarios.map((scenario, index) =>
        construireCarteScenarioStable(
          scenario,
          index
        )
      ).join("")}
    </div>
  `;

}

function construireAutresScenariosFavorables(
  scenarios
) {

  if (
    scenarios.length === 0
  ) {
    return "";
  }

  return `
    <div class="autres-scenarios-favorables">
      <h3>
        Autres scénarios favorables
      </h3>

      <p>
        Dans ces scénarios, le président élu fait partie
        de vos refus. Mais vos hypothèses indiquent malgré tout
        qu’un candidat acceptable pourrait devenir le pivot
        d’une coalition gouvernementale stable.
      </p>

      <p>
        Ces cas peuvent donc rester favorables du point de vue
        gouvernemental : voter au premier tour pour ce candidat
        acceptable peut renforcer sa capacité à devenir le centre
        de gravité du gouvernement, même sans être élu président.
      </p>

      <div class="cartes-stabilite">
        ${scenarios.map((scenario, index) =>
          construireCarteScenarioStable(
            scenario,
            index
          )
        ).join("")}
      </div>
    </div>
  `;

}

function trouverMeilleurScenarioAcceptable(
  president,
  indicateurs,
  resultats,
  _pivotsAcceptables
) {

  const presidentResultat =
    resultats.find(
      resultat =>
        resultat.candidat.id === president.id
    );

  if (!presidentResultat) {
    return null;
  }

  const analyse =
    analyserScenarioInstitutionnel(
      president,
      candidats,
      indicateurs
    );

  if (
    !analyse.stable
    || !analyse.pivot
    || !acceptables.includes(
      analyse.pivot.candidat.id
    )
  ) {
    return null;
  }

  const opposition =
    calculerIndicateursOpposition(
      analyse.pivot.candidat
    );

  const scoreSoutiens =
    calculerScoreSoutiens(
      analyse.pivot
    );

  const scoreOppositions =
    calculerScoreOppositions(
      opposition
    );

  const scoreScenario =
    scoreSoutiens
    - scoreOppositions
    + analyse.pivot.scorePivot;

  return {
    president,
    presidentResultat,
    pivot:
      analyse.pivot,
    opposition,
    scoreSoutiens,
    scoreOppositions,
    scoreScenario,
    estViable: true,
    type:
      analyse.type,
    explication:
      analyse.explication,
    situation:
      analyse.situation
  };

}

function construireCarteScenarioStable(
  scenario,
  index
) {

  const presidentRefuse =
    refus.includes(
      scenario.president.id
    );

  const memePersonne =
    scenario.president.id
    === scenario.pivot.candidat.id;

  const lecture =
    scenario.explication;

  return `
    <article class="
      candidat-stabilite
      candidat-acceptable
    ">
      <div class="candidat-stabilite-entete">
        <strong>
          ${index + 1}. ${scenario.pivot.candidat.nom}
        </strong>
        <span>
          Pivot acceptable
        </span>
      </div>

      <div class="scenario-ligne">
        Président élu :
        <strong>
          ${scenario.president.nom}
        </strong>
        ${
          presidentRefuse
            ? "<span class='badge-refus'>refusé</span>"
            : ""
        }
      </div>

      <div class="scenario-ligne">
        Conséquence :
        <strong>
          ${scenario.situation}
        </strong>
      </div>

      <div class="barre-comparaison">
        <div class="barre-libelle">
          <span>Soutiens gouvernementaux</span>
          <span>${scenario.scoreSoutiens}/100</span>
        </div>
        <div class="barre-fond">
          <div
            class="barre-remplissage barre-soutiens"
            style="width:${scenario.scoreSoutiens}%"
          ></div>
        </div>
        <div class="barre-detail">
          ${scenario.pivot.nombreAllies} alliés
          · ${scenario.pivot.alliancesReciproques} réciproques
          · densité ${Math.round(scenario.pivot.densiteMutuelle * 100)}%
          · continuité ${scenario.pivot.continuiteSoutiens.toFixed(1)}
        </div>
      </div>

      <div class="barre-comparaison">
        <div class="barre-libelle">
          <span>Oppositions parlementaires</span>
          <span>${scenario.scoreOppositions}/100</span>
        </div>
        <div class="barre-fond">
          <div
            class="barre-remplissage barre-oppositions"
            style="width:${scenario.scoreOppositions}%"
          ></div>
        </div>
        <div class="barre-detail">
          ${scenario.opposition.nombreOpposants} opposants
          · ${scenario.opposition.oppositionsReciproques} réciproques
          · densité ${Math.round(scenario.opposition.densiteOpposition * 100)}%
          · continuité ${scenario.opposition.continuiteOpposition.toFixed(1)}
          · spectre ${Math.round(scenario.opposition.tauxContinuiteOpposition * 100)}%
        </div>
      </div>

      <div class="lecture-stabilite">
        ${lecture}
      </div>
    </article>
  `;

}

function calculerScoreSoutiens(
  resultat
) {

  return bornerScore(
    (resultat.poidsTotalAllies * 1.8)
    + (resultat.alliancesReciproques * 6)
    + (resultat.densiteMutuelle * 20)
    + (resultat.tauxReciprocite * 20)
    + (resultat.continuiteSoutiens * 2)
  );

}

function calculerScoreOppositions(
  opposition
) {

  return bornerScore(
    (opposition.poidsOpposants * 1.8)
    + (opposition.oppositionsReciproques * 6)
    + (opposition.densiteOpposition * 20)
    + (opposition.tauxReciprociteOpposition * 20)
    + (opposition.continuiteOpposition * 2)
  );

}

function bornerScore(
  score
) {

  return Math.max(
    4,
    Math.min(
      96,
      Math.round(score)
    )
  );

}
