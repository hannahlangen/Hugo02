import React, { useState, useEffect, useRef } from 'react'
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

// Chat questions for Hugo assessment including Culture Map elements
const chatQuestions = [
  {
    id: 1,
    type: 'greeting',
    question: "Hallo! Ich bin Hugo, dein persönlicher Persönlichkeitsexperte. 👋 Schön, dass du hier bist! Wie soll ich dich nennen?",
    field: 'name',
    required: true
  },
  {
    id: 2,
    type: 'email',
    question: "Perfekt, {name}! Damit ich dir später deine Ergebnisse zusenden kann, benötige ich deine E-Mail-Adresse. Keine Sorge - deine Daten sind bei uns sicher! 📧",
    field: 'email',
    required: true
  },
  {
    id: 3,
    type: 'cultural_background',
    question: "Jetzt wird's interessant! 🌍 Für unser Team-Building nutzen wir die Culture Map Theorie von Erin Meyer. Deshalb möchte ich wissen: In welchem Land oder welcher Region hast du den größten Teil deiner Kindheit und Jugend verbracht? Das hilft uns zu verstehen, welche kulturellen Arbeitsweisen dir vertraut sind und wie du am besten mit Kollegen aus anderen Kulturen zusammenarbeitest.",
    field: 'cultural_background',
    required: true
  },
  {
    id: 4,
    type: 'work_style',
    question: "Danke für diese wichtige Information! 💼 Jetzt zu deinem Arbeitsstil: Stell dir vor, du startest ein neues Projekt. Beschreibe mir in ein paar Sätzen, wie du normalerweise vorgehst. Planst du gerne im Detail oder springst du lieber direkt ins kalte Wasser?",
    field: 'work_style',
    required: true
  },
  {
    id: 5,
    type: 'team_interaction',
    question: "Interessant! 👥 Und wie ist das bei Teamarbeit? Erzähl mir von einer Situation, in der du besonders gut mit anderen zusammengearbeitet hast. Was hat dich dabei motiviert und wie hast du zum Erfolg beigetragen?",
    field: 'team_interaction',
    required: true
  },
  {
    id: 6,
    type: 'problem_solving',
    question: "Das klingt großartig! 🧩 Jetzt eine andere Perspektive: Wenn du vor einem komplexen Problem stehst, das du noch nie gelöst hast - wie gehst du vor? Suchst du nach bewährten Lösungen oder entwickelst du lieber völlig neue Ansätze?",
    field: 'problem_solving',
    required: true
  },
  {
    id: 7,
    type: 'communication',
    question: "Sehr aufschlussreich! 💬 Kommunikation ist der Schlüssel zum Erfolg. Wie erklärst du komplexe Sachverhalte anderen Menschen? Und wie gehst du mit Meinungsverschiedenheiten im Team um?",
    field: 'communication',
    required: true
  },
  {
    id: 8,
    type: 'motivation',
    question: "Fast geschafft! 🎯 Zum Abschluss: Was motiviert dich am meisten bei der Arbeit? Ist es das Erreichen von Zielen, das Lösen kniffliger Probleme, die Zusammenarbeit mit Menschen oder etwas ganz anderes?",
    field: 'motivation',
    required: true
  },
  {
    id: 9,
    type: 'completion',
    question: "Fantastisch, {name}! 🎉 Du hast alle Fragen beantwortet. Ich analysiere jetzt deine Antworten mit meiner KI-Expertise und erstelle dein persönliches Hugo-Persönlichkeitsprofil. Das dauert nur einen Moment...",
    field: 'completion',
    required: false
  }
]

