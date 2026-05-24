function afficherCoalitions() {

  const container =
    document.getElementById(
      "coalitions"
    );

  container.innerHTML = "";

  container.style.display =
    "flex";

  container.style.gap =
    "20px";

  const colonnePresidents =
    document.createElement("div");

  colonnePresidents.style.flex =
    "1";

  const colonneMinistres =
    document.createElement("div");

  colonneMinistres.style.flex =
    "2";

  const candidatsPresidentiables =
    candidats.filter(c =>
      preselection.includes(c.id)
    );

  candidatsPresidentiables.forEach(
    president => {

      const bouton =
        document.createElement("button");

      if (
        presidentsEvalues.includes(
          president.id
        )
      ) {

        bouton.innerText =
          "✓ " + president.nom;

        bouton.style.fontWeight =
          "bold";

      } else {

        bouton.innerText =
          president.nom;

      }

      bouton.style.display =
        "block";

      bouton.style.marginBottom =
        "10px";

      if (
        presidentActif ===
        president.id
      ) {

        bouton.style.backgroundColor =
          "#4da3ff";

        bouton.style.color =
          "white";

      }

      bouton.onclick = () => {

        if (
          presidentActif ===
          president.id
        ) {

          presidentActif = null;

        } else {

          presidentActif =
            president.id;

        }

        mettreAJour();

      };

      colonnePresidents.appendChild(
        bouton
      );

    }
  );

  if (presidentActif !== null) {

    afficherOptionsPresidentActif(
      colonneMinistres
    );

  }

  container.appendChild(
    colonnePresidents
  );

  container.appendChild(
    colonneMinistres
  );

}

function afficherOptionsPresidentActif(
  colonneMinistres
) {

  const president =
    candidats.find(
      c => c.id === presidentActif
    );

  const titre =
    document.createElement("div");

  titre.innerHTML =
    "<strong>"
    + president.nom
    + " pourrait gouverner avec :</strong>";

  titre.style.marginBottom =
    "15px";

  colonneMinistres.appendChild(
    titre
  );

  const boutonFermer =
    document.createElement("button");

  boutonFermer.innerText =
    "Fermer";

  boutonFermer.style.display =
    "block";

  boutonFermer.style.marginBottom =
    "20px";

  boutonFermer.onclick = () => {

    if (
      !presidentsEvalues.includes(
        president.id
      )
    ) {

      presidentsEvalues.push(
        president.id
      );

    }

    presidentActif = null;

    mettreAJour();

  };

  colonneMinistres.appendChild(
    boutonFermer
  );

  afficherOptionsInstitutionnelles(
    colonneMinistres,
    president
  );

  const colonnesRelations =
    document.createElement("div");

  colonnesRelations.className =
    "relations-gouvernementales";

  afficherMinistresCompatibles(
    colonnesRelations,
    president
  );

  afficherPorositesTactiques(
    colonnesRelations,
    president
  );

  colonneMinistres.appendChild(
    colonnesRelations
  );

}

function afficherOptionsInstitutionnelles(
  colonneMinistres,
  president
) {

  const titreOptions =
    document.createElement("div");

  titreOptions.innerHTML =
    "<strong>Options institutionnelles possibles :</strong>";

  titreOptions.style.marginTop =
    "10px";

  titreOptions.style.marginBottom =
    "15px";

  colonneMinistres.appendChild(
    titreOptions
  );

  const options = [

    {
      cle: "sansDissolution",
      texte:
        "Gouverner avec l’Assemblée actuelle sans dissolution"
    },

    {
      cle: "coalitionDissolution",
      texte:
        "Former une coalition après dissolution"
    },

    {
      cle: "majoriteAbsolue",
      texte:
        "Obtenir une majorité absolue après dissolution"
    }

  ];

  options.forEach(option => {

    const ligne =
      document.createElement("div");

    ligne.style.marginBottom =
      "10px";

    const checkbox =
      document.createElement("input");

    checkbox.type =
      "checkbox";

    const cle =
      president.id
      + "-"
      + option.cle;

    checkbox.checked =
      optionsInstitutionnelles[
        cle
      ] || false;

    checkbox.onchange = () => {

      optionsInstitutionnelles[
        cle
      ] = checkbox.checked;

      mettreAJour();

    };

    const label =
      document.createElement("span");

    label.innerText =
      " " + option.texte;

    ligne.appendChild(
      checkbox
    );

    ligne.appendChild(
      label
    );

    colonneMinistres.appendChild(
      ligne
    );

  });

}

function afficherMinistresCompatibles(
  colonnesRelations,
  president
) {

  const colonne =
    document.createElement("section");

  colonne.className =
    "relation-colonne ministrables-colonne";

  const titreMinistres =
    document.createElement("div");

  titreMinistres.className =
    "relation-entete";

  titreMinistres.innerHTML =
    `
    <h3>
      Ministrables
    </h3>

    <p>
      Cette personne pourrait participer
      à un gouvernement dirigé par ce président,
      entrer dans une coalition stable,
      ou fournir des ministres compatibles.
    </p>

    <p>
      Gouverner ensemble suppose une compatibilité forte,
      des alliances réciproques
      et une capacité à construire une coalition durable.
    </p>
    `;

  titreMinistres.style.marginBottom =
    "15px";

  colonne.appendChild(
    titreMinistres
  );

  candidats.forEach(
    ministre => {

      if (
        ministre.id === president.id
      ) {
        return;
      }

      const bouton =
        document.createElement("button");

      bouton.innerText =
        ministre.nom;

      const cle =
        president.id
        + "-"
        + ministre.id;

      if (
        coalitions[cle]
      ) {

        bouton.style.backgroundColor =
          "lightblue";

      }

      bouton.onclick = () => {

        coalitions[cle] =
          !coalitions[cle];

        mettreAJour();

      };

      colonne.appendChild(
        bouton
      );

    }
  );

  colonnesRelations.appendChild(
    colonne
  );

}

function afficherPorositesTactiques(
  colonnesRelations,
  president
) {

  const colonne =
    document.createElement("section");

  colonne.className =
    "relation-colonne opposants-colonne";

  const titrePorosite =
    document.createElement("div");

  titrePorosite.className =
    "relation-entete";

  titrePorosite.innerHTML =
    `
    <h3>
      Opposants au Parlement
    </h3>

    <p>
      Cette étape estime la capacité de certains acteurs
      à coordonner une opposition parlementaire
      contre un président ou un gouvernement.
    </p>

    <p>
      Cette personne pourrait soutenir une motion de censure,
      participer à une coalition d’opposition,
      ou accepter une coordination tactique ponctuelle.
    </p>

    <p>
      Cela ne signifie pas forcément gouverner ensemble,
      former une coalition stable,
      ou partager le même programme politique.
    </p>
    `;

  titrePorosite.style.marginBottom =
    "15px";

  colonne.appendChild(
    titrePorosite
  );

  candidats.forEach(
    opposant => {

      if (
        opposant.id === president.id
      ) {
        return;
      }

      const bouton =
        document.createElement("button");

      bouton.innerText =
        opposant.nom;

      const cle =
        president.id
        + "-"
        + opposant.id;

      if (
        porositesTactiques[cle]
      ) {

        bouton.style.backgroundColor =
          "#ffd6a5";

      }

      bouton.onclick = () => {

        porositesTactiques[cle] =
          !porositesTactiques[cle];

        mettreAJour();

      };

      colonne.appendChild(
        bouton
      );

    }
  );

  colonnesRelations.appendChild(
    colonne
  );

}
