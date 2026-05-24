function obtenirPoidsInfluence(
  candidatId
) {

  return poidsInfluence[
    influencesPolitiques[
      candidatId
    ] || "moyenne"
  ];

}

const tauxContinuiteCensure =
  2 / 3;

function allianceExiste(
  candidatId,
  autreId
) {

  return Boolean(
    coalitions[
      candidatId
      + "-"
      + autreId
    ]
  );

}

function allianceReciproqueExiste(
  candidatId,
  autreId
) {

  return allianceExiste(
    candidatId,
    autreId
  )
  && allianceExiste(
    autreId,
    candidatId
  );

}

function porositeTactiqueExiste(
  candidatId,
  autreId
) {

  return Boolean(
    porositesTactiques[
      candidatId
      + "-"
      + autreId
    ]
  );

}

function porositeReciproqueExiste(
  candidatId,
  autreId
) {

  return porositeTactiqueExiste(
    candidatId,
    autreId
  )
  && porositeTactiqueExiste(
    autreId,
    candidatId
  );

}

function calculerIndicateursInstitutionnels(
  candidatsVisibles
) {

  const scoresVictoire =
    calculerScoresVictoire(
      candidatsVisibles
    );

  const indicateurs = {};

  candidatsVisibles.forEach(
    candidat => {

      const allies =
        candidats.filter(
          autre =>
            autre.id !== candidat.id
            && allianceExiste(
              candidat.id,
              autre.id
            )
        );

      const alliesReciproques =
        allies.filter(
          autre =>
            allianceReciproqueExiste(
              candidat.id,
              autre.id
            )
        );

      const poidsTotalAllies =
        allies.reduce(
          (total, autre) =>
            total
            + obtenirPoidsInfluence(
              autre.id
            ),
          0
        );

      const densiteMutuelle =
        calculerDensiteMutuelle(
          allies
        );

      const continuiteSoutiens =
        calculerContinuiteTactique(
          candidat,
          "alliances"
        );

      const hostiliteAgregee =
        calculerHostiliteAgregee(
          candidat
        );

      const tauxReciprocite =
        allies.length === 0
          ? 0
          : alliesReciproques.length
            / allies.length;

      const scorePivot =
        poidsTotalAllies
        + (alliesReciproques.length * 2)
        + (densiteMutuelle * 3)
        + continuiteSoutiens
        - hostiliteAgregee;

      indicateurs[
        candidat.id
      ] = {
        candidat,
        duelsGagnes:
          scoresVictoire[
            candidat.id
          ] || 0,
        influence:
          influencesPolitiques[
            candidat.id
          ],
        nombreAllies:
          allies.length,
        poidsTotalAllies,
        alliancesReciproques:
          alliesReciproques.length,
        densiteMutuelle,
        continuiteSoutiens,
        hostiliteAgregee,
        tauxReciprocite,
        scorePivot
      };

    }
  );

  return indicateurs;

}

function calculerDensiteMutuelle(
  allies
) {

  if (allies.length < 2) {
    return 0;
  }

  let liensPossibles = 0;
  let liensReciproques = 0;

  allies.forEach(
    (allieA, indexA) => {

      allies.forEach(
        (allieB, indexB) => {

          if (indexB <= indexA) {
            return;
          }

          liensPossibles++;

          if (
            allianceReciproqueExiste(
              allieA.id,
              allieB.id
            )
          ) {

            liensReciproques++;

          }

        }
      );

    }
  );

  return liensPossibles === 0
    ? 0
    : liensReciproques / liensPossibles;

}

function calculerDensiteOpposition(
  opposants
) {

  if (opposants.length < 2) {
    return 0;
  }

  let liensPossibles = 0;
  let liensReciproques = 0;

  opposants.forEach(
    (opposantA, indexA) => {

      opposants.forEach(
        (opposantB, indexB) => {

          if (indexB <= indexA) {
            return;
          }

          liensPossibles++;

          if (
            porositeReciproqueExiste(
              opposantA.id,
              opposantB.id
            )
          ) {

            liensReciproques++;

          }

        }
      );

    }
  );

  return liensPossibles === 0
    ? 0
    : liensReciproques / liensPossibles;

}

