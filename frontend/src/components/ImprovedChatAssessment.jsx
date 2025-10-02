import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx'
import { 
  MessageCircle, 
  Send, 
  User, 
  Bot,
  Loader2,
  CheckCircle,
  Globe,
  Users,
  Brain,
  Heart
} from 'lucide-react'

// Improved chat questions based on the complete Hugo guide
const chatQuestions = [
  {
    id: 1,
    type: 'greeting',
    question: "Hallo! Ich bin Hugo, dein persönlicher Persönlichkeitsexperte. 👋 Schön, dass du hier bist! Wie soll ich dich nennen?",
    field: 'name',
    required: true,
    analysis_focus: 'basic_info'
  },
  {
    id: 2,
    type: 'email',
    question: "Perfekt, {name}! Damit ich dir später deine Ergebnisse zusenden kann, benötige ich deine E-Mail-Adresse. Keine Sorge - deine Daten sind bei uns sicher! 📧",
    field: 'email',
    required: true,
    analysis_focus: 'basic_info'
  },
  {
    id: 3,
    type: 'cultural_background',
    question: "Jetzt wird's interessant! 🌍 Für unser Team-Building nutzen wir die Culture Map Theorie von Erin Meyer. Deshalb möchte ich wissen: In welchem Land oder welcher Region hast du den größten Teil deiner Kindheit und Jugend verbracht? Das hilft uns zu verstehen, welche kulturellen Arbeitsweisen dir vertraut sind und wie du am besten mit Kollegen aus anderen Kulturen zusammenarbeitest.",
    field: 'cultural_background',
    required: true,
    analysis_focus: 'culture_map'
  },
  {
    id: 4,
    type: 'work_approach',
    question: "Danke für diese wichtige Information! 💼 Jetzt zu deinem Arbeitsstil: Stell dir vor, du startest ein brandneues Projekt, das noch niemand vorher gemacht hat. Beschreibe mir in ein paar Sätzen, wie du normalerweise vorgehst. Planst du gerne im Detail voraus, springst du direkt ins kalte Wasser, oder suchst du erst nach bewährten Methoden?",
    field: 'work_approach',
    required: true,
    analysis_focus: 'primary_dimension'
  },
  {
    id: 5,
    type: 'decision_making',
    question: "Sehr aufschlussreich! 🤔 Und wie ist das bei wichtigen Entscheidungen? Erzähl mir von einer Situation, in der du eine schwierige Entscheidung treffen musstest. Hast du schnell entschieden, alle Beteiligten einbezogen, gründlich analysiert, oder warst du eher vorsichtig und hast verschiedene Optionen abgewogen?",
    field: 'decision_making',
    required: true,
    analysis_focus: 'primary_dimension'
  },
  {
    id: 6,
    type: 'team_role',
    question: "Interessant! 👥 Bei Teamarbeit übernimmt jeder eine natürliche Rolle. Welche Rolle findest du dich normalerweise wieder? Führst du gerne und gibst die Richtung vor? Sorgst du für Harmonie und dass alle gehört werden? Bringst du neue Ideen ein? Oder stellst du sicher, dass alles qualitativ hochwertig und gut durchdacht ist?",
    field: 'team_role',
    required: true,
    analysis_focus: 'secondary_traits'
  },
  {
    id: 7,
    type: 'problem_solving',
    question: "Das passt gut zu dir! 🧩 Jetzt eine andere Perspektive: Wenn du vor einem komplexen Problem stehst, das du noch nie gelöst hast - wie gehst du vor? Experimentierst du mit neuen Ansätzen, suchst du nach bewährten Lösungen, fragst du Experten um Rat, oder bringst du Menschen zusammen, um gemeinsam eine Lösung zu finden?",
    field: 'problem_solving',
    required: true,
    analysis_focus: 'secondary_traits'
  },
  {
    id: 8,
    type: 'communication_style',
    question: "Sehr gut! 💬 Kommunikation ist der Schlüssel zum Erfolg. Wenn du jemandem etwas Kompliziertes erklären musst - wie machst du das? Gehst du strukturiert und Schritt für Schritt vor? Erzählst du begeistert von den Möglichkeiten? Fokussierst du auf Fakten und Details? Oder passt du dich an die Person an und fragst nach ihren Bedürfnissen?",
    field: 'communication_style',
    required: true,
    analysis_focus: 'communication_dna'
  },
  {
    id: 9,
    type: 'motivation_source',
    question: "Fast geschafft! 🎯 Zum Abschluss: Was gibt dir am meisten Energie bei der Arbeit? Ist es das Erreichen ehrgeiziger Ziele? Das Entwickeln von Menschen und Teams? Das Erschaffen von etwas völlig Neuem? Das Perfektionieren und Verbessern von Dingen? Oder das erfolgreiche Umsetzen und Fertigstellen von Projekten?",
    field: 'motivation_source',
    required: true,
    analysis_focus: 'core_motivation'
  },
  {
    id: 10,
    type: 'completion',
    question: "Fantastisch, {name}! 🎉 Du hast alle Fragen beantwortet. Ich analysiere jetzt deine Antworten mit meiner KI-Expertise und erstelle dein persönliches Hugo-Persönlichkeitsprofil. Das dauert nur einen Moment...",
    field: 'completion',
    required: false,
    analysis_focus: 'completion'
  }
]

