const preselection = [
  17, // Mélenchon
  23, // Glucksmann
  15, // Attal
  8,  // Philippe
  5,  // Retailleau
  18  // Bardella
];
const refus = [];
const acceptables = [];

const pronostics = {};

function toggleSelection(
  tableau,
  id,
  bouton,
  couleur
) {

  if (tableau.includes(id)) {

    const index =
      tableau.indexOf(id);

    tableau.splice(index, 1);

    bouton.style.backgroundColor = "";

    bouton.style.color = "";

  } else {

    tableau.push(id);

    bouton.style.backgroundColor =
      couleur;

    bouton.style.color = "white";

  }

}

function afficherPreselection() {

  const container =
    document.getElementById(
      "preselection-candidats"
    );

  container.innerHTML = "";

  candidats.forEach(candidat => {

    const bouton =
      document.createElement("button");

    bouton.innerText =
      candidat.nom;

    if (
      preselection.includes(candidat.id)
    ) {

      bouton.style.backgroundColor =
        "#4da3ff";

      bouton.style.color =
        "white";

    }

    bouton.onclick = () => {

      // retirer

      if (
        preselection.includes(candidat.id)
      ) {

        const index =
          preselection.indexOf(candidat.id);

        preselection.splice(index, 1);

      }

      // ajouter

      else {

        if (
          preselection.length >= 6
        ) {

          alert(
            "Maximum 6 candidats"
          );

          return;

        }

        preselection.push(candidat.id);

      }

      mettreAJour();

    };

    container.appendChild(bouton);

  });

  document.getElementById(
    "compteur-preselection"
  ).innerText =
    preselection.length
    + " / 6 sélectionnés";

}

function creerBoutons() {

  const refusContainer =
    document.getElementById(
      "liste-refus"
    );

  const acceptablesContainer =
    document.getElementById(
      "liste-acceptables"
    );

  refusContainer.innerHTML = "";
  acceptablesContainer.innerHTML = "";

  const candidatsVisibles =
    candidats.filter(c =>
      preselection.includes(c.id)
    );

  candidatsVisibles.forEach(candidat => {

    // ---------- REFUS ----------

    const boutonRefus =
      document.createElement("button");

    boutonRefus.innerText =
      candidat.nom;

      if (
  refus.includes(candidat.id)
) {

  boutonRefus.style.backgroundColor =
    "tomato";

  boutonRefus.style.color =
    "white";

}

  boutonRefus.onclick = () => {

  if (!refus.includes(candidat.id)) {
    const indexAcceptable = acceptables.indexOf(candidat.id);

    if (indexAcceptable !== -1) {
      acceptables.splice(indexAcceptable, 1);
    }
  }

  toggleSelection(
    refus,
    candidat.id,
    boutonRefus,
    "tomato"
  );

  mettreAJour();

};

    refusContainer.appendChild(
      boutonRefus
    );

    // ---------- ACCEPTABLES ----------

    const boutonAcceptable =
      document.createElement("button");

    boutonAcceptable.innerText =
      candidat.nom;

      if (
  acceptables.includes(candidat.id)
) {

  boutonAcceptable.style.backgroundColor =
    "lightgreen";

  boutonAcceptable.style.color =
    "black";

}

   boutonAcceptable.onclick = () => {

  if (!acceptables.includes(candidat.id)) {
    const indexRefus = refus.indexOf(candidat.id);

    if (indexRefus !== -1) {
      refus.splice(indexRefus, 1);
    }
  }

  toggleSelection(
    acceptables,
    candidat.id,
    boutonAcceptable,
    "lightgreen"
  );

  mettreAJour();

};

    acceptablesContainer.appendChild(
      boutonAcceptable
    );

  });

}

function afficherDuels() {

  const container =
    document.getElementById(
      "scenarios"
    );

  container.innerHTML = "";

  const candidatsRefuses =
    candidats.filter(c =>
      refus.includes(c.id)
    );

  const candidatsAcceptables =
    candidats.filter(c =>
      acceptables.includes(c.id)
    );

    

  candidatsAcceptables.forEach(
    acceptable => {

      candidatsRefuses.forEach(
        refuse => {

if (acceptable.id === refuse.id) {
  return;
}

          const duel =
            document.createElement("div");

          duel.style.marginBottom =
            "20px";

          duel.style.padding =
            "10px";

          duel.style.border =
            "1px solid #ddd";

          const titre =
            document.createElement("div");

          titre.innerHTML =
            "<strong>"
            + acceptable.nom
            + " vs "
            + refuse.nom
            + "</strong>";

          duel.appendChild(titre);

          const boutonAcceptable =
            document.createElement("button");

          boutonAcceptable.innerText =
            acceptable.nom + " gagne";

          const boutonRefuse =
            document.createElement("button");

          boutonRefuse.innerText =
            refuse.nom + " gagne";

          const cle =
            acceptable.id
            + "-"
            + refuse.id;

          boutonAcceptable.onclick = () => {

            pronostics[cle] =
              acceptable.id;

            mettreAJour();

          };

          boutonRefuse.onclick = () => {

            pronostics[cle] =
              refuse.id;

            mettreAJour();

          };

          if (
            pronostics[cle]
            === acceptable.id
          ) {

            boutonAcceptable.style.backgroundColor =
              "lightgreen";

          }

          if (
            pronostics[cle]
            === refuse.id
          ) {

            boutonRefuse.style.backgroundColor =
              "tomato";

          }

          duel.appendChild(
            boutonAcceptable
          );

          duel.appendChild(
            boutonRefuse
          );

          container.appendChild(
            duel
          );

        }
      );

    });

}

function calculerStrategie() {

  const strategie =
    document.getElementById(
      "strategie"
    );

  const scores = {};

  candidats.forEach(candidat => {

    scores[candidat.id] = 0;

  });

  Object.values(pronostics)
    .forEach(vainqueurId => {

      scores[vainqueurId]++;

    });

  let meilleur = null;

  let meilleurScore = -1;

  acceptables.forEach(id => {

    if (
      scores[id] > meilleurScore
    ) {

      meilleurScore =
        scores[id];

      meilleur =
        candidats.find(
          c => c.id === id
        );

    }

  });

  if (
    meilleurScore <= 0
  ) {

    strategie.innerHTML =
      "⚠ Aucun scénario satisfaisant";

  } else {

    strategie.innerHTML =
      `
      <div>
        MON VOTE STRATÉGIQUE ACTUEL
      </div>

      <br>

      <div style="
        font-size:32px;
        font-weight:bold;
      ">
        → ${meilleur.nom}
      </div>

      <br>

      <div>
        Victoires en duel :
        ${meilleurScore}
      </div>
      `;

  }

}

function mettreAJour() {

  afficherPreselection();

if (
  preselection.length === 6
) {

  creerBoutons();

  afficherDuels();

  calculerStrategie();

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

}

mettreAJour();