function calculerContinuiteTactique(
  candidat,
  typeGraphe
) {

  const distances =
    calculerDistancesCompatibilite(
      candidat.id,
      typeGraphe
    );

  return candidats.reduce(
    (total, autre) => {

      if (autre.id === candidat.id) {
        return total;
      }

      const distance =
        distances[
          autre.id
        ];

      if (!distance) {
        return total;
      }

      return total
        + obtenirPoidsContinuite(
          candidat.id,
          autre.id,
          distance,
          typeGraphe
        )
        * obtenirPoidsInfluence(
          autre.id
        );

    },
    0
  );

}

function calculerTauxContinuiteSpectre(
  candidat,
  typeGraphe
) {

  const distances =
    calculerDistancesCompatibilite(
      candidat.id,
      typeGraphe,
      Infinity
    );

  const poidsTotalSpectre =
    candidats.reduce(
      (total, autre) => {

        if (autre.id === candidat.id) {
          return total;
        }

        return total
          + obtenirPoidsInfluence(
            autre.id
          );

      },
      0
    );

  if (
    poidsTotalSpectre === 0
  ) {
    return 0;
  }

  const poidsAtteignable =
    candidats.reduce(
      (total, autre) => {

        if (autre.id === candidat.id) {
          return total;
        }

        const distance =
          distances[
            autre.id
          ];

        if (!distance) {
          return total;
        }

        return total
          + obtenirPoidsInfluence(
            autre.id
          );

      },
      0
    );

  return poidsAtteignable
    / poidsTotalSpectre;

}

function calculerTauxContinuiteDansGroupe(
  candidat,
  typeGraphe,
  groupe
) {

  const idsGroupe =
    groupe.map(
      membre =>
        membre.id
    );

  const distances =
    calculerDistancesCompatibiliteDansGroupe(
      candidat.id,
      typeGraphe,
      idsGroupe
    );

  const poidsTotalGroupe =
    groupe.reduce(
      (total, autre) => {

        if (autre.id === candidat.id) {
          return total;
        }

        return total
          + obtenirPoidsInfluence(
            autre.id
          );

      },
      0
    );

  if (
    poidsTotalGroupe === 0
  ) {
    return 0;
  }

  const poidsAtteignable =
    groupe.reduce(
      (total, autre) => {

        if (autre.id === candidat.id) {
          return total;
        }

        if (
          distances[
            autre.id
          ] === undefined
        ) {
          return total;
        }

        return total
          + obtenirPoidsInfluence(
            autre.id
          );

      },
      0
    );

  return poidsAtteignable
    / poidsTotalGroupe;

}

function presidentDeclareCapableDeGouverner(
  president
) {

  return Boolean(
    optionsInstitutionnelles[
      president.id
      + "-majoriteAbsolue"
    ]
    || optionsInstitutionnelles[
      president.id
      + "-coalitionDissolution"
    ]
    || optionsInstitutionnelles[
      president.id
      + "-sansDissolution"
    ]
  );

}

function trouverPivotNaturel(
  candidatsOpposition,
  indicateurs,
  _president
) {

  const pivots =
    candidatsOpposition
      .map(candidat =>
        indicateurs[
          candidat.id
        ]
      )
      .filter(Boolean)
      .sort(
        (a, b) =>
          b.scorePivot
          - a.scorePivot
      );

  return pivots[0] || null;

}

function trouverPivotDuReseauPresidentiel(
  president,
  indicateurs
) {

  const allies =
    candidats
      .filter(
        candidat =>
          candidat.id !== president.id
          && allianceExiste(
            president.id,
            candidat.id
          )
      )
      .map(candidat =>
        indicateurs[
          candidat.id
        ]
      )
      .filter(Boolean)
      .sort(
        (a, b) =>
          b.continuiteSoutiens
          - a.continuiteSoutiens
      );

  return allies[0] || null;

}

function oppositionBloquanteExiste(
  pivot
) {

  const opposition =
    calculerIndicateursOpposition(
      pivot.candidat
    );

  return opposition.tauxContinuiteOpposition
    >= tauxContinuiteCensure;

}

