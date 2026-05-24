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

        Scores des présidentiables plausibles

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

    <table style="
      width:100%;
      border-collapse:collapse;
      font-size:13px;
    ">

      <tr>
        <th align="left">Candidat</th>
        <th>Influence</th>
        <th>Duels</th>
        <th>Potentiel</th>
        <th>Capacité présidentielle</th>
        <th>Alliés</th>
        <th>Poids alliés</th>
        <th>Réciproques</th>
        <th>Densité</th>
        <th>Continuité</th>
        <th>Hostilité</th>
        <th>Score pivot</th>
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
      10. Au premier tour, soutenir un acceptable capable de gouverner
    </h2>

    <p>
      Si votre objectif est qu’un candidat acceptable
      devienne Premier ministre ou président d’une coalition
      favorable, il peut être rationnel de soutenir
      au premier tour celui qui peut devenir le pivot
      gouvernemental le plus stable.
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

  return `
    <div class="carte-stabilite">
      <h3>
        Scénarios favorables à vos acceptables
      </h3>

      <p>
        Les scénarios sont classés du gouvernement acceptable
        le plus stable au moins stable.
        Le président élu peut être différent du pivot gouvernemental.
        Les configurations avec opposition bloquante
        ne sont pas affichées comme solutions favorables.
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
