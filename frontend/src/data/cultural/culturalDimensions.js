// Cultural Dimensions Database
// Based on Erin Meyer's Culture Map and Hofstede's 6 Dimensions

export const culturalDimensions = {
  // Erin Meyer's Culture Map - 8 Scales (0-10 scale)
  erinMeyer: {
    dimensions: {
      communicating: {
        name: { de: 'Kommunikation', en: 'Communicating', da: 'Kommunikation' },
        lowContext: { de: 'Explizit', en: 'Low-context', da: 'Eksplicit' },
        highContext: { de: 'Implizit', en: 'High-context', da: 'Implicit' }
      },
      evaluating: {
        name: { de: 'Feedback', en: 'Evaluating', da: 'Feedback' },
        direct: { de: 'Direkt', en: 'Direct negative feedback', da: 'Direkte' },
        indirect: { de: 'Indirekt', en: 'Indirect negative feedback', da: 'Indirekte' }
      },
      persuading: {
        name: { de: 'Überzeugung', en: 'Persuading', da: 'Overbevisning' },
        principlesFirst: { de: 'Prinzipien zuerst', en: 'Principles-first', da: 'Principper først' },
        applicationsFirst: { de: 'Anwendungen zuerst', en: 'Applications-first', da: 'Anvendelser først' }
      },
      leading: {
        name: { de: 'Führung', en: 'Leading', da: 'Ledelse' },
        egalitarian: { de: 'Egalitär', en: 'Egalitarian', da: 'Egalitær' },
        hierarchical: { de: 'Hierarchisch', en: 'Hierarchical', da: 'Hierarkisk' }
      },
      deciding: {
        name: { de: 'Entscheidungsfindung', en: 'Deciding', da: 'Beslutningstagning' },
        consensual: { de: 'Konsensual', en: 'Consensual', da: 'Konsensus' },
        topDown: { de: 'Top-Down', en: 'Top-down', da: 'Top-down' }
      },
      trusting: {
        name: { de: 'Vertrauen', en: 'Trusting', da: 'Tillid' },
        taskBased: { de: 'Aufgabenbasiert', en: 'Task-based', da: 'Opgavebaseret' },
        relationshipBased: { de: 'Beziehungsbasiert', en: 'Relationship-based', da: 'Relationsbaseret' }
      },
      disagreeing: {
        name: { de: 'Meinungsverschiedenheiten', en: 'Disagreeing', da: 'Uenighed' },
        confrontational: { de: 'Konfrontativ', en: 'Confrontational', da: 'Konfronterende' },
        avoidsConfrontation: { de: 'Konfliktvermeidend', en: 'Avoids confrontation', da: 'Undgår konfrontation' }
      },
      scheduling: {
        name: { de: 'Zeitplanung', en: 'Scheduling', da: 'Tidsplanlægning' },
        linearTime: { de: 'Linear', en: 'Linear-time', da: 'Lineær' },
        flexibleTime: { de: 'Flexibel', en: 'Flexible-time', da: 'Fleksibel' }
      }
    }
  },

  // Hofstede's 6 Dimensions (0-100 scale)
  hofstede: {
    dimensions: {
      powerDistance: {
        name: { de: 'Machtdistanz', en: 'Power Distance', da: 'Magtdistance' },
        description: { 
          de: 'Akzeptanz ungleicher Machtverteilung',
          en: 'Acceptance of unequal power distribution',
          da: 'Accept af ulige magtfordeling'
        }
      },
      individualismCollectivism: {
        name: { de: 'Individualismus', en: 'Individualism', da: 'Individualisme' },
        description: {
          de: 'Grad der Unabhängigkeit von Gruppen',
          en: 'Degree of independence from groups',
          da: 'Grad af uafhængighed fra grupper'
        }
      },
      masculinityFemininity: {
        name: { de: 'Maskulinität', en: 'Masculinity', da: 'Maskulinitet' },
        description: {
          de: 'Wettbewerb vs. Fürsorge',
          en: 'Competition vs. caring',
          da: 'Konkurrence vs. omsorg'
        }
      },
      uncertaintyAvoidance: {
        name: { de: 'Unsicherheitsvermeidung', en: 'Uncertainty Avoidance', da: 'Usikkerhedsundgåelse' },
        description: {
          de: 'Umgang mit Ungewissheit',
          en: 'Dealing with uncertainty',
          da: 'Håndtering af usikkerhed'
        }
      },
      longTermOrientation: {
        name: { de: 'Langzeitorientierung', en: 'Long-term Orientation', da: 'Langsigtet orientering' },
        description: {
          de: 'Zukunft vs. Gegenwart/Vergangenheit',
          en: 'Future vs. present/past',
          da: 'Fremtid vs. nutid/fortid'
        }
      },
      indulgenceRestraint: {
        name: { de: 'Nachgiebigkeit', en: 'Indulgence', da: 'Eftergivenhed' },
        description: {
          de: 'Genuss vs. Kontrolle von Bedürfnissen',
          en: 'Gratification vs. control of desires',
          da: 'Tilfredsstillelse vs. kontrol af ønsker'
        }
      }
    }
  },

  // Country-specific scores
  countries: {
    DE: {
      name: { de: 'Deutschland', en: 'Germany', da: 'Tyskland' },
      erinMeyer: {
        communicating: 3, // Low-context (explicit)
        evaluating: 7, // Direct feedback
        persuading: 2, // Principles-first
        leading: 3, // Egalitarian
        deciding: 6, // Consensual
        trusting: 3, // Task-based
        disagreeing: 7, // Confrontational
        scheduling: 2 // Linear-time
      },
      hofstede: {
        powerDistance: 35,
        individualismCollectivism: 67,
        masculinityFemininity: 66,
        uncertaintyAvoidance: 65,
        longTermOrientation: 83,
        indulgenceRestraint: 40
      }
    },
    US: {
      name: { de: 'USA', en: 'United States', da: 'USA' },
      erinMeyer: {
        communicating: 2, // Very low-context
        evaluating: 5, // Moderately direct
        persuading: 8, // Applications-first
        leading: 2, // Very egalitarian
        deciding: 3, // Top-down
        trusting: 2, // Very task-based
        disagreeing: 5, // Moderately confrontational
        scheduling: 1 // Very linear-time
      },
      hofstede: {
        powerDistance: 40,
        individualismCollectivism: 91,
        masculinityFemininity: 62,
        uncertaintyAvoidance: 46,
        longTermOrientation: 26,
        indulgenceRestraint: 68
      }
    },
    GB: {
      name: { de: 'Großbritannien', en: 'United Kingdom', da: 'Storbritannien' },
      erinMeyer: {
        communicating: 2,
        evaluating: 6,
        persuading: 7,
        leading: 2,
        deciding: 3,
        trusting: 2,
        disagreeing: 6,
        scheduling: 2
      },
      hofstede: {
        powerDistance: 35,
        individualismCollectivism: 89,
        masculinityFemininity: 66,
        uncertaintyAvoidance: 35,
        longTermOrientation: 51,
        indulgenceRestraint: 69
      }
    },
    DK: {
      name: { de: 'Dänemark', en: 'Denmark', da: 'Danmark' },
      erinMeyer: {
        communicating: 2,
        evaluating: 7,
        persuading: 6,
        leading: 1, // Very egalitarian
        deciding: 7, // Very consensual
        trusting: 2,
        disagreeing: 6,
        scheduling: 3
      },
      hofstede: {
        powerDistance: 18, // Very low
        individualismCollectivism: 74,
        masculinityFemininity: 16, // Very feminine
        uncertaintyAvoidance: 23, // Very low
        longTermOrientation: 35,
        indulgenceRestraint: 70
      }
    },
    FR: {
      name: { de: 'Frankreich', en: 'France', da: 'Frankrig' },
      erinMeyer: {
        communicating: 6,
        evaluating: 7,
        persuading: 1, // Very principles-first
        leading: 7,
        deciding: 4,
        trusting: 4,
        disagreeing: 8,
        scheduling: 7
      },
      hofstede: {
        powerDistance: 68,
        individualismCollectivism: 71,
        masculinityFemininity: 43,
        uncertaintyAvoidance: 86,
        longTermOrientation: 63,
        indulgenceRestraint: 48
      }
    },
    JP: {
      name: { de: 'Japan', en: 'Japan', da: 'Japan' },
      erinMeyer: {
        communicating: 9, // Very high-context
        evaluating: 2, // Very indirect
        persuading: 5,
        leading: 8,
        deciding: 8,
        trusting: 8,
        disagreeing: 2,
        scheduling: 4
      },
      hofstede: {
        powerDistance: 54,
        individualismCollectivism: 46,
        masculinityFemininity: 95, // Very masculine
        uncertaintyAvoidance: 92,
        longTermOrientation: 88,
        indulgenceRestraint: 42
      }
    },
    CN: {
      name: { de: 'China', en: 'China', da: 'Kina' },
      erinMeyer: {
        communicating: 9,
        evaluating: 3,
        persuading: 6,
        leading: 9,
        deciding: 2,
        trusting: 9,
        disagreeing: 3,
        scheduling: 8
      },
      hofstede: {
        powerDistance: 80,
        individualismCollectivism: 20,
        masculinityFemininity: 66,
        uncertaintyAvoidance: 30,
        longTermOrientation: 87,
        indulgenceRestraint: 24
      }
    },
    IN: {
      name: { de: 'Indien', en: 'India', da: 'Indien' },
      erinMeyer: {
        communicating: 8,
        evaluating: 4,
        persuading: 5,
        leading: 9,
        deciding: 3,
        trusting: 7,
        disagreeing: 4,
        scheduling: 9
      },
      hofstede: {
        powerDistance: 77,
        individualismCollectivism: 48,
        masculinityFemininity: 56,
        uncertaintyAvoidance: 40,
        longTermOrientation: 51,
        indulgenceRestraint: 26
      }
    },
    BR: {
      name: { de: 'Brasilien', en: 'Brazil', da: 'Brasilien' },
      erinMeyer: {
        communicating: 7,
        evaluating: 5,
        persuading: 7,
        leading: 8,
        deciding: 4,
        trusting: 8,
        disagreeing: 5,
        scheduling: 9
      },
      hofstede: {
        powerDistance: 69,
        individualismCollectivism: 38,
        masculinityFemininity: 49,
        uncertaintyAvoidance: 76,
        longTermOrientation: 44,
        indulgenceRestraint: 59
      }
    },
    SE: {
      name: { de: 'Schweden', en: 'Sweden', da: 'Sverige' },
      erinMeyer: {
        communicating: 2,
        evaluating: 6,
        persuading: 6,
        leading: 1,
        deciding: 8,
        trusting: 2,
        disagreeing: 5,
        scheduling: 2
      },
      hofstede: {
        powerDistance: 31,
        individualismCollectivism: 71,
        masculinityFemininity: 5, // Very feminine
        uncertaintyAvoidance: 29,
        longTermOrientation: 53,
        indulgenceRestraint: 78
      }
    },
    NO: {
      name: { de: 'Norwegen', en: 'Norway', da: 'Norge' },
      erinMeyer: {
        communicating: 2,
        evaluating: 6,
        persuading: 6,
        leading: 1,
        deciding: 7,
        trusting: 2,
        disagreeing: 5,
        scheduling: 2
      },
      hofstede: {
        powerDistance: 31,
        individualismCollectivism: 69,
        masculinityFemininity: 8,
        uncertaintyAvoidance: 50,
        longTermOrientation: 35,
        indulgenceRestraint: 55
      }
    },
    NL: {
      name: { de: 'Niederlande', en: 'Netherlands', da: 'Holland' },
      erinMeyer: {
        communicating: 2,
        evaluating: 8, // Very direct
        persuading: 6,
        leading: 2,
        deciding: 6,
        trusting: 2,
        disagreeing: 7,
        scheduling: 2
      },
      hofstede: {
        powerDistance: 38,
        individualismCollectivism: 80,
        masculinityFemininity: 14,
        uncertaintyAvoidance: 53,
        longTermOrientation: 67,
        indulgenceRestraint: 68
      }
    },
    ES: {
      name: { de: 'Spanien', en: 'Spain', da: 'Spanien' },
      erinMeyer: {
        communicating: 6,
        evaluating: 5,
        persuading: 6,
        leading: 6,
        deciding: 5,
        trusting: 6,
        disagreeing: 6,
        scheduling: 8
      },
      hofstede: {
        powerDistance: 57,
        individualismCollectivism: 51,
        masculinityFemininity: 42,
        uncertaintyAvoidance: 86,
        longTermOrientation: 48,
        indulgenceRestraint: 44
      }
    },
    IT: {
      name: { de: 'Italien', en: 'Italy', da: 'Italien' },
      erinMeyer: {
        communicating: 7,
        evaluating: 6,
        persuading: 5,
        leading: 6,
        deciding: 5,
        trusting: 6,
        disagreeing: 7,
        scheduling: 8
      },
      hofstede: {
        powerDistance: 50,
        individualismCollectivism: 76,
        masculinityFemininity: 70,
        uncertaintyAvoidance: 75,
        longTermOrientation: 61,
        indulgenceRestraint: 30
      }
    }
  }
};

