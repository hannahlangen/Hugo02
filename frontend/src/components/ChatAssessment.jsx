import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx'
import { 
  Brain, 
  Send, 
  Loader2, 
  CheckCircle, 
  MessageSquare,
  Sparkles,
  User,
  Bot
} from 'lucide-react'

// Chat Message Component
function ChatMessage({ message, isUser, timestamp, isTyping = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start space-x-3 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <Avatar className={`w-8 h-8 ${isUser ? 'bg-blue-500' : 'bg-purple-500'}`}>
          <AvatarFallback className="text-white text-sm">
            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>
        
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          {isTyping ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Hugo tippt...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message}
            </div>
          )}
          
          {timestamp && !isTyping && (
            <div className={`text-xs mt-2 opacity-70 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
              {new Date(timestamp).toLocaleTimeString('de-DE', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Typing Indicator Component
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-start mb-4"
    >
      <div className="flex items-start space-x-3">
        <Avatar className="w-8 h-8 bg-purple-500">
          <AvatarFallback className="text-white text-sm">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        
        <div className="bg-gray-100 rounded-2xl px-4 py-3">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm text-gray-600 ml-2">Hugo tippt...</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Progress Bar Component
function ProgressBar({ current, total }) {
  const progress = (current / total) * 100
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}

// Main Chat Assessment Component
export default function ChatAssessment({ invitationToken, onComplete }) {
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [hugoType, setHugoType] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [participantName, setParticipantName] = useState('')
  const [participantEmail, setParticipantEmail] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [error, setError] = useState(null)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const totalQuestions = 8 // Based on CHAT_QUESTIONS in backend
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])
  
  // Focus input when component mounts
  useEffect(() => {
    if (isRegistered && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isRegistered])
  
  // Register participant and start chat session
  const handleRegistration = async (e) => {
    e.preventDefault()
    
    if (!participantName.trim() || !participantEmail.trim()) {
      setError('Bitte fülle alle Felder aus.')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/chat-assessment/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitation_token: invitationToken,
          participant_name: participantName,
          participant_email: participantEmail
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Fehler beim Starten des Assessments')
      }
      
      const data = await response.json()
      setSessionId(data.session_id)
      setIsRegistered(true)
      
      // Add welcome message
      setMessages([{
        id: 1,
        message: data.message,
        isUser: false,
        timestamp: new Date().toISOString()
      }])
      
      // Start with first question after a delay
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 2,
          message: "Wenn du in einem Team arbeitest, was motiviert dich am meisten?",
          isUser: false,
          timestamp: new Date().toISOString()
        }])
        setCurrentQuestion(1)
      }, 2000)
      
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Send message to chat
  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading || isCompleted) return
    
    const userMessage = {
      id: Date.now(),
      message: currentMessage.trim(),
      isUser: true,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)
    setIsTyping(true)
    
    try {
      const response = await fetch(`/api/chat-assessment/sessions/${sessionId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage.message,
          is_user: true,
          timestamp: userMessage.timestamp
        })
      })
      
      if (!response.ok) {
        throw new Error('Fehler beim Senden der Nachricht')
      }
      
      const data = await response.json()
      
      // Simulate typing delay
      setTimeout(() => {
        setIsTyping(false)
        
        const botMessage = {
          id: Date.now() + 1,
          message: data.message,
          isUser: false,
          timestamp: new Date().toISOString()
        }
        
        setMessages(prev => [...prev, botMessage])
        
        if (data.is_completed) {
          setIsCompleted(true)
          setHugoType(data.hugo_type)
          if (onComplete) {
            onComplete(data.hugo_type)
          }
        } else if (data.is_question) {
          setCurrentQuestion(prev => prev + 1)
        }
      }, 1500 + Math.random() * 1000) // Random delay between 1.5-2.5s
      
    } catch (error) {
      setIsTyping(false)
      setError('Fehler beim Senden der Nachricht. Bitte versuche es erneut.')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
  
  // Registration Form
  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Willkommen bei Hugo!
                </h1>
                <p className="text-gray-600">
                  Lass uns gemeinsam deinen Persönlichkeitstyp entdecken.
                </p>
              </div>
              
              <form onSubmit={handleRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dein Name
                  </label>
                  <Input
                    type="text"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Max Mustermann"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-Mail-Adresse
                  </label>
                  <Input
                    type="email"
                    value={participantEmail}
                    onChange={(e) => setParticipantEmail(e.target.value)}
                    placeholder="max@example.com"
                    required
                  />
                </div>
                
                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Assessment starten...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Assessment starten
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-xs text-gray-500">
                <p>Deine Daten werden vertraulich behandelt und sind GDPR-konform geschützt.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }
  
  // Chat Interface
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Hugo Assessment</h1>
              <p className="text-sm text-gray-600">
                {isCompleted ? 'Assessment abgeschlossen' : `Frage ${currentQuestion} von ${totalQuestions}`}
              </p>
            </div>
          </div>
          
          {!isCompleted && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Fortschritt</span>
              <div className="w-24">
                <ProgressBar current={currentQuestion} total={totalQuestions} />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.message}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              
              {isTyping && <TypingIndicator />}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          {!isCompleted && (
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <Input
                    ref={inputRef}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Schreibe deine Antwort..."
                    disabled={isLoading || isCompleted}
                    className="resize-none"
                  />
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!currentMessage.trim() || isLoading || isCompleted}
                  size="sm"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {/* Completion State */}
          {isCompleted && hugoType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 border-t border-gray-200 p-6"
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  🎉 Assessment abgeschlossen!
                </h2>
                <p className="text-gray-600 mb-4">
                  Dein Hugo-Typ wurde erfolgreich bestimmt.
                </p>
                <Badge className="bg-blue-500 text-white text-lg px-4 py-2">
                  {hugoType}
                </Badge>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
