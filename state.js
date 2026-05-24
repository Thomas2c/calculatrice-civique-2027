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
const porositesTactiques = {};
const potentielsSecondTour = {};
const presidentsEvalues = [];
const niveauxInfluence = [
  "faible",
  "moyenne",
  "forte"
];
const poidsInfluence = {
  faible: 1,
  moyenne: 2,
  forte: 3
};
const influencesPolitiques =
  Object.fromEntries(
    candidats.map(candidat => [
      candidat.id,
      "moyenne"
    ])
  );

let presidentActif = null;
