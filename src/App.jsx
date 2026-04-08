import { useEffect, useRef, useState } from "react";

const TOPICS = [
  { id: "transit", label: "Transit", icon: "🚌" },
  { id: "housing", label: "Housing", icon: "🏠" },
  { id: "environment", label: "Environment", icon: "🌿" },
  { id: "education", label: "Education", icon: "📚" },
  { id: "seniors", label: "Senior Citizens", icon: "👴" },
  { id: "safety", label: "Public Safety", icon: "👮" },
  { id: "health", label: "Healthcare", icon: "🏥" },
  { id: "business", label: "Small Business", icon: "💼" },
];

const BILLS = {
  transit: [
    {
      id: "b1",
      title: "NYC Congestion Pricing Expansion Act",
      status: "LIVE",
      statusLabel: "Vote this week",
      summary:
        "Expands congestion pricing zones to include Brooklyn and Queens bridges, generating $1.2B annually for MTA capital improvements.",
      impact: "Affects your commute on the L and J trains in your district",
      repPosition: "Opposed",
      neighbors: 312,
      hearing: "April 10, 2PM - City Hall",
      support: 58,
    },
    {
      id: "b2",
      title: "Bus Rapid Transit Corridor Bill",
      status: "UPCOMING",
      statusLabel: "Hearing April 15",
      summary:
        "Creates dedicated bus lanes on 5 major corridors across all 5 boroughs, reducing average commute times by an estimated 12 minutes.",
      impact: "3 new BRT stops planned within 0.5 miles of your address",
      repPosition: "Supporting",
      neighbors: 189,
      hearing: "April 15, 10AM - DOT Office",
      support: 74,
    },
  ],
  housing: [
    {
      id: "b3",
      title: "Rent Stabilization Expansion Act",
      status: "LIVE",
      statusLabel: "Committee vote today",
      summary:
        "Extends rent stabilization protections to 400,000 additional units built before 1993, capping annual increases at 3% or CPI.",
      impact:
        "Affects ~8,200 units in your district - Crown Heights and Prospect Heights",
      repPosition: "Supporting",
      neighbors: 891,
      hearing: "Today, 11AM - City Council Chambers",
      support: 81,
    },
    {
      id: "b4",
      title: "Affordable Housing Inclusionary Zoning Reform",
      status: "UPCOMING",
      statusLabel: "Hearing April 12",
      summary:
        "Requires 25% affordable units in all new developments over 10 units citywide, up from the current 20% requirement.",
      impact: "2 pending developments in your zip code would be affected",
      repPosition: "Undecided",
      neighbors: 423,
      hearing: "April 12, 2PM - Brooklyn Borough Hall",
      support: 67,
    },
  ],
  environment: [
    {
      id: "b5",
      title: "NYC Green New Deal Implementation Bill",
      status: "UPCOMING",
      statusLabel: "Hearing April 18",
      summary:
        "Mandates all city buildings over 25,000 sq ft achieve net-zero emissions by 2030, with a $500M retrofit fund for low-income buildings.",
      impact: "14 buildings in your district qualify for retrofit funding",
      repPosition: "Supporting",
      neighbors: 267,
      hearing: "April 18, 1PM - Environmental Committee",
      support: 79,
    },
  ],
  education: [
    {
      id: "b6",
      title: "Universal Pre-K Funding Expansion",
      status: "LIVE",
      statusLabel: "Vote this week",
      summary:
        "Increases per-pupil Pre-K funding by $2,400 annually and adds 85 new classrooms across underserved districts.",
      impact: "3 schools in your district would receive new classrooms",
      repPosition: "Supporting",
      neighbors: 544,
      hearing: "April 9, 3PM - Education Committee",
      support: 88,
    },
  ],
  seniors: [
    {
      id: "b7",
      title: "Senior Center Funding Protection Act",
      status: "LIVE",
      statusLabel: "Budget vote this week",
      summary:
        "Prevents $40M in proposed cuts to NYC senior center programming, maintaining meals, healthcare, and social services for 60,000 seniors.",
      impact: "2 senior centers in your district face closure without this bill",
      repPosition: "Supporting",
      neighbors: 203,
      hearing: "April 10, 10AM - City Council",
      support: 91,
    },
  ],
  safety: [
    {
      id: "b8",
      title: "Community Safety & Accountability Act",
      status: "UPCOMING",
      statusLabel: "Hearing April 14",
      summary:
        "Establishes civilian oversight boards with subpoena power in each borough and requires body cam footage release within 30 days.",
      impact: "Creates a new oversight board covering your precinct",
      repPosition: "Undecided",
      neighbors: 378,
      hearing: "April 14, 2PM - Public Safety Committee",
      support: 63,
    },
  ],
  health: [
    {
      id: "b9",
      title: "Mental Health Crisis Response Reform",
      status: "LIVE",
      statusLabel: "Vote this week",
      summary:
        "Routes non-violent mental health 911 calls to trained crisis responders instead of police, with $80M in new funding for mobile teams.",
      impact: "Your district had 1,200+ mental health 911 calls last year",
      repPosition: "Supporting",
      neighbors: 456,
      hearing: "April 9, 1PM - Health Committee",
      support: 72,
    },
  ],
  business: [
    {
      id: "b10",
      title: "Small Business Commercial Rent Relief Act",
      status: "UPCOMING",
      statusLabel: "Hearing April 16",
      summary:
        "Provides rent stabilization protections for commercial tenants with under $3M annual revenue, preventing arbitrary lease non-renewals.",
      impact: "47 small businesses on your main corridor would be protected",
      repPosition: "Supporting",
      neighbors: 291,
      hearing: "April 16, 11AM - Small Business Committee",
      support: 76,
    },
  ],
};

const REP = {
  name: "Council Member Pierina Sanchez",
  district: "District 14 - Bronx",
  party: "Democrat",
  alignment: 78,
};

const STATUS_COLORS = {
  LIVE: { bg: "rgba(155, 85, 54, 0.12)", text: "#9b5536", dot: "#9b5536" },
  UPCOMING: { bg: "rgba(184, 140, 74, 0.16)", text: "#b88c4a", dot: "#b88c4a" },
  PASSED: { bg: "rgba(95, 126, 93, 0.14)", text: "#5f7e5d", dot: "#5f7e5d" },
};

const PIN_COORDS = {
  b1: { x: 35, y: 30 },
  b2: { x: 68, y: 22 },
  b3: { x: 22, y: 48 },
  b4: { x: 60, y: 62 },
  b5: { x: 78, y: 30 },
  b6: { x: 25, y: 68 },
  b7: { x: 52, y: 18 },
  b8: { x: 45, y: 78 },
  b9: { x: 55, y: 52 },
  b10: { x: 72, y: 70 },
};

const NEIGHBORHOODS = [
  {
    id: "fordham",
    label: "Fordham",
    borough: "Bronx",
    zipCodes: ["10458", "10468"],
    path: "M145 105 L220 88 L248 126 L222 170 L150 176 L124 138 Z",
    labelX: 186,
    labelY: 132,
  },
  {
    id: "mott-haven",
    label: "Mott Haven",
    borough: "Bronx",
    zipCodes: ["10454", "10455"],
    path: "M208 172 L258 160 L284 198 L258 238 L202 232 L184 198 Z",
    labelX: 234,
    labelY: 198,
  },
  {
    id: "kingsbridge",
    label: "Kingsbridge",
    borough: "Bronx",
    zipCodes: ["10463"],
    path: "M92 52 L152 38 L182 72 L154 108 L94 98 L76 72 Z",
    labelX: 128,
    labelY: 73,
  },
  {
    id: "astoria",
    label: "Astoria",
    borough: "Queens",
    zipCodes: ["11102", "11105"],
    path: "M262 116 L330 98 L364 138 L344 190 L274 196 L248 154 Z",
    labelX: 307,
    labelY: 145,
  },
  {
    id: "williamsburg",
    label: "Williamsburg",
    borough: "Brooklyn",
    zipCodes: ["11211", "11249"],
    path: "M220 242 L292 224 L322 270 L296 322 L226 316 L198 272 Z",
    labelX: 258,
    labelY: 273,
  },
  {
    id: "st-george",
    label: "St. George",
    borough: "Staten Island",
    zipCodes: ["10301"],
    path: "M44 262 L110 246 L144 286 L124 336 L62 344 L30 300 Z",
    labelX: 87,
    labelY: 294,
  },
];