// Helper function to get cultural profile
export const getCulturalProfile = (countryCode) => {
  return culturalDimensions.countries[countryCode] || null;
};

// Helper function to interpret cultural dimensions
export const interpretCulturalDimensions = (countryCode, language = 'en') => {
  const profile = getCulturalProfile(countryCode);
  if (!profile) return null;

  const interpretations = {
    de: {
      communicating: profile.erinMeyer.communicating < 5 ? 'Explizite Kommunikation bevorzugt' : 'Implizite Kommunikation bevorzugt',
      evaluating: profile.erinMeyer.evaluating > 5 ? 'Direktes Feedback' : 'Indirektes Feedback',
      leading: profile.erinMeyer.leading < 5 ? 'Flache Hierarchien' : 'Ausgeprägte Hierarchien',
      deciding: profile.erinMeyer.deciding > 5 ? 'Konsensbasierte Entscheidungen' : 'Top-Down Entscheidungen',
      powerDistance: profile.hofstede.powerDistance > 50 ? 'Hohe Machtdistanz' : 'Niedrige Machtdistanz',
      individualism: profile.hofstede.individualismCollectivism > 50 ? 'Individualistisch' : 'Kollektivistisch'
    },
    en: {
      communicating: profile.erinMeyer.communicating < 5 ? 'Prefers explicit communication' : 'Prefers implicit communication',
      evaluating: profile.erinMeyer.evaluating > 5 ? 'Direct feedback' : 'Indirect feedback',
      leading: profile.erinMeyer.leading < 5 ? 'Flat hierarchies' : 'Strong hierarchies',
      deciding: profile.erinMeyer.deciding > 5 ? 'Consensus-based decisions' : 'Top-down decisions',
      powerDistance: profile.hofstede.powerDistance > 50 ? 'High power distance' : 'Low power distance',
      individualism: profile.hofstede.individualismCollectivism > 50 ? 'Individualistic' : 'Collectivistic'
    },
    da: {
      communicating: profile.erinMeyer.communicating < 5 ? 'Foretrækker eksplicit kommunikation' : 'Foretrækker implicit kommunikation',
      evaluating: profile.erinMeyer.evaluating > 5 ? 'Direkte feedback' : 'Indirekte feedback',
      leading: profile.erinMeyer.leading < 5 ? 'Flade hierarkier' : 'Stærke hierarkier',
      deciding: profile.erinMeyer.deciding > 5 ? 'Konsensusbaserede beslutninger' : 'Top-down beslutninger',
      powerDistance: profile.hofstede.powerDistance > 50 ? 'Høj magtdistance' : 'Lav magtdistance',
      individualism: profile.hofstede.individualismCollectivism > 50 ? 'Individualistisk' : 'Kollektivistisk'
    }
  };

  return interpretations[language] || interpretations.en;
};

export default culturalDimensions;
