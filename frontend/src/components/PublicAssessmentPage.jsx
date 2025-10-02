import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Brain, 
  Clock, 
  Shield, 
  Users, 
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Building,
  Mail
} from 'lucide-react'
import ChatAssessment from './ChatAssessment'

export default function PublicAssessmentPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [invitation, setInvitation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [completedType, setCompletedType] = useState(null)
  
  // Load invitation details
  useEffect(() => {
    const loadInvitation = async () => {
      try {
        const response = await fetch(`/api/chat-assessment/invitations/${token}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Diese Einladung ist ungültig oder abgelaufen.')
          } else if (response.status === 400) {
            setError('Diese Einladung wurde bereits verwendet.')
          } else {
            setError('Fehler beim Laden der Einladung.')
          }
          return
        }
        
        const data = await response.json()
        setInvitation(data)
        
      } catch (error) {
        setError('Verbindungsfehler. Bitte versuche es später erneut.')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (token) {
      loadInvitation()
    } else {
      setError('Kein gültiger Einladungslink.')
      setIsLoading(false)
    }
  }, [token])
  
  // Handle assessment completion
  const handleAssessmentComplete = (hugoType) => {
    setIsCompleted(true)
    setCompletedType(hugoType)
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Lade Einladung...</p>
        </motion.div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Einladung nicht verfügbar
              </h1>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
              >
                Zur Startseite
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }
  
  // Show chat assessment if started
  if (hasStarted) {
    return (
      <ChatAssessment 
        invitationToken={token}
        onComplete={handleAssessmentComplete}
      />
    )
  }
  
  // Completion state
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                🎉 Assessment abgeschlossen!
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                Vielen Dank für deine Teilnahme! Dein Hugo-Persönlichkeitstyp wurde erfolgreich bestimmt.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Dein Hugo-Typ:
                </h2>
                <Badge className="bg-blue-500 text-white text-xl px-6 py-3">
                  {completedType}
                </Badge>
              </div>
              
              <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Was passiert als nächstes?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Deine Ergebnisse wurden an {invitation?.company_name} übermittelt
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Du erhältst eine detaillierte Auswertung deines Persönlichkeitstyps
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Dein Team kann nun bessere Zusammenarbeit und Kommunikation entwickeln
                  </li>
                </ul>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Bei Fragen wende dich gerne an {invitation?.sender_name} oder dein HR-Team.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }
  
  // Welcome/Introduction state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Hugo Assessment</h1>
              <p className="text-sm text-gray-600">Persönlichkeitsanalyse für {invitation?.company_name}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Welcome Card */}
          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Willkommen bei Hugo!
                </h2>
                <p className="text-gray-600">
                  Du wurdest von <strong>{invitation?.sender_name}</strong> zu einem Persönlichkeitsassessment eingeladen.
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Building className="w-5 h-5 text-blue-500" />
                  <span>{invitation?.company_name}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span>{invitation?.participant_email}</span>
                </div>
              </div>
              
              <Button 
                onClick={() => setHasStarted(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                size="lg"
              >
                Assessment starten
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
          
          {/* Information Card */}
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Was dich erwartet
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">10-15 Minuten</h4>
                    <p className="text-gray-600 text-sm">
                      Das Assessment dauert nur wenige Minuten und wird als freundliches Gespräch geführt.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">KI-gestützter Chat</h4>
                    <p className="text-gray-600 text-sm">
                      Hugo, unser KI-Assistent, führt dich durch personalisierte Fragen zu deiner Persönlichkeit.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sofortige Ergebnisse</h4>
                    <p className="text-gray-600 text-sm">
                      Du erhältst direkt nach dem Assessment deinen Hugo-Persönlichkeitstyp.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Datenschutz</h4>
                    <p className="text-gray-600 text-sm">
                      Deine Daten werden vertraulich behandelt und sind GDPR-konform geschützt.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Die 12 Hugo-Persönlichkeitstypen
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { dimension: "Vision", types: ["V1", "V2", "V3"], color: "bg-blue-500" },
                  { dimension: "Innovation", types: ["I1", "I2", "I3"], color: "bg-purple-500" },
                  { dimension: "Expertise", types: ["E1", "E2", "E3"], color: "bg-green-500" },
                  { dimension: "Connection", types: ["C1", "C2", "C3"], color: "bg-orange-500" }
                ].map((dimension, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-12 h-12 ${dimension.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-white font-bold text-sm">{dimension.dimension[0]}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{dimension.dimension}</h4>
                    <div className="flex justify-center space-x-1">
                      {dimension.types.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-center text-gray-600 text-sm mt-6">
                Hugo analysiert deine Antworten und bestimmt deinen primären Persönlichkeitstyp 
                basierend auf den vier Dimensionen: Vision, Innovation, Expertise und Connection.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
