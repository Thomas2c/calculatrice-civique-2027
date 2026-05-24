function afficherScenariosPolitiques() {

  const container =
    document.getElementById(
      "scenarios-politiques"
    );

  if (
    Object.keys(pronostics).length === 0
  ) {

    container.innerHTML =
      `
      <h3>
        9. Les conséquences institutionnelles
      </h3>

      <p>
        Remplissez d’abord quelques duels
        pour faire apparaître les conséquences
        institutionnelles possibles.
      </p>
      `;

    return;

  }

  const candidatsVisibles =
    candidats.filter(c =>
      preselection.includes(c.id)
    );

  const indicateurs =
    calculerIndicateursInstitutionnels(
      candidats
    );

  let html = `
    <h3>
      9. Les conséquences institutionnelles
    </h3>

    <table style="
      width:100%;
      border-collapse:collapse;
      margin-top:15px;
    ">
      <tr>
        <th align="left">Si ce candidat gagne...</th>
        <th align="left">Conséquence plausible</th>
        <th align="left">Pivot gouvernemental possible</th>
        <th align="left">Détail du scénario</th>
      </tr>
  `;

  candidatsVisibles.forEach(
    candidat => {

      const analyse =
        analyserScenarioInstitutionnel(
          candidat,
          candidats,
          indicateurs
        );

      const donnees =
        indicateurs[
          candidat.id
        ];

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
            ${analyse.situation}
          </td>

          <td>
            ${
              analyse.pivot
                ? analyse.pivot.candidat.nom
                : "Aucun pivot clair"
            }
          </td>

          <td>
            Alliés : ${donnees.nombreAllies}
            · poids : ${donnees.poidsTotalAllies}
            · réciprocité : ${Math.round(donnees.tauxReciprocite * 100)}%
            · hostilité : ${donnees.hostiliteAgregee}
            · ${analyse.explication}
          </td>

        </tr>
      `;

    }
  );

  html += `
    </table>

    <div style="
      margin-top:40px;
      padding-top:20px;
      border-top:2px solid #ccc;
    ">

      <h4>
        Synthèse neutre
      </h4>

      <p>
        Ces conséquences décrivent les effets
        institutionnels plausibles de vos hypothèses.
        Ils ne qualifient pas ces situations comme bonnes
        ou mauvaises et ne recommandent aucune orientation.
      </p>

    </div>
  `;

  container.innerHTML =
    html;

}