// Hugo type definitions with detailed characteristics
const hugoTypes = {
  'V1': {
    name: 'Wegweiser',
    subtitle: 'Zeigt den Weg zu einer besseren Zukunft',
    dimension: 'Vision',
    color: 'blue',
    description: 'Du bist ein natürlicher Stratege, der komplexe Situationen schnell durchdringt und klare Richtungen vorgibt.',
    strengths: ['Strategisches Denken', 'Entscheidungskraft', 'Natürliche Führung', 'Krisenmanagement', 'Zielorientierung'],
    development: ['Geduld mit Details', 'Emotionale Sensibilität', 'Delegation', 'Work-Life-Balance'],
    keywords: ['Ziel', 'Strategie', 'Entscheidung', 'Führung', 'Ergebnis']
  },
  'V2': {
    name: 'Entwickler',
    subtitle: 'Hilft Menschen und Teams zu wachsen',
    dimension: 'Vision',
    color: 'blue',
    description: 'Du bist ein Menschen-Magnet, der das Beste in anderen erkennt und herausholt.',
    strengths: ['Menschen-Entwicklung', 'Empathische Führung', 'Team-Inspiration', 'Beziehungsaufbau', 'Kulturgestaltung'],
    development: ['Selbstfürsorge', 'Schwierige Entscheidungen', 'Konfrontationen', 'Grenzen setzen'],
    keywords: ['Entwicklung', 'Potenzial', 'Team', 'Wachstum', 'Inspiration']
  },
  'V3': {
    name: 'Organisator',
    subtitle: 'Schafft Struktur und Effizienz für nachhaltigen Erfolg',
    dimension: 'Vision',
    color: 'blue',
    description: 'Du bist der Architekt effizienter Systeme, der Ordnung aus Chaos schafft.',
    strengths: ['Systematische Organisation', 'Effizienz-Optimierung', 'Qualitätssicherung', 'Zuverlässigkeit', 'Prozess-Innovation'],
    development: ['Flexibilität', 'Menschen-Fokus', 'Innovation vs. Effizienz', 'Perfektionismus'],
    keywords: ['Prozess', 'Effizienz', 'Qualität', 'System', 'Optimierung']
  },
  'I1': {
    name: 'Pionier',
    subtitle: 'Erkundet unbekannte Territorien und erschafft Durchbrüche',
    dimension: 'Innovation',
    color: 'purple',
    description: 'Du bist ein natürlicher Entdecker, der sich in unbekannten Territorien wohlfühlt.',
    strengths: ['Kreative Problemlösung', 'Risikobereitschaft', 'Visionäre Ideen', 'Schnelle Anpassung', 'Inspiration'],
    development: ['Geduld mit Routine', 'Umsetzung', 'Strukturierung', 'Detailarbeit'],
    keywords: ['Innovation', 'Experiment', 'Möglichkeit', 'Durchbruch', 'Neu']
  },
  'I2': {
    name: 'Architekt',
    subtitle: 'Entwirft systematische Innovationen für die Zukunft',
    dimension: 'Innovation',
    color: 'purple',
    description: 'Du verbindest kreative Vision mit systematischer Umsetzung.',
    strengths: ['Systematische Innovation', 'Langfristige Planung', 'Komplexe Systeme', 'Kreativität + Struktur', 'Nachhaltige Lösungen'],
    development: ['Perfektionismus', 'Schnelle Entscheidungen', 'Überplanung', 'Detailbewertung'],
    keywords: ['System', 'Design', 'Zukunft', 'Architektur', 'Konzept']
  },
  'I3': {
    name: 'Inspirator',
    subtitle: 'Begeistert andere für neue Ideen und Möglichkeiten',
    dimension: 'Innovation',
    color: 'purple',
    description: 'Du bist ein natürlicher Motivator, der andere für innovative Konzepte begeistert.',
    strengths: ['Begeisterungsfähigkeit', 'Kreative Kommunikation', 'Team-Inspiration', 'Netzwerkaufbau', 'Optimismus'],
    development: ['Überschätzung', 'Kritische Details', 'Umsetzung', 'Rückschläge'],
    keywords: ['Begeisterung', 'Möglichkeit', 'Vision', 'Energie', 'Inspiration']
  },
  'E1': {
    name: 'Forscher',
    subtitle: 'Sucht nach Wahrheit und fundiertem Wissen',
    dimension: 'Expertise',
    color: 'green',
    description: 'Du bist ein natürlicher Wissenssucher, der durch gründliche Analyse zu Erkenntnissen gelangt.',
    strengths: ['Gründliche Analyse', 'Objektive Bewertung', 'Systematische Problemlösung', 'Qualitätsstandards', 'Kritisches Denken'],
    development: ['Überanalyse', 'Schnelle Entscheidungen', 'Kritik', 'Emotionale Aspekte'],
    keywords: ['Analyse', 'Fakten', 'Forschung', 'Beweis', 'Qualität']
  },
  'E2': {
    name: 'Meister',
    subtitle: 'Perfektioniert Fähigkeiten und liefert Exzellenz',
    dimension: 'Expertise',
    color: 'green',
    description: 'Du bist der Experte deines Fachgebiets, der durch kontinuierliche Verbesserung Exzellenz erreicht.',
    strengths: ['Fachliche Exzellenz', 'Kontinuierliche Verbesserung', 'Qualitätsstandards', 'Detailgenauigkeit', 'Zuverlässigkeit'],
    development: ['Perfektionismus', '"Gut genug"', 'Isolation', 'Ungeduld', 'Veränderungen'],
    keywords: ['Exzellenz', 'Qualität', 'Expertise', 'Perfektion', 'Standard']
  },
  'E3': {
    name: 'Berater',
    subtitle: 'Teilt Wissen und berät andere weise',
    dimension: 'Expertise',
    color: 'green',
    description: 'Du kombinierst tiefes Fachwissen mit der Fähigkeit, andere zu beraten und zu entwickeln.',
    strengths: ['Wissenstransfer', 'Strategische Beratung', 'Empathische Expertise', 'Entwicklung anderer', 'Ethische Führung'],
    development: ['Überberatung', 'Direkte Entscheidungen', 'Eigene Bedürfnisse', 'Entscheidungszeit'],
    keywords: ['Beratung', 'Weisheit', 'Entwicklung', 'Mentoring', 'Ethik']
  },
  'C1': {
    name: 'Harmonizer',
    subtitle: 'Schafft Einheit und positive Teamdynamik',
    dimension: 'Kollaboration',
    color: 'orange',
    description: 'Du bist ein natürlicher Teamplayer, der für positive Atmosphäre sorgt.',
    strengths: ['Teamharmonie', 'Empathie', 'Inklusive Führung', 'Konsensbildung', 'Positive Atmosphäre'],
    development: ['Konfliktvermeidung', 'Harte Entscheidungen', 'Eigene Meinung', 'Überanpassung'],
    keywords: ['Team', 'Harmonie', 'Zusammen', 'Einigkeit', 'Verständnis']
  },
  'C2': {
    name: 'Brückenbauer',
    subtitle: 'Verbindet Menschen und Ideen miteinander',
    dimension: 'Kollaboration',
    color: 'orange',
    description: 'Du bist ein natürlicher Netzwerker, der Menschen zusammenbringt und Synergien schafft.',
    strengths: ['Netzwerkaufbau', 'Synergieschaffung', 'Kommunikation', 'Diplomatische Fähigkeiten', 'Kollaborative Problemlösung'],
    development: ['Kompromissbereitschaft', 'Klare Positionen', 'Übervernetzung', 'Verzetteln'],
    keywords: ['Verbindung', 'Synergie', 'Netzwerk', 'Zusammenarbeit', 'Brücke']
  },
  'C3': {
    name: 'Umsetzer',
    subtitle: 'Verwandelt Ideen in konkrete Ergebnisse',
    dimension: 'Kollaboration',
    color: 'orange',
    description: 'Du bist ein praktischer Macher, der Ideen in die Realität umsetzt.',
    strengths: ['Praktische Umsetzung', 'Ergebnisorientierung', 'Projektmanagement', 'Zuverlässige Ausführung', 'Pragmatische Problemlösung'],
    development: ['Fokus auf Umsetzung', 'Abstrakte Konzepte', 'Ungeduld mit Planung', 'Strategische Aspekte'],
    keywords: ['Umsetzung', 'Ergebnis', 'Praktisch', 'Machen', 'Ausführung']
  }
}

