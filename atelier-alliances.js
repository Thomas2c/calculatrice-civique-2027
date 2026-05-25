let dernierEffetAtelier =
  null;

function afficherAtelierAlliances() {

  const container =
    document.getElementById(
      "atelier-alliances"
    );

  if (!container) {
    return;
  }

  const indicateurs =
    calculerIndicateursInstitutionnels(
      candidats
    );

  const pivots =
    candidats
      .filter(candidat =>
        preselection.includes(
          candidat.id
        )
      )
      .map(candidat =>
        construireDonneesPivotAtelier(
          candidat,
          indicateurs
        )
      )
      .sort(
        (a, b) =>
          b.scoreGouvernabilite
          - a.scoreGouvernabilite
      )
      .map((pivot, index) => ({
        ...pivot,
        position:
          index + 1
      }));

  container.innerHTML =
    `
    <section class="atelier-alliances">
      <div class="atelier-entete">
        <h2>
          Atelier de construction de coalition
        </h2>

        <p>
          Explorez les 6 pivots principaux, ajoutez
          progressivement des alliés sous chaque pivot,
          et observez comment la gouvernabilité se recompose
          dans tout le système.
        </p>

        <p class="atelier-note">
          Les ajouts ne sont pas des recommandations politiques.
          Ce sont des hypothèses de recomposition que vous pouvez
          tester pour voir leurs effets institutionnels.
        </p>
      </div>

      ${construireEffetsSystemiquesAtelier()}

      <div class="atelier-pivots">
        ${pivots.map(pivot =>
          construireCartePivotAtelier(
            pivot
          )
        ).join("")}
      </div>

      ${Object.keys(alliancesDynamiques).some(cle => alliancesDynamiques[cle])
        ? `
          <button
            type="button"
            class="bouton-secondaire"
            onclick="reinitialiserAlliancesDynamiques()"
          >
            Réinitialiser les coalitions testées
          </button>
        `
        : ""}
    </section>
    `;

}

function construireDonneesPivotAtelier(
  candidat,
  indicateurs
) {

  const donnees =
    indicateurs[
      candidat.id
    ];

  const scoreGouvernabilite =
    calculerScoreSoutiens(
      donnees
    );

  let etat =
    "isolé";

  let classeEtat =
    "etat-isole";

  if (scoreGouvernabilite >= 66) {
    etat =
      "stable";
    classeEtat =
      "etat-stable";
  } else if (scoreGouvernabilite >= 40) {
    etat =
      "fragile";
    classeEtat =
      "etat-fragile";
  }

  return {
    candidat,
    donnees,
    scoreGouvernabilite,
    etat,
    classeEtat
  };

}

function construireCartePivotAtelier(
  pivot
) {

  const groupes =
    classerCandidatsPourPivotAtelier(
      pivot.candidat
    );

  return `
    <article class="carte-pivot-atelier ${pivot.classeEtat}">
      <div class="pivot-atelier-entete">
        <div>
          <h3>${pivot.candidat.nom}</h3>
          <span class="position-pivot">
            position ${pivot.position}/6
          </span>
        </div>

        <span class="etat-pivot">
          ${pivot.etat}
        </span>
      </div>

      <div class="score-pivot-atelier">
        <div class="barre-fond">
          <div
            class="barre-remplissage barre-gouvernabilite"
            style="width:${pivot.scoreGouvernabilite}%"
          ></div>
        </div>
        <strong>${pivot.scoreGouvernabilite}/100</strong>
      </div>

      <div class="resume-pivot-atelier">
        ${pivot.donnees.nombreAllies} alliés
        · ${pivot.donnees.alliancesReciproques} réciproques
        · continuité ${pivot.donnees.continuiteSoutiens.toFixed(1)}
      </div>

      ${construireZoneCandidatsPivot(
        "Alliés actifs",
        groupes.allies,
        pivot.candidat,
        "allie"
      )}

      ${construireZoneCandidatsPivot(
        "Disponibles",
        groupes.disponibles,
        pivot.candidat,
        "disponible"
      )}

      ${construireZoneCandidatsPivot(
        "Opposants",
        groupes.opposants,
        pivot.candidat,
        "opposant"
      )}
    </article>
  `;

}

function classerCandidatsPourPivotAtelier(
  pivot
) {

  const groupes = {
    allies: [],
    disponibles: [],
    opposants: []
  };

  candidats.forEach(candidat => {

    if (
      candidat.id === pivot.id
    ) {
      return;
    }

    const allie =
      allianceExiste(
        pivot.id,
        candidat.id
      );

    const opposant =
      porositeTactiqueExiste(
        pivot.id,
        candidat.id
      );

    if (allie) {
      groupes.allies.push(
        candidat
      );
    } else if (opposant) {
      groupes.opposants.push(
        candidat
      );
    } else {
      groupes.disponibles.push(
        candidat
      );
    }

  });

  return groupes;

}

function construireZoneCandidatsPivot(
  titre,
  liste,
  pivot,
  type
) {

  return `
    <div class="zone-coalition zone-${type}">
      <div class="zone-coalition-titre">
        ${titre}
        <span>${liste.length}</span>
      </div>

      <div class="capsules-coalition">
        ${
          liste.length === 0
            ? "<span class='capsule-vide'>Aucun</span>"
            : liste.map(candidat =>
              construireCapsuleCandidatPivot(
                pivot,
                candidat,
                type
              )
            ).join("")
        }
      </div>
    </div>
  `;

}

