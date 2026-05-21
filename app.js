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

const coalitions = {};

const optionsInstitutionnelles = {};

const coalitionsOuvertes = {};

let presidentActif = null;

const presidentsEvalues = [];

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

  // -------------------
  // COLONNE GAUCHE
  // -------------------

  const colonnePresidents =
    document.createElement("div");

  colonnePresidents.style.flex =
    "1";

  // -------------------
  // COLONNE DROITE
  // -------------------

  const colonneMinistres =
    document.createElement("div");

  colonneMinistres.style.flex =
    "2";

  const candidatsVisibles =
    candidats.filter(c =>
      preselection.includes(c.id)
    );

  // -------------------
  // LISTE PRESIDENTS
  // -------------------

  candidatsVisibles.forEach(
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

  // -------------------
  // LISTE MINISTRES
  // -------------------

  if (presidentActif !== null) {

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

    // -------- BOUTON FERMER --------

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

    // -------- MINISTRES --------
const separation =
  document.createElement("hr");

separation.style.margin =
  "25px 0";

colonneMinistres.appendChild(
  separation
);

const titreMinistres =
  document.createElement("div");

titreMinistres.innerHTML =
  "<strong>Personnalités compatibles pour gouverner :</strong><br><span style='font-size:14px;'>Choisissez les personnalités que ce candidat pourrait intégrer à son gouvernement.</span>";

titreMinistres.style.marginBottom =
  "15px";

colonneMinistres.appendChild(
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

        colonneMinistres.appendChild(
          bouton
        );

      }
    );

  }

  container.appendChild(
    colonnePresidents
  );

  container.appendChild(
    colonneMinistres
  );

}

const zoneMinistres =
  document.createElement("div");


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

  const candidatsVisibles =
    candidats.filter(c =>
      preselection.includes(c.id)
    );

  candidatsVisibles.forEach(
    (candidat1, index1) => {

      candidatsVisibles.forEach(
        (candidat2, index2) => {

          // éviter doublons et auto-duels

          if (
            index2 <= index1
          ) {
            return;
          }

          const duel =
            document.createElement("div");

          duel.style.padding =
            "8px";

          duel.style.border =
            "2px solid #444";

          duel.style.borderRadius =
            "8px";

          // -------------------
          // BOUTON 1
          // -------------------

          const bouton1 =
            document.createElement("button");

          bouton1.innerText =
            candidat1.nom + " gagne";

          // -------------------
          // BOUTON 2
          // -------------------

          const bouton2 =
            document.createElement("button");

          bouton2.innerText =
            candidat2.nom + " gagne";

          // -------------------
          // CLE
          // -------------------

          const cle =
            candidat1.id
            + "-"
            + candidat2.id;

          // -------------------
          // CLICS
          // -------------------

          bouton1.onclick = () => {

            pronostics[cle] =
              candidat1.id;

            mettreAJour();

          };

          bouton2.onclick = () => {

            pronostics[cle] =
              candidat2.id;

            mettreAJour();

          };

// -------------------
// COULEURS
// -------------------

if (
  pronostics[cle]
  === candidat1.id
) {

  if (
    refus.includes(candidat1.id)
  ) {

    bouton1.style.backgroundColor =
      "tomato";

    bouton1.style.color =
      "white";

  }

  else if (
    acceptables.includes(candidat1.id)
  ) {

    bouton1.style.backgroundColor =
      "lightgreen";

    bouton1.style.color =
      "black";

  }

  else {

    bouton1.style.backgroundColor =
      "#999";

    bouton1.style.color =
      "white";

  }

}

if (
  pronostics[cle]
  === candidat2.id
) {

  if (
    refus.includes(candidat2.id)
  ) {

    bouton2.style.backgroundColor =
      "tomato";

    bouton2.style.color =
      "white";

  }

  else if (
    acceptables.includes(candidat2.id)
  ) {

    bouton2.style.backgroundColor =
      "lightgreen";

    bouton2.style.color =
      "black";

  }

  else {

    bouton2.style.backgroundColor =
      "#999";

    bouton2.style.color =
      "white";

  }

}

          // -------------------
          // AJOUT
          // -------------------

          duel.appendChild(
            bouton1
          );

          duel.appendChild(
            bouton2
          );

          container.appendChild(
            duel
          );

        }
      );

    });

}

