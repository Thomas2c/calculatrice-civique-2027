function exporterConfiguration() {

  const configuration =
    construireConfiguration({
      inclurePreferences:
        true
    });

  const contenu =
    JSON.stringify(
      configuration,
      null,
      2
    );

  telechargerFichier(
    "simulateur-politique-2027-configuration.json",
    contenu,
    "application/json"
  );

  afficherMessageSauvegarde(
    "Configuration sauvegardée sur votre ordinateur."
  );

}

function construireConfiguration(
  options = {}
) {

  const inclurePreferences =
    options.inclurePreferences !== false;

  const configuration = {
    version: 1,
    sauvegardeLe:
      new Date().toISOString(),
    preselection:
      [...preselection],
    pronostics:
      { ...pronostics },
    coalitions:
      { ...coalitions },
    alliancesDynamiques:
      { ...alliancesDynamiques },
    optionsInstitutionnelles:
      { ...optionsInstitutionnelles },
    porositesTactiques:
      { ...porositesTactiques },
    potentielsSecondTour:
      { ...potentielsSecondTour },
    presidentsEvalues:
      [...presidentsEvalues],
    influencesPolitiques:
      { ...influencesPolitiques },
    presidentActif
  };

  if (inclurePreferences) {

    configuration.refus =
      [...refus];

    configuration.acceptables =
      [...acceptables];

  }

  return configuration;

}

function telechargerFichier(
  nom,
  contenu,
  type
) {

  const blob =
    new Blob(
      [contenu],
      {
        type
      }
    );

  const lien =
    document.createElement("a");

  lien.href =
    URL.createObjectURL(blob);

  lien.download =
    nom;

  lien.click();

  URL.revokeObjectURL(
    lien.href
  );

}

function importerConfigurationDepuisFichier(
  fichier
) {

  if (!fichier) {
    return;
  }

  const lecteur =
    new FileReader();

  lecteur.onload = () => {

    try {

      const configuration =
        JSON.parse(
          lecteur.result
        );

      appliquerConfiguration(
        configuration
      );

      afficherMessageSauvegarde(
        "Configuration chargée."
      );

    } catch (erreur) {

      afficherMessageSauvegarde(
        "Impossible de charger ce fichier de configuration."
      );

    }

  };

  lecteur.readAsText(
    fichier
  );

}

function appliquerConfiguration(
  configuration,
  options = {}
) {

  const mettreAJourApres =
    options.mettreAJourApres !== false;

  remplacerTableau(
    preselection,
    configuration.preselection
  );

  remplacerTableau(
    refus,
    configuration.refus || []
  );

  remplacerTableau(
    acceptables,
    configuration.acceptables || []
  );

  remplacerTableau(
    presidentsEvalues,
    configuration.presidentsEvalues
  );

  remplacerObjet(
    pronostics,
    configuration.pronostics
  );

  remplacerObjet(
    coalitions,
    configuration.coalitions
  );

  remplacerObjet(
    alliancesDynamiques,
    configuration.alliancesDynamiques
  );

  remplacerObjet(
    optionsInstitutionnelles,
    configuration.optionsInstitutionnelles
  );

  remplacerObjet(
    porositesTactiques,
    configuration.porositesTactiques
  );

  remplacerObjet(
    potentielsSecondTour,
    configuration.potentielsSecondTour
  );

  remplacerObjet(
    influencesPolitiques,
    configuration.influencesPolitiques
  );

  presidentActif =
    configuration.presidentActif ?? null;

  if (mettreAJourApres) {

    mettreAJour();

  }

}

function remplacerTableau(
  cible,
  valeurs
) {

  cible.splice(
    0,
    cible.length,
    ...(
      Array.isArray(valeurs)
        ? valeurs
        : []
    )
  );

}

function remplacerObjet(
  cible,
  valeurs
) {

  Object.keys(cible).forEach(
    cle => {

      delete cible[cle];

    }
  );

  Object.assign(
    cible,
    valeurs || {}
  );

}