function construireCapsuleCandidatPivot(
  pivot,
  candidat,
  type
) {

  const dynamique =
    Boolean(
      alliancesDynamiques[
        pivot.id + "-" + candidat.id
      ]
    );

  const peutRetirer =
    type === "allie"
    && dynamique;

  const action =
    peutRetirer
      ? "Retirer de la coalition testée"
      : "Ajouter à la coalition de "
        + pivot.nom;

  return `
    <button
      type="button"
      class="
        capsule-candidat
        capsule-${type}
        ${dynamique ? "capsule-dynamique" : ""}
      "
      title="${action}"
      onclick="basculerCandidatDansCoalition(${pivot.id}, ${candidat.id})"
    >
      ${candidat.nom}
    </button>
  `;

}

function basculerCandidatDansCoalition(
  pivotId,
  candidatId
) {

  const avant =
    capturerScoresAtelier();

  const cleAB =
    pivotId + "-" + candidatId;

  const cleBA =
    candidatId + "-" + pivotId;

  const dejaDynamique =
    Boolean(
      alliancesDynamiques[cleAB]
      && alliancesDynamiques[cleBA]
    );

  if (dejaDynamique) {
    delete alliancesDynamiques[cleAB];
    delete alliancesDynamiques[cleBA];
  } else {
    alliancesDynamiques[cleAB] =
      true;
    alliancesDynamiques[cleBA] =
      true;
  }

  const apres =
    capturerScoresAtelier();

  dernierEffetAtelier =
    construireEffetAtelier(
      pivotId,
      candidatId,
      dejaDynamique ? "retrait" : "ajout",
      avant,
      apres
    );

  mettreAJour();

}

function capturerScoresAtelier() {

  const indicateurs =
    calculerIndicateursInstitutionnels(
      candidats
    );

  return candidats
    .filter(candidat =>
      preselection.includes(
        candidat.id
      )
    )
    .map(candidat => {

      const donnees =
        indicateurs[
          candidat.id
        ];

      return {
        candidat,
        scoreGouvernabilite:
          calculerScoreSoutiens(
            donnees
          ),
        scorePivot:
          donnees.scorePivot,
        continuite:
          donnees.continuiteSoutiens
      };

    });

}

function construireEffetAtelier(
  pivotId,
  candidatId,
  typeAction,
  avant,
  apres
) {

  const pivot =
    candidats.find(candidat =>
      candidat.id === pivotId
    );

  const candidat =
    candidats.find(personne =>
      personne.id === candidatId
    );

  const deltas =
    apres.map(scoreApres => {

      const scoreAvant =
        avant.find(score =>
          score.candidat.id
          === scoreApres.candidat.id
        );

      return {
        candidat:
          scoreApres.candidat,
        deltaGouvernabilite:
          scoreApres.scoreGouvernabilite
          - scoreAvant.scoreGouvernabilite,
        deltaContinuite:
          scoreApres.continuite
          - scoreAvant.continuite,
        deltaPivot:
          scoreApres.scorePivot
          - scoreAvant.scorePivot
      };

    })
    .filter(delta =>
      Math.abs(
        delta.deltaGouvernabilite
      ) >= 1
      || Math.abs(
        delta.deltaContinuite
      ) >= 0.5
      || Math.abs(
        delta.deltaPivot
      ) >= 0.5
    )
    .sort(
      (a, b) =>
        Math.abs(b.deltaGouvernabilite)
        - Math.abs(a.deltaGouvernabilite)
    )
    .slice(
      0,
      4
    );

  return {
    pivot,
    candidat,
    typeAction,
    deltas
  };

}

function construireEffetsSystemiquesAtelier() {

  if (!dernierEffetAtelier) {

    return `
      <div class="diagnostic-atelier diagnostic-neutre">
        Sélectionnez un candidat sous un pivot pour tester
        l’élargissement progressif de sa coalition.
      </div>
    `;

  }

  const verbe =
    dernierEffetAtelier.typeAction === "ajout"
      ? "rejoint"
      : "quitte";

  return `
    <div class="effets-systemiques">
      <strong>
        ${dernierEffetAtelier.candidat.nom}
        ${verbe}
        la coalition de
        ${dernierEffetAtelier.pivot.nom}.
      </strong>

      <div class="liste-effets-systemiques">
        ${
          dernierEffetAtelier.deltas.length === 0
            ? `
              <span>
                Les scénarios sont recalculés,
                sans effet systémique majeur visible.
              </span>
            `
            : dernierEffetAtelier.deltas.map(delta =>
              construireLigneEffetSystemique(
                delta
              )
            ).join("")
        }
      </div>
    </div>
  `;

}

function construireLigneEffetSystemique(
  delta
) {

  const signe =
    delta.deltaGouvernabilite >= 0
      ? "+"
      : "";

  const sens =
    delta.deltaGouvernabilite >= 0
      ? "↗"
      : "↘";

  return `
    <span>
      ${sens}
      ${delta.candidat.nom}
      ${signe}${delta.deltaGouvernabilite}
      gouvernabilité
      · continuité ${delta.deltaContinuite >= 0 ? "+" : ""}${delta.deltaContinuite.toFixed(1)}
    </span>
  `;

}

function reinitialiserAlliancesDynamiques() {

  remplacerObjet(
    alliancesDynamiques,
    {}
  );

  dernierEffetAtelier =
    null;

  mettreAJour();

}