const ZIP_TO_NEIGHBORHOOD = Object.fromEntries(
  NEIGHBORHOODS.flatMap((place) => place.zipCodes.map((zip) => [zip, place.id])),
);

const BILL_NEIGHBORHOODS = {
  b1: ["fordham", "astoria"],
  b2: ["fordham", "williamsburg", "astoria"],
  b3: ["williamsburg", "mott-haven", "fordham"],
  b4: ["williamsburg", "astoria"],
  b5: ["fordham", "mott-haven", "kingsbridge", "astoria", "williamsburg", "st-george"],
  b6: ["fordham", "mott-haven", "kingsbridge"],
  b7: ["fordham", "kingsbridge", "mott-haven"],
  b8: ["mott-haven", "fordham", "st-george"],
  b9: ["mott-haven", "fordham"],
  b10: ["williamsburg", "st-george", "fordham"],
};

const COMMUNITY_EVENTS = [
  {
    id: "e1",
    dateLabel: "Today, Apr 8",
    time: "6:30 PM",
    title: "Tenant Organizing Night",
    type: "Community event",
    location: "Bronx Library Center",
    details: "Neighbors share housing concerns, prep public comments, and review current rent-related legislation.",
    neighborhood: "fordham",
  },
  {
    id: "e2",
    dateLabel: "Thu, Apr 10",
    time: "7:00 PM",
    title: "District 14 Transit Town Hall",
    type: "Community event",
    location: "Fordham Community Hub",
    details: "Open forum on buses, subway reliability, and congestion pricing impacts in the district.",
    neighborhood: "fordham",
  },
  {
    id: "e3",
    dateLabel: "Mon, Apr 14",
    time: "5:30 PM",
    title: "Youth Safety Roundtable",
    type: "Community event",
    location: "Poe Park Visitor Center",
    details: "Community leaders, parents, and local advocates discuss safety priorities before committee hearings.",
    neighborhood: "mott-haven",
  },
  {
    id: "e4",
    dateLabel: "Wed, Apr 16",
    time: "6:00 PM",
    title: "Small Business Resource Clinic",
    type: "Community event",
    location: "Belmont Merchant Association",
    details: "Business owners get lease guidance, policy updates, and help preparing outreach to council offices.",
    neighborhood: "williamsburg",
  },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Espanol" },
  { code: "fr", label: "Francais" },
  { code: "hi", label: "Hindi" },
];

const UI_TEXT = {
  en: {
    billBriefing: "Bill briefing",
    aiSummary: "AI summary",
    interact: "Interact with the bill",
    createDraft: "Create a testimony draft",
    language: "Language",
    askPlaceholder: "Ask a question about this bill...",
    askAi: "Ask AI",
    aiAnswer: "AI answer",
    backToFeed: "Back to feed",
    helper:
      "Use the language selector to understand the bill, ask questions, and draft testimony in the language you prefer.",
    whatChanges: "What changes",
    whyMatters: "Why it matters here",
    keyTradeoff: "Key tradeoff",
    timeline: "Timeline and pressure point",
    supportButton: "Support this bill",
    opposeButton: "Oppose this bill",
    copyButton: "Copy and send to rep",
    copiedButton: "Copied to clipboard",
    prompts: [
      "What is the local impact?",
      "When is the next vote?",
      "What are the main tradeoffs?",
    ],
  },
  es: {
    billBriefing: "Resumen del proyecto",
    aiSummary: "Resumen con IA",
    interact: "Interactua con el proyecto",
    createDraft: "Crear borrador de testimonio",
    language: "Idioma",
    askPlaceholder: "Haz una pregunta sobre este proyecto...",
    askAi: "Preguntar a la IA",
    aiAnswer: "Respuesta de la IA",
    backToFeed: "Volver al feed",
    helper:
      "Usa el selector de idioma para entender el proyecto, hacer preguntas y redactar tu testimonio en el idioma que prefieras.",
    whatChanges: "Que cambia",
    whyMatters: "Por que importa aqui",
    keyTradeoff: "Punto de tension",
    timeline: "Calendario y momento clave",
    supportButton: "Apoyar este proyecto",
    opposeButton: "Oponerse a este proyecto",
    copyButton: "Copiar y enviar a tu representante",
    copiedButton: "Copiado",
    prompts: [
      "Cual es el impacto local?",
      "Cuando es la proxima votacion?",
      "Cuales son las principales tensiones?",
    ],
  },
  fr: {
    billBriefing: "Brief du projet de loi",
    aiSummary: "Resume IA",
    interact: "Interagir avec le projet",
    createDraft: "Creer un brouillon de temoignage",
    language: "Langue",
    askPlaceholder: "Posez une question sur ce projet...",
    askAi: "Demander a l'IA",
    aiAnswer: "Reponse de l'IA",
    backToFeed: "Retour au fil",
    helper:
      "Utilisez le selecteur de langue pour comprendre le projet, poser des questions et rediger un temoignage dans la langue souhaitee.",
    whatChanges: "Ce qui change",
    whyMatters: "Pourquoi c'est important ici",
    keyTradeoff: "Principal arbitrage",
    timeline: "Calendrier et point de pression",
    supportButton: "Soutenir ce projet",
    opposeButton: "S'opposer a ce projet",
    copyButton: "Copier et envoyer au representant",
    copiedButton: "Copie",
    prompts: [
      "Quel est l'impact local ?",
      "Quand a lieu le prochain vote ?",
      "Quels sont les principaux arbitrages ?",
    ],
  },
  hi: {
    billBriefing: "Bill briefing",
    aiSummary: "AI summary",
    interact: "Bill se interact karein",
    createDraft: "Testimony draft banayen",
    language: "Language",
    askPlaceholder: "Is bill ke baare mein sawal poochhein...",
    askAi: "AI se poochhein",
    aiAnswer: "AI jawab",
    backToFeed: "Feed par wapas",
    helper:
      "Language selector se bill ko samajhiye, sawal poochhiye, aur apni pasand ki bhasha mein testimony draft kijiye.",
    whatChanges: "Kya badlega",
    whyMatters: "Yahaan kyun maayne rakhta hai",
    keyTradeoff: "Mukhya tradeoff",
    timeline: "Timeline aur action point",
    supportButton: "Is bill ko support karein",
    opposeButton: "Is bill ka virodh karein",
    copyButton: "Copy karke representative ko bhejen",
    copiedButton: "Clipboard par copy ho gaya",
    prompts: [
      "Local impact kya hai?",
      "Agla vote kab hai?",
      "Main tradeoffs kya hain?",
    ],
  },
};

function getText(language) {
  return UI_TEXT[language] || UI_TEXT.en;
}

function genTestimony(bill, stance) {
  const action = stance === "support" ? "urge you to vote YES" : "urge you to vote NO";

  return `Dear ${REP.name},

I am a constituent in ${REP.district} writing to ${stance} the ${bill.title}.

${bill.impact}. This directly affects my community.

${
    stance === "support"
      ? `This legislation is a meaningful step forward. I ${action} on this bill.`
      : `I have serious concerns about this legislation. I ${action} on this bill.`
  }

Respectfully,
A constituent of ${REP.district}`;
}

