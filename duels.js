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

          const bouton1 =
            document.createElement("button");

          bouton1.innerText =
            candidat1.nom + " gagne";

          const bouton2 =
            document.createElement("button");

          bouton2.innerText =
            candidat2.nom + " gagne";

          const cle =
            candidat1.id
            + "-"
            + candidat2.id;

          bouton1.onclick = () => {

            pronostics[cle] =
              candidat1.id;

            console.log(pronostics);
            mettreAJour();

          };

          bouton2.onclick = () => {

            pronostics[cle] =
              candidat2.id;

            console.log(pronostics);
            mettreAJour();

          };

          colorerPronostic(
            bouton1,
            candidat1
          );

          colorerPronostic(
            bouton2,
            candidat2
          );

          duel.appendChild(
            bouton1
          );

          duel.appendChild(
            bouton2
          );

          container.appendChild(
            duel
          );

          function colorerPronostic(
            bouton,
            candidat
          ) {

            if (
              pronostics[cle] !== candidat.id
            ) {
              return;
            }

            if (
              refus.includes(candidat.id)
            ) {

              bouton.style.backgroundColor =
                "tomato";

              bouton.style.color =
                "white";

            }

            else if (
              acceptables.includes(candidat.id)
            ) {

              bouton.style.backgroundColor =
                "lightgreen";

              bouton.style.color =
                "black";

            }

            else {

              bouton.style.backgroundColor =
                "#999";

              bouton.style.color =
                "white";

            }

          }

        }
      );

    });

}