function afficherScenariosPolitiques() {

  const container =
    document.getElementById(
      "scenarios-politiques"
    );

  let html = "";

  if (
  Object.keys(pronostics).length === 0
) {

  container.innerHTML =
    `
    <h3>
      Scénarios politiques
    </h3>

    <p>
      Remplissez d’abord quelques duels
      pour faire apparaître des scénarios
      institutionnels possibles.
    </p>
    `;

  return;

}

  const candidatsVisibles =
    candidats.filter(c =>
      preselection.includes(c.id)
    );



  html += `
    <h3>
      Scénarios politiques
    </h3>

    <table style="
      width:100%;
      border-collapse:collapse;
      margin-top:15px;
    ">
  `;

  html += `
    <tr>

      <th align="left">
        Si ce candidat gagne...
      </th>

      <th align="left">
        Alors le pouvoir exécutif pourrait être exercé par...
      </th>

      <th align="left">
        Le pouvoir gouvernemental pourrait finalement s’organiser autour de...
      </th>

    </tr>
  `;

  candidatsVisibles.forEach(
    candidat => {

      // -------------------
      // OPTIONS
      // -------------------

      const sansDissolution =
        optionsInstitutionnelles[
          candidat.id
          + "-sansDissolution"
        ];

      const coalition =
        optionsInstitutionnelles[
          candidat.id
          + "-coalitionDissolution"
        ];

      const majorite =
        optionsInstitutionnelles[
          candidat.id
          + "-majoriteAbsolue"
        ];

      // -------------------
      // SCORE COALITION
      // -------------------

     let meilleurScore = -1;

let meilleurs = [];

candidatsVisibles.forEach(
  autre => {

    let score = 0;

    candidats.forEach(
      ministre => {

        const cle =
          autre.id
          + "-"
          + ministre.id;

        if (
          coalitions[cle]
        ) {

          score++;

        }

      }
    );

    // bonus :
    // le président élu
    // garde une prime
    // de centralité

    if (
      autre.id === candidat.id
    ) {

      score += 0.5;

    }

    if (
      score > meilleurScore
    ) {

      meilleurScore =
        score;

      meilleurs = [
        autre.nom
      ];

    }

    else if (
      score === meilleurScore
    ) {

      meilleurs.push(
        autre.nom
      );

    }

  }
);

const meilleurCoalitionnaire =
  meilleurs.join(" / ");



      // -------------------
      // INTERPRETATION
      // -------------------

      let executif = "";

      if (majorite) {

        executif =
          candidat.nom;

      }

      else if (
        sansDissolution
        || coalition
      ) {

        executif =
          "Coalition autour du président élu";

      }

      else {

        executif =
          "Cohabitation probable";

      }

      const idsCoalition =
  meilleurCoalitionnaire
    .split(" / ")
    .map(nom =>
      candidats.find(
        c => c.nom === nom
      )?.id
    );

const tousAcceptables =
  idsCoalition.every(id =>
    acceptables.includes(id)
  );

const tousRefuses =
  idsCoalition.every(id =>
    refus.includes(id)
  );

let couleurCoalition = "";

if (tousAcceptables) {

  couleurCoalition =
    "background:lightgreen;";

}

else if (tousRefuses) {

  couleurCoalition =
    "background:tomato;color:white;";

}


html += `
  <tr>

<td
  style="
    ${
      refus.includes(candidat.id)
      ? "background:tomato;color:white;"
      : acceptables.includes(candidat.id)
      ? "background:lightgreen;"
      : ""
    }
  "
>
  ${candidat.nom}
</td>

<td>
  ${executif}
</td>

<td style="${couleurCoalition}">
  ${meilleurCoalitionnaire}
</td>

  </tr>
`;

    }
  );

  html += `</table>`;

  container.innerHTML =
    html;

}

function calculerStrategie() {

  const strategie =
    document.getElementById(
      "strategie"
    );

  let html = "";

  const candidatsVisibles =
    candidats.filter(c =>
      preselection.includes(c.id)
    );

  const scoresVictoire = {};

  const scoresCoalition = {};

  // -------------------
  // SCORE VICTOIRE
  // -------------------

  candidatsVisibles.forEach(c => {

    scoresVictoire[c.id] = 0;

  });

  Object.values(pronostics)
    .forEach(vainqueurId => {

      if (
        scoresVictoire[vainqueurId]
        !== undefined
      ) {

        scoresVictoire[
          vainqueurId
        ]++;

      }

    });

  // -------------------
  // SCORE COALITION
  // -------------------

  candidatsVisibles.forEach(
    president => {

      let score = 0;

      candidats.forEach(
        ministre => {

          const cle =
            president.id
            + "-"
            + ministre.id;

          if (
            coalitions[cle]
          ) {

            score++;

          }

        }
      );

      scoresCoalition[
        president.id
      ] = score;

    }
  );

  // -------------------
  // RESULTATS
  // -------------------

  const resultats =
    candidatsVisibles.map(
      candidat => {

        const victoire =
          scoresVictoire[
            candidat.id
          ];

        const coalition =
          scoresCoalition[
            candidat.id
          ];

        const global =
          victoire * coalition;

        return {
          candidat,
          victoire,
          coalition,
          global
        };

      }
    );

  // -------------------
  // TRI
  // -------------------

  resultats.sort(
    (a, b) =>
      b.global - a.global
  );

  // -------------------
  // AFFICHAGE
  // -------------------

  html += `
    <table style="
      width:100%;
      border-collapse:collapse;
      font-size:14px;
    ">
  `;

  html += `
    <tr>
      <th align="left">
        Candidat
      </th>

      <th>
        Duels <br> gagnés
      </th>

      <th>
        Alliances <br> pour gouverner
      </th>

      <th>
        Note <br> Global
      </th>
    </tr>
  `;

  resultats.forEach(
    resultat => {

      let couleur = "";

      if (
        refus.includes(
          resultat.candidat.id
        )
      ) {

        couleur =
          "#ffb3b3";

      }

      else if (
        acceptables.includes(
          resultat.candidat.id
        )
      ) {

        couleur =
          "#b7f0b7";

      }

      html += `
        <tr style="
          background:${couleur};
        ">

          <td>
            ${resultat.candidat.nom}
          </td>

          <td align="center">
            ${resultat.victoire}
          </td>

          <td align="center">
            ${resultat.coalition}
          </td>

          <td align="center">
            <strong>
              ${resultat.global}
            </strong>
          </td>

        </tr>
      `;

    }
  );

  html += `</table>`;

  strategie.innerHTML =
    html;

}

function mettreAJour() {

  afficherPreselection();

if (
  preselection.length === 6
) {

  creerBoutons();

  afficherDuels();

  afficherCoalitions();

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

}
const boutonPrequalification =
  document.getElementById(
    "toggle-prequalification"
  );

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