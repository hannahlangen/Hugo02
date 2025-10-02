// Open-ended questions for Hugo Personality Assessment
// Questions are designed to identify dimension first, then specific type within dimension

export const dimensionQuestions = {
  // Phase 1: Identify primary dimension (Vision, Innovation, Expertise, Collaboration)
  phase1: [
    {
      id: 'q1_work_approach',
      question: {
        de: 'Stell dir vor, du startest ein neues Projekt. Was ist dir dabei am wichtigsten? Beschreibe, wie du typischerweise an neue Aufgaben herangehst.',
        en: 'Imagine you\'re starting a new project. What\'s most important to you? Describe how you typically approach new tasks.',
        da: 'Forestil dig, at du starter et nyt projekt. Hvad er vigtigst for dig? Beskriv, hvordan du typisk griber nye opgaver an.'
      },
      dimensionIndicators: {
        vision: ['ziel', 'richtung', 'plan', 'struktur', 'organisation', 'goal', 'direction', 'plan', 'structure', 'organization', 'mål', 'retning', 'plan', 'struktur', 'organisation'],
        innovation: ['neu', 'kreativ', 'idee', 'anders', 'innovation', 'new', 'creative', 'idea', 'different', 'innovation', 'ny', 'kreativ', 'idé', 'anderledes', 'innovation'],
        expertise: ['wissen', 'lernen', 'verstehen', 'analyse', 'details', 'knowledge', 'learn', 'understand', 'analysis', 'details', 'viden', 'lære', 'forstå', 'analyse', 'detaljer'],
        collaboration: ['team', 'zusammen', 'menschen', 'harmonie', 'unterstützung', 'team', 'together', 'people', 'harmony', 'support', 'team', 'sammen', 'mennesker', 'harmoni', 'støtte']
      }
    },
    {
      id: 'q2_team_role',
      question: {
        de: 'In einem Team übernimmst du am liebsten welche Rolle? Warum fühlst du dich in dieser Rolle wohl?',
        en: 'In a team, what role do you prefer to take on? Why do you feel comfortable in this role?',
        da: 'I et team, hvilken rolle foretrækker du at påtage dig? Hvorfor føler du dig godt tilpas i denne rolle?'
      },
      dimensionIndicators: {
        vision: ['führung', 'leitung', 'koordination', 'überblick', 'strategie', 'leadership', 'coordination', 'overview', 'strategy', 'ledelse', 'koordination', 'overblik', 'strategi'],
        innovation: ['ideen', 'kreativität', 'brainstorming', 'konzepte', 'vision', 'ideas', 'creativity', 'brainstorming', 'concepts', 'vision', 'idéer', 'kreativitet', 'brainstorming', 'koncepter', 'vision'],
        expertise: ['experte', 'spezialist', 'fachwissen', 'qualität', 'präzision', 'expert', 'specialist', 'expertise', 'quality', 'precision', 'ekspert', 'specialist', 'ekspertise', 'kvalitet', 'præcision'],
        collaboration: ['vermittlung', 'unterstützung', 'teamwork', 'zusammenhalt', 'hilfe', 'mediation', 'support', 'teamwork', 'cohesion', 'help', 'formidling', 'støtte', 'teamwork', 'sammenhold', 'hjælp']
      }
    },
    {
      id: 'q3_satisfaction',
      question: {
        de: 'Was gibt dir das größte Gefühl von Erfüllung in deiner Arbeit? Erzähle von einem Moment, in dem du besonders zufrieden warst.',
        en: 'What gives you the greatest sense of fulfillment in your work? Tell me about a moment when you felt particularly satisfied.',
        da: 'Hvad giver dig den største følelse af tilfredshed i dit arbejde? Fortæl om et øjeblik, hvor du følte dig særligt tilfreds.'
      },
      dimensionIndicators: {
        vision: ['erreicht', 'ziel', 'erfolg', 'ergebnis', 'fortschritt', 'achieved', 'goal', 'success', 'result', 'progress', 'opnået', 'mål', 'succes', 'resultat', 'fremskridt'],
        innovation: ['geschaffen', 'entwickelt', 'neu', 'lösung', 'durchbruch', 'created', 'developed', 'new', 'solution', 'breakthrough', 'skabt', 'udviklet', 'ny', 'løsning', 'gennembrud'],
        expertise: ['gelernt', 'verstanden', 'gemeistert', 'perfektioniert', 'learned', 'understood', 'mastered', 'perfected', 'lært', 'forstået', 'mestret', 'perfektioneret'],
        collaboration: ['geholfen', 'team', 'gemeinsam', 'unterstützt', 'verbunden', 'helped', 'team', 'together', 'supported', 'connected', 'hjulpet', 'team', 'sammen', 'støttet', 'forbundet']
      }
    }
  ],

  // Phase 2: Identify specific type within dimension
  vision: [
    {
      id: 'v_decision_making',
      question: {
        de: 'Wenn du vor einer wichtigen Entscheidung stehst: Triffst du sie schnell und entschlossen, oder nimmst du dir Zeit, um alle Optionen abzuwägen?',
        en: 'When facing an important decision: Do you make it quickly and decisively, or do you take time to weigh all options?',
        da: 'Når du står over for en vigtig beslutning: Træffer du den hurtigt og beslutsomt, eller tager du dig tid til at veje alle muligheder?'
      },
      typeIndicators: {
        V1: ['schnell', 'entschlossen', 'sofort', 'intuitiv', 'quickly', 'decisively', 'immediately', 'intuitively', 'hurtigt', 'beslutsomt', 'straks', 'intuitivt'],
        V2: ['abwägen', 'analysieren', 'entwickeln', 'planen', 'weigh', 'analyze', 'develop', 'plan', 'veje', 'analysere', 'udvikle', 'planlægge'],
        V3: ['systematisch', 'strukturiert', 'prozess', 'methode', 'systematically', 'structured', 'process', 'method', 'systematisk', 'struktureret', 'proces', 'metode']
      }
    },
    {
      id: 'v_change_handling',
      question: {
        de: 'Wie gehst du mit unerwarteten Veränderungen um? Beschreibe eine Situation, in der sich plötzlich alles geändert hat.',
        en: 'How do you handle unexpected changes? Describe a situation where everything suddenly changed.',
        da: 'Hvordan håndterer du uventede ændringer? Beskriv en situation, hvor alt pludselig ændrede sig.'
      },
      typeIndicators: {
        V1: ['führung', 'übernommen', 'richtung', 'entschieden', 'leadership', 'took charge', 'direction', 'decided', 'ledelse', 'overtog', 'retning', 'besluttede'],
        V2: ['angepasst', 'entwickelt', 'lösung', 'strategie', 'adapted', 'developed', 'solution', 'strategy', 'tilpasset', 'udviklet', 'løsning', 'strategi'],
        V3: ['organisiert', 'strukturiert', 'plan', 'system', 'organized', 'structured', 'plan', 'system', 'organiseret', 'struktureret', 'plan', 'system']
      }
    }
  ],

  innovation: [
    {
      id: 'i_idea_generation',
      question: {
        de: 'Woher kommen deine besten Ideen? Beschreibe deinen kreativen Prozess.',
        en: 'Where do your best ideas come from? Describe your creative process.',
        da: 'Hvor kommer dine bedste idéer fra? Beskriv din kreative proces.'
      },
      typeIndicators: {
        I1: ['experiment', 'ausprobieren', 'risiko', 'neu', 'experiment', 'try out', 'risk', 'new', 'eksperiment', 'prøve', 'risiko', 'ny'],
        I2: ['konzept', 'system', 'design', 'architektur', 'concept', 'system', 'design', 'architecture', 'koncept', 'system', 'design', 'arkitektur'],
        I3: ['menschen', 'inspiration', 'vision', 'begeisterung', 'people', 'inspiration', 'vision', 'enthusiasm', 'mennesker', 'inspiration', 'vision', 'begejstring']
      }
    },
    {
      id: 'i_implementation',
      question: {
        de: 'Wenn du eine neue Idee hast: Was machst du als Nächstes? Wie bringst du Ideen in die Realität?',
        en: 'When you have a new idea: What do you do next? How do you bring ideas into reality?',
        da: 'Når du har en ny idé: Hvad gør du så? Hvordan bringer du idéer til virkelighed?'
      },
      typeIndicators: {
        I1: ['sofort', 'testen', 'prototyp', 'ausprobieren', 'immediately', 'test', 'prototype', 'try', 'straks', 'teste', 'prototype', 'prøve'],
        I2: ['planen', 'durchdenken', 'konzipieren', 'strukturieren', 'plan', 'think through', 'conceptualize', 'structure', 'planlægge', 'tænke igennem', 'konceptualisere', 'strukturere'],
        I3: ['teilen', 'begeistern', 'überzeugen', 'motivieren', 'share', 'inspire', 'convince', 'motivate', 'dele', 'inspirere', 'overbevise', 'motivere']
      }
    }
  ],

  expertise: [
    {
      id: 'e_learning_approach',
      question: {
        de: 'Wie lernst du am besten? Beschreibe, wie du dir neues Wissen aneignest.',
        en: 'How do you learn best? Describe how you acquire new knowledge.',
        da: 'Hvordan lærer du bedst? Beskriv, hvordan du tilegner dig ny viden.'
      },
      typeIndicators: {
        E1: ['recherche', 'studieren', 'forschen', 'vertiefen', 'research', 'study', 'investigate', 'deepen', 'research', 'studere', 'forske', 'fordybe'],
        E2: ['praxis', 'üben', 'perfektionieren', 'meistern', 'practice', 'exercise', 'perfect', 'master', 'praksis', 'øve', 'perfektionere', 'mestre'],
        E3: ['anwenden', 'lehren', 'weitergeben', 'beraten', 'apply', 'teach', 'share', 'advise', 'anvende', 'undervise', 'dele', 'rådgive']
      }
    },
    {
      id: 'e_knowledge_sharing',
      question: {
        de: 'Wie gehst du mit deinem Wissen um? Behältst du es für dich oder teilst du es gerne mit anderen?',
        en: 'How do you handle your knowledge? Do you keep it to yourself or do you like to share it with others?',
        da: 'Hvordan håndterer du din viden? Holder du den for dig selv, eller deler du den gerne med andre?'
      },
      typeIndicators: {
        E1: ['vertiefen', 'erforschen', 'dokumentieren', 'analysieren', 'deepen', 'explore', 'document', 'analyze', 'fordybe', 'udforske', 'dokumentere', 'analysere'],
        E2: ['perfektionieren', 'optimieren', 'verfeinern', 'verbessern', 'perfect', 'optimize', 'refine', 'improve', 'perfektionere', 'optimere', 'forfine', 'forbedre'],
        E3: ['teilen', 'beraten', 'helfen', 'unterstützen', 'share', 'advise', 'help', 'support', 'dele', 'rådgive', 'hjælpe', 'støtte']
      }
    }
  ],

  collaboration: [
    {
      id: 'c_conflict_handling',
      question: {
        de: 'Wie gehst du mit Konflikten im Team um? Erzähle von einer Situation, in der es Spannungen gab.',
        en: 'How do you handle conflicts in a team? Tell me about a situation where there were tensions.',
        da: 'Hvordan håndterer du konflikter i et team? Fortæl om en situation, hvor der var spændinger.'
      },
      typeIndicators: {
        C1: ['vermittelt', 'harmonie', 'ausgleich', 'frieden', 'mediated', 'harmony', 'balance', 'peace', 'formidlet', 'harmoni', 'balance', 'fred'],
        C2: ['verbunden', 'brücke', 'verständnis', 'kommunikation', 'connected', 'bridge', 'understanding', 'communication', 'forbundet', 'bro', 'forståelse', 'kommunikation'],
        C3: ['gelöst', 'umgesetzt', 'praktisch', 'konkret', 'solved', 'implemented', 'practical', 'concrete', 'løst', 'implementeret', 'praktisk', 'konkret']
      }
    },
    {
      id: 'c_team_contribution',
      question: {
        de: 'Was ist dein größter Beitrag zum Team? Wie würden deine Kollegen dich beschreiben?',
        en: 'What is your greatest contribution to the team? How would your colleagues describe you?',
        da: 'Hvad er dit største bidrag til teamet? Hvordan ville dine kolleger beskrive dig?'
      },
      typeIndicators: {
        C1: ['harmonie', 'atmosphäre', 'zusammenhalt', 'stimmung', 'harmony', 'atmosphere', 'cohesion', 'mood', 'harmoni', 'atmosfære', 'sammenhold', 'stemning'],
        C2: ['verbindung', 'netzwerk', 'kommunikation', 'brücke', 'connection', 'network', 'communication', 'bridge', 'forbindelse', 'netværk', 'kommunikation', 'bro'],
        C3: ['umsetzung', 'erledigung', 'zuverlässig', 'praktisch', 'implementation', 'completion', 'reliable', 'practical', 'implementering', 'færdiggørelse', 'pålidelig', 'praktisk']
      }
    }
  ]
};