function analyserScenarioInstitutionnel(
  president,
  candidatsAnalyses,
  indicateurs
) {

  const donneesPresident =
    indicateurs[
      president.id
    ];

  const presidentPeutGouverner =
    presidentDeclareCapableDeGouverner(
      president
    );

  if (presidentPeutGouverner) {

    return {
      president,
      pivot:
        donneesPresident,
      situation:
        "Coalition avec le président",
      stable: true,
      type:
        "president",
      explication:
        "Le président est déclaré capable de gouverner par majorité ou coalition."
    };

  }

  const candidatsNonAlliesPresident =
    candidatsAnalyses.filter(
      candidat =>
        candidat.id !== president.id
        && !allianceExiste(
          president.id,
          candidat.id
        )
    );

  const pivotNaturel =
    trouverPivotNaturel(
      candidatsNonAlliesPresident,
      indicateurs,
      president
    );

  const tauxContinuitePivotNaturel =
    pivotNaturel
      ? calculerTauxContinuiteDansGroupe(
        pivotNaturel.candidat,
        "alliances",
        candidatsNonAlliesPresident
      )
      : 0;

  if (
    pivotNaturel
    && tauxContinuitePivotNaturel >= tauxContinuiteCensure
    && !oppositionBloquanteExiste(
      pivotNaturel
    )
  ) {

    return {
      president,
      pivot:
        pivotNaturel,
      situation:
        "Gouvernement autour d’un pivot alternatif",
      stable: true,
      type:
        "pivot-alternatif",
      explication:
        "Le président ne gouverne pas directement, mais les acteurs non alliés peuvent structurer une coalition alternative."
    };

  }

  const pivotPresidentiel =
    trouverPivotDuReseauPresidentiel(
      president,
      indicateurs
    );

  if (
    pivotPresidentiel
    && calculerTauxContinuiteSpectre(
      pivotPresidentiel.candidat,
      "alliances"
    ) >= tauxContinuiteCensure
    && !oppositionBloquanteExiste(
      pivotPresidentiel
    )
  ) {

    return {
      president,
      pivot:
        pivotPresidentiel,
      situation:
        "Premier ministre imposé par le réseau présidentiel",
      stable: true,
      type:
        "reseau-presidentiel",
      explication:
        "Un allié du président dispose d’une continuité suffisante pour résister à une censure."
    };

  }

  return {
    president,
    pivot:
      pivotNaturel || donneesPresident,
    situation:
      "Gouvernement instable ou censurable",
    stable: false,
    type:
      "instable",
    explication:
      "Aucune coalition directe, alternative ou présidentielle ne couvre assez le spectre."
  };

}

function calculerDistancesCompatibiliteDansGroupe(
  candidatId,
  typeGraphe,
  idsGroupe
) {

  const idsAutorises =
    new Set(
      idsGroupe
    );

  const distances = {};
  const file = [
    candidatId
  ];

  distances[
    candidatId
  ] = 0;

  while (
    file.length > 0
  ) {

    const courant =
      file.shift();

    candidats.forEach(
      autre => {

        if (
          autre.id === courant
          || !idsAutorises.has(
            autre.id
          )
          || distances[
            autre.id
          ] !== undefined
        ) {
          return;
        }

        if (
          lienCompatibleExiste(
            courant,
            autre.id,
            typeGraphe
          )
        ) {

          distances[
            autre.id
          ] =
            distances[courant] + 1;

          file.push(
            autre.id
          );

        }

      }
    );

  }

  return distances;

}

function calculerDistancesCompatibilite(
  candidatId,
  typeGraphe,
  distanceMax = 3
) {

  const distances = {};
  const file = [
    candidatId
  ];

  distances[
    candidatId
  ] = 0;

  while (
    file.length > 0
  ) {

    const courant =
      file.shift();

    if (
      distances[courant] >= distanceMax
    ) {
      continue;
    }

    candidats.forEach(
      autre => {

        if (
          autre.id === courant
          || distances[
            autre.id
          ] !== undefined
        ) {
          return;
        }

        if (
          lienCompatibleExiste(
            courant,
            autre.id,
            typeGraphe
          )
        ) {

          distances[
            autre.id
          ] =
            distances[courant] + 1;

          file.push(
            autre.id
          );

        }

      }
    );

  }

  return distances;

}

