const fs = require("fs");

// Chemin du fichier JSON et du fichier texte de sortie
const inputFile = "bible.json";
const outputFile = "bible.txt";

// Lire le fichier JSON
fs.readFile(inputFile, "utf8", (err, data) => {
  if (err) {
    console.error("Erreur lors de la lecture du fichier JSON:", err);
    return;
  }

  // Parser le JSON
  const bible = JSON.parse(data);
  let output = "";

  // Parcourir les livres
  for (const book in bible) {
    output += `\n${book}\n\n`;

    // Parcourir les chapitres
    const chapters = bible[book];
    const chapterNumbers = Object.keys(chapters).sort(
      (a, b) => Number(a) - Number(b)
    );
    for (const chapter of chapterNumbers) {
      output += `Chapitre ${chapter}\n`;

      // Parcourir les versets
      const verses = chapters[chapter];
      const verseNumbers = Object.keys(verses).sort(
        (a, b) => Number(a) - Number(b)
      );
      for (const verse of verseNumbers) {
        output += `${chapter}:${verse} ${verses[verse]}\n`;
      }

      output += "\n";
    }
  }

  // Écrire le résultat dans un fichier texte
  fs.writeFile(outputFile, output, "utf8", (err) => {
    if (err) {
      console.error("Erreur lors de l'écriture du fichier texte:", err);
      return;
    }
    console.log("Conversion terminée avec succès !");
  });
});
