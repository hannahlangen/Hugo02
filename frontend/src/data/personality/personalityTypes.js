/**
 * Hugo Personality System - 12 Personality Types
 * Based on 4 dimensions: Vision, Innovation, Expertise, Collaboration
 */

export const DIMENSIONS = {
  VISION: {
    id: 'vision',
    icon: '🎯',
    name: { de: 'VISION', en: 'VISION' },
    description: { 
      de: 'Richtung und Zukunft gestalten', 
      en: 'Shaping direction and future' 
    }
  },
  INNOVATION: {
    id: 'innovation',
    icon: '💡',
    name: { de: 'INNOVATION', en: 'INNOVATION' },
    description: { 
      de: 'Kreativität und Durchbrüche schaffen', 
      en: 'Creating creativity and breakthroughs' 
    }
  },
  EXPERTISE: {
    id: 'expertise',
    icon: '🎓',
    name: { de: 'EXPERTISE', en: 'EXPERTISE' },
    description: { 
      de: 'Wissen vertiefen und Qualität sichern', 
      en: 'Deepening knowledge and ensuring quality' 
    }
  },
  COLLABORATION: {
    id: 'collaboration',
    icon: '🤝',
    name: { de: 'KOLLABORATION', en: 'COLLABORATION' },
    description: { 
      de: 'Teamarbeit und Umsetzung fördern', 
      en: 'Promoting teamwork and implementation' 
    }
  }
};