function genTestimonyForLanguage(bill, stance, language) {
  if (language === "es") {
    const action = stance === "support" ? "vote SI" : "vote NO";
    return `Estimada ${REP.name},

Soy una persona constituyente de ${REP.district} y escribo para ${stance === "support" ? "apoyar" : "oponerme a"} ${bill.title}.

${bill.impact}. Esto afecta directamente a mi comunidad.

${
      stance === "support"
        ? `Esta medida representa una mejora concreta para el distrito. Le pido que ${action}.`
        : `Tengo preocupaciones serias sobre esta medida y su implementacion. Le pido que ${action}.`
    }

Atentamente,
Una persona constituyente de ${REP.district}`;
  }

  if (language === "fr") {
    const action = stance === "support" ? "votiez OUI" : "votiez NON";
    return `Chere ${REP.name},

Je suis une residente de ${REP.district} et je vous ecris pour ${stance === "support" ? "soutenir" : "m'opposer a"} ${bill.title}.

${bill.impact}. Cela affecte directement ma communaute.

${
      stance === "support"
        ? `Cette mesure apporterait un benefice concret au district. Je vous demande de ${action}.`
        : `J'ai de serieuses inquietudes concernant cette mesure et ses effets. Je vous demande de ${action}.`
    }

Cordialement,
Une residente de ${REP.district}`;
  }

  if (language === "hi") {
    return `Dear ${REP.name},

Main ${REP.district} ki constituent hoon aur ${bill.title} ko ${stance === "support" ? "support" : "oppose"} karne ke liye likh rahi hoon.

${bill.impact}. Iska seedha asar meri community par padega.

${
      stance === "support"
        ? "Yeh bill hamare district ke liye practical aur meaningful step hai. Kripya iske paksh mein vote kijiye."
        : "Mujhe is bill ke design aur implementation ko lekar gambhir chinta hai. Kripya iske virodh mein vote kijiye."
    }

Sincerely,
${REP.district} ki ek constituent`;
  }

  return genTestimony(bill, stance);
}

function genBillSummary(bill, language) {
  const text = getText(language);

  if (language === "es") {
    return [
      {
        label: text.whatChanges,
        text: `${bill.title} ${bill.summary.charAt(0).toLowerCase()}${bill.summary.slice(1)} No es solo una idea general: cambia financiamiento, reglas o mecanismos de ejecucion que la ciudad tendria que aplicar de manera concreta.`,
      },
      {
        label: text.whyMatters,
        text: `${bill.impact}. En este distrito, eso se traduciria en efectos reales sobre rutinas diarias, acceso a servicios, costos o recursos del vecindario.`,
      },
      {
        label: text.keyTradeoff,
        text: `${bill.support}% de las personas seguidas en este feed apoya la medida, mientras ${REP.name} actualmente esta ${bill.repPosition === "Supporting" ? "a favor de" : bill.repPosition === "Opposed" ? "en contra de" : "sin definir sobre"} ella. La discusion principal es si el beneficio esperado justifica los costos o dificultades de implementacion.`,
      },
      {
        label: text.timeline,
        text: `${bill.statusLabel}. El siguiente momento clave es ${bill.hearing}. Este es el periodo en el que todavia vale la pena aprender, preguntar y contactar a tu representante.`,
      },
    ];
  }

  if (language === "fr") {
    return [
      {
        label: text.whatChanges,
        text: `${bill.title} ${bill.summary.charAt(0).toLowerCase()}${bill.summary.slice(1)} Ce n'est pas seulement une orientation politique: cela modifie concretement le financement, les regles ou la mise en oeuvre.`,
      },
      {
        label: text.whyMatters,
        text: `${bill.impact}. Dans ce district, l'effet serait visible dans la vie quotidienne, l'acces aux services, les couts locaux ou les ressources de quartier.`,
      },
      {
        label: text.keyTradeoff,
        text: `${bill.support}% des voisins suivis dans ce feed soutiennent le projet, tandis que ${REP.name} est actuellement ${bill.repPosition === "Supporting" ? "favorable a" : bill.repPosition === "Opposed" ? "opposee a" : "indecise sur"} celui-ci. Le debat porte surtout sur le rapport entre benefice public et cout politique ou operationnel.`,
      },
      {
        label: text.timeline,
        text: `${bill.statusLabel}. La prochaine etape publique est ${bill.hearing}. C'est maintenant qu'il faut comprendre le texte et contacter le representant avant que la position se fige.`,
      },
    ];
  }

  if (language === "hi") {
    return [
      {
        label: text.whatChanges,
        text: `${bill.title} ka matlab hai ki ${bill.summary.charAt(0).toLowerCase()}${bill.summary.slice(1)} Yeh sirf broad policy signal nahin hai; isse funding, rules ya implementation process mein real change aayega.`,
      },
      {
        label: text.whyMatters,
        text: `${bill.impact}. District level par iska asar rozmarra ki zindagi, service access, kharch, ya local resources par dikh sakta hai.`,
      },
      {
        label: text.keyTradeoff,
        text: `${bill.support}% neighbors is bill ko support kar rahe hain, jabki ${REP.name} abhi ${bill.repPosition.toLowerCase()} hain. Main sawal yeh hai ki expected public benefit implementation ya budget concerns se zyada strong hai ya nahin.`,
      },
      {
        label: text.timeline,
        text: `${bill.statusLabel}. Agla public milestone ${bill.hearing} hai. Isi window mein bill samajhna, sawal poochhna aur representative ko testimony bhejna sabse effective rahega.`,
      },
    ];
  }

  return [
    {
      label: text.whatChanges,
      text: `${bill.title} would ${bill.summary.charAt(0).toLowerCase()}${bill.summary.slice(1)} This is not just a statement of intent: it changes funding, rules, or enforcement in a way that agencies would need to implement immediately after approval.`,
    },
    {
      label: text.whyMatters,
      text: `${bill.impact}. In this district, that means residents would likely feel the effect in daily routines, service access, travel time, housing costs, or neighborhood resources rather than only in abstract citywide numbers.`,
    },
    {
      label: text.keyTradeoff,
      text: `${bill.support}% of neighbors in this feed support the bill, while ${REP.name} is currently ${bill.repPosition.toLowerCase()} this bill. The core debate is whether the expected public benefit is worth the budget, operational, or political tradeoffs that opponents are likely raising.`,
    },
    {
      label: text.timeline,
      text: `${bill.statusLabel}. The next public milestone is ${bill.hearing}. If someone wants to shape the outcome, this is the window to understand the bill, pressure the representative, and send testimony before the decision hardens.`,
    },
  ];
}

function answerBillQuestion(bill, question, language) {
  const q = question.trim().toLowerCase();
  const positionText =
    bill.repPosition === "Supporting" ? "supporting" : bill.repPosition === "Opposed" ? "opposing" : "undecided on";

  if (language === "es") {
    if (!q) return "Pregunta por impacto local, calendario, postura de tu representante o principales tensiones.";
    if (q.includes("impact") || q.includes("local") || q.includes("distr")) {
      return `${bill.impact}. Eso significa que el efecto del proyecto se sentiria en tu distrito de manera concreta, no solo en estadisticas generales de la ciudad.`;
    }
    if (q.includes("cuando") || q.includes("vot") || q.includes("audiencia") || q.includes("proxim")) {
      return `El siguiente paso es: ${bill.statusLabel.toLowerCase()}. El momento publico listado es ${bill.hearing}, asi que este es el mejor periodo para entender el texto y contactar a tu representante.`;
    }
    if (q.includes("tension") || q.includes("tradeoff") || q.includes("pros") || q.includes("cons")) {
      return `El principal debate es si el beneficio local descrito en "${bill.impact}" compensa los costos, el ritmo de implementacion o las objeciones politicas que puedan surgir.`;
    }
    return `${bill.summary} En terminos practicos, la pregunta clave para tu distrito es si ese cambio mejorara resultados locales con suficiente rapidez y sin costos no deseados.`;
  }

  if (language === "fr") {
    if (!q) return "Posez une question sur l'impact local, le calendrier, la position du representant ou les arbitrages.";
    if (q.includes("impact") || q.includes("local") || q.includes("district")) {
      return `${bill.impact}. Autrement dit, l'effet du projet serait concret pour les residents du district et pas seulement theorique a l'echelle de la ville.`;
    }
    if (q.includes("quand") || q.includes("vote") || q.includes("audience") || q.includes("prochain")) {
      return `La prochaine etape est ${bill.statusLabel.toLowerCase()}. L'echeance publique indiquee est ${bill.hearing}, donc c'est maintenant qu'il faut agir si vous voulez influencer le resultat.`;
    }
    if (q.includes("arbitrage") || q.includes("tradeoff") || q.includes("pros") || q.includes("cons")) {
      return `Le principal arbitrage est de savoir si le benefice public attendu, notamment ${bill.impact}, justifie les couts ou les contraintes de mise en oeuvre.`;
    }
    return `${bill.summary} Pour ce district, la bonne question est de savoir comment cette mesure changerait concretement la vie locale et a quel rythme.`;
  }

  if (language === "hi") {
    if (!q) return "Local impact, timeline, representative ki position, ya tradeoffs ke baare mein poochhiye.";
    if (q.includes("impact") || q.includes("local") || q.includes("district")) {
      return `${bill.impact}. Iska matlab hai ki bill ka effect district mein directly mehsoos hoga, sirf city-level policy language tak seemit nahin rahega.`;
    }
    if (q.includes("kab") || q.includes("vote") || q.includes("hearing") || q.includes("next")) {
      return `Next action ${bill.statusLabel.toLowerCase()} hai. Public milestone ${bill.hearing} hai, isliye abhi sawal poochhne aur representative tak pahunchne ka sahi time hai.`;
    }
    if (q.includes("tradeoff") || q.includes("pros") || q.includes("cons")) {
      return `Main tradeoff yeh hai ki expected public benefit, especially ${bill.impact}, implementation complexity ya budget concerns se zyada valuable hai ya nahin.`;
    }
    return `${bill.summary} District ke liye practical sawal yeh hai ki yeh change local outcomes ko kitna improve karega aur kis cost par.`;
  }

  if (!q) {
    return "Ask about local impact, timing, community support, or your representative's position.";
  }

  if (q.includes("impact") || q.includes("local") || q.includes("district") || q.includes("community")) {
    return `${bill.impact}. That means the bill is likely to show up in day-to-day life here, not just as a citywide policy headline.`;
  }

  if (q.includes("when") || q.includes("hearing") || q.includes("vote") || q.includes("next")) {
    return `Next major action: ${bill.statusLabel.toLowerCase()}. The listed hearing or vote is ${bill.hearing}, so this is the window to review the bill and influence your representative before the outcome firms up.`;
  }

  if (q.includes("rep") || q.includes("representative") || q.includes("council member") || q.includes("position")) {
    return `${REP.name} is currently ${positionText} this bill. If you want to influence that position, the testimony draft panel on the right is the fastest next step.`;
  }

  if (q.includes("tradeoff") || q.includes("pros") || q.includes("cons") || q.includes("support") || q.includes("oppose")) {
    return `The main tradeoff is whether the public benefit described here, especially ${bill.impact}, outweighs implementation cost, political resistance, or unintended side effects. That is usually the strongest frame for either supporting or opposing testimony.`;
  }

  return `${bill.summary} For your district, the practical question is whether that policy change creates visible local benefit quickly enough to justify the tradeoffs.`;
}