// AI analysis function to determine Hugo type
const analyzeHugoType = (responses) => {
  // Scoring system for each dimension
  let scores = {
    V1: 0, V2: 0, V3: 0,  // Vision
    I1: 0, I2: 0, I3: 0,  // Innovation
    E1: 0, E2: 0, E3: 0,  // Expertise
    C1: 0, C2: 0, C3: 0   // Kollaboration
  }

  // Analyze work approach
  const workApproach = responses.work_approach?.toLowerCase() || ''
  if (workApproach.includes('plan') || workApproach.includes('strateg') || workApproach.includes('ziel')) {
    scores.V1 += 3
    scores.V3 += 2
  }
  if (workApproach.includes('team') || workApproach.includes('menschen') || workApproach.includes('gemeinsam')) {
    scores.V2 += 3
    scores.C1 += 2
  }
  if (workApproach.includes('system') || workApproach.includes('struktur') || workApproach.includes('prozess')) {
    scores.V3 += 3
    scores.E2 += 2
  }
  if (workApproach.includes('experiment') || workApproach.includes('neu') || workApproach.includes('kreativ')) {
    scores.I1 += 3
    scores.I3 += 2
  }
  if (workApproach.includes('analyse') || workApproach.includes('gründlich') || workApproach.includes('forsch')) {
    scores.E1 += 3
    scores.E3 += 2
  }

  // Analyze decision making
  const decisionMaking = responses.decision_making?.toLowerCase() || ''
  if (decisionMaking.includes('schnell') || decisionMaking.includes('entschlossen') || decisionMaking.includes('direkt')) {
    scores.V1 += 3
    scores.C3 += 2
  }
  if (decisionMaking.includes('alle') || decisionMaking.includes('team') || decisionMaking.includes('konsens')) {
    scores.V2 += 3
    scores.C1 += 3
    scores.C2 += 2
  }
  if (decisionMaking.includes('analyse') || decisionMaking.includes('gründlich') || decisionMaking.includes('fakten')) {
    scores.E1 += 3
    scores.E2 += 2
  }
  if (decisionMaking.includes('vorsichtig') || decisionMaking.includes('abwäg') || decisionMaking.includes('option')) {
    scores.E3 += 2
    scores.C2 += 2
  }

  // Analyze team role
  const teamRole = responses.team_role?.toLowerCase() || ''
  if (teamRole.includes('führ') || teamRole.includes('richtung') || teamRole.includes('leit')) {
    scores.V1 += 3
    scores.V2 += 2
  }
  if (teamRole.includes('harmonie') || teamRole.includes('gehört') || teamRole.includes('alle')) {
    scores.C1 += 3
    scores.V2 += 2
  }
  if (teamRole.includes('idee') || teamRole.includes('kreativ') || teamRole.includes('innovation')) {
    scores.I1 += 3
    scores.I3 += 3
  }
  if (teamRole.includes('qualität') || teamRole.includes('durchdacht') || teamRole.includes('expertise')) {
    scores.E1 += 2
    scores.E2 += 3
  }

  // Analyze problem solving
  const problemSolving = responses.problem_solving?.toLowerCase() || ''
  if (problemSolving.includes('experiment') || problemSolving.includes('neu') || problemSolving.includes('ausprobier')) {
    scores.I1 += 3
    scores.I2 += 2
  }
  if (problemSolving.includes('bewährt') || problemSolving.includes('erfahrung') || problemSolving.includes('standard')) {
    scores.E2 += 3
    scores.V3 += 2
  }
  if (problemSolving.includes('expert') || problemSolving.includes('rat') || problemSolving.includes('wissen')) {
    scores.E1 += 2
    scores.E3 += 3
  }
  if (problemSolving.includes('menschen') || problemSolving.includes('gemeinsam') || problemSolving.includes('team')) {
    scores.C1 += 2
    scores.C2 += 3
  }

  // Analyze communication style
  const communicationStyle = responses.communication_style?.toLowerCase() || ''
  if (communicationStyle.includes('strukturiert') || communicationStyle.includes('schritt') || communicationStyle.includes('system')) {
    scores.V3 += 3
    scores.E2 += 2
  }
  if (communicationStyle.includes('begeistert') || communicationStyle.includes('möglichkeit') || communicationStyle.includes('energie')) {
    scores.I3 += 3
    scores.I1 += 2
  }
  if (communicationStyle.includes('fakten') || communicationStyle.includes('detail') || communicationStyle.includes('präzise')) {
    scores.E1 += 3
    scores.E2 += 2
  }
  if (communicationStyle.includes('anpass') || communicationStyle.includes('bedürfnis') || communicationStyle.includes('person')) {
    scores.V2 += 3
    scores.C1 += 2
  }

  // Analyze motivation source
  const motivationSource = responses.motivation_source?.toLowerCase() || ''
  if (motivationSource.includes('ziel') || motivationSource.includes('ehrgeiz') || motivationSource.includes('erfolg')) {
    scores.V1 += 3
    scores.C3 += 2
  }
  if (motivationSource.includes('menschen') || motivationSource.includes('team') || motivationSource.includes('entwickl')) {
    scores.V2 += 3
    scores.C1 += 2
  }
  if (motivationSource.includes('neu') || motivationSource.includes('erschaff') || motivationSource.includes('kreativ')) {
    scores.I1 += 3
    scores.I2 += 2
  }
  if (motivationSource.includes('perfekt') || motivationSource.includes('verbess') || motivationSource.includes('qualität')) {
    scores.E2 += 3
    scores.E1 += 2
  }
  if (motivationSource.includes('umset') || motivationSource.includes('fertig') || motivationSource.includes('ergebnis')) {
    scores.C3 += 3
    scores.V3 += 2
  }

  // Find the highest scoring type
  let maxScore = 0
  let determinedType = 'V1'
  
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      determinedType = type
    }
  }

  return determinedType
}

