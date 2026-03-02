const abbrToName = {
  // Pentateuque
  Gn: "Livre de la Genèse",
  Ex: "Livre de l'Exode",
  Lv: "Livre du Lévitique",
  Nb: "Livre des Nombres",
  Dt: "Livre du Deutéronome",

  // Livres historiques
  Jos: "Livre de Josué",
  Jg: "Livre des Juges",
  Rt: "Livre de Ruth",
  "1S": "Premier livre de Samuel",
  "2S": "Deuxième livre de Samuel",
  "1R": "Premier livre des Rois",
  "2R": "Deuxième livre des Rois",
  "1Ch": "Premier livre des Chroniques",
  "2Ch": "Deuxième livre des Chroniques",
  Esd: "Livre d'Esdras",
  Ne: "Livre de Néhémie",
  Tb: "Livre de Tobie",
  Jdt: "Livre de Judith",
  Est: "Livre d'Esther",
  "1M": "Premier Livre des Martyrs d'Israël",
  "2M": "Deuxième Livre des Martyrs d'Israël",

  // Livres poétiques et sapientiaux
  Jb: "Livre de Job",
  Ps: "Psaumes",
  Pr: "Livre des Proverbes",
  Qo: "L'ecclésiaste",
  Ct: "Cantique des cantiques",
  Sg: "Livre de la Sagesse",
  Si: "Livre de Ben Sira le Sage",

  // Prophètes majeurs
  Is: "Livre d'Isaïe",
  Jr: "Livre de Jérémie",
  Lm: "Livre des lamentations de Jérémie",
  Ba: "Livre de Baruch",
  LtJr: "Lettre de Jérémie",
  Ez: "Livre d'Ezekiel",
  Dn: "Livre de Daniel",

  // Prophètes mineurs
  Os: "Livre d'Osée",
  Jl: "Livre de Joël",
  Am: "Livre d'Amos",
  Ab: "Livre d'Abdias",
  Jon: "Livre de Jonas",
  Mi: "Livre de Michée",
  Na: "Livre de Nahum",
  Ha: "Livre d'Habaquc",
  So: "Livre de Sophonie",
  Ag: "Livre d'Aggée",
  Za: "Livre de Zacharie",
  Ml: "Livre de Malachie",

  // Evangiles
  Mt: "Evangile de Jésus-Christ selon saint Matthieu",
  Mc: "Evangile de Jésus-Christ selon saint Marc",
  Lc: "Evangile de Jésus-Christ selon saint Luc",
  Jn: "Evangile de Jésus-Christ selon saint Jean",

  // Actes
  Ac: "Livre des Actes des Apôtres",

  // Epîtres pauliniennes
  Rm: "Lettre de saint Paul Apôtre aux Romains",
  "1Co": "Première lettre de saint Paul Apôtre aux Corinthiens",
  "2Co": "Deuxième lettre de saint Paul Apôtre aux Corinthiens",
  Ga: "Lettre de saint Paul Apôtre aux Galates",
  Ep: "Lettre de saint Paul Apôtre aux Ephésiens",
  Ph: "Lettre de saint Paul Apôtre aux Philippiens",
  Col: "Lettre de saint Paul Apôtre aux Colossiens",
  "1Th": "Première lettre de saint Paul Apôtre aux Thessaloniciens",
  "2Th": "Deuxième lettre de saint Paul Apôtre aux Thessaloniciens",
  "1Tm": "Première lettre de saint Paul Apôtre à Timothée",
  "2Tm": "Deuxième lettre de saint Paul Apôtre à Timothée",
  Tt: "Lettre de saint Paul Apôtre à Tite",
  Phm: "Lettre de saint Paul Apôtre à Philémon",

  // Epître aux Hébreux
  He: "Lettre aux Hébreux",

  // Epîtres catholiques
  Jc: "Lettre de saint Jacques Apôtre",
  "1P": "Première lettre de saint Pierre Apôtre",
  "2P": "Deuxième lettre de saint Pierre Apôtre",
  "1Jn": "Première lettre de saint Jean",
  "2Jn": "Deuxième lettre de saint Jean",
  "3Jn": "Troisième lettre de saint Jean",
  Jd: "Lettre de saint Jude",

  // Apocalypse
  Ap: "Livre de l'Apocalypse",
};

const nameToAbbr = Object.fromEntries(
  Object.entries(abbrToName).map(([abbr, name]) => [name, abbr])
);

module.exports = { abbrToName, nameToAbbr };