function getBillDetails(bill) {
  const base = {
    introId: `Int ${bill.id.replace("b", "0")}${bill.id.length < 3 ? "23" : "24"}-2026`,
    introductionDate: "2026-03-15",
    nextEventDate: "2026-04-20",
    committee:
      bill.id === "b5"
        ? "Committee on Environmental Protection"
        : bill.id === "b6"
          ? "Committee on Education"
          : bill.id === "b1" || bill.id === "b2"
            ? "Committee on Transportation and Infrastructure"
            : "Committee on General Welfare",
    residentsAffected:
      bill.id === "b5"
        ? "8,800,000 residents"
        : bill.id === "b7"
          ? "60,000 seniors"
          : bill.id === "b6"
            ? "48,000 students"
            : "1,200,000 residents",
    impactScore:
      bill.id === "b5" ? "8.5/10" : bill.id === "b7" ? "8.9/10" : bill.id === "b6" ? "8.7/10" : "7.9/10",
    benefits:
      bill.id === "b5"
        ? "Children, park workers, and local wildlife."
        : bill.id === "b7"
          ? "Older adults, caregivers, and local service providers."
          : bill.id === "b6"
            ? "Families with young children, schools, and educators."
            : "Residents who rely on public services affected by this bill.",
    pays:
      bill.id === "b5"
        ? "City agencies transitioning to safer alternatives."
        : bill.id === "b7"
          ? "City budget reallocations and program administrators."
          : bill.id === "b6"
            ? "City and state education budgets."
            : "City agencies responsible for implementation.",
    impactReason:
      bill.id === "b5"
        ? "City parks and public spaces are used by millions of residents each year, so exposure and enforcement decisions scale quickly."
        : bill.id === "b7"
          ? "A relatively small budget change would ripple through meal access, wellness programming, and social support for older residents."
          : bill.id === "b6"
            ? "Education spending changes affect classroom capacity, enrollment access, and school staffing across multiple neighborhoods."
            : bill.impact,
    testimonies: [
      {
        name: "Jane Doe",
        date: "4/8/2026",
        stance: "SUPPORT",
        body:
          bill.id === "b5"
            ? "As a parent, I am deeply concerned about chemical exposure in our parks. This bill is a necessary step to protect children's health and make city spaces safer."
            : `As a constituent, I see how ${bill.impact.toLowerCase()}. This bill deserves serious public attention before the next vote.`,
      },
    ],
    jargon: [
      {
        term: "Administrative Code",
        definition: "The collection of laws that govern how New York City agencies operate and enforce rules.",
      },
      {
        term:
          bill.id === "b5"
            ? "Synthetic Pesticides"
            : bill.id === "b6"
              ? "Per-Pupil Funding"
              : bill.id === "b7"
                ? "Program Appropriation"
                : "Implementation Rule",
        definition:
          bill.id === "b5"
            ? "Man-made chemicals used to kill weeds or pests that can also raise public health and environmental concerns."
            : bill.id === "b6"
              ? "The amount of public funding allocated for each student served by the school system."
              : bill.id === "b7"
                ? "A line in the city budget that reserves money for a specific public program or service."
                : "The formal guidance agencies use to put a passed bill into practice.",
      },
    ],
  };

  return base;
}

function CivicLogo({ small = false }) {
  return (
    <div className={`brand-lockup ${small ? "small" : ""}`}>
      <div className="brand-mark">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="7" r="3" stroke="white" strokeWidth="1.8" />
          <path
            d="M8 2C5.24 2 3 4.24 3 7c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z"
            stroke="white"
            strokeWidth="1.6"
            fill="none"
          />
        </svg>
      </div>
      <span>CivicPulse</span>
    </div>
  );
}