function afficherMessageSauvegarde(
  message
) {

  const element =
    document.getElementById(
      "message-sauvegarde"
    );

  if (!element) {
    return;
  }

  element.innerText =
    message;

}

function initialiserSauvegarde() {

  const boutonSauvegarder =
    document.getElementById(
      "sauvegarder-configuration"
    );

  const fichierConfiguration =
    document.getElementById(
      "charger-configuration"
    );

  const boutonPartager =
    document.getElementById(
      "partager-previsions"
    );

  const boutonBilan =
    document.getElementById(
      "generer-bilan"
    );

  if (boutonSauvegarder) {

    boutonSauvegarder.onclick =
      exporterConfiguration;

  }

  if (fichierConfiguration) {

    fichierConfiguration.onchange =
      event => {

        importerConfigurationDepuisFichier(
          event.target.files[0]
        );

        event.target.value = "";

      };

  }

  if (boutonPartager) {

    boutonPartager.onclick =
      partagerPrevisions;

  }

  if (boutonBilan) {

    boutonBilan.onclick =
      genererBilanInstitutionnel;

  }

  importerConfigurationDepuisUrl();

}

function partagerPrevisions() {

  const configurationPublique =
    construireConfiguration({
      inclurePreferences:
        false
    });

  const lien =
    window.location.href.split("?")[0]
    + "?config="
    + encodeURIComponent(
      encoderConfiguration(
        configurationPublique
      )
    );

  if (
    navigator.clipboard
    && navigator.clipboard.writeText
  ) {

    navigator.clipboard
      .writeText(lien)
      .then(() => {

        afficherMessageSauvegarde(
          "Lien de partage copié sans vos acceptables ni vos refus."
        );

      })
      .catch(() => {

        afficherMessageSauvegarde(
          "Lien de partage généré : " + lien
        );

      });

    return;

  }

  afficherMessageSauvegarde(
    "Lien de partage généré : " + lien
  );

}

function importerConfigurationDepuisUrl() {

  const parametres =
    new URLSearchParams(
      window.location.search
    );

  const config =
    parametres.get("config");

  if (!config) {
    return;
  }

  try {

    appliquerConfiguration(
      decoderConfiguration(config),
      {
        mettreAJourApres:
          false
      }
    );

    afficherMessageSauvegarde(
      "Prévisions partagées chargées. Les préférences privées ne sont pas incluses."
    );

  } catch (erreur) {

    afficherMessageSauvegarde(
      "Impossible de charger le lien de partage."
    );

  }

}

function encoderConfiguration(
  configuration
) {

  const donnees =
    new TextEncoder().encode(
      JSON.stringify(configuration)
    );

  let texteBinaire = "";

  donnees.forEach(octet => {

    texteBinaire +=
      String.fromCharCode(octet);

  });

  return btoa(
    texteBinaire
  );

}

function decoderConfiguration(
  contenu
) {

  const texteBinaire =
    atob(contenu);

  const donnees =
    Uint8Array.from(
      texteBinaire,
      caractere =>
        caractere.charCodeAt(0)
    );

  return JSON.parse(
    new TextDecoder().decode(
      donnees
    )
  );

}

function genererBilanInstitutionnel() {

  const contenu =
    construireBilanInstitutionnel();

  telechargerFichier(
    "simulateur-politique-2027-bilan.html",
    contenu,
    "text/html"
  );

  afficherMessageSauvegarde(
    "Bilan institutionnel généré sans préférences privées."
  );

}

