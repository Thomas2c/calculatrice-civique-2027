let etapeUXMaxVisible = 1;

const messagesValidationUX = {
  1: {
    condition: () =>
      preselection.length === 6,
    attente:
      "Choisissez 6 candidats pour ouvrir l’étape suivante.",
    succes:
      `
      <strong>Bravo 🙂</strong>
      <p>
        Vous avez défini les principaux acteurs possibles
        de l’élection présidentielle.
      </p>
      <p>
        Le simulateur peut maintenant explorer les scénarios
        de second tour, les coalitions possibles
        et les futurs rapports de force.
      </p>
      `
  },
  2: {
    condition: () =>
      true,
    succes:
      `
      <strong>Très bien 🙂</strong>
      <p>
        Le simulateur peut maintenant pondérer les alliances,
        les coalitions et les pivots gouvernementaux selon
        le poids politique réel des acteurs.
      </p>
      `
  },
  3: {
    condition: () =>
      true,
    succes:
      `
      <strong>Vos préférences commencent à dessiner le paysage.</strong>
      <p>
        Elles font apparaître des espaces de coalition,
        des oppositions et des incompatibilités possibles.
      </p>
      `
  },
  4: {
    condition: () =>
      Object.keys(
        pronostics
      ).length > 0,
    attente:
      "Choisissez au moins un duel pour ouvrir l’étape des alliances.",
    succes:
      `
      <strong>Les trajectoires commencent à apparaître.</strong>
      <p>
        Vos hypothèses de second tour permettent maintenant
        d’explorer les coalitions, les cohabitations
        et les situations de blocage.
      </p>
      `
  },
  5: {
    condition: () =>
      presidentsEvalues.length > 0
      || Object.values(
        coalitions
      ).some(Boolean)
      || Object.values(
        optionsInstitutionnelles
      ).some(Boolean)
      || Object.values(
        porositesTactiques
      ).some(Boolean),
    attente:
      "Évaluez au moins un président ou une alliance pour afficher les scénarios.",
    succes:
      `
      <strong>Le modèle a assez d’éléments pour produire une lecture institutionnelle.</strong>
      <p>
        Il peut maintenant mesurer les coalitions stables,
        les présidences isolées, les oppositions compatibles
        et les pivots gouvernementaux possibles.
      </p>
      `
  }
};

function initialiserProgressionUX() {

  document.addEventListener(
    "click",
    event => {

      const bouton =
        event.target.closest(
          "[data-ux-next]"
        );

      if (!bouton) {
        return;
      }

      const prochaineEtape =
        Number(
          bouton.dataset.uxNext
        );

      etapeUXMaxVisible =
        Math.max(
          etapeUXMaxVisible,
          prochaineEtape
        );

      appliquerProgressionUX();

      const prochaineSection =
        document.querySelector(
          `[data-ux-step="${prochaineEtape}"]`
        );

      if (prochaineSection) {
        prochaineSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    }
  );

}

function appliquerProgressionUX() {

  document
    .querySelectorAll(
      ".etape-ux"
    )
    .forEach(section => {

      const numeroEtape =
        Number(
          section.dataset.uxStep
        );

      section.classList.toggle(
        "etape-visible",
        numeroEtape <= etapeUXMaxVisible
      );

    });

  afficherValidationsUX();

  afficherProgressionUX();

}

function afficherProgressionUX() {

  document
    .querySelectorAll(
      "[data-ux-indicator]"
    )
    .forEach(indicateur => {

      const numeroEtape =
        Number(
          indicateur.dataset.uxIndicator
        );

      indicateur.classList.toggle(
        "progression-active",
        numeroEtape === etapeUXMaxVisible
      );

      indicateur.classList.toggle(
        "progression-complete",
        numeroEtape < etapeUXMaxVisible
      );

    });

}

function afficherValidationsUX() {

  Object.entries(
    messagesValidationUX
  ).forEach(
    ([numero, message]) => {

      const container =
        document.getElementById(
          "validation-etape-" + numero
        );

      if (!container) {
        return;
      }

      const etape =
        Number(numero);

      if (
        etape > etapeUXMaxVisible
      ) {
        container.innerHTML = "";
        return;
      }

      if (
        !message.condition()
      ) {
        container.innerHTML =
          `
          <div class="validation-attente">
            ${message.attente || "Continuez cette étape à votre rythme."}
          </div>
          `;
        return;
      }

      container.innerHTML =
        `
        <div class="validation-succes">
          ${message.succes}
          <button
            type="button"
            class="bouton-continuer"
            data-ux-next="${etape + 1}"
          >
            Continuer l’exploration
          </button>
        </div>
        `;

    }
  );

}
