function exporterConfiguration() {

  const configuration = {
    version: 1,
    sauvegardeLe:
      new Date().toISOString(),
    preselection:
      [...preselection],
    refus:
      [...refus],
    acceptables:
      [...acceptables],
    pronostics:
      { ...pronostics },
    coalitions:
      { ...coalitions },
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

  const contenu =
    JSON.stringify(
      configuration,
      null,
      2
    );

  const blob =
    new Blob(
      [contenu],
      {
        type: "application/json"
      }
    );

  const lien =
    document.createElement("a");

  lien.href =
    URL.createObjectURL(blob);

  lien.download =
    "simulateur-politique-2027-configuration.json";

  lien.click();

  URL.revokeObjectURL(
    lien.href
  );

  afficherMessageSauvegarde(
    "Configuration sauvegardée sur votre ordinateur."
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
  configuration
) {

  remplacerTableau(
    preselection,
    configuration.preselection
  );

  remplacerTableau(
    refus,
    configuration.refus
  );

  remplacerTableau(
    acceptables,
    configuration.acceptables
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

  mettreAJour();

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

}