function construireBilanInstitutionnel() {

  const candidatsPresidentiables =
    candidats.filter(candidat =>
      preselection.includes(
        candidat.id
      )
    );

  const indicateurs =
    calculerIndicateursInstitutionnels(
      candidats
    );

  const lignesScenarios =
    candidatsPresidentiables.map(president => {

      const analyse =
        analyserScenarioInstitutionnel(
          president,
          candidats,
          indicateurs
        );

      return `
        <tr>
          <td>${president.nom}</td>
          <td>${analyse.situation}</td>
          <td>${analyse.pivot ? analyse.pivot.candidat.nom : "Aucun"}</td>
          <td>${analyse.stable ? "Stable" : "Instable ou censurable"}</td>
        </tr>
      `;

    }).join("");

  const lignesScores =
    candidatsPresidentiables.map(candidat => {

      const donnees =
        indicateurs[candidat.id];

      return `
        <tr>
          <td>${candidat.nom}</td>
          <td>${donnees.influence}</td>
          <td>${donnees.nombreAllies}</td>
          <td>${donnees.poidsTotalAllies}</td>
          <td>${donnees.alliancesReciproques}</td>
          <td>${Math.round(donnees.densiteMutuelle * 100)}%</td>
          <td>${donnees.continuiteSoutiens.toFixed(1)}</td>
          <td>${donnees.hostiliteAgregee}</td>
          <td>${donnees.scorePivot.toFixed(1)}</td>
        </tr>
      `;

    }).join("");

  const lignesDuels =
    Object.keys(pronostics).map(cle => {

      const gagnant =
        candidats.find(candidat =>
          candidat.id === pronostics[cle]
        );

      return `
        <li>${cle} : ${gagnant ? gagnant.nom : "non renseigné"}</li>
      `;

    }).join("");

  const lignesAlliances =
    [
      ...new Set(
        Object.keys(coalitions)
          .filter(cle => coalitions[cle])
          .concat(
            Object.keys(alliancesDynamiques)
              .filter(cle => alliancesDynamiques[cle])
          )
      )
    ]
      .map(cle => {

        const [
          gauche,
          droite
        ] = cle.split("-").map(Number);

        const candidatA =
          candidats.find(candidat =>
            candidat.id === gauche
          );

        const candidatB =
          candidats.find(candidat =>
            candidat.id === droite
          );

        return `
          <li>${candidatA?.nom || gauche} → ${candidatB?.nom || droite}</li>
        `;

      }).join("");

  return `
    <!doctype html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <title>Bilan institutionnel 2027</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 32px;
          color: #111;
          line-height: 1.45;
        }
        h1, h2 {
          margin-bottom: 8px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 14px 0 28px;
          font-size: 13px;
        }
        th, td {
          border-bottom: 1px solid #ddd;
          padding: 7px;
          text-align: left;
        }
        th {
          background: #f2f2f2;
        }
        .notice {
          padding: 12px;
          background: #f6f6f6;
          border-left: 4px solid #777;
          margin-bottom: 22px;
        }
        @media print {
          body {
            margin: 18mm;
          }
        }
      </style>
    </head>
    <body>
      <h1>Bilan institutionnel du simulateur politique 2027</h1>
      <div class="notice">
        Ce bilan est descriptif et neutre. Il ne contient pas
        les préférences privées de l’utilisateur : ni acceptables,
        ni refusés.
      </div>

      <h2>Candidats plausibles et scores institutionnels</h2>
      <table>
        <tr>
          <th>Candidat</th>
          <th>Influence</th>
          <th>Alliés</th>
          <th>Poids alliés</th>
          <th>Réciproques</th>
          <th>Densité</th>
          <th>Continuité</th>
          <th>Hostilité</th>
          <th>Score pivot</th>
        </tr>
        ${lignesScores}
      </table>

      <h2>Scénarios institutionnels</h2>
      <table>
        <tr>
          <th>Président élu</th>
          <th>Conséquence plausible</th>
          <th>Pivot gouvernemental</th>
          <th>Stabilité</th>
        </tr>
        ${lignesScenarios}
      </table>

      <h2>Duels renseignés</h2>
      <ul>${lignesDuels || "<li>Aucun duel renseigné.</li>"}</ul>

      <h2>Alliances gouvernementales et dynamiques</h2>
      <ul>${lignesAlliances || "<li>Aucune alliance renseignée.</li>"}</ul>

      <h2>Seuils de gouvernabilité</h2>
      <p>
        Une opposition coordonnable sur deux tiers du spectre
        politique pondéré est considérée comme capable de rendre
        un gouvernement censurable. Les continuités indirectes
        sont pondérées par la distance dans le réseau.
      </p>
    </body>
    </html>
  `;

}
