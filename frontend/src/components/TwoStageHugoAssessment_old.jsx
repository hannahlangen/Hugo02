import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Send, User, Clock, CheckCircle, Users, Trophy, Target } from 'lucide-react'

// Two-Stage Hugo Assessment Component
export default function TwoStageHugoAssessment() {
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
  const messagesEndRef = useRef(null)

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
      dimension_focus: ["V", "E"],
      keywords: {
        V: ["intuition", "big picture", "strategie", "langfristig", "vision", "bauchgefühl", "überblick"],
        I: ["kreativ", "unkonventionell", "spontan", "flexibel", "experimentell", "risiko", "neu"],
        E: ["analyse", "daten", "fakten", "research", "systematisch", "gründlich", "beweis", "logik"],
        C: ["team", "konsens", "feedback", "gemeinsam", "abstimmung", "andere", "diskussion"]
      }
    },
    {
      id: 4,
      text: "Welche Rolle übernimmst du typischerweise in Teams?",
      dimension_focus: ["V", "C"],
      keywords: {
        V: ["führung", "leitung", "koordination", "strategie", "richtung", "vision", "ziele", "organisation"],
        I: ["ideengeber", "kreativ", "innovation", "brainstorm", "lösungen", "neu", "anders", "inspiration"],
        E: ["experte", "berater", "qualität", "fachlich", "wissen", "analyse", "kompetenz", "standard"],
        C: ["vermittler", "unterstützung", "harmonie", "team", "zusammenhalt", "motivation", "hilfe"]
      }
    },
    {
      id: 5,
      text: "Was ist dein Ansatz bei Problemen?",
      dimension_focus: ["I", "E"],
      keywords: {
        V: ["systematisch", "strategisch", "strukturiert", "plan", "übersicht", "koordination", "ziel"],
        I: ["kreativ", "unkonventionell", "brainstorm", "experiment", "neu", "anders", "flexibel"],
        E: ["analyse", "research", "daten", "methodik", "gründlich", "systematisch", "bewährt", "fakten"],
        C: ["team", "gemeinsam", "diskussion", "feedback", "zusammen", "unterstützung", "konsens"]
      }
    },
    {
      id: 6,
      text: "Wie kommunizierst du deine Ideen?",
      dimension_focus: ["V", "C"],
      keywords: {
        V: ["präsentation", "überzeugend", "vision", "big picture", "strategie", "führung", "klar", "direkt"],
        I: ["kreativ", "visuell", "storytelling", "begeisterung", "inspiration", "neu", "anders"],
        E: ["fakten", "daten", "detailliert", "präzise", "fachlich", "fundiert", "analyse", "beweis"],
        C: ["empathisch", "zuhören", "feedback", "diskussion", "gemeinsam", "verständnis", "harmonie"]
      }
    },
    {
      id: 7,
      text: "Was schätzt du an erfolgreichen Projekten am meisten?",
      dimension_focus: ["V", "E"],
      keywords: {
        V: ["impact", "veränderung", "wachstum", "erfolg", "ziele", "vision", "fortschritt", "führung"],
        I: ["innovation", "kreativität", "neu", "anders", "experiment", "lösung", "herausforderung"],
        E: ["qualität", "perfektion", "expertise", "standard", "fachlich", "kompetenz", "gründlich"],
        C: ["teamwork", "zusammenarbeit", "harmonie", "menschen", "beziehung", "unterstützung", "gemeinsam"]
      }
    },
    {
      id: 8,
      text: "Wie gehst du mit Veränderungen um?",
      dimension_focus: ["I", "V"],
      keywords: {
        V: ["strategie", "plan", "koordination", "führung", "struktur", "ziel", "organisation", "übersicht"],
        I: ["flexibel", "anpassung", "chance", "experiment", "neu", "kreativ", "spontan", "offen"],
        E: ["analyse", "vorsichtig", "gründlich", "bewährt", "risiko", "fakten", "systematisch"],
        C: ["team", "gemeinsam", "unterstützung", "feedback", "diskussion", "zusammen", "harmonie"]
      }
    },
    {
      id: 9,
      text: "Was ist dein Fokus bei der Arbeit?",
      dimension_focus: ["E", "C"],
      keywords: {
        V: ["strategie", "vision", "ziele", "big picture", "führung", "wachstum", "erfolg", "impact"],
        I: ["innovation", "kreativität", "neu", "experiment", "herausforderung", "lösung", "anders"],
        E: ["qualität", "expertise", "perfektion", "fachlich", "kompetenz", "standard", "gründlich", "wissen"],
        C: ["menschen", "team", "beziehung", "harmonie", "unterstützung", "zusammenarbeit", "hilfe"]
      }
    },
    {
      id: 10,
      text: "Wie lernst du am besten?",
      dimension_focus: ["E", "I"],
      keywords: {
        V: ["strategie", "big picture", "führung", "ziele", "vision", "übersicht", "koordination"],
        I: ["experiment", "ausprobieren", "kreativ", "neu", "anders", "flexibel", "spielerisch"],
        E: ["systematisch", "gründlich", "analyse", "research", "fakten", "methodik", "struktur", "tiefe"],
        C: ["diskussion", "feedback", "team", "gemeinsam", "austausch", "mentoring", "unterstützung"]
      }
    },
    {
      id: 11,
      text: "Was ist deine Stärke in schwierigen Situationen?",
      dimension_focus: ["V", "C"],
      keywords: {
        V: ["führung", "koordination", "strategie", "übersicht", "richtung", "entscheidung", "ziel"],
        I: ["kreativität", "flexibilität", "lösungen", "neu", "anders", "anpassung", "innovation"],
        E: ["analyse", "expertise", "gründlich", "systematisch", "fakten", "kompetenz", "qualität"],
        C: ["vermittlung", "harmonie", "team", "unterstützung", "empathie", "zusammenhalt", "hilfe"]
      }
    },
    {
      id: 12,
      text: "Wie definierst du beruflichen Erfolg?",
      dimension_focus: ["V", "E"],
      keywords: {
        V: ["impact", "führung", "wachstum", "vision", "veränderung", "ziele", "erfolg", "fortschritt"],
        I: ["innovation", "kreativität", "neu", "herausforderung", "experiment", "anders", "lösung"],
        E: ["expertise", "qualität", "kompetenz", "perfektion", "fachlich", "wissen", "standard", "können"],
        C: ["team", "menschen", "beziehung", "harmonie", "unterstützung", "zusammenarbeit", "hilfe"]
      }
    }
  ]

  // Stage 2: Subtype Questions (dimension-specific)
  const stage2Questions = {
    V: [
      {
        id: "V1",
        text: "Wie gehst du an strategische Planung heran?",
        keywords: {
          V1: ["systematisch", "struktur", "plan", "methodik", "organisation", "koordination", "prozess"],
          V2: ["flexibel", "anpassung", "dynamisch", "agil", "reaktion", "situativ", "pragmatisch"],
          V3: ["menschen", "team", "führung", "motivation", "inspiration", "vision", "gemeinsam"]
        }
      },
      {
        id: "V2", 
        text: "Wie motivierst du andere für deine Vision?",
        keywords: {
          V1: ["fakten", "daten", "logik", "systematisch", "struktur", "plan", "methodik"],
          V2: ["flexibel", "pragmatisch", "situativ", "anpassung", "reaktion", "dynamisch", "agil"],
          V3: ["begeisterung", "inspiration", "emotion", "menschen", "team", "führung", "vision"]
        }
      },
      {
        id: "V3",
        text: "Was ist dein Führungsstil?",
        keywords: {
          V1: ["systematisch", "struktur", "prozess", "organisation", "koordination", "plan", "methodik"],
          V2: ["flexibel", "situativ", "pragmatisch", "anpassung", "dynamisch", "agil", "reaktion"],
          V3: ["inspirierend", "motivierend", "menschen", "team", "vision", "führung", "gemeinsam"]
        }
      }
    ],
    I: [
      {
        id: "I1",
        text: "Wie entwickelst du neue Ideen?",
        keywords: {
          I1: ["systematisch", "methodik", "struktur", "analyse", "research", "gründlich", "prozess"],
          I2: ["spontan", "brainstorm", "kreativ", "flexibel", "experiment", "spielerisch", "frei"],
          I3: ["team", "gemeinsam", "diskussion", "feedback", "austausch", "kollaboration", "zusammen"]
        }
      },
      {
        id: "I2",
        text: "Wie testest du deine Innovationen?",
        keywords: {
          I1: ["systematisch", "methodik", "analyse", "gründlich", "struktur", "plan", "prozess"],
          I2: ["experiment", "ausprobieren", "schnell", "flexibel", "spontan", "iterativ", "agil"],
          I3: ["feedback", "team", "gemeinsam", "diskussion", "austausch", "kollaboration", "zusammen"]
        }
      },
      {
        id: "I3",
        text: "Wie bringst du Kreativität ins Team?",
        keywords: {
          I1: ["systematisch", "struktur", "methodik", "organisation", "prozess", "plan", "koordination"],
          I2: ["spontan", "flexibel", "experiment", "spielerisch", "frei", "brainstorm", "kreativ"],
          I3: ["workshop", "team", "gemeinsam", "kollaboration", "diskussion", "austausch", "inspiration"]
        }
      }
    ],
    E: [
      {
        id: "E1",
        text: "Wie baust du deine Expertise auf?",
        keywords: {
          E1: ["systematisch", "gründlich", "struktur", "methodik", "analyse", "research", "tiefe"],
          E2: ["praktisch", "anwendung", "erfahrung", "hands-on", "pragmatisch", "real", "konkret"],
          E3: ["austausch", "mentoring", "lehren", "teilen", "diskussion", "feedback", "gemeinsam"]
        }
      },
      {
        id: "E2",
        text: "Wie gibst du dein Wissen weiter?",
        keywords: {
          E1: ["systematisch", "struktur", "methodik", "gründlich", "analyse", "detailliert", "präzise"],
          E2: ["praktisch", "beispiele", "anwendung", "hands-on", "konkret", "erfahrung", "real"],
          E3: ["mentoring", "coaching", "unterstützung", "geduld", "empathie", "individuell", "persönlich"]
        }
      },
      {
        id: "E3",
        text: "Wie sicherst du Qualität?",
        keywords: {
          E1: ["systematisch", "prozess", "methodik", "standard", "struktur", "kontrolle", "gründlich"],
          E2: ["praktisch", "erfahrung", "bewährt", "pragmatisch", "real", "konkret", "anwendung"],
          E3: ["team", "feedback", "gemeinsam", "unterstützung", "kollaboration", "austausch", "mentoring"]
        }
      }
    ],
    C: [
      {
        id: "C1",
        text: "Wie baust du Beziehungen auf?",
        keywords: {
          C1: ["systematisch", "struktur", "organisation", "plan", "methodik", "koordination", "prozess"],
          C2: ["natürlich", "spontan", "flexibel", "situativ", "anpassung", "pragmatisch", "authentisch"],
          C3: ["empathie", "verständnis", "unterstützung", "hilfe", "fürsorge", "persönlich", "individuell"]
        }
      },
      {
        id: "C2",
        text: "Wie löst du Konflikte?",
        keywords: {
          C1: ["systematisch", "struktur", "prozess", "methodik", "organisation", "plan", "koordination"],
          C2: ["flexibel", "situativ", "pragmatisch", "anpassung", "vermittlung", "ausgleich", "balance"],
          C3: ["empathie", "verständnis", "unterstützung", "fürsorge", "persönlich", "individuell", "hilfe"]
        }
      },
      {
        id: "C3",
        text: "Wie unterstützt du Teammitglieder?",
        keywords: {
          C1: ["systematisch", "struktur", "organisation", "koordination", "prozess", "plan", "methodik"],
          C2: ["flexibel", "situativ", "pragmatisch", "anpassung", "ausgleich", "vermittlung", "balance"],
          C3: ["empathie", "fürsorge", "persönlich", "individuell", "unterstützung", "verständnis", "hilfe"]
        }
      }
    ]
  }

  // Hugo Type Definitions
  const hugoTypes = {
    V1: {
      name: "Der Stratege",
      description: "Systematischer Visionär mit strukturiertem Ansatz",
      dimension: "Vision",
      color: "bg-blue-500",
      strengths: ["Strategische Planung", "Systematisches Denken", "Strukturierte Umsetzung"],
      development: ["Flexibilität erhöhen", "Spontaneität entwickeln", "Emotionale Intelligenz stärken"]
    },
    V2: {
      name: "Der Pragmatiker", 
      description: "Flexibler Visionär mit adaptivem Ansatz",
      dimension: "Vision",
      color: "bg-blue-400",
      strengths: ["Adaptive Strategien", "Pragmatische Lösungen", "Situative Führung"],
      development: ["Langfristige Planung", "Systematik entwickeln", "Konsistenz verbessern"]
    },
    V3: {
      name: "Der Inspirator",
      description: "Menschen-orientierter Visionär mit motivierendem Ansatz", 
      dimension: "Vision",
      color: "bg-blue-600",
      strengths: ["Inspirierende Führung", "Menschen motivieren", "Vision vermitteln"],
      development: ["Strukturierung verbessern", "Detailplanung stärken", "Systematik entwickeln"]
    },
    I1: {
      name: "Der Forscher",
      description: "Systematischer Innovator mit methodischem Ansatz",
      dimension: "Innovation", 
      color: "bg-purple-500",
      strengths: ["Systematische Innovation", "Methodische Kreativität", "Strukturierte Experimente"],
      development: ["Spontaneität erhöhen", "Flexibilität entwickeln", "Schnellere Iteration"]
    },
    I2: {
      name: "Der Experimentator",
      description: "Spontaner Innovator mit flexiblem Ansatz",
      dimension: "Innovation",
      color: "bg-purple-400", 
      strengths: ["Schnelle Experimente", "Flexible Innovation", "Spontane Kreativität"],
      development: ["Systematik entwickeln", "Struktur verbessern", "Langfristige Planung"]
    },
    I3: {
      name: "Der Kollaborator",
      description: "Team-orientierter Innovator mit kollaborativem Ansatz",
      dimension: "Innovation",
      color: "bg-purple-600",
      strengths: ["Kollaborative Innovation", "Team-Kreativität", "Gemeinsame Ideenfindung"],
      development: ["Eigeninitiative stärken", "Individuelle Kreativität", "Selbstständigkeit entwickeln"]
    },
    E1: {
      name: "Der Analyst",
      description: "Systematischer Experte mit methodischem Ansatz",
      dimension: "Expertise",
      color: "bg-green-500",
      strengths: ["Tiefe Analyse", "Systematische Expertise", "Methodisches Vorgehen"],
      development: ["Praktische Anwendung", "Flexibilität erhöhen", "Kommunikation verbessern"]
    },
    E2: {
      name: "Der Praktiker", 
      description: "Anwendungs-orientierter Experte mit pragmatischem Ansatz",
      dimension: "Expertise",
      color: "bg-green-400",
      strengths: ["Praktische Expertise", "Anwendungsorientierung", "Pragmatische Lösungen"],
      development: ["Theoretisches Fundament", "Systematik entwickeln", "Langfristige Perspektive"]
    },
    E3: {
      name: "Der Mentor",
      description: "Menschen-orientierter Experte mit unterstützendem Ansatz",
      dimension: "Expertise", 
      color: "bg-green-600",
      strengths: ["Wissenstransfer", "Mentoring", "Unterstützende Expertise"],
      development: ["Eigenständigkeit fördern", "Systematik stärken", "Strukturierung verbessern"]
    },
    C1: {
      name: "Der Koordinator",
      description: "Systematischer Connector mit strukturiertem Ansatz",
      dimension: "Connection",
      color: "bg-orange-500", 
      strengths: ["Systematische Vernetzung", "Strukturierte Kommunikation", "Organisierte Zusammenarbeit"],
      development: ["Spontaneität entwickeln", "Emotionale Flexibilität", "Natürlichkeit stärken"]
    },
    C2: {
      name: "Der Vermittler",
      description: "Flexibler Connector mit ausgleichendem Ansatz",
      dimension: "Connection",
      color: "bg-orange-400",
      strengths: ["Flexible Vermittlung", "Situative Kommunikation", "Ausgleichende Führung"],
      development: ["Struktur entwickeln", "Konsistenz verbessern", "Systematik stärken"]
    },
    C3: {
      name: "Der Unterstützer", 
      description: "Empathischer Connector mit fürsorglichem Ansatz",
      dimension: "Connection",
      color: "bg-orange-600",
      strengths: ["Empathische Unterstützung", "Persönliche Beziehungen", "Fürsorgliche Führung"],
      development: ["Grenzen setzen", "Strukturierung verbessern", "Systematik entwickeln"]
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (stage === 'intro') {
      addMessage("Hallo! Ich bin Hugo, dein persönlicher Persönlichkeitsexperte. 👋", 'bot')
      setTimeout(() => {
        addMessage("Schön, dass du hier bist! Wie soll ich dich nennen?", 'bot')
      }, 1000)
    }
  }, [])

  const addMessage = (text, sender, delay = 0) => {
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text,
        sender,
        timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      }])
    }, delay)
  }

  const simulateTyping = (duration = 2000) => {
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), duration)
  }

  const analyzeAnswer = (answer, question) => {
    const lowerAnswer = answer.toLowerCase()
    const scores = { V: 0, I: 0, E: 0, C: 0 }
    
    // Analyze keywords for each dimension
    Object.entries(question.keywords).forEach(([dimension, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerAnswer.includes(keyword.toLowerCase())) {
          scores[dimension] += 1
        }
      })
    })
    
    // Add bonus points for dimension focus
    if (question.dimension_focus) {
      question.dimension_focus.forEach(dim => {
        scores[dim] += 0.5
      })
    }
    
    return scores
  }

  const analyzeSubtypeAnswer = (answer, question, dimension) => {
    const lowerAnswer = answer.toLowerCase()
    const scores = { 1: 0, 2: 0, 3: 0 }
    
    Object.entries(question.keywords).forEach(([subtype, keywords]) => {
      const subtypeNum = subtype.slice(-1) // Get number from V1, V2, etc.
      keywords.forEach(keyword => {
        if (lowerAnswer.includes(keyword.toLowerCase())) {
          scores[subtypeNum] += 1
        }
      })
    })
    
    return scores
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userInput.trim()) return

    const currentInput = userInput.trim()
    setUserInput('')
    
    // Add user message
    addMessage(currentInput, 'user')
    
    simulateTyping()

    if (stage === 'intro') {
      setUserName(currentInput)
      setTimeout(() => {
        addMessage(`Freut mich, ${currentInput}! Um dir die bestmöglichen Team-Empfehlungen zu geben, nutzen wir die Culture Map Theorie von Erin Meyer. Diese hilft uns, kulturelle Unterschiede in internationalen Teams zu verstehen und zu nutzen. 🌍`, 'bot')
        setTimeout(() => {
          addMessage("In welchem Land hast du hauptsächlich deine Kindheit und Jugend verbracht? Das prägt oft unsere Arbeits- und Kommunikationsstile.", 'bot')
        }, 2000)
      }, 2000)
      setStage('cultural')
    } else if (stage === 'cultural') {
      setCulturalBackground(currentInput)
      setTimeout(() => {
        addMessage("Danke! Jetzt starten wir mit dem Assessment. Ich stelle dir zunächst 12 Fragen, um deine Hauptdimension zu identifieren, und dann weitere spezifische Fragen für deinen genauen Typ.", 'bot')
        setTimeout(() => {
          addMessage("Sei ehrlich und authentisch - es gibt keine richtigen oder falschen Antworten! 😊", 'bot')
          setTimeout(() => {
            setStage('stage1')
            setCurrentQuestion(0)
            setTimeout(() => {
              addMessage(`Frage 1 von 12: ${stage1Questions[0].text}`, 'bot')
            }, 1000)
          }, 1500)
        }, 2000)
      }, 2000)
    } else if (stage === 'stage1') {
      // Analyze Stage 1 answer
      const question = stage1Questions[currentQuestion]
      const scores = analyzeAnswer(currentInput, question)
      
      // Update dimension scores
      setDimensionScores(prev => ({
        V: prev.V + scores.V,
        I: prev.I + scores.I,
        E: prev.E + scores.E,
        C: prev.C + scores.C
      }))
      
      // Store answer
      setAnswers(prev => [...prev, { question: question.text, answer: currentInput, scores }])
      
      if (currentQuestion < stage1Questions.length - 1) {
        // Next question
        const nextQ = currentQuestion + 1
        setCurrentQuestion(nextQ)
        setTimeout(() => {
          addMessage(`Frage ${nextQ + 1} von 12: ${stage1Questions[nextQ].text}`, 'bot')
        }, 2000)
      } else {
        // Stage 1 complete - determine primary dimension
        setTimeout(() => {
          const finalScores = {
            V: dimensionScores.V + scores.V,
            I: dimensionScores.I + scores.I,
            E: dimensionScores.E + scores.E,
            C: dimensionScores.C + scores.C
          }
          
          const primary = Object.entries(finalScores).reduce((a, b) => 
            finalScores[a[0]] > finalScores[b[0]] ? a : b
          )[0]
          
          setPrimaryDimension(primary)
          
          const dimensionNames = {
            V: "Vision", I: "Innovation", E: "Expertise", C: "Connection"
          }
          
          addMessage(`Großartig! Deine Hauptdimension ist: **${dimensionNames[primary]}** 🎯`, 'bot')
          setTimeout(() => {
            addMessage("Jetzt stelle ich dir 3 spezifische Fragen, um deinen genauen Subtyp zu bestimmen.", 'bot')
            setTimeout(() => {
              setStage('stage2')
              setCurrentQuestion(0)
              setTimeout(() => {
                addMessage(`Frage 1 von 3: ${stage2Questions[primary][0].text}`, 'bot')
              }, 1000)
            }, 2000)
          }, 2000)
        }, 2000)
      }
    } else if (stage === 'stage2') {
      // Analyze Stage 2 answer
      const question = stage2Questions[primaryDimension][currentQuestion]
      const subtypeScores = analyzeSubtypeAnswer(currentInput, question, primaryDimension)
      
      // Store answer with subtype scores
      setAnswers(prev => [...prev, { 
        question: question.text, 
        answer: currentInput, 
        subtypeScores,
        stage: 'stage2'
      }])
      
      if (currentQuestion < stage2Questions[primaryDimension].length - 1) {
        // Next question
        const nextQ = currentQuestion + 1
        setCurrentQuestion(nextQ)
        setTimeout(() => {
          addMessage(`Frage ${nextQ + 1} von 3: ${stage2Questions[primaryDimension][nextQ].text}`, 'bot')
        }, 2000)
      } else {
        // Assessment complete - determine final type
        setTimeout(() => {
          // Calculate subtype scores
          const subtypeScores = { 1: 0, 2: 0, 3: 0 }
          
          answers.filter(a => a.stage === 'stage2').forEach(answer => {
            Object.entries(answer.subtypeScores).forEach(([subtype, score]) => {
              subtypeScores[subtype] += score
            })
          })
          
          // Add current answer
          Object.entries(subtypeScores).forEach(([subtype, score]) => {
            subtypeScores[subtype] += score
          })
          
          const finalSubtype = Object.entries(subtypeScores).reduce((a, b) => 
            subtypeScores[a[0]] > subtypeScores[b[0]] ? a : b
          )[0]
          
          const finalType = `${primaryDimension}${finalSubtype}`
          const typeInfo = hugoTypes[finalType]
          
          setFinalResult({ type: finalType, info: typeInfo })
          
          addMessage("🎉 Fantastisch! Dein Assessment ist abgeschlossen!", 'bot')
          setTimeout(() => {
            addMessage(`Du bist ein **${typeInfo.name}** (${finalType})`, 'bot')
            setTimeout(() => {
              addMessage(`${typeInfo.description}`, 'bot')
              setTimeout(() => {
                setStage('results')
              }, 2000)
            }, 2000)
          }, 2000)
        }, 2000)
      }
    }
  }

  const getQuestionProgress = () => {
    if (stage === 'stage1') {
      return `Frage ${currentQuestion + 1} von 12 - Dimension bestimmen`
    } else if (stage === 'stage2') {
      return `Frage ${currentQuestion + 1} von 3 - ${primaryDimension}-Subtyp bestimmen`
    }
    return "Hugo Assessment"
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src="/hugo-avatar-transparent.png" 
                alt="Hugo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Hugo Assessment
              </CardTitle>
              <p className="text-sm text-gray-600">
                Zweistufiges Persönlichkeitsassessment
              </p>
            </div>
          </div>
          {(stage === 'stage1' || stage === 'stage2') && (
            <Badge variant="outline" className="text-xs">
              {getQuestionProgress()}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
                    {message.sender === 'bot' ? (
                      <img 
                        src="/hugo-avatar-transparent.png" 
                        alt="Hugo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className={`rounded-lg px-3 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src="/hugo-avatar-transparent.png" 
                    alt="Hugo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Results Display */}
        {stage === 'results' && finalResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border-t bg-gradient-to-r from-blue-50 to-purple-50"
          >
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${finalResult.info.color} text-white text-2xl font-bold mb-4`}>
                {finalResult.type}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {finalResult.info.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {finalResult.info.description}
              </p>
              <Badge className={`${finalResult.info.color} text-white`}>
                Dimension: {finalResult.info.dimension}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                  Deine Stärken
                </h4>
                <ul className="space-y-2">
                  {finalResult.info.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-blue-500" />
                  Entwicklungsbereiche
                </h4>
                <ul className="space-y-2">
                  {finalResult.info.development.map((area, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <Target className="w-4 h-4 mr-2 text-blue-500" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2 text-purple-500" />
                Team-Integration
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Basierend auf deinem Typ und kulturellen Hintergrund ({culturalBackground}) werden wir dich dem optimalen Team zuordnen.
              </p>
              <div className="flex items-center justify-center">
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  onClick={() => {
                    // Here we would trigger the team integration
                    addMessage("🎯 Perfekt! Du wirst automatisch dem passenden Team zugeordnet. Willkommen im Team!", 'bot')
                  }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Team-Zuordnung starten
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Input Form */}
        {stage !== 'results' && (
          <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
            <div className="flex space-x-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Deine Antwort hier eingeben..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                type="submit" 
                disabled={!userInput.trim() || isTyping}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Drücke Enter zum Senden • Sei ehrlich und authentisch für die besten Ergebnisse
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
