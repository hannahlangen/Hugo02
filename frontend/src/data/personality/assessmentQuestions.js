/**
 * Hugo Personality Assessment Questions
 * 36 questions (3 per personality type) to determine personality profile
 */

export const ASSESSMENT_QUESTIONS = [
  // V1 - Der Wegweiser / The Pathfinder
  {
    id: 'q1',
    type: 'V1',
    question: {
      de: 'Ich treffe auch schwierige Entscheidungen schnell und entschlossen.',
      en: 'I make difficult decisions quickly and decisively.'
    }
  },
  {
    id: 'q2',
    type: 'V1',
    question: {
      de: 'In chaotischen Situationen übernehme ich automatisch die Führung.',
      en: 'In chaotic situations, I automatically take the lead.'
    }
  },
  {
    id: 'q3',
    type: 'V1',
    question: {
      de: 'Ich denke strategisch und fokussiere mich auf langfristige Ziele.',
      en: 'I think strategically and focus on long-term goals.'
    }
  },

  // V2 - Der Entwickler / The Developer
  {
    id: 'q4',
    type: 'V2',
    question: {
      de: 'Ich finde große Erfüllung darin, andere Menschen zu entwickeln und wachsen zu sehen.',
      en: 'I find great fulfillment in developing others and seeing them grow.'
    }
  },
  {
    id: 'q5',
    type: 'V2',
    question: {
      de: 'Ich erkenne das Potenzial in Menschen, bevor sie es selbst sehen.',
      en: 'I recognize potential in people before they see it themselves.'
    }
  },
  {
    id: 'q6',
    type: 'V2',
    question: {
      de: 'Mir ist eine positive Teamkultur wichtiger als kurzfristige Ergebnisse.',
      en: 'A positive team culture is more important to me than short-term results.'
    }
  },

  // V3 - Der Organisator / The Organizer
  {
    id: 'q7',
    type: 'V3',
    question: {
      de: 'Ich schaffe gerne Ordnung und optimiere Prozesse für mehr Effizienz.',
      en: 'I enjoy creating order and optimizing processes for greater efficiency.'
    }
  },
  {
    id: 'q8',
    type: 'V3',
    question: {
      de: 'Ich arbeite am besten in strukturierten Umgebungen mit klaren Abläufen.',
      en: 'I work best in structured environments with clear procedures.'
    }
  },
  {
    id: 'q9',
    type: 'V3',
    question: {
      de: 'Qualität und Zuverlässigkeit sind mir wichtiger als Geschwindigkeit.',
      en: 'Quality and reliability are more important to me than speed.'
    }
  },

  // I1 - Der Pionier / The Pioneer
  {
    id: 'q10',
    type: 'I1',
    question: {
      de: 'Ich liebe es, neue Wege auszuprobieren, auch wenn sie riskant sind.',
      en: 'I love trying new approaches, even if they are risky.'
    }
  },
  {
    id: 'q11',
    type: 'I1',
    question: {
      de: 'Routine langweilt mich - ich brauche ständig neue Herausforderungen.',
      en: 'Routine bores me - I constantly need new challenges.'
    }
  },
  {
    id: 'q12',
    type: 'I1',
    question: {
      de: 'Ich experimentiere gerne und lerne aus Fehlern.',
      en: 'I enjoy experimenting and learning from mistakes.'
    }
  },

  // I2 - Der Architekt / The Architect
  {
    id: 'q13',
    type: 'I2',
    question: {
      de: 'Ich entwickle durchdachte, langfristige Lösungen für komplexe Probleme.',
      en: 'I develop well-thought-out, long-term solutions for complex problems.'
    }
  },
  {
    id: 'q14',
    type: 'I2',
    question: {
      de: 'Ich verbinde kreative Ideen mit strategischer Planung.',
      en: 'I combine creative ideas with strategic planning.'
    }
  },
  {
    id: 'q15',
    type: 'I2',
    question: {
      de: 'Ich denke in Systemen und sehe Zusammenhänge, die andere übersehen.',
      en: 'I think in systems and see connections that others overlook.'
    }
  },

  // I3 - Der Inspirator / The Inspirator
  {
    id: 'q16',
    type: 'I3',
    question: {
      de: 'Ich begeistere andere leicht für neue Ideen und Veränderungen.',
      en: 'I easily inspire others for new ideas and changes.'
    }
  },
  {
    id: 'q17',
    type: 'I3',
    question: {
      de: 'Ich kommuniziere Visionen auf eine Weise, die Menschen emotional berührt.',
      en: 'I communicate visions in a way that emotionally touches people.'
    }
  },
  {
    id: 'q18',
    type: 'I3',
    question: {
      de: 'Ich liebe es, kreative Geschichten zu erzählen und andere zu inspirieren.',
      en: 'I love telling creative stories and inspiring others.'
    }
  },

  // E1 - Der Forscher / The Researcher
  {
    id: 'q19',
    type: 'E1',
    question: {
      de: 'Ich analysiere Daten gründlich, bevor ich Entscheidungen treffe.',
      en: 'I analyze data thoroughly before making decisions.'
    }
  },
  {
    id: 'q20',
    type: 'E1',
    question: {
      de: 'Ich habe eine unersättliche Neugier und will Dinge wirklich verstehen.',
      en: 'I have an insatiable curiosity and want to truly understand things.'
    }
  },
  {
    id: 'q21',
    type: 'E1',
    question: {
      de: 'Ich verlasse mich auf Fakten und Evidenz, nicht auf Bauchgefühl.',
      en: 'I rely on facts and evidence, not on gut feeling.'
    }
  },

  // E2 - Der Meister / The Master
  {
    id: 'q22',
    type: 'E2',
    question: {
      de: 'Ich strebe in meinem Fachgebiet nach Perfektion und Meisterschaft.',
      en: 'I strive for perfection and mastery in my field.'
    }
  },
  {
    id: 'q23',
    type: 'E2',
    question: {
      de: 'Qualität ist mir wichtiger als Quantität oder Geschwindigkeit.',
      en: 'Quality is more important to me than quantity or speed.'
    }
  },
  {
    id: 'q24',
    type: 'E2',
    question: {
      de: 'Ich bin stolz auf meine Fachexpertise und handwerkliche Präzision.',
      en: 'I am proud of my technical expertise and craftsmanship precision.'
    }
  },

  // E3 - Der Berater / The Advisor
  {
    id: 'q25',
    type: 'E3',
    question: {
      de: 'Ich teile gerne mein Wissen und berate andere strategisch.',
      en: 'I enjoy sharing my knowledge and advising others strategically.'
    }
  },
  {
    id: 'q26',
    type: 'E3',
    question: {
      de: 'Menschen kommen zu mir, um Rat und Perspektive zu bekommen.',
      en: 'People come to me for advice and perspective.'
    }
  },
  {
    id: 'q27',
    type: 'E3',
    question: {
      de: 'Ich verbinde Fachwissen mit strategischer Weitsicht.',
      en: 'I combine expertise with strategic foresight.'
    }
  },

  // C1 - Der Harmonizer / The Harmonizer
  {
    id: 'q28',
    type: 'C1',
    question: {
      de: 'Ich sorge dafür, dass sich alle im Team wohl und gehört fühlen.',
      en: 'I ensure that everyone on the team feels comfortable and heard.'
    }
  },
  {
    id: 'q29',
    type: 'C1',
    question: {
      de: 'Ich spüre emotionale Spannungen im Team und kann sie lösen.',
      en: 'I sense emotional tensions in the team and can resolve them.'
    }
  },
  {
    id: 'q30',
    type: 'C1',
    question: {
      de: 'Eine positive Teamatmosphäre ist mir sehr wichtig.',
      en: 'A positive team atmosphere is very important to me.'
    }
  },

  // C2 - Der Brückenbauer / The Bridge Builder
  {
    id: 'q31',
    type: 'C2',
    question: {
      de: 'Ich bringe Menschen mit unterschiedlichen Perspektiven zusammen.',
      en: 'I bring together people with different perspectives.'
    }
  },
  {
    id: 'q32',
    type: 'C2',
    question: {
      de: 'Ich baue leicht Netzwerke auf und pflege Beziehungen.',
      en: 'I easily build networks and maintain relationships.'
    }
  },
  {
    id: 'q33',
    type: 'C2',
    question: {
      de: 'Ich finde Konsens und Win-Win-Lösungen in Konflikten.',
      en: 'I find consensus and win-win solutions in conflicts.'
    }
  },

  // C3 - Der Umsetzer / The Implementer
  {
    id: 'q34',
    type: 'C3',
    question: {
      de: 'Ich verwandle Pläne und Ideen in konkrete Ergebnisse.',
      en: 'I turn plans and ideas into concrete results.'
    }
  },
  {
    id: 'q35',
    type: 'C3',
    question: {
      de: 'Ich bin pragmatisch und fokussiere mich auf das, was funktioniert.',
      en: 'I am pragmatic and focus on what works.'
    }
  },
  {
    id: 'q36',
    type: 'C3',
    question: {
      de: 'Ich koordiniere Teams effektiv, um Ziele zu erreichen.',
      en: 'I coordinate teams effectively to achieve goals.'
    }
  }
];

// Answer scale
export const ANSWER_SCALE = [
  { value: 1, label: { de: 'Trifft gar nicht zu', en: 'Strongly disagree' } },
  { value: 2, label: { de: 'Trifft eher nicht zu', en: 'Disagree' } },
  { value: 3, label: { de: 'Neutral', en: 'Neutral' } },
  { value: 4, label: { de: 'Trifft eher zu', en: 'Agree' } },
  { value: 5, label: { de: 'Trifft voll zu', en: 'Strongly agree' } }
];

export default ASSESSMENT_QUESTIONS;
