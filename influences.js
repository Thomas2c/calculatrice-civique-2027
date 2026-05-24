const criteresInfluence = {
  faible: {
    titre: "Influence faible",
    resume:
      "Peu ou pas de députés, appareil politique réduit, peu de relais institutionnels.",
    details: [
      "Peut exister médiatiquement.",
      "Pèse peu dans la formation réelle d’un gouvernement.",
      "Correspond souvent à des micro-partis ou candidatures de témoignage."
    ]
  },
  moyenne: {
    titre: "Influence moyenne",
    resume:
      "Dispose d’élus, d’un parti structuré ou d’une capacité de négociation réelle, mais limitée.",
    details: [
      "Peut participer à une coalition.",
      "Peut fournir des ministres ou peser au Parlement.",
      "Peut faire ou défaire certaines majorités."
    ]
  },
  forte: {
    titre: "Influence forte",
    resume:
      "Peut structurer une coalition, agréger des soutiens variés ou devenir un pivot gouvernemental.",
    details: [
      "Peut venir d’un grand parti ou d’un réseau d’élus.",
      "Peut venir d’une forte dynamique présidentielle.",
      "Peut être forte même avec peu d’élus actuels si l’agrégation paraît rapide."
    ]
  }
};

function afficherInfluencesPolitiques() {

  const container =
    document.getElementById(
      "influences-candidats"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  niveauxInfluence.forEach(
    niveau => {

      const colonne =
        creerColonneInfluence(
          niveau
        );

      container.appendChild(
        colonne
      );

    }
  );

}

function creerColonneInfluence(
  niveau
) {

  const colonne =
    document.createElement("section");

  colonne.className =
    "influence-colonne influence-"
    + niveau;

  colonne.dataset.niveau =
    niveau;

  colonne.addEventListener(
    "dragover",
    event => {

      event.preventDefault();

      colonne.classList.add(
        "influence-colonne-survol"
      );

    }
  );

  colonne.addEventListener(
    "dragleave",
    () => {

      colonne.classList.remove(
        "influence-colonne-survol"
      );

    }
  );

  colonne.addEventListener(
    "drop",
    event => {

      event.preventDefault();

      colonne.classList.remove(
        "influence-colonne-survol"
      );

      const candidatId =
        Number(
          event.dataTransfer.getData(
            "text/plain"
          )
        );

      if (!candidatId) {
        return;
      }

      influencesPolitiques[
        candidatId
      ] = niveau;

      mettreAJour();

    }
  );

  const entete =
    document.createElement("div");

  entete.className =
    "influence-entete";

  const titre =
    document.createElement("h3");

  titre.innerText =
    criteresInfluence[
      niveau
    ].titre;

  const resume =
    document.createElement("p");

  resume.innerText =
    criteresInfluence[
      niveau
    ].resume;

  const liste =
    document.createElement("ul");

  criteresInfluence[
    niveau
  ].details.forEach(
    detail => {

      const item =
        document.createElement("li");

      item.innerText =
        detail;

      liste.appendChild(
        item
      );

    }
  );

  entete.appendChild(
    titre
  );

  entete.appendChild(
    resume
  );

  entete.appendChild(
    liste
  );

  colonne.appendChild(
    entete
  );

  const listeCandidats =
    document.createElement("div");

  listeCandidats.className =
    "influence-liste";

  candidats
    .filter(candidat =>
      influencesPolitiques[
        candidat.id
      ] === niveau
    )
    .forEach(candidat => {

      listeCandidats.appendChild(
        creerCarteInfluence(
          candidat,
          niveau
        )
      );

    });

  colonne.appendChild(
    listeCandidats
  );

  return colonne;

}

function creerCarteInfluence(
  candidat,
  niveau
) {

  const carte =
    document.createElement("button");

  carte.type =
    "button";

  carte.className =
    "influence-carte";

  carte.draggable =
    true;

  carte.dataset.candidatId =
    candidat.id;

  carte.innerText =
    candidat.nom;

  carte.addEventListener(
    "dragstart",
    event => {

      event.dataTransfer.setData(
        "text/plain",
        String(candidat.id)
      );

      event.dataTransfer.effectAllowed =
        "move";

    }
  );

  return carte;

}
