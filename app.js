function mettreAJour() {

  afficherPreselection();

  afficherInfluencesPolitiques();

  if (
    preselection.length === 6
  ) {

    creerBoutons();

    afficherDuels();

    afficherCoalitions();

    afficherPotentielsSecondTour();

    calculerStrategie();

    afficherScenariosPolitiques();

  } else {

    document.getElementById(
      "liste-refus"
    ).innerHTML =
      "Sélectionnez exactement 6 candidats.";

    document.getElementById(
      "liste-acceptables"
    ).innerHTML =
      "";

    document.getElementById(
      "scenarios"
    ).innerHTML =
      "";

    document.getElementById(
      "strategie"
    ).innerHTML =
      `
      Sélectionnez exactement
      6 candidats plausibles
      pour commencer.
      `;

  }

  appliquerProgressionUX();

}

const boutonPrequalification =
  document.getElementById(
    "toggle-prequalification"
  );

initialiserSauvegarde();

initialiserProgressionUX();

let dejaClique = false;

boutonPrequalification
  .addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "preselection-candidats"
        )
        .scrollIntoView({
          behavior: "smooth"
        });

      if (!dejaClique) {

        boutonPrequalification
          .innerText =
            "✓ Préqualification modifiable ci-dessous";

        dejaClique = true;
      }
    }
  );

mettreAJour();
