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
        5.2 Conséquences institutionnelles
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
      5.2 Conséquences institutionnelles
    </h3>

    <table class="tableau-resultats">
      <tr>
        <th align="left">Si ce candidat gagne...</th>
        <th align="left">Conséquence plausible</th>
        <th align="left">Pivot gouvernemental plausible</th>
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

      const pivot =
        analyse.pivot
          ? analyse.pivot.candidat
          : null;

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

          <td
            style="
              ${
                pivot && refus.includes(pivot.id)
                ? "background:tomato;color:white;"
                : pivot && acceptables.includes(pivot.id)
                ? "background:lightgreen;"
                : ""
              }
            "
          >
            ${
              pivot
                ? pivot.nom
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

    <aside class="notice-resultats">

      <h4>
        Notice
      </h4>

      <p>
        Selon vos hypothèses, voici les situations institutionnelles
        qui pourraient émerger après l’élection présidentielle
        puis d’éventuelles législatives.
      </p>

      <p>
        Le système ne cherche pas à dire quelle situation est préférable.
        Il rend visibles les conséquences plausibles des rapports de force.
      </p>

      <p>
        Ces conséquences décrivent les effets
        institutionnels plausibles de vos hypothèses.
        Ils ne qualifient pas ces situations comme bonnes
        ou mauvaises et ne recommandent aucune orientation.
      </p>

      <h5>
        Comment ces scénarios sont-ils calculés ?
      </h5>

      <p>
        Ces scénarios sont déduits de vos choix précédents :
      </p>

      <ul>
        <li>
          Les duels évaluent la capacité d’un candidat
          à gagner l’élection présidentielle.
        </li>
        <li>
          Les alliances gouvernementales estiment sa capacité
          à former un gouvernement durable.
        </li>
        <li>
          Les options institutionnelles projettent les formes possibles
          du pouvoir exécutif : coalition, dissolution ou majorité absolue.
        </li>
        <li>
          Si aucun centre de majorité stable ne se dégage,
          le simulateur rend visibles les risques de cohabitation,
          de blocage ou de déplacement du centre gouvernemental.
        </li>
      </ul>

    </aside>
  `;

  container.innerHTML =
    html;

}
