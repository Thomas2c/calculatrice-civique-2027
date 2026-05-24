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

  if (
    preselection.length !== 6
  ) {

    container.style.border =
      "3px solid red";

    container.style.padding =
      "15px";

    container.style.borderRadius =
      "12px";

  }

  else {

    container.style.border =
      "3px solid green";

  }

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

      if (
        preselection.includes(candidat.id)
      ) {

        const index =
          preselection.indexOf(candidat.id);

        preselection.splice(index, 1);

      }

      else {

        if (
          preselection.length >= 6
        ) {

          alert(
            "Enlevez un candidat avant d'en ajouter un autre"
          );

          return;

        }

        preselection.push(candidat.id);

      }

      mettreAJour();

    };

    container.appendChild(bouton);

  });

  const compteur =
    document.getElementById(
      "compteur-preselection"
    );

  const manque =
    6 - preselection.length;

  if (
    manque > 0
  ) {

    compteur.innerHTML =
      `
      <span style="
        color:red;
        font-weight:bold;
      ">
        Il vous manque encore
        ${manque}
        candidat(s)
        pour atteindre 6
        et passer à l’étape suivante.
      </span>
      `;

  } else {

    compteur.innerHTML =
      `
      <span style="
        color:green;
        font-weight:bold;
      ">
        ✓ 6 candidats sélectionnés.
      </span>
      `;

  }

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