function lienCompatibleExiste(
  candidatId,
  autreId,
  typeGraphe
) {

  if (
    typeGraphe === "oppositions"
  ) {

    return porositeTactiqueExiste(
      candidatId,
      autreId
    )
    || porositeTactiqueExiste(
      autreId,
      candidatId
    );

  }

  return allianceExiste(
    candidatId,
    autreId
  )
  || allianceExiste(
    autreId,
    candidatId
  );

}

function obtenirPoidsContinuite(
  candidatId,
  autreId,
  distance,
  typeGraphe
) {

  if (
    typeGraphe === "oppositions"
  ) {

    if (
      distance === 1
      && porositeReciproqueExiste(
        candidatId,
        autreId
      )
    ) {
      return 3;
    }

    if (distance === 1) {
      return 1;
    }

  } else {

    if (
      distance === 1
      && allianceReciproqueExiste(
        candidatId,
        autreId
      )
    ) {
      return 3;
    }

    if (distance === 1) {
      return 1;
    }

  }

  if (distance === 2) {
    return 0.5;
  }

  if (distance === 3) {
    return 0.25;
  }

  return 0;

}

function calculerIndicateursOpposition(
  candidat
) {

  const opposants =
    candidats.filter(
      autre =>
        autre.id !== candidat.id
        && porositeTactiqueExiste(
          candidat.id,
          autre.id
        )
    );

  const opposantsReciproques =
    opposants.filter(
      autre =>
        porositeReciproqueExiste(
          candidat.id,
          autre.id
        )
    );

  const poidsOpposants =
    opposants.reduce(
      (total, autre) =>
        total
        + obtenirPoidsInfluence(
          autre.id
        ),
      0
    );

  const densiteOpposition =
    calculerDensiteOpposition(
      opposants
    );

  const tauxReciprociteOpposition =
    opposants.length === 0
      ? 0
      : opposantsReciproques.length
        / opposants.length;

  const continuiteOpposition =
    calculerContinuiteTactique(
      candidat,
      "oppositions"
    );

  const tauxContinuiteOpposition =
    calculerTauxContinuiteSpectre(
      candidat,
      "oppositions"
    );

  return {
    nombreOpposants:
      opposants.length,
    poidsOpposants,
    oppositionsReciproques:
      opposantsReciproques.length,
    densiteOpposition,
    continuiteOpposition,
    tauxContinuiteOpposition,
    tauxReciprociteOpposition
  };

}

function calculerHostiliteAgregee(
  candidat
) {

  return candidats.reduce(
    (total, autre) => {

      if (autre.id === candidat.id) {
        return total;
      }

      const oppositionDeclaree =
        refus.includes(autre.id);

      const oppositionTactique =
        porositeTactiqueExiste(
          candidat.id,
          autre.id
        );

      if (
        !oppositionDeclaree
        && !oppositionTactique
      ) {
        return total;
      }

      return total
        + obtenirPoidsInfluence(
          autre.id
        );

    },
    0
  );

}

function trouverPivotGouvernemental(
  candidatsVisibles,
  indicateurs
) {

  const resultats =
    candidatsVisibles
      .map(candidat =>
        indicateurs[
          candidat.id
        ]
      )
      .sort(
        (a, b) =>
          b.scorePivot
          - a.scorePivot
      );

  if (
    resultats.length === 0
    || resultats[0].scorePivot <= 0
  ) {

    return null;

  }

  return resultats[0];

}

function qualifierSituationInstitutionnelle(
  president,
  pivot,
  indicateurs
) {

  const donneesPresident =
    indicateurs[
      president.id
    ];

  if (
    donneesPresident.poidsTotalAllies >= 8
    && donneesPresident.tauxReciprocite >= 0.4
  ) {

    return "Coalition avec le président";

  }

  if (
    pivot
    && pivot.candidat.id !== president.id
    && pivot.scorePivot > donneesPresident.scorePivot
  ) {

    return "Cohabitation probable";

  }

  if (
    donneesPresident.nombreAllies <= 1
    && donneesPresident.hostiliteAgregee >= 6
  ) {

    return "Présidence isolée";

  }

  if (
    pivot === null
  ) {

    return "Parlement fragmenté";

  }

  return "Gouvernement minoritaire survivant";

}