export const PERSONALITY_TYPES = {
  V1: {
    id: 'V1',
    dimension: 'vision',
    name: { de: 'Der Wegweiser', en: 'The Pathfinder' },
    tagline: { 
      de: 'Zeigt den Weg zu einer besseren Zukunft', 
      en: 'Shows the way to a better future' 
    },
    core: {
      de: 'Natürlicher Stratege, der komplexe Situationen durchdringt und klare Richtungen vorgibt',
      en: 'Natural strategist who penetrates complex situations and provides clear direction'
    },
    strengths: {
      de: ['Strategisches Denken', 'Entscheidungskraft', 'Führungsqualität', 'Krisenmanagement'],
      en: ['Strategic thinking', 'Decision-making', 'Leadership', 'Crisis management']
    }
  },
  V2: {
    id: 'V2',
    dimension: 'vision',
    name: { de: 'Der Entwickler', en: 'The Developer' },
    tagline: { 
      de: 'Hilft Menschen und Teams zu wachsen', 
      en: 'Helps people and teams grow' 
    },
    core: {
      de: 'Menschen-Magnet, der das Beste in anderen erkennt und herausholt',
      en: 'People magnet who recognizes and brings out the best in others'
    },
    strengths: {
      de: ['Menschen-Entwicklung', 'Empathische Führung', 'Team-Inspiration', 'Kulturgestaltung'],
      en: ['People development', 'Empathetic leadership', 'Team inspiration', 'Culture building']
    }
  },
  V3: {
    id: 'V3',
    dimension: 'vision',
    name: { de: 'Der Organisator', en: 'The Organizer' },
    tagline: { 
      de: 'Schafft Struktur und Effizienz für nachhaltigen Erfolg', 
      en: 'Creates structure and efficiency for sustainable success' 
    },
    core: {
      de: 'Architekt effizienter Systeme, der Ordnung aus Chaos schafft',
      en: 'Architect of efficient systems who creates order from chaos'
    },
    strengths: {
      de: ['Systematische Organisation', 'Effizienz-Optimierung', 'Qualitätssicherung', 'Zuverlässigkeit'],
      en: ['Systematic organization', 'Efficiency optimization', 'Quality assurance', 'Reliability']
    }
  },
  I1: {
    id: 'I1',
    dimension: 'innovation',
    name: { de: 'Der Pionier', en: 'The Pioneer' },
    tagline: { 
      de: 'Erschafft neue Wege und Möglichkeiten', 
      en: 'Creates new paths and possibilities' 
    },
    core: {
      de: 'Kreativer Entdecker, der Grenzen überschreitet und Neues wagt',
      en: 'Creative explorer who crosses boundaries and dares new things'
    },
    strengths: {
      de: ['Kreative Innovation', 'Risikobereitschaft', 'Experimentierfreude', 'Visionäres Denken'],
      en: ['Creative innovation', 'Risk-taking', 'Experimentation', 'Visionary thinking']
    }
  },
  I2: {
    id: 'I2',
    dimension: 'innovation',
    name: { de: 'Der Architekt', en: 'The Architect' },
    tagline: { 
      de: 'Designt durchdachte Lösungen für komplexe Probleme', 
      en: 'Designs thoughtful solutions for complex problems' 
    },
    core: {
      de: 'Systematischer Innovator, der kreative Lösungen mit strategischer Planung verbindet',
      en: 'Systematic innovator who combines creative solutions with strategic planning'
    },
    strengths: {
      de: ['Systematische Innovation', 'Konzeptionelle Stärke', 'Langfristiges Denken', 'Problemlösung'],
      en: ['Systematic innovation', 'Conceptual strength', 'Long-term thinking', 'Problem solving']
    }
  },
  I3: {
    id: 'I3',
    dimension: 'innovation',
    name: { de: 'Der Inspirator', en: 'The Inspirator' },
    tagline: { 
      de: 'Begeistert andere für neue Ideen und Veränderung', 
      en: 'Inspires others for new ideas and change' 
    },
    core: {
      de: 'Charismatischer Visionär, der andere für Innovationen begeistert',
      en: 'Charismatic visionary who inspires others for innovation'
    },
    strengths: {
      de: ['Kreative Kommunikation', 'Begeisterungsfähigkeit', 'Change Management', 'Storytelling'],
      en: ['Creative communication', 'Enthusiasm', 'Change management', 'Storytelling']
    }
  },
  E1: {
    id: 'E1',
    dimension: 'expertise',
    name: { de: 'Der Forscher', en: 'The Researcher' },
    tagline: { 
      de: 'Der analytische Entdecker', 
      en: 'The analytical explorer' 
    },
    core: {
      de: 'Wissensmotor mit unersättlicher Neugier, der Daten in Erkenntnisse verwandelt',
      en: 'Knowledge engine with insatiable curiosity who transforms data into insights'
    },
    strengths: {
      de: ['Analytisches Denken', 'Forschungskompetenz', 'Objektivität', 'Detailgenauigkeit'],
      en: ['Analytical thinking', 'Research competence', 'Objectivity', 'Attention to detail']
    }
  },
  E2: {
    id: 'E2',
    dimension: 'expertise',
    name: { de: 'Der Meister', en: 'The Master' },
    tagline: { 
      de: 'Strebt nach Perfektion und höchster Qualität', 
      en: 'Strives for perfection and highest quality' 
    },
    core: {
      de: 'Qualitätsgarant, der durch Meisterschaft und Exzellenz überzeugt',
      en: 'Quality guarantor who convinces through mastery and excellence'
    },
    strengths: {
      de: ['Fachexpertise', 'Qualitätsfokus', 'Handwerkliche Perfektion', 'Zuverlässigkeit'],
      en: ['Technical expertise', 'Quality focus', 'Craftsmanship perfection', 'Reliability']
    }
  },
  E3: {
    id: 'E3',
    dimension: 'expertise',
    name: { de: 'Der Berater', en: 'The Advisor' },
    tagline: { 
      de: 'Teilt Weisheit und berät strategisch', 
      en: 'Shares wisdom and advises strategically' 
    },
    core: {
      de: 'Weiser Ratgeber, der Wissen mit strategischer Einsicht verbindet',
      en: 'Wise counselor who combines knowledge with strategic insight'
    },
    strengths: {
      de: ['Strategische Beratung', 'Erfahrungswissen', 'Mentoring', 'Urteilsvermögen'],
      en: ['Strategic consulting', 'Experiential knowledge', 'Mentoring', 'Judgment']
    }
  },
  C1: {
    id: 'C1',
    dimension: 'collaboration',
    name: { de: 'Der Harmonizer', en: 'The Harmonizer' },
    tagline: { 
      de: 'Schafft Harmonie und unterstützt das Team', 
      en: 'Creates harmony and supports the team' 
    },
    core: {
      de: 'Teamstabilisator, der für positive Atmosphäre und Zusammenhalt sorgt',
      en: 'Team stabilizer who ensures positive atmosphere and cohesion'
    },
    strengths: {
      de: ['Empathie', 'Konfliktlösung', 'Team-Support', 'Atmosphäre-Gestaltung'],
      en: ['Empathy', 'Conflict resolution', 'Team support', 'Atmosphere creation']
    }
  },
  C2: {
    id: 'C2',
    dimension: 'collaboration',
    name: { de: 'Der Brückenbauer', en: 'The Bridge Builder' },
    tagline: { 
      de: 'Verbindet Menschen und schafft Konsens', 
      en: 'Connects people and creates consensus' 
    },
    core: {
      de: 'Netzwerker, der unterschiedliche Perspektiven zusammenbringt',
      en: 'Networker who brings together different perspectives'
    },
    strengths: {
      de: ['Netzwerken', 'Konsensbildung', 'Kommunikation', 'Diplomatie'],
      en: ['Networking', 'Consensus building', 'Communication', 'Diplomacy']
    }
  },
  C3: {
    id: 'C3',
    dimension: 'collaboration',
    name: { de: 'Der Umsetzer', en: 'The Implementer' },
    tagline: { 
      de: 'Macht Pläne zur Realität', 
      en: 'Turns plans into reality' 
    },
    core: {
      de: 'Pragmatischer Macher, der Ideen in konkrete Ergebnisse verwandelt',
      en: 'Pragmatic doer who transforms ideas into concrete results'
    },
    strengths: {
      de: ['Umsetzungsstärke', 'Pragmatismus', 'Teamkoordination', 'Ergebnisorientierung'],
      en: ['Implementation strength', 'Pragmatism', 'Team coordination', 'Results orientation']
    }
  }
};

// Helper function to get type by ID
export const getPersonalityType = (typeId) => {
  return PERSONALITY_TYPES[typeId] || null;
};

// Helper function to get all types by dimension
export const getTypesByDimension = (dimensionId) => {
  return Object.values(PERSONALITY_TYPES).filter(type => type.dimension === dimensionId);
};

// Helper function to get dimension info
export const getDimension = (dimensionId) => {
  return DIMENSIONS[dimensionId.toUpperCase()] || null;
};

export default PERSONALITY_TYPES;
