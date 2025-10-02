import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/RoleBasedAuthContext';
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Send, User, Clock, CheckCircle, Users, Trophy, Target } from 'lucide-react'

// Two-Stage Hugo Assessment Component
export default function TwoStageHugoAssessment({ onBack }) {
  const { user, logout } = useAuth();
  const [stage, setStage] = useState('intro') // intro, stage1, stage2, results
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [culturalBackground, setCulturalBackground] = useState('')
  const [answers, setAnswers] = useState([])
  const [dimensionScores, setDimensionScores] = useState({ V: 0, I: 0, E: 0, C: 0 })
  const [primaryDimension, setPrimaryDimension] = useState('')
  const [finalResult, setFinalResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const messagesEndRef = useRef(null)

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // Stage 1: Dimension Identification Questions (12 questions)
  const stage1Questions = [
    {
      id: 1,
      text: "Wie gehst du normalerweise an neue Projekte heran?",
      dimension_focus: ["V", "I"],
      keywords: {
        V: ["strategie", "plan", "ziel", "vision", "langfristig", "zukunft", "roadmap", "konzept"],
        I: ["kreativ", "experiment", "ausprobieren", "innovation", "neu", "anders", "idee", "brainstorm"],
        E: ["analyse", "research", "fakten", "daten", "methodik", "bewährt", "qualität", "standard"],
        C: ["team", "gemeinsam", "abstimmen", "feedback", "zusammen", "kollegen", "diskussion", "konsens"]
      }
    },
    {
      id: 2,
      text: "Was motiviert dich am meisten bei der Arbeit?",
      dimension_focus: ["V", "C"],
      keywords: {
        V: ["impact", "veränderung", "führung", "wachstum", "erfolg", "ziele", "vision", "fortschritt"],
        I: ["herausforderung", "kreativität", "neues", "problem", "lösung", "innovation", "experiment"],
        E: ["expertise", "qualität", "perfektion", "wissen", "können", "fachlich", "kompetenz", "lernen"],
        C: ["menschen", "team", "helfen", "zusammenarbeit", "beziehung", "harmonie", "unterstützung"]
      }
    },
    {
      id: 3,
      text: "Wie triffst du wichtige Entscheidungen?",
      dimension_focus: ["E", "V"],
      keywords: {
        V: ["intuition", "bauchgefühl", "vision", "big picture", "langfristig", "strategisch"],
        I: ["kreativ", "unkonventionell", "neue wege", "experimentell", "risiko"],
        E: ["daten", "analyse", "fakten", "research", "systematisch", "methodisch", "bewährt"],
        C: ["team", "feedback", "konsens", "diskussion", "meinungen", "gemeinsam"]
      }
    },
    {
      id: 4,
      text: "Was ist deine Stärke in Teams?",
      dimension_focus: ["C", "I"],
      keywords: {
        V: ["führung", "richtung", "vision", "koordination", "strategie", "ziele"],
        I: ["ideen", "kreativität", "innovation", "neue ansätze", "problem lösung"],
        E: ["expertise", "wissen", "qualität", "analyse", "fachkompetenz", "präzision"],
        C: ["kommunikation", "vermittlung", "harmonie", "unterstützung", "zusammenhalt", "empathie"]
      }
    },
    {
      id: 5,
      text: "Wie gehst du mit Herausforderungen um?",
      dimension_focus: ["I", "E"],
      keywords: {
        V: ["strategisch", "langfristig", "big picture", "führung", "vision"],
        I: ["kreativ", "experimentell", "neue wege", "innovation", "flexibel", "anpassung"],
        E: ["systematisch", "methodisch", "analyse", "bewährt", "step by step", "gründlich"],
        C: ["team", "unterstützung", "gemeinsam", "feedback", "diskussion"]
      }
    },
    {
      id: 6,
      text: "Was schätzt du an deiner Arbeitsweise?",
      dimension_focus: ["E", "V"],
      keywords: {
        V: ["vision", "big picture", "führung", "strategie", "impact", "zukunft"],
        I: ["kreativität", "innovation", "flexibilität", "neue ideen", "experimentell"],
        E: ["qualität", "präzision", "expertise", "gründlichkeit", "systematisch", "zuverlässig"],
        C: ["teamwork", "kommunikation", "harmonie", "unterstützung", "empathie"]
      }
    },
    {
      id: 7,
      text: "Wie lernst du am besten?",
      dimension_focus: ["E", "I"],
      keywords: {
        V: ["big picture", "zusammenhänge", "strategie", "vision", "konzepte"],
        I: ["experimentell", "ausprobieren", "kreativ", "hands-on", "trial and error"],
        E: ["systematisch", "strukturiert", "step by step", "theorie", "fundament", "methodik"],
        C: ["diskussion", "austausch", "feedback", "gemeinsam", "mentoring"]
      }
    },
    {
      id: 8,
      text: "Was ist dir bei der Kommunikation wichtig?",
      dimension_focus: ["C", "V"],
      keywords: {
        V: ["klarheit", "vision", "richtung", "inspiration", "big picture", "ziele"],
        I: ["kreativität", "neue ideen", "brainstorming", "innovation", "flexibilität"],
        E: ["präzision", "fakten", "details", "qualität", "systematisch", "strukturiert"],
        C: ["empathie", "verständnis", "harmonie", "beziehung", "feedback", "zuhören"]
      }
    },
    {
      id: 9,
      text: "Wie planst du deine Arbeit?",
      dimension_focus: ["V", "E"],
      keywords: {
        V: ["strategisch", "langfristig", "vision", "big picture", "ziele", "roadmap"],
        I: ["flexibel", "spontan", "kreativ", "anpassung", "experimentell"],
        E: ["systematisch", "strukturiert", "detailliert", "methodisch", "step by step"],
        C: ["team", "abstimmung", "gemeinsam", "feedback", "konsens"]
      }
    },
    {
      id: 10,
      text: "Was treibt dich zur Höchstleistung an?",
      dimension_focus: ["V", "I"],
      keywords: {
        V: ["vision", "impact", "führung", "erfolg", "wachstum", "veränderung"],
        I: ["herausforderung", "kreativität", "innovation", "neues", "problem lösung"],
        E: ["perfektion", "qualität", "expertise", "können", "wissen", "kompetenz"],
        C: ["team", "menschen", "helfen", "zusammenarbeit", "harmonie"]
      }
    },
    {
      id: 11,
      text: "Wie gehst du mit Veränderungen um?",
      dimension_focus: ["I", "V"],
      keywords: {
        V: ["strategisch", "vision", "chancen", "führung", "langfristig", "anpassung"],
        I: ["flexibel", "kreativ", "experimentell", "neue wege", "innovation", "spontan"],
        E: ["systematisch", "analyse", "vorsichtig", "bewährt", "step by step"],
        C: ["team", "gemeinsam", "unterstützung", "diskussion", "konsens"]
      }
    },
    {
      id: 12,
      text: "Was ist dein ideales Arbeitsumfeld?",
      dimension_focus: ["C", "E"],
      keywords: {
        V: ["dynamisch", "wachstum", "führung", "vision", "impact", "strategisch"],
        I: ["kreativ", "flexibel", "innovation", "experimentell", "neue ideen"],
        E: ["strukturiert", "qualität", "expertise", "systematisch", "fokussiert"],
        C: ["team", "kollaborativ", "harmonie", "unterstützung", "kommunikation"]
      }
    }
  ];

  // Stage 2: Specific Type Questions based on primary dimension
  const stage2Questions = {
    V: [
      {
        id: "V1",
        text: "Du stehst vor einer wichtigen strategischen Entscheidung. Wie gehst du vor?",
        types: {
          V1: ["erkunde", "möglichkeiten", "optionen", "flexibel", "anpassung", "experimentell"],
          V2: ["entwickle", "plan", "systematisch", "struktur", "aufbau", "schritt für schritt"],
          V3: ["organisiere", "koordiniere", "team", "ressourcen", "effizienz", "umsetzung"]
        }
      },
      {
        id: "V2", 
        text: "Wie motivierst du andere für deine Vision?",
        types: {
          V1: ["inspiration", "möglichkeiten", "potential", "entdeckung", "neue wege"],
          V2: ["entwicklung", "wachstum", "aufbau", "systematisch", "fortschritt"],
          V3: ["organisation", "struktur", "klarheit", "effizienz", "koordination"]
        }
      },
      {
        id: "V3",
        text: "Was ist dein Fokus bei der Umsetzung von Zielen?",
        types: {
          V1: ["flexibilität", "anpassung", "neue ansätze", "exploration", "möglichkeiten"],
          V2: ["entwicklung", "aufbau", "systematisch", "wachstum", "fortschritt"],
          V3: ["organisation", "effizienz", "koordination", "struktur", "umsetzung"]
        }
      }
    ],
    I: [
      {
        id: "I1",
        text: "Wie entwickelst du neue Ideen?",
        types: {
          I1: ["kreation", "erschaffung", "neu", "original", "einzigartig", "künstlerisch"],
          I2: ["innovation", "verbesserung", "weiterentwicklung", "optimierung", "fortschritt"],
          I3: ["katalysator", "veränderung", "transformation", "disruption", "revolution"]
        }
      },
      {
        id: "I2",
        text: "Was ist dein Ansatz bei Problemlösungen?",
        types: {
          I1: ["kreativ", "künstlerisch", "original", "neu erschaffen", "einzigartig"],
          I2: ["innovativ", "verbessern", "weiterentwickeln", "optimieren", "fortschritt"],
          I3: ["transformieren", "revolutionieren", "disruptiv", "katalysator", "veränderung"]
        }
      },
      {
        id: "I3",
        text: "Wie bringst du Veränderungen voran?",
        types: {
          I1: ["kreative lösungen", "neue ansätze", "original", "künstlerisch"],
          I2: ["innovation", "verbesserung", "weiterentwicklung", "systematisch"],
          I3: ["transformation", "disruption", "katalysator", "revolution", "durchbruch"]
        }
      }
    ],
    E: [
      {
        id: "E1",
        text: "Wie baust du deine Expertise auf?",
        types: {
          E1: ["spezialisierung", "tiefe", "fokus", "meisterschaft", "expertise", "fachgebiet"],
          E2: ["analyse", "systematisch", "methodik", "strukturiert", "research", "daten"],
          E3: ["beratung", "weitergabe", "mentoring", "anleitung", "unterstützung", "hilfe"]
        }
      },
      {
        id: "E2",
        text: "Was ist dein Ansatz bei komplexen Aufgaben?",
        types: {
          E1: ["spezialist", "tiefe", "fokus", "expertise", "meisterschaft"],
          E2: ["analyse", "systematisch", "strukturiert", "methodik", "step by step"],
          E3: ["beratung", "anleitung", "unterstützung", "weitergabe", "hilfe"]
        }
      },
      {
        id: "E3",
        text: "Wie teilst du dein Wissen?",
        types: {
          E1: ["expertise", "spezialisierung", "tiefe", "fachkompetenz", "meisterschaft"],
          E2: ["systematisch", "strukturiert", "analyse", "methodik", "präzise"],
          E3: ["beratung", "mentoring", "anleitung", "unterstützung", "weitergabe"]
        }
      }
    ],
    C: [
      {
        id: "C1",
        text: "Wie baust du Beziehungen auf?",
        types: {
          C1: ["netzwerk", "verbindungen", "kontakte", "beziehungen", "networking", "austausch"],
          C2: ["zusammenarbeit", "kollaboration", "teamwork", "gemeinsam", "kooperation"],
          C3: ["unterstützung", "hilfe", "empathie", "fürsorge", "betreuung", "care"]
        }
      },
      {
        id: "C2",
        text: "Was ist dein Fokus in Teams?",
        types: {
          C1: ["vernetzung", "verbindungen", "kontakte", "austausch", "beziehungen"],
          C2: ["zusammenarbeit", "kollaboration", "teamwork", "synergie", "gemeinsam"],
          C3: ["unterstützung", "hilfe", "betreuung", "fürsorge", "empathie"]
        }
      },
      {
        id: "C3",
        text: "Wie hilfst du anderen am besten?",
        types: {
          C1: ["vernetzung", "kontakte", "verbindungen", "austausch", "beziehungen"],
          C2: ["zusammenarbeit", "kollaboration", "teamwork", "gemeinsam", "synergie"],
          C3: ["unterstützung", "betreuung", "fürsorge", "empathie", "hilfe", "care"]
        }
      }
    ]
  };

  // Hugo Type Definitions
  const hugoTypes = {
    V1: {
      name: "Pathfinder",
      description: "Du erkundest neue Möglichkeiten und Wege. Als Pathfinder öffnest du Türen zu unbekannten Territorien und inspirierst andere, dir zu folgen.",
      strengths: ["Exploration", "Flexibilität", "Möglichkeiten erkennen", "Anpassungsfähigkeit"],
      workStyle: "Flexibel und explorativ, immer auf der Suche nach neuen Möglichkeiten",
      communication: "Inspirierend und visionär, teilt Möglichkeiten und Potentiale",
      dimension: "Vision"
    },
    V2: {
      name: "Developer", 
      description: "Du entwickelst Visionen systematisch weiter. Als Developer baust du Brücken zwischen Vision und Realität durch strukturierte Entwicklung.",
      strengths: ["Systematische Entwicklung", "Aufbau", "Strukturierung", "Fortschritt"],
      workStyle: "Systematisch und aufbauend, entwickelt Visionen Schritt für Schritt",
      communication: "Strukturiert und entwicklungsorientiert, zeigt Wachstumswege auf",
      dimension: "Vision"
    },
    V3: {
      name: "Organizer",
      description: "Du organisierst und koordinierst die Umsetzung von Visionen. Als Organizer sorgst du für Effizienz und erfolgreiche Realisierung.",
      strengths: ["Organisation", "Koordination", "Effizienz", "Umsetzung"],
      workStyle: "Organisiert und koordinierend, fokussiert auf effiziente Umsetzung",
      communication: "Klar und strukturiert, koordiniert und organisiert Teams",
      dimension: "Vision"
    },
    I1: {
      name: "Creator",
      description: "Du erschaffst völlig neue Lösungen und Ansätze. Als Creator bringst du originelle und einzigartige Ideen hervor.",
      strengths: ["Kreation", "Originalität", "Einzigartigkeit", "Künstlerische Ansätze"],
      workStyle: "Kreativ und original, erschafft neue und einzigartige Lösungen",
      communication: "Kreativ und inspirierend, teilt originelle Ideen und Ansätze",
      dimension: "Innovation"
    },
    I2: {
      name: "Innovator",
      description: "Du verbesserst und entwickelst bestehende Lösungen weiter. Als Innovator treibst du kontinuierliche Verbesserung und Fortschritt voran.",
      strengths: ["Innovation", "Verbesserung", "Weiterentwicklung", "Optimierung"],
      workStyle: "Innovativ und verbessernd, entwickelt bestehende Lösungen weiter",
      communication: "Fortschrittsorientiert und verbessernd, zeigt Optimierungsmöglichkeiten",
      dimension: "Innovation"
    },
    I3: {
      name: "Catalyst",
      description: "Du katalysierst Veränderungen und Transformationen. Als Catalyst bringst du disruptive Veränderungen und Durchbrüche voran.",
      strengths: ["Transformation", "Disruption", "Katalysator", "Durchbrüche"],
      workStyle: "Transformativ und disruptiv, katalysiert große Veränderungen",
      communication: "Transformativ und durchbrechend, inspiriert zu radikalen Veränderungen",
      dimension: "Innovation"
    },
    E1: {
      name: "Specialist",
      description: "Du entwickelst tiefe Expertise in spezifischen Bereichen. Als Specialist bist du der Experte, zu dem andere kommen.",
      strengths: ["Spezialisierung", "Tiefe Expertise", "Meisterschaft", "Fachkompetenz"],
      workStyle: "Spezialisiert und fokussiert, entwickelt tiefe Expertise",
      communication: "Fachlich und präzise, teilt tiefes Expertenwissen",
      dimension: "Expertise"
    },
    E2: {
      name: "Analyst",
      description: "Du analysierst systematisch und strukturiert komplexe Sachverhalte. Als Analyst bringst du Klarheit in komplexe Situationen.",
      strengths: ["Systematische Analyse", "Strukturierung", "Methodik", "Präzision"],
      workStyle: "Analytisch und systematisch, strukturiert komplexe Aufgaben",
      communication: "Strukturiert und analytisch, erklärt komplexe Zusammenhänge",
      dimension: "Expertise"
    },
    E3: {
      name: "Advisor",
      description: "Du berätst und unterstützt andere mit deinem Wissen. Als Advisor hilfst du anderen, bessere Entscheidungen zu treffen.",
      strengths: ["Beratung", "Mentoring", "Wissensweitergabe", "Unterstützung"],
      workStyle: "Beratend und unterstützend, gibt Wissen weiter",
      communication: "Beratend und unterstützend, hilft anderen bei Entscheidungen",
      dimension: "Expertise"
    },
    C1: {
      name: "Networker",
      description: "Du baust Netzwerke und Verbindungen auf. Als Networker schaffst du wertvolle Beziehungen und Kontakte.",
      strengths: ["Networking", "Beziehungsaufbau", "Verbindungen", "Austausch"],
      workStyle: "Vernetzend und beziehungsorientiert, baut Kontakte auf",
      communication: "Beziehungsorientiert und vernetzend, schafft Verbindungen",
      dimension: "Connection"
    },
    C2: {
      name: "Collaborator",
      description: "Du förderst Zusammenarbeit und Teamwork. Als Collaborator schaffst du Synergien und gemeinsame Erfolge.",
      strengths: ["Zusammenarbeit", "Kollaboration", "Teamwork", "Synergie"],
      workStyle: "Kollaborativ und teamorientiert, fördert Zusammenarbeit",
      communication: "Kollaborativ und teamorientiert, fördert gemeinsame Arbeit",
      dimension: "Connection"
    },
    C3: {
      name: "Supporter",
      description: "Du unterstützt und betreust andere. Als Supporter sorgst du für das Wohlbefinden und die Entwicklung anderer.",
      strengths: ["Unterstützung", "Betreuung", "Empathie", "Fürsorge"],
      workStyle: "Unterstützend und fürsorgend, kümmert sich um andere",
      communication: "Empathisch und unterstützend, zeigt Fürsorge und Verständnis",
      dimension: "Connection"
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize assessment
  useEffect(() => {
    if (stage === 'intro') {
      setMessages([
        {
          type: 'bot',
          content: 'Willkommen zum Hugo Persönlichkeitsassessment! 🎯',
          timestamp: new Date()
        },
        {
          type: 'bot', 
          content: 'Ich bin Hugo, dein persönlicher Assessment-Guide. In den nächsten Minuten werden wir gemeinsam deinen einzigartigen Hugo-Persönlichkeitstyp entdecken.',
          timestamp: new Date()
        },
        {
          type: 'bot',
          content: 'Das Assessment besteht aus zwei Phasen:\n\n📊 **Phase 1**: Dimension Identification (12 Fragen)\n🎯 **Phase 2**: Type Specification (3 Fragen)\n\nLass uns beginnen! Wie heißt du?',
          timestamp: new Date()
        }
      ]);
    }
  }, [stage]);

  // Analyze text for dimension keywords
  const analyzeDimensionKeywords = (text, question) => {
    const scores = { V: 0, I: 0, E: 0, C: 0 };
    const lowerText = text.toLowerCase();
    
    Object.entries(question.keywords).forEach(([dimension, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          scores[dimension] += 1;
          // Give extra weight to focus dimensions
          if (question.dimension_focus.includes(dimension)) {
            scores[dimension] += 0.5;
          }
        }
      });
    });
    
    return scores;
  };

  // Analyze text for type keywords
  const analyzeTypeKeywords = (text, question, dimension) => {
    const scores = {};
    const lowerText = text.toLowerCase();
    
    Object.entries(question.types).forEach(([type, keywords]) => {
      scores[type] = 0;
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          scores[type] += 1;
        }
      });
    });
    
    return scores;
  };

  // Handle user input
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Handle different stages
    if (stage === 'intro') {
      setUserName(userInput);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: `Schön dich kennenzulernen, ${userInput}! 👋\n\nUm das Assessment zu personalisieren, benötige ich noch deine E-Mail-Adresse.`,
          timestamp: new Date()
        }]);
        setIsTyping(false);
        setStage('email');
      }, 1000);
    } else if (stage === 'email') {
      setUserEmail(userInput);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: `Perfekt! Eine letzte Frage zur Personalisierung: Aus welchem kulturellen Hintergrund kommst du? (z.B. Deutschland, international, etc.)\n\nDies hilft mir, die Ergebnisse besser zu interpretieren.`,
          timestamp: new Date()
        }]);
        setIsTyping(false);
        setStage('culture');
      }, 1000);
    } else if (stage === 'culture') {
      setCulturalBackground(userInput);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: `Danke ${userName}! 🎯\n\n**Phase 1: Dimension Identification**\n\nIch werde dir jetzt 12 Fragen stellen, um deine Hauptdimension zu identifieren. Antworte einfach natürlich und authentisch.\n\n**Frage 1/12:**\n${stage1Questions[0].text}`,
          timestamp: new Date()
        }]);
        setIsTyping(false);
        setStage('stage1');
        setCurrentQuestion(0);
      }, 1500);
    } else if (stage === 'stage1') {
      // Analyze answer for dimension keywords
      const question = stage1Questions[currentQuestion];
      const scores = analyzeDimensionKeywords(userInput, question);
      
      // Update dimension scores
      setDimensionScores(prev => ({
        V: prev.V + scores.V,
        I: prev.I + scores.I,
        E: prev.E + scores.E,
        C: prev.C + scores.C
      }));

      // Store answer
      setAnswers(prev => [...prev, {
        question: question.text,
        answer: userInput,
        scores: scores
      }]);

      setTimeout(() => {
        if (currentQuestion < stage1Questions.length - 1) {
          // Next question
          const nextQ = currentQuestion + 1;
          setMessages(prev => [...prev, {
            type: 'bot',
            content: `Danke für deine Antwort! 📝\n\n**Frage ${nextQ + 1}/12:**\n${stage1Questions[nextQ].text}`,
            timestamp: new Date()
          }]);
          setCurrentQuestion(nextQ);
        } else {
          // Phase 1 complete, determine primary dimension
          const finalScores = {
            V: dimensionScores.V + scores.V,
            I: dimensionScores.I + scores.I,
            E: dimensionScores.E + scores.E,
            C: dimensionScores.C + scores.C
          };
          
          const primary = Object.entries(finalScores).reduce((a, b) => 
            finalScores[a[0]] > finalScores[b[0]] ? a : b
          )[0];
          
          setPrimaryDimension(primary);
          
          const dimensionNames = {
            V: 'Vision',
            I: 'Innovation', 
            E: 'Expertise',
            C: 'Connection'
          };
          
          setMessages(prev => [...prev, {
            type: 'bot',
            content: `Ausgezeichnet! 🎉\n\n**Phase 1 abgeschlossen!**\n\nDeine Hauptdimension ist: **${dimensionNames[primary]}**\n\n**Phase 2: Type Specification**\n\nJetzt werden wir deinen spezifischen Hugo-Typ innerhalb der ${dimensionNames[primary]}-Dimension bestimmen.\n\n**Frage 1/3:**\n${stage2Questions[primary][0].text}`,
            timestamp: new Date()
          }]);
          setStage('stage2');
          setCurrentQuestion(0);
        }
        setIsTyping(false);
      }, 1500);
    } else if (stage === 'stage2') {
      // Analyze answer for type keywords
      const question = stage2Questions[primaryDimension][currentQuestion];
      const typeScores = analyzeTypeKeywords(userInput, question, primaryDimension);
      
      // Store answer with type scores
      setAnswers(prev => [...prev, {
        question: question.text,
        answer: userInput,
        typeScores: typeScores
      }]);

      setTimeout(() => {
        if (currentQuestion < 2) {
          // Next question
          const nextQ = currentQuestion + 1;
          setMessages(prev => [...prev, {
            type: 'bot',
            content: `Interessant! 🤔\n\n**Frage ${nextQ + 1}/3:**\n${stage2Questions[primaryDimension][nextQ].text}`,
            timestamp: new Date()
          }]);
          setCurrentQuestion(nextQ);
        } else {
          // Assessment complete, calculate final type
          setIsLoading(true);
          setMessages(prev => [...prev, {
            type: 'bot',
            content: `Fantastisch! 🎯\n\nIch analysiere jetzt deine Antworten und bestimme deinen Hugo-Typ...\n\n⏳ Einen Moment bitte...`,
            timestamp: new Date()
          }]);
          
          // Calculate final type
          setTimeout(() => {
            const typeAnswers = answers.slice(-2).concat([{
              question: question.text,
              answer: userInput,
              typeScores: typeScores
            }]);
            
            const finalTypeScores = {};
            Object.keys(stage2Questions[primaryDimension][0].types).forEach(type => {
              finalTypeScores[type] = 0;
            });
            
            typeAnswers.forEach(answer => {
              if (answer.typeScores) {
                Object.entries(answer.typeScores).forEach(([type, score]) => {
                  finalTypeScores[type] += score;
                });
              }
            });
            
            const finalType = Object.entries(finalTypeScores).reduce((a, b) => 
              finalTypeScores[a[0]] > finalTypeScores[b[0]] ? a : b
            )[0];
            
            setFinalResult(finalType);
            setStage('results');
            setIsLoading(false);
            
            const typeInfo = hugoTypes[finalType];
            setMessages(prev => [...prev, {
              type: 'bot',
              content: `🎉 **Dein Hugo-Typ ist bestimmt!**\n\n**${finalType} - ${typeInfo.name}**\n\n${typeInfo.description}\n\n**Deine Stärken:**\n${typeInfo.strengths.map(s => `• ${s}`).join('\n')}\n\n**Dein Arbeitsstil:**\n${typeInfo.workStyle}\n\n**Deine Kommunikation:**\n${typeInfo.communication}\n\nMöchtest du mehr Details zu deinem Typ erfahren?`,
              timestamp: new Date()
            }]);
          }, 3000);
        }
        setIsTyping(false);
      }, 1500);
    } else if (stage === 'results') {
      // Handle post-assessment questions
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: `Vielen Dank für dein Feedback! 😊\n\nDein Assessment ist jetzt abgeschlossen. Du kannst:\n\n• Dein Profil in deinem Dashboard ansehen\n• Mehr über deinen Hugo-Typ erfahren\n• Sehen, wie du mit anderen Typen zusammenarbeitest\n\nViel Erfolg mit deinem neuen Hugo-Wissen! 🚀`,
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 1000);
    }

    setUserInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Hamburger Menu */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Back Button and Title */}
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900">Hugo Assessment</h1>
            </div>
            
            {/* User Info and Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.first_name} {user?.last_name}
              </span>
              
              {/* Hamburger Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.first_name} {user?.last_name}</div>
                      <div className="text-gray-500">{user?.email}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {user?.role === 'hugo_manager' ? 'Platform Administrator' : 
                         user?.role === 'hr_manager' ? 'Company Administrator' : 'Team Member'}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg className="inline h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Progress Indicator */}
          {stage !== 'intro' && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Assessment Progress</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {stage === 'stage1' && (
                      <Badge variant="outline">Phase 1: {currentQuestion + 1}/12</Badge>
                    )}
                    {stage === 'stage2' && (
                      <Badge variant="outline">Phase 2: {currentQuestion + 1}/3</Badge>
                    )}
                    {stage === 'results' && (
                      <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    )}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: stage === 'intro' || stage === 'email' || stage === 'culture' ? '10%' :
                             stage === 'stage1' ? `${20 + (currentQuestion / 12) * 60}%` :
                             stage === 'stage2' ? `${80 + (currentQuestion / 3) * 15}%` :
                             '100%'
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Interface */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold">H</span>
                </div>
                Hugo Assessment Chat
                {isTyping && (
                  <div className="flex items-center space-x-1 ml-auto">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Deine Antwort..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isTyping || isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isTyping || isLoading || !userInput.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          {stage === 'results' && finalResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  Dein Hugo-Typ: {finalResult} - {hugoTypes[finalResult].name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Dimension</h4>
                    <Badge className="mb-4">{hugoTypes[finalResult].dimension}</Badge>
                    
                    <h4 className="font-semibold mb-2">Beschreibung</h4>
                    <p className="text-gray-600 mb-4">{hugoTypes[finalResult].description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Deine Stärken</h4>
                    <ul className="space-y-1 mb-4">
                      {hugoTypes[finalResult].strengths.map((strength, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-sm">Arbeitsstil:</span>
                        <p className="text-sm text-gray-600">{hugoTypes[finalResult].workStyle}</p>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Kommunikation:</span>
                        <p className="text-sm text-gray-600">{hugoTypes[finalResult].communication}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}