// Helper function to analyze response and identify dimension
export const analyzeDimensionResponse = (response, questionId) => {
  const question = dimensionQuestions.phase1.find(q => q.id === questionId);
  if (!question) return null;

  const scores = {
    vision: 0,
    innovation: 0,
    expertise: 0,
    collaboration: 0
  };

  const lowerResponse = response.toLowerCase();

  // Count keyword matches for each dimension
  Object.keys(question.dimensionIndicators).forEach(dimension => {
    const keywords = question.dimensionIndicators[dimension];
    keywords.forEach(keyword => {
      if (lowerResponse.includes(keyword.toLowerCase())) {
        scores[dimension]++;
      }
    });
  });

  return scores;
};

// Helper function to analyze response and identify type within dimension
export const analyzeTypeResponse = (response, dimension, questionId) => {
  const questions = dimensionQuestions[dimension];
  if (!questions) return null;

  const question = questions.find(q => q.id === questionId);
  if (!question) return null;

  const scores = {};
  const lowerResponse = response.toLowerCase();

  // Count keyword matches for each type
  Object.keys(question.typeIndicators).forEach(type => {
    scores[type] = 0;
    const keywords = question.typeIndicators[type];
    keywords.forEach(keyword => {
      if (lowerResponse.includes(keyword.toLowerCase())) {
        scores[type]++;
      }
    });
  });

  return scores;
};

export default dimensionQuestions;
