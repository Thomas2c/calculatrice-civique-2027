function afficherPotentielsSecondTour() {

  const container =
    document.getElementById(
      "potentiels-second-tour"
    );

  const totalContainer =
    document.getElementById(
      "total-potentiels"
    );

  container.innerHTML = "";

  const candidatsVisibles =
    candidats.filter(c =>
      preselection.includes(c.id)
    );

  candidatsVisibles.forEach(
    candidat => {

      const ligne =
        document.createElement("div");

      ligne.className =
        "ligne-potentiel";

      const label =
        document.createElement("div");

      label.innerText =
        candidat.nom;

      const slider =
        document.createElement("input");

      slider.type =
        "range";

      slider.min = 0;

      slider.max = 100;

      slider.step = 1;

      slider.value =
        potentielsSecondTour[
          candidat.id
        ] || 0;

      const valeur =
        document.createElement("span");

      valeur.innerText =
        slider.value + "%";

      slider.oninput = () => {

        potentielsSecondTour[
          candidat.id
        ] = Number(
          slider.value
        );

        valeur.innerText =
          slider.value + "%";

        afficherTotalPotentiels();

        calculerStrategie();

      };

      ligne.appendChild(label);

      ligne.appendChild(slider);

      ligne.appendChild(valeur);

      container.appendChild(
        ligne
      );

    }
  );

  afficherTotalPotentiels();

}

function afficherTotalPotentiels() {

  const totalContainer =
    document.getElementById(
      "total-potentiels"
    );

  const total =
    Object.values(
      potentielsSecondTour
    ).reduce(
      (a, b) => a + b,
      0
    );

  totalContainer.innerHTML =
    `
    Perception globale :
    ${total}
    `;

}
