const refus = [];
const acceptables = [];

const pronostics = {};

function creerBoutons() {

  const refusContainer =
    document.getElementById("liste-refus");

  const acceptablesContainer =
    document.getElementById("liste-acceptables");

  candidats.forEach(candidat => {

    // ---------- REFUS ----------

    const boutonRefus =
      document.createElement("button");

    boutonRefus.innerText =
      candidat.nom;

    boutonRefus.onclick = () => {

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

    boutonAcceptable.onclick = () => {

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

  } else {

    tableau.push(id);

    bouton.style.backgroundColor = couleur;

  }

}

function afficherDuels() {

  const container =
    document.getElementById("scenarios");

  container.innerHTML = "";

  // candidats refusés
  const candidatsRefuses =
    candidats.filter(c =>
      refus.includes(c.id)
    );

  // candidats acceptables
  const candidatsAcceptables =
    candidats.filter(c =>
      acceptables.includes(c.id)
    );

  candidatsAcceptables.forEach(
    acceptable => {

      candidatsRefuses.forEach(
        refuse => {

          const duel =
            document.createElement("div");

          duel.style.marginBottom =
            "20px";

          duel.style.padding =
            "10px";

          duel.style.border =
            "1px solid #ddd";

          // titre duel

          const titre =
            document.createElement("div");

          titre.innerHTML =
            "<strong>"
            + acceptable.nom
            + " vs "
            + refuse.nom
            + "</strong>";

          duel.appendChild(titre);

          // boutons

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

          // coloration

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

  // initialiser scores

  candidats.forEach(candidat => {

    scores[candidat.id] = 0;

  });

  // compter victoires

  Object.values(pronostics)
    .forEach(vainqueurId => {

      scores[vainqueurId]++;

    });

  // chercher meilleur acceptable

  let meilleur = null;

  let meilleurScore = -1;

  acceptables.forEach(id => {

    if (scores[id] > meilleurScore) {

      meilleurScore = scores[id];

      meilleur =
        candidats.find(c => c.id === id);

    }

  });

  // affichage

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

  afficherDuels();

  calculerStrategie();

}

creerBoutons();