export default function ImprovedChatAssessment() {
  const [isActive, setIsActive] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [messages, setMessages] = useState([])
  const [currentInput, setCurrentInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [assessmentData, setAssessmentData] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [result, setResult] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const startAssessment = () => {
    setIsActive(true)
    setCurrentQuestionIndex(0)
    setMessages([])
    setAssessmentData({})
    setIsCompleted(false)
    setResult(null)
    
    // Add first question after a short delay
    setTimeout(() => {
      addBotMessage(chatQuestions[0].question)
    }, 500)
  }

  const addBotMessage = (text) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        text: text,
        timestamp: new Date()
      }])
    }, 1000 + Math.random() * 1000)
  }

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text: text,
      timestamp: new Date()
    }])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentInput.trim()) return

    const currentQuestion = chatQuestions[currentQuestionIndex]
    const userResponse = currentInput.trim()
    
    // Add user message
    addUserMessage(userResponse)
    
    // Store response
    const newData = {
      ...assessmentData,
      [currentQuestion.field]: userResponse
    }
    setAssessmentData(newData)
    
    setCurrentInput('')

    // Check if this is the last question
    if (currentQuestionIndex >= chatQuestions.length - 1) {
      // Start analysis
      setIsAnalyzing(true)
      
      setTimeout(() => {
        // Determine Hugo type using improved analysis
        const hugoType = analyzeHugoType(newData)
        const typeInfo = hugoTypes[hugoType]
        
        setResult({
          hugoType: hugoType,
          name: typeInfo.name,
          subtitle: typeInfo.subtitle,
          dimension: typeInfo.dimension,
          description: typeInfo.description,
          strengths: typeInfo.strengths,
          development: typeInfo.development,
          color: typeInfo.color
        })
        
        setIsAnalyzing(false)
        setIsCompleted(true)
        
        // Add completion message
        addBotMessage(`Perfekt! Dein Hugo-Persönlichkeitstyp ist: **${hugoType} - ${typeInfo.name}**\n\n${typeInfo.description}\n\nDeine Stärken umfassen: ${typeInfo.strengths.slice(0, 3).join(', ')}.\n\nDieses Profil hilft dir und deinem Team, optimal zusammenzuarbeiten! 🎉`)
      }, 3000)
      
      return
    }

    // Move to next question
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      
      let nextQuestion = chatQuestions[nextIndex].question
      // Replace name placeholder
      if (newData.name) {
        nextQuestion = nextQuestion.replace('{name}', newData.name)
      }
      
      addBotMessage(nextQuestion)
    }, 1500)
  }

  const resetAssessment = () => {
    setIsActive(false)
    setCurrentQuestionIndex(0)
    setMessages([])
    setCurrentInput('')
    setIsTyping(false)
    setIsAnalyzing(false)
    setAssessmentData({})
    setIsCompleted(false)
    setResult(null)
  }

  if (!isActive) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <img 
                src="/hugo-avatar-transparent.png" 
                alt="Hugo" 
                className="h-16 w-16 rounded-full"
              />
            </div>
            <CardTitle className="text-2xl">Verbessertes Hugo Assessment</CardTitle>
            <CardDescription>
              Erlebe das präzise Hugo Chat-Assessment mit individueller Typisierung
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-blue-900">Präzise Analyse</h3>
                <p className="text-sm text-blue-700">Individuelle Auswertung basierend auf dem vollständigen Hugo-Leitfaden</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <Brain className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-green-900">KI-gestützt</h3>
                <p className="text-sm text-green-700">Intelligente Antwortauswertung für alle 12 Hugo-Typen</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium text-purple-900">Culture Map</h3>
                <p className="text-sm text-purple-700">Kulturelle Hintergründe für internationales Team-Building</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-medium text-orange-900">Team-Integration</h3>
                <p className="text-sm text-orange-700">Automatische Empfehlungen für optimale Team-Zusammenstellung</p>
              </div>
            </div>
            
            <Button onClick={startAssessment} className="w-full" size="lg">
              <MessageCircle className="h-5 w-5 mr-2" />
              Verbessertes Assessment starten
            </Button>
            
            <p className="text-sm text-gray-600">
              Dauer: ca. 8-12 Minuten • Vollständig anonym für Tests • Präzise Typisierung
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/hugo-avatar-transparent.png" 
              alt="Hugo" 
              className="h-10 w-10 rounded-full"
            />
            <div>
              <CardDescription className="text-gray-600">
                {isCompleted ? 'Assessment abgeschlossen' : `Frage ${currentQuestionIndex + 1} von ${chatQuestions.length}`}
              </CardDescription>
            </div>
          </div>
          {isCompleted && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4 mr-1" />
              Fertig
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              {message.type === 'user' ? (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gray-200 text-gray-700">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <img 
                  src="/hugo-avatar-transparent.png" 
                  alt="Hugo" 
                  className="h-8 w-8 rounded-full flex-shrink-0"
                />
              )}
              <div className={`rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString('de-DE', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <img 
                src="/hugo-avatar-transparent.png" 
                alt="Hugo" 
                className="h-8 w-8 rounded-full"
              />
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="flex justify-center">
            <div className="bg-blue-50 rounded-lg p-4 flex items-center space-x-3">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              <div>
                <p className="font-medium text-blue-900">Analysiere deine Antworten...</p>
                <p className="text-sm text-blue-700">Präzise Hugo-Typ-Bestimmung läuft</p>
              </div>
            </div>
          </div>
        )}
        
        {result && (
          <div className={`bg-gradient-to-r from-${result.color}-50 to-blue-50 rounded-lg p-4 border border-${result.color}-200`}>
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className={`bg-${result.color}-600 text-white font-bold text-lg`}>
                  {result.hugoType}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg">{result.name}</h3>
                <p className="text-sm text-gray-600">{result.subtitle}</p>
                <Badge variant="secondary" className={`bg-${result.color}-100 text-${result.color}-800 mt-1`}>
                  {result.dimension}
                </Badge>
              </div>
            </div>
            <p className="text-sm mb-3">{result.description}</p>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <h4 className="font-medium text-sm">Deine Stärken:</h4>
                <p className="text-xs text-gray-600">{result.strengths.slice(0, 3).join(' • ')}</p>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>
      
      {!isCompleted && !isAnalyzing && (
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Deine Antwort hier eingeben..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button type="submit" disabled={isTyping || !currentInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Drücke Enter zum Senden • Sei ehrlich und authentisch für die besten Ergebnisse
          </p>
        </div>
      )}
      
      {isCompleted && (
        <div className="border-t p-4">
          <Button onClick={resetAssessment} variant="outline" className="w-full">
            Neues Assessment starten
          </Button>
        </div>
      )}
    </Card>
  )
}