export default function ChatAssessmentTest() {
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
  }, [messages])

  const startChat = () => {
    setIsActive(true)
    setMessages([])
    setCurrentQuestionIndex(0)
    setAssessmentData({})
    setIsCompleted(false)
    setResult(null)
    
    // Add initial Hugo message with typing effect
    setTimeout(() => {
      addHugoMessage(chatQuestions[0].question)
    }, 500)
  }

  const addHugoMessage = (text) => {
    setIsTyping(true)
    
    setTimeout(() => {
      const processedText = text.replace('{name}', assessmentData.name || '')
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'hugo',
        text: processedText,
        timestamp: new Date()
      }])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random typing delay
  }

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text: text,
      timestamp: new Date()
    }])
  }

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return

    const currentQuestion = chatQuestions[currentQuestionIndex]
    
    // Add user message
    addUserMessage(currentInput)
    
    // Store the answer
    const newData = {
      ...assessmentData,
      [currentQuestion.field]: currentInput
    }
    setAssessmentData(newData)
    
    // Clear input
    setCurrentInput('')
    
    // Move to next question or complete assessment
    if (currentQuestionIndex < chatQuestions.length - 1) {
      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1
        setCurrentQuestionIndex(nextIndex)
        addHugoMessage(chatQuestions[nextIndex].question)
      }, 1500)
    } else {
      // Assessment completed - analyze results
      setTimeout(() => {
        analyzeResults(newData)
      }, 1500)
    }
  }

  const analyzeResults = async (data) => {
    setIsAnalyzing(true)
    
    try {
      // Simulate AI analysis (in real implementation, this would call the OpenAI service)
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock result based on answers
      const mockResult = {
        hugoType: 'V1',
        typeName: 'Pathfinder',
        dimension: 'Vision',
        description: 'Du bist ein visionärer Denker, der gerne neue Wege erkundet und andere inspiriert.',
        strengths: [
          'Strategisches Denken',
          'Natürliche Führungsqualitäten', 
          'Zielorientierung'
        ],
        culturalInsights: {
          background: data.cultural_background,
          communicationStyle: 'Direkt und zielorientiert',
          teamworkPreference: 'Führungsrolle in diversen Teams'
        },
        teamRecommendations: [
          'Ideal für Projektleitung und strategische Planung',
          'Profitiert von kulturell diversen Teams',
          'Sollte mit detailorientierten Typen (E-Typen) zusammenarbeiten'
        ]
      }
      
      setResult(mockResult)
      setIsCompleted(true)
      
      // Add completion message
      addHugoMessage(`Wow, ${data.name}! 🎯 Deine Analyse ist fertig. Du bist ein **${mockResult.typeName} (${mockResult.hugoType})** - ein echter ${mockResult.dimension}-Typ! Das bedeutet, du bringst visionäres Denken und natürliche Führungsqualitäten mit. Dein kultureller Hintergrund aus ${data.cultural_background} wird eine wertvolle Bereicherung für jedes Team sein!`)
      
    } catch (error) {
      console.error('Analysis error:', error)
      addHugoMessage('Entschuldigung, bei der Analyse ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isActive) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                H
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">Chat-Assessment Testen</CardTitle>
              <CardDescription>
                Erlebe das Hugo Chat-Assessment selbst und teste die KI-gestützte Persönlichkeitsanalyse
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Interaktiver Chat</h3>
                <p className="text-sm text-blue-700">Natürliche Gesprächsführung mit Hugo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <Brain className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">KI-Analyse</h3>
                <p className="text-sm text-green-700">OpenAI-gestützte Antwortauswertung</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
              <Globe className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-900">Culture Map</h3>
                <p className="text-sm text-purple-700">Kulturelle Hintergründe für Team-Building</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-900">Team-Integration</h3>
                <p className="text-sm text-orange-700">Automatische Empfehlungen für Teams</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={startChat}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Chat-Assessment starten
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              Dauer: ca. 5-8 Minuten • Vollständig anonym für Tests
            </p>
          </div>
        </CardContent>
      </Card>
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
                <p className="text-sm text-blue-700">KI erstellt dein Persönlichkeitsprofil</p>
              </div>
            </div>
          </div>
        )}
        
        {result && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-green-600 text-white font-bold text-lg">
                  {result.hugoType}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{result.typeName}</h3>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {result.dimension}-Typ
                </Badge>
              </div>
            </div>
            
            <p className="text-gray-700 mb-3">{result.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Stärken:</h4>
                <ul className="space-y-1">
                  {result.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Kultureller Hintergrund:</h4>
                <p className="text-gray-700">{result.culturalInsights.background}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Kommunikationsstil: {result.culturalInsights.communicationStyle}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>
      
      {!isCompleted && !isAnalyzing && (
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Deine Antwort hier eingeben..."
              disabled={isTyping}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isTyping}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Drücke Enter zum Senden • Sei ehrlich und authentisch für die besten Ergebnisse
          </p>
        </div>
      )}
      
      {isCompleted && (
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Assessment erfolgreich abgeschlossen! 🎉
            </p>
            <Button 
              onClick={() => {
                setIsActive(false)
                setIsCompleted(false)
              }}
              variant="outline"
              size="sm"
            >
              Neues Assessment
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