function Landing({ onEnter }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return undefined;

    const width = el.offsetWidth || 560;
    const height = 300;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");

    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    el.appendChild(svg);

    const make = (tag, attrs) => {
      const node = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
      return node;
    };

    svg.appendChild(make("rect", { width, height, fill: "#efe4d2" }));

    for (let x = 0; x < width; x += 28) {
      svg.appendChild(
        make("line", {
          x1: x,
          y1: 0,
          x2: x,
          y2: height,
          stroke: "rgba(120, 94, 66, 0.08)",
          "stroke-width": "0.5",
        }),
      );
    }

    for (let y = 0; y < height; y += 28) {
      svg.appendChild(
        make("line", {
          x1: 0,
          y1: y,
          x2: width,
          y2: y,
          stroke: "rgba(120, 94, 66, 0.08)",
          "stroke-width": "0.5",
        }),
      );
    }

    [
      [0.1, 0.5, 0.9, 0.48],
      [0.25, 0, 0.27, 1],
      [0.52, 0, 0.5, 1],
      [0.75, 0, 0.77, 1],
      [0.3, 0.3, 0.72, 0.33],
      [0.15, 0.68, 0.85, 0.7],
    ].forEach(([x1, y1, x2, y2]) => {
      svg.appendChild(
        make("line", {
          x1: x1 * width,
          y1: y1 * height,
          x2: x2 * width,
          y2: y2 * height,
          stroke: "rgba(88, 60, 39, 0.18)",
          "stroke-width": "6",
        }),
      );
      svg.appendChild(
        make("line", {
          x1: x1 * width,
          y1: y1 * height,
          x2: x2 * width,
          y2: y2 * height,
          stroke: "rgba(255,248,236,0.75)",
          "stroke-width": "1",
        }),
      );
    });

    const pins = [
      { x: 0.33, y: 0.28, c: "#9b5536", l: "LIVE" },
      { x: 0.57, y: 0.2, c: "#9b5536", l: "LIVE" },
      { x: 0.2, y: 0.5, c: "#b88c4a", l: "891" },
      { x: 0.65, y: 0.38, c: "#b88c4a", l: "456" },
      { x: 0.42, y: 0.6, c: "#b88c4a", l: "312" },
      { x: 0.78, y: 0.52, c: "#5f7e5d", l: "OK" },
      { x: 0.18, y: 0.72, c: "#5f7e5d", l: "OK" },
      { x: 0.6, y: 0.68, c: "#b88c4a", l: "189" },
    ];

    pins.forEach(({ x, y, c, l }) => {
      const px = x * width;
      const py = y * height;

      if (c === "#9b5536") {
        svg.appendChild(make("circle", { cx: px, cy: py, r: "18", fill: c, opacity: "0.14" }));
      }

      const group = make("g", {});
      group.appendChild(make("rect", { x: px - 16, y: py - 28, width: 32, height: 20, rx: "10", fill: c }));
      group.appendChild(make("polygon", { points: `${px - 4},${py - 10} ${px + 4},${py - 10} ${px},${py - 3}`, fill: c }));
      const text = make("text", {
        x: px,
        y: py - 14,
        "text-anchor": "middle",
        "dominant-baseline": "middle",
        fill: "white",
        "font-size": l === "LIVE" ? "7.5" : "9",
        "font-weight": "700",
        "font-family": "Public Sans, sans-serif",
      });
      text.textContent = l;
      group.appendChild(text);
      svg.appendChild(group);
    });

    svg.appendChild(make("circle", { cx: width * 0.47, cy: height * 0.5, r: "7", fill: "#6f8a91" }));
    svg.appendChild(
      make("circle", {
        cx: width * 0.47,
        cy: height * 0.5,
        r: "14",
        fill: "none",
        stroke: "#6f8a91",
        "stroke-width": "1.6",
        opacity: "0.35",
      }),
    );

    return () => {
      if (el.contains(svg)) {
        el.removeChild(svg);
      }
    };
  }, []);

  return (
    <div className="landing-shell">
      <header className="landing-topbar">
        <CivicLogo small />
        <button className="btn btn-primary" onClick={onEnter}>
          Get started
        </button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Launching in NYC - April 2026</div>
          <h1>
            Your city is making decisions <span>right now.</span>
            <br />
            Are you there?
          </h1>
          <p>
            Real-time civic intelligence for your neighborhood. Know what is being
            voted on, see what is live nearby, and make your voice heard before the
            gavel drops.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={onEnter}>
              See your district
            </button>
            <button className="btn btn-secondary" onClick={onEnter}>
              Watch demo
            </button>
          </div>
        </div>

        <div className="hero-map-card">
          <div className="map-overlay-copy">
            <span>District 14 pulse</span>
            <strong>4 votes happening now</strong>
          </div>
          <div ref={mapRef} className="hero-map" />
        </div>
      </section>

      <section className="stats-grid">
        {[
          ["847K", "NYC residents affected"],
          ["23", "Active bills today"],
          ["4", "Votes happening now"],
          ["1-tap", "Testimony sent"],
        ].map(([value, label]) => (
          <article key={label} className="stat-card">
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="section-label">What is happening now</div>
          <div className="timeline">
            {[
              [
                "Rent Stabilization Expansion Act",
                "Committee vote - 11AM City Council Chambers",
                "#9b5536",
                "891",
              ],
              [
                "Mental Health Crisis Response Reform",
                "Vote this week - 1PM Health Committee",
                "#9b5536",
                "456",
              ],
              ["Bus Rapid Transit Corridor Bill", "Hearing April 15 - DOT Office", "#b88c4a", "189"],
            ].map(([name, meta, color, count]) => (
              <div className="timeline-row" key={name}>
                <span className="timeline-dot" style={{ background: color }} />
                <div>
                  <h3>{name}</h3>
                  <p>{meta}</p>
                </div>
                <span className="timeline-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-label">How it works</div>
          <div className="steps-grid">
            {[
              ["01", "Enter address", "Find your district, ward, and local representatives."],
              ["02", "Pick issues", "Tailor the feed to what matters in your neighborhood."],
              ["03", "See what is live", "Watch map pins pulse when a vote or hearing is active."],
              ["04", "Send testimony", "Generate a letter fast and copy it into action."],
            ].map(([num, title, body]) => (
              <article key={num} className="step-card">
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-panel">
        <div>
          <div className="section-label">Ready to demo it</div>
          <h2>Your neighborhood needs you present.</h2>
          <p>Step into the product flow and explore the district dashboard.</p>
        </div>
        <button className="btn btn-light" onClick={onEnter}>
          Open app
        </button>
      </section>
    </div>
  );
}

function Pin({ bill, onClick, selected }) {
  const color = STATUS_COLORS[bill.status].dot;
  const label = bill.status === "LIVE" ? "LIVE" : String(bill.neighbors);
  const pos = PIN_COORDS[bill.id] || { x: 50, y: 50 };

  return (
    <div
      className={`map-pin ${selected ? "selected" : ""}`}
      onClick={() => onClick(bill)}
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      <div className="map-pin-label" style={{ background: color }}>
        {label}
      </div>
      <div className="map-pin-tip" style={{ borderTopColor: color }} />
    </div>
  );
}

function MapView({ feed, onTestify, onViewFeed }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState(null);
  const filtered = filter ? feed.filter((bill) => bill.status === filter) : feed;

  return (
    <div className="map-view">
      <div className="district-map">
        <div className="district-map-bg">
          <svg width="100%" height="100%" viewBox="0 0 400 360" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 15 }, (_, i) => (
              <line
                key={`v${i}`}
                x1={i * 28}
                y1={0}
                x2={i * 28}
                y2={360}
                stroke="rgba(120, 94, 66, 0.08)"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 14 }, (_, i) => (
              <line
                key={`h${i}`}
                x1={0}
                y1={i * 28}
                x2={400}
                y2={i * 28}
                stroke="rgba(120, 94, 66, 0.08)"
                strokeWidth="0.5"
              />
            ))}
            {[
              [40, 180, 360, 175],
              [100, 0, 108, 360],
              [200, 0, 196, 360],
              [300, 0, 308, 360],
              [120, 120, 288, 132],
              [60, 270, 340, 278],
            ].map(([x1, y1, x2, y2], i) => (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(88, 60, 39, 0.18)" strokeWidth="7" />
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,248,236,0.72)" strokeWidth="1" />
              </g>
            ))}
          </svg>
        </div>

        <div className="map-filter-row">
          {[null, "LIVE", "UPCOMING"].map((status) => (
            <button
              key={status ?? "all"}
              className={`chip ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(status)}
            >
              {status === "LIVE" ? "Live" : status === "UPCOMING" ? "Upcoming" : "All"}
            </button>
          ))}
        </div>

        <div className="district-badge">District 14 - Bronx</div>

        <div className="map-pin-layer">
          {filtered.map((bill) => (
            <Pin
              key={bill.id}
              bill={bill}
              selected={selected?.id === bill.id}
              onClick={(nextBill) => setSelected(selected?.id === nextBill.id ? null : nextBill)}
            />
          ))}
          <div className="you-are-here" />
        </div>

        {selected && (
          <div className="map-bottom-sheet">
            <div className="map-sheet-top">
              <span
                className="status-pill"
                style={{
                  background: STATUS_COLORS[selected.status].bg,
                  color: STATUS_COLORS[selected.status].text,
                }}
              >
                {selected.statusLabel}
              </span>
              <button className="icon-button" onClick={() => setSelected(null)}>
                x
              </button>
            </div>
            <h3>{selected.title}</h3>
            <p>{selected.impact}</p>
            <div className="split-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  onTestify(selected);
                  setSelected(null);
                }}
              >
                Open briefing
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  onViewFeed();
                  setSelected(null);
                }}
              >
                View bill
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="panel subtle">
        <div className="section-label">Active in your district</div>
        <div className="mini-list">
          {feed.slice(0, 4).map((bill) => (
            <button key={bill.id} className="mini-list-row" onClick={() => setSelected(bill)}>
              <span className="timeline-dot" style={{ background: STATUS_COLORS[bill.status].dot }} />
              <div>
                <strong>{bill.title}</strong>
                <p>{bill.hearing}</p>
              </div>
              <span>{bill.neighbors}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventsView({ feed }) {
  const hearingEvents = feed.map((bill) => {
    const [dateLabel, rest = ""] = bill.hearing.split(" - ");
    const timeMatch = dateLabel.match(/(\d{1,2}(?::\d{2})?\s?(?:AM|PM))/i);

    return {
      id: `hearing-${bill.id}`,
      dateLabel,
      time: timeMatch ? timeMatch[1].toUpperCase() : "TBD",
      title: bill.title,
      type: bill.status === "LIVE" ? "Hearing or vote" : "Upcoming hearing",
      location: rest || "Committee chamber",
      details: bill.impact,
      color: STATUS_COLORS[bill.status].dot,
    };
  });

  const events = [...hearingEvents, ...COMMUNITY_EVENTS].sort((a, b) => {
    const order = {
      "Today, Apr 8": 0,
      "April 9, 3PM": 1,
      "April 9, 1PM": 1,
      "Thu, Apr 10": 2,
      "April 10, 10AM": 2,
      "April 10, 2PM": 2,
      "April 12, 2PM": 3,
      "Mon, Apr 14": 4,
      "April 14, 2PM": 4,
      "April 15, 10AM": 5,
      "Wed, Apr 16": 6,
      "April 16, 11AM": 6,
      "April 18, 1PM": 7,
    };

    return (order[a.dateLabel] ?? 99) - (order[b.dateLabel] ?? 99);
  });

  const grouped = events.reduce((acc, event) => {
    const key = event.dateLabel.startsWith("April")
      ? event.dateLabel.replace(/,?\s+\d{1,2}(?::\d{2})?\s?(AM|PM)$/i, "")
      : event.dateLabel;
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <section className="events-view">
      <div className="panel subtle">
        <div className="section-label">District calendar</div>
        <h3>Hearings, votes, and community events</h3>
        <p className="helper">
          One place to track official bill activity and neighborhood events that shape local action.
        </p>
      </div>

      <section className="panel events-panel">
        {Object.entries(grouped).map(([day, items]) => (
          <div className="event-day" key={day}>
            <div className="event-day-label">{day}</div>
            <div className="event-list">
              {items.map((event) => (
                <article className="event-card" key={event.id}>
                  <span className="event-accent" style={{ background: event.color || "#7d8f95" }} />
                  <div className="event-time">{event.time}</div>
                  <div className="event-copy">
                    <div className="event-meta">
                      <span className="status-pill event-type">{event.type}</span>
                      <span>{event.location}</span>
                    </div>
                    <h3>{event.title}</h3>
                    <p>{event.details}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}

function NeighborhoodMapPanel({
  selectedNeighborhood,
  setSelectedNeighborhood,
  neighborhoodZip,
  setNeighborhoodZip,
  filteredCount,
  localEvents,
}) {
  const activeNeighborhood = NEIGHBORHOODS.find((place) => place.id === selectedNeighborhood);

  const handleZipSubmit = (event) => {
    event.preventDefault();
    const match = ZIP_TO_NEIGHBORHOOD[neighborhoodZip.trim()];
    if (match) {
      setSelectedNeighborhood(match);
    }
  };

  return (
    <aside className="feed-sidebar">
      <section className="panel subtle neighborhood-panel">
        <div className="section-label">Neighborhood map</div>
        <h3>Select a neighborhood</h3>
        <p className="helper">
          Choose a part of New York City to filter the bills and upcoming events shown in your feed.
        </p>

        <form className="zip-search" onSubmit={handleZipSubmit}>
          <input
            type="text"
            value={neighborhoodZip}
            maxLength={5}
            placeholder="Enter ZIP code, e.g. 10458"
            onChange={(event) => setNeighborhoodZip(event.target.value.replace(/\D/g, ""))}
          />
          <button className="btn btn-secondary" type="submit">
            Find
          </button>
        </form>

        <div className="nyc-map-card">
          <svg viewBox="0 0 400 400" className="nyc-map" aria-label="NYC neighborhood map">
            {NEIGHBORHOODS.map((place) => {
              const active = selectedNeighborhood === place.id;
              return (
                <g key={place.id}>
                  <path
                    d={place.path}
                    className={active ? "active" : ""}
                    onClick={() => {
                      setSelectedNeighborhood(place.id);
                      setNeighborhoodZip(place.zipCodes[0]);
                    }}
                  />
                  <text x={place.labelX} y={place.labelY} textAnchor="middle">
                    {place.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="neighborhood-chip-row">
          {NEIGHBORHOODS.map((place) => (
            <button
              key={place.id}
              className={`chip ${selectedNeighborhood === place.id ? "active" : ""}`}
              onClick={() => {
                setSelectedNeighborhood(place.id);
                setNeighborhoodZip(place.zipCodes[0]);
              }}
            >
              {place.label}
            </button>
          ))}
          {selectedNeighborhood && (
            <button
              className="chip"
              onClick={() => {
                setSelectedNeighborhood(null);
                setNeighborhoodZip("");
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="neighborhood-summary">
          <strong>{activeNeighborhood ? activeNeighborhood.label : "All neighborhoods"}</strong>
          <span>
            {activeNeighborhood
              ? `${activeNeighborhood.borough} selected. ${filteredCount} bills currently match this area.`
              : `Showing all tracked bills across the city. ${filteredCount} bills currently in your feed.`}
          </span>
        </div>
      </section>

      <section className="panel subtle neighborhood-events">
        <div className="section-label">Local events</div>
        <div className="mini-list">
          {localEvents.length ? (
            localEvents.map((event) => (
              <article key={event.id} className="mini-static-row neighborhood-event-row">
                <span className="timeline-dot" style={{ background: event.color || "#7d8f95" }} />
                <div>
                  <strong>{event.title}</strong>
                  <p>
                    {event.time} • {event.location}
                  </p>
                </div>
                <span>{event.dateLabel}</span>
              </article>
            ))
          ) : (
            <p className="muted">No nearby events in this neighborhood yet.</p>
          )}
        </div>
      </section>
    </aside>
  );
}

function DashboardShell({
  address,
  selectedTopics,
  onOpenTestimony,
  testimonyBill,
  testimony,
  setTestimony,
  copied,
  setCopied,
  votes,
  setVotes,
  activeTab,
  setActiveTab,
}) {
  const [filterTopic, setFilterTopic] = useState(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  const [neighborhoodZip, setNeighborhoodZip] = useState("");
  const [billQuestion, setBillQuestion] = useState("");
  const [billAnswer, setBillAnswer] = useState("");
  const [language, setLanguage] = useState("en");
  const text = getText(language);

  const getFeed = () => {
    const topics = filterTopic
      ? [filterTopic]
      : selectedTopics.length
        ? selectedTopics
        : Object.keys(BILLS);
    return topics.flatMap((topic) => BILLS[topic] || []);
  };

  const feed = getFeed().filter(
    (bill) => !selectedNeighborhood || (BILL_NEIGHBORHOODS[bill.id] || []).includes(selectedNeighborhood),
  );
  const liveBill = feed.find((bill) => bill.status === "LIVE");
  const billDetails = testimonyBill ? getBillDetails(testimonyBill) : null;
  const feedEvents = [
    ...feed.map((bill) => ({
      id: `feed-${bill.id}`,
      title: bill.title,
      time: bill.hearing.split(" - ")[0],
      dateLabel: bill.hearing.split(" - ")[0],
      location: bill.hearing.split(" - ")[1] || "Committee chamber",
      color: STATUS_COLORS[bill.status].dot,
      neighborhood: (BILL_NEIGHBORHOODS[bill.id] || [])[0] || null,
    })),
    ...COMMUNITY_EVENTS.map((event) => ({ ...event, color: "#7d8f95" })),
  ].filter((event) => !selectedNeighborhood || event.neighborhood === selectedNeighborhood);

  useEffect(() => {
    if (!testimonyBill) return;
    setBillQuestion("");
    setBillAnswer(answerBillQuestion(testimonyBill, getText(language).prompts[0], language));
    setTestimony(genTestimonyForLanguage(testimonyBill, "support", language));
  }, [language, setTestimony, testimonyBill]);

  const askAboutBill = (nextQuestion) => {
    if (!testimonyBill) return;
    const prompt = nextQuestion.trim();
    if (!prompt) return;
    setBillQuestion(prompt);
    setBillAnswer(answerBillQuestion(testimonyBill, prompt, language));
  };

  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <div>
          <CivicLogo small />
          <p>{address || "Demo address"} - District 14, Bronx</p>
        </div>
        <div className="signal-card">
          <span>Live civic signal</span>
          <strong>4 active actions</strong>
        </div>
      </header>

      <nav className="tabs">
        {["feed", "map", "rep", "calendar", "testimony"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "feed"
              ? "My Feed"
              : tab === "map"
                ? "Map"
              : tab === "rep"
                  ? "My Rep"
                  : tab === "calendar"
                    ? "Events"
                    : "Bill Briefing"}
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {activeTab === "feed" && (
          <section className="feed-layout">
            <div>
              {liveBill && (
                <div className="alert-card">
                  <div className="live-dot" />
                  <div>
                    <span>Live now - {liveBill.hearing}</span>
                    <strong>{liveBill.title} is active in your district.</strong>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => onOpenTestimony(liveBill, "support")}
                  >
                    Open bill briefing
                  </button>
                </div>
              )}

              <div className="topic-row">
                <button
                  className={`chip ${filterTopic === null ? "active" : ""}`}
                  onClick={() => setFilterTopic(null)}
                >
                  All
                </button>
                {TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    className={`chip ${filterTopic === topic.id ? "active" : ""}`}
                    onClick={() => setFilterTopic(filterTopic === topic.id ? null : topic.id)}
                  >
                    {topic.icon} {topic.label}
                  </button>
                ))}
              </div>

              <div className="feed-list">
                {feed.map((bill) => {
                  const uv = votes[bill.id];
                  const sc = STATUS_COLORS[bill.status];
                  const placeNames = (BILL_NEIGHBORHOODS[bill.id] || [])
                    .map((id) => NEIGHBORHOODS.find((place) => place.id === id)?.label)
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <article className="bill-card" key={bill.id}>
                      <div className="bill-head">
                        <span className="status-pill" style={{ background: sc.bg, color: sc.text }}>
                          {bill.statusLabel}
                        </span>
                        <span className="muted">{bill.neighbors} neighbors</span>
                      </div>

                      <h3>{bill.title}</h3>
                      <p className="summary">{bill.summary}</p>
                      <div className="impact-box">{bill.impact}</div>
                      <p className="helper">
                        Neighborhoods: {placeNames || "Citywide"}
                      </p>

                      <div className="bill-meta">
                        <span>
                          Rep position:{" "}
                          <strong
                            className={
                              bill.repPosition === "Supporting"
                                ? "support"
                                : bill.repPosition === "Opposed"
                                  ? "oppose"
                                  : "undecided"
                            }
                          >
                            {bill.repPosition}
                          </strong>
                        </span>
                        <span>{bill.support}% community support</span>
                      </div>

                      <div className="support-bar">
                        <span style={{ width: `${bill.support}%` }} />
                      </div>

                      <div className="split-actions">
                        <button
                          className={`vote-btn ${uv === "support" ? "selected support" : ""}`}
                          onClick={() => !uv && setVotes((prev) => ({ ...prev, [bill.id]: "support" }))}
                        >
                          {uv === "support" ? "Supporting" : "Support"}
                        </button>
                        <button
                          className={`vote-btn ${uv === "oppose" ? "selected oppose" : ""}`}
                          onClick={() => !uv && setVotes((prev) => ({ ...prev, [bill.id]: "oppose" }))}
                        >
                          {uv === "oppose" ? "Opposed" : "Oppose"}
                        </button>
                        <button className="btn btn-secondary" onClick={() => onOpenTestimony(bill, uv || "support")}>
                          Review bill
                        </button>
                      </div>
                    </article>
                  );
                })}
                {!feed.length && (
                  <div className="panel subtle">
                    <div className="section-label">No matching bills</div>
                    <p className="helper">
                      Try a different topic or clear the neighborhood selection to widen the feed.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <NeighborhoodMapPanel
              selectedNeighborhood={selectedNeighborhood}
              setSelectedNeighborhood={setSelectedNeighborhood}
              neighborhoodZip={neighborhoodZip}
              setNeighborhoodZip={setNeighborhoodZip}
              filteredCount={feed.length}
              localEvents={feedEvents.slice(0, 5)}
            />
          </section>
        )}

        {activeTab === "map" && (
          <MapView
            feed={feed}
            onTestify={(bill) => onOpenTestimony(bill, "support")}
            onViewFeed={() => setActiveTab("feed")}
          />
        )}

        {activeTab === "rep" && (
          <section className="two-column">
            <div className="panel">
              <div className="rep-card">
                <div className="rep-avatar">PS</div>
                <div>
                  <h3>{REP.name}</h3>
                  <p>
                    {REP.district} - {REP.party}
                  </p>
                </div>
              </div>

              <div className="alignment-card">
                <span>Alignment with your issues</span>
                <div className="alignment-row">
                  <div className="support-bar">
                    <span style={{ width: `${REP.alignment}%` }} />
                  </div>
                  <strong>{REP.alignment}%</strong>
                </div>
              </div>

              <button className="btn btn-secondary">Contact Representative</button>
            </div>

            <div className="panel">
              <div className="section-label">Recent positions</div>
              <div className="mini-list">
                {feed.slice(0, 5).map((bill) => (
                  <div key={bill.id} className="mini-static-row">
                    <span className="timeline-dot" style={{ background: STATUS_COLORS[bill.status].dot }} />
                    <div>
                      <strong>{bill.title}</strong>
                      <p>{bill.repPosition}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "calendar" && (
          <EventsView feed={feed} />
        )}

        {activeTab === "testimony" && testimonyBill && (
          <section className="panel testimony-panel">
            <div className="testimony-head">
              <div>
                <div className="section-label">{text.billBriefing}</div>
                <h3>{testimonyBill.title}</h3>
              </div>
              <div className="briefing-controls">
                <label className="language-control">
                  <span>{text.language}</span>
                  <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                    {LANGUAGES.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              <button className="btn btn-secondary" onClick={() => setActiveTab("feed")}>
                {text.backToFeed}
              </button>
              </div>
            </div>

            <p className="helper">{text.helper}</p>

            <div className="briefing-layout">
              <div className="briefing-left">
                <div className="brief-section">
                  <div className="bill-hero-card">
                    <div className="section-label">Introduction</div>
                    <div className="bill-hero-top">
                      <div>
                        <strong>{billDetails?.introId}</strong>
                        <h4>{testimonyBill.title}</h4>
                      </div>
                      <span className="status-pill" style={{ background: STATUS_COLORS[testimonyBill.status].bg, color: STATUS_COLORS[testimonyBill.status].text }}>
                        {testimonyBill.status === "LIVE" ? "In Committee" : testimonyBill.statusLabel}
                      </span>
                    </div>
                    <p>{testimonyBill.summary}</p>
                  </div>
                </div>

                <div className="brief-section">
                  <div className="section-label">Plain language summary</div>
                  <div className="language-pill-row">
                    {LANGUAGES.map((option) => (
                      <button
                        key={option.code}
                        className={`chip ${language === option.code ? "active" : ""}`}
                        onClick={() => setLanguage(option.code)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <div className="plain-summary-card">
                    <p>{genBillSummary(testimonyBill, language)[0].text}</p>
                    <strong>{genBillSummary(testimonyBill, language)[1].text}</strong>
                  </div>
                </div>

                <div className="brief-section">
                  <div className="section-label">Civic sentiment</div>
                  <div className="draft-actions">
                    <button
                      className={`vote-btn ${votes[testimonyBill.id] === "support" ? "selected support" : ""}`}
                      onClick={() => setVotes((prev) => ({ ...prev, [testimonyBill.id]: "support" }))}
                    >
                      I Support This
                    </button>
                    <button
                      className={`vote-btn ${votes[testimonyBill.id] === "oppose" ? "selected oppose" : ""}`}
                      onClick={() => setVotes((prev) => ({ ...prev, [testimonyBill.id]: "oppose" }))}
                    >
                      I Oppose This
                    </button>
                  </div>
                  <p className="helper">
                    Your sentiment helps track community momentum and is shared anonymously with representatives.
                  </p>
                </div>

                <div className="brief-section">
                  <div className="section-label">Impact analysis</div>
                  <div className="impact-grid">
                    <article className="brief-card">
                      <span>Residents affected</span>
                      <p>{billDetails?.residentsAffected}</p>
                    </article>
                    <article className="brief-card">
                      <span>Impact score</span>
                      <p>{billDetails?.impactScore}</p>
                    </article>
                    <article className="brief-card">
                      <span>Who benefits?</span>
                      <p>{billDetails?.benefits}</p>
                    </article>
                    <article className="brief-card">
                      <span>Who pays?</span>
                      <p>{billDetails?.pays}</p>
                    </article>
                  </div>
                  <div className="answer-card">
                    <div className="section-label">Impact reason</div>
                    <p>{billDetails?.impactReason}</p>
                  </div>
                </div>

                <div className="brief-section">
                  <div className="section-label">{text.aiSummary}</div>
                  <div className="brief-grid">
                    {genBillSummary(testimonyBill, language).map((item) => (
                      <article key={item.label} className="brief-card">
                        <span>{item.label}</span>
                        <p>{item.text}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="brief-section">
                  <div className="section-label">{text.interact}</div>
                  <div className="prompt-row">
                    {text.prompts.map((prompt) => (
                      <button key={prompt} className="chip" onClick={() => askAboutBill(prompt)}>
                        {prompt}
                      </button>
                    ))}
                  </div>
                  <div className="ask-row">
                    <input
                      type="text"
                      value={billQuestion}
                      placeholder={text.askPlaceholder}
                      onChange={(event) => setBillQuestion(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          askAboutBill(billQuestion);
                        }
                      }}
                    />
                    <button className="btn btn-secondary" onClick={() => askAboutBill(billQuestion)}>
                      {text.askAi}
                    </button>
                  </div>
                  <div className="answer-card">
                    <div className="section-label">{text.aiAnswer}</div>
                    <p>{billAnswer}</p>
                  </div>
                </div>

                <div className="brief-section">
                  <div className="section-label">Public testimony</div>
                  <div className="answer-card">
                    <div className="testimony-count">{billDetails?.testimonies.length} testimonies</div>
                    <p>Sign in to share your testimony on this bill.</p>
                    <button className="btn btn-secondary">Sign In to Comment</button>
                  </div>
                  {billDetails?.testimonies.map((entry) => (
                    <article key={`${entry.name}-${entry.date}`} className="community-testimony">
                      <div className="bill-meta">
                        <strong>{entry.name}</strong>
                        <span>{entry.date}</span>
                      </div>
                      <div className="status-pill event-type">{entry.stance}</div>
                      <p>{entry.body}</p>
                    </article>
                  ))}
                </div>

                <div className="brief-section">
                  <div className="section-label">Jargon explainer</div>
                  <div className="answer-card">
                    {billDetails?.jargon.map((item) => (
                      <div key={item.term} className="jargon-row">
                        <strong>{item.term}:</strong>
                        <span>{item.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="briefing-right">
                <div className="brief-section">
                  <div className="section-label">Current status</div>
                  <div className="status-stack">
                    <div className="status-row">
                      <span>Status</span>
                      <strong>{testimonyBill.status === "LIVE" ? "In Committee" : testimonyBill.statusLabel}</strong>
                    </div>
                    <div className="status-row">
                      <span>Introduced</span>
                      <strong>{billDetails?.introductionDate}</strong>
                    </div>
                    <div className="status-row">
                      <span>Next Event</span>
                      <strong>{billDetails?.nextEventDate}</strong>
                    </div>
                    <div className="status-row">
                      <span>Committee</span>
                      <strong>{billDetails?.committee}</strong>
                    </div>
                    <div className="status-row">
                      <span>Sponsors</span>
                      <strong>{Math.max(6, Math.round(testimonyBill.support / 7))}</strong>
                    </div>
                  </div>
                </div>

                <div className="brief-section">
                  <div className="section-label">{text.createDraft}</div>
                  <div className="draft-actions">
                    <button
                      className="vote-btn support selected"
                      onClick={() => setTestimony(genTestimonyForLanguage(testimonyBill, "support", language))}
                    >
                      {text.supportButton}
                    </button>
                    <button
                      className="vote-btn oppose selected"
                      onClick={() => setTestimony(genTestimonyForLanguage(testimonyBill, "oppose", language))}
                    >
                      {text.opposeButton}
                    </button>
                  </div>

                  <textarea
                    rows={16}
                    value={testimony}
                    onChange={(event) => setTestimony(event.target.value)}
                  />

                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      try {
                        if (navigator.clipboard) {
                          await navigator.clipboard.writeText(testimony);
                          setCopied(true);
                          window.setTimeout(() => setCopied(false), 2000);
                        }
                      } catch {
                        setCopied(false);
                      }
                    }}
                  >
                    {copied ? text.copiedButton : text.copyButton}
                  </button>
                </div>

                <div className="brief-section">
                  <button className="btn btn-secondary">Track this Bill</button>
                  <button className="btn btn-secondary">Share</button>
                  <div className="resource-card">
                    <strong>Legistar</strong>
                    <span>Open official legislation record</span>
                  </div>
                  <div className="resource-card">
                    <strong>CP</strong>
                    <span>CivicPulse NYC</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Onboarding({ address, setAddress, selectedTopics, setSelectedTopics, onFinish }) {
  const [screen, setScreen] = useState("address");

  if (screen === "address") {
    return (
      <div className="onboarding-shell">
        <div className="onboarding-card">
          <CivicLogo />
          <div>
            <div className="section-label">Step 1</div>
            <h2>Where do you live?</h2>
            <p>
              We will find your district, representatives, and the local bills that
              affect your neighborhood.
            </p>
          </div>

          <input
            type="text"
            value={address}
            placeholder="Enter your NYC address..."
            onChange={(event) => setAddress(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && address.trim().length > 3) {
                setScreen("topics");
              }
            }}
          />

          <button
            className="btn btn-primary"
            onClick={() => address.trim().length > 3 && setScreen("topics")}
          >
            Find my district
          </button>

          <span className="helper">Demo uses District 14 - Bronx</span>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-shell">
      <div className="onboarding-card wide">
        <CivicLogo />
        <div>
          <div className="section-label">Step 2</div>
          <h2>What do you care about?</h2>
          <p>Pick as many topics as you want. The dashboard will center them.</p>
        </div>

        <div className="topics-grid">
          {TOPICS.map((topic) => {
            const selected = selectedTopics.includes(topic.id);
            return (
              <button
                key={topic.id}
                className={`topic-card ${selected ? "selected" : ""}`}
                onClick={() =>
                  setSelectedTopics((prev) =>
                    prev.includes(topic.id)
                      ? prev.filter((item) => item !== topic.id)
                      : [...prev, topic.id],
                  )
                }
              >
                <span>{topic.icon}</span>
                <strong>{topic.label}</strong>
              </button>
            );
          })}
        </div>

        <button className="btn btn-primary" onClick={onFinish}>
          Show my civic dashboard
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [address, setAddress] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [activeTab, setActiveTab] = useState("feed");
  const [testimonyBill, setTestimonyBill] = useState(null);
  const [testimony, setTestimony] = useState("");
  const [copied, setCopied] = useState(false);
  const [votes, setVotes] = useState({});

  const openTestimony = (bill, stance) => {
    setTestimonyBill(bill);
    setTestimony(genTestimony(bill, stance));
    setActiveTab("testimony");
  };

  return (
    <div className="app-shell">
      {screen === "landing" && <Landing onEnter={() => setScreen("onboarding")} />}
      {screen === "onboarding" && (
        <Onboarding
          address={address}
          setAddress={setAddress}
          selectedTopics={selectedTopics}
          setSelectedTopics={setSelectedTopics}
          onFinish={() => setScreen("dashboard")}
        />
      )}
      {screen === "dashboard" && (
        <DashboardShell
          address={address}
          selectedTopics={selectedTopics}
          onOpenTestimony={openTestimony}
          testimonyBill={testimonyBill}
          testimony={testimony}
          setTestimony={setTestimony}
          copied={copied}
          setCopied={setCopied}
          votes={votes}
          setVotes={setVotes}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}
