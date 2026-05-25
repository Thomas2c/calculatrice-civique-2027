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

let glissementInfluence =
  null;

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

  carte.addEventListener(
    "pointerdown",
    event => {

      demarrerGlissementInfluence(
        event,
        carte,
        candidat.id
      );

    }
  );

  carte.addEventListener(
    "click",
    event => {

      if (
        carte.dataset.glissementEffectue ===
        "true"
      ) {

        event.preventDefault();

        carte.dataset.glissementEffectue =
          "false";

      }

    }
  );

  return carte;

}

function demarrerGlissementInfluence(
  event,
  carte,
  candidatId
) {

  if (
    event.pointerType === "mouse" &&
    event.button !== 0
  ) {
    return;
  }

  glissementInfluence = {
    carte,
    candidatId,
    departX: event.clientX,
    departY: event.clientY,
    actif: false
  };

  carte.setPointerCapture(
    event.pointerId
  );

  carte.addEventListener(
    "pointermove",
    deplacerCarteInfluence
  );

  carte.addEventListener(
    "pointerup",
    terminerGlissementInfluence
  );

  carte.addEventListener(
    "pointercancel",
    annulerGlissementInfluence
  );

}

function deplacerCarteInfluence(
  event
) {

  if (!glissementInfluence) {
    return;
  }

  const distanceX =
    event.clientX -
    glissementInfluence.departX;

  const distanceY =
    event.clientY -
    glissementInfluence.departY;

  const distance =
    Math.hypot(
      distanceX,
      distanceY
    );

  if (
    !glissementInfluence.actif &&
    distance < 8
  ) {
    return;
  }

  event.preventDefault();

  glissementInfluence.actif =
    true;

  const carte =
    glissementInfluence.carte;

  carte.classList.add(
    "influence-carte-mobile-drag"
  );

  carte.style.transform =
    "translate("
    + distanceX
    + "px, "
    + distanceY
    + "px)";

  document
    .querySelectorAll(
      ".influence-colonne-survol"
    )
    .forEach(colonne => {

      colonne.classList.remove(
        "influence-colonne-survol"
      );

    });

  const cible =
    trouverColonneInfluenceSousPointeur(
      event.clientX,
      event.clientY
    );

  if (cible) {

    cible.classList.add(
      "influence-colonne-survol"
    );

  }

}

function terminerGlissementInfluence(
  event
) {

  if (!glissementInfluence) {
    return;
  }

  const {
    carte,
    candidatId,
    actif
  } = glissementInfluence;

  nettoyerGlissementInfluence(
    carte
  );

  if (!actif) {
    glissementInfluence = null;
    return;
  }

  event.preventDefault();

  carte.dataset.glissementEffectue =
    "true";

  const cible =
    trouverColonneInfluenceSousPointeur(
      event.clientX,
      event.clientY
    );

  if (
    cible &&
    cible.dataset.niveau
  ) {

    influencesPolitiques[
      candidatId
    ] = cible.dataset.niveau;

    mettreAJour();

  }

  glissementInfluence =
    null;

}

function annulerGlissementInfluence() {

  if (!glissementInfluence) {
    return;
  }

  nettoyerGlissementInfluence(
    glissementInfluence.carte
  );

  glissementInfluence =
    null;

}

function nettoyerGlissementInfluence(
  carte
) {

  carte.classList.remove(
    "influence-carte-mobile-drag"
  );

  carte.style.transform =
    "";

  carte.removeEventListener(
    "pointermove",
    deplacerCarteInfluence
  );

  carte.removeEventListener(
    "pointerup",
    terminerGlissementInfluence
  );

  carte.removeEventListener(
    "pointercancel",
    annulerGlissementInfluence
  );

  document
    .querySelectorAll(
      ".influence-colonne-survol"
    )
    .forEach(colonne => {

      colonne.classList.remove(
        "influence-colonne-survol"
      );

    });

}

function trouverColonneInfluenceSousPointeur(
  x,
  y
) {

  const carteGlissee =
    glissementInfluence
      ? glissementInfluence.carte
      : null;

  if (carteGlissee) {

    carteGlissee.style.visibility =
      "hidden";

  }

  const element =
    document.elementFromPoint(
      x,
      y
    );

  if (carteGlissee) {

    carteGlissee.style.visibility =
      "";

  }

  if (!element) {
    return null;
  }

  return element.closest(
    ".influence-colonne"
  );

}
