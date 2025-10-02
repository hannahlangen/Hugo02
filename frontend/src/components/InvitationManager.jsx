import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  Mail, 
  Send, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Copy,
  ExternalLink,
  Loader2,
  Plus,
  Trash2,
  Eye,
  Calendar,
  User,
  MessageCircle
} from 'lucide-react'
import TwoStageHugoAssessment from './TwoStageHugoAssessment.jsx'

// Single Invitation Form Component
function InvitationForm({ onSend, isLoading }) {
  const [formData, setFormData] = useState({
    participant_email: '',
    participant_name: '',
    sender_name: ''
  })
  const [errors, setErrors] = useState({})
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const newErrors = {}
    if (!formData.participant_email) newErrors.participant_email = 'E-Mail ist erforderlich'
    if (!formData.sender_name) newErrors.sender_name = 'Absendername ist erforderlich'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setErrors({})
    const success = await onSend(formData)
    
    if (success) {
      setFormData({
        participant_email: '',
        participant_name: '',
        sender_name: formData.sender_name // Keep sender name
      })
    }
  }
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="w-5 h-5" />
          <span>Neue Einladung senden</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-Mail-Adresse *
              </label>
              <Input
                type="email"
                value={formData.participant_email}
                onChange={(e) => handleChange('participant_email', e.target.value)}
                placeholder="max.mustermann@example.com"
                className={errors.participant_email ? 'border-red-500' : ''}
              />
              {errors.participant_email && (
                <p className="text-red-500 text-sm mt-1">{errors.participant_email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name (optional)
              </label>
              <Input
                type="text"
                value={formData.participant_name}
                onChange={(e) => handleChange('participant_name', e.target.value)}
                placeholder="Max Mustermann"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Absender (Ihr Name) *
            </label>
            <Input
              type="text"
              value={formData.sender_name}
              onChange={(e) => handleChange('sender_name', e.target.value)}
              placeholder="Anna Schmidt"
              className={errors.sender_name ? 'border-red-500' : ''}
            />
            {errors.sender_name && (
              <p className="text-red-500 text-sm mt-1">{errors.sender_name}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Einladung wird gesendet...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Einladung senden
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Bulk Invitation Form Component
function BulkInvitationForm({ onSend, isLoading }) {
  const [formData, setFormData] = useState({
    emails: '',
    sender_name: ''
  })
  const [errors, setErrors] = useState({})
  const [emailList, setEmailList] = useState([])
  
  useEffect(() => {
    // Parse emails from textarea
    const emails = formData.emails
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Support formats: "email" or "Name <email>" or "Name, email"
        const emailMatch = line.match(/([^<,]+)?[<,]?\s*([^\s<>]+@[^\s<>]+)/);
        if (emailMatch) {
          return {
            email: emailMatch[2].trim(),
            name: emailMatch[1] ? emailMatch[1].trim() : ''
          }
        }
        return null
      })
      .filter(item => item !== null)
    
    setEmailList(emails)
  }, [formData.emails])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const newErrors = {}
    if (emailList.length === 0) newErrors.emails = 'Mindestens eine E-Mail-Adresse ist erforderlich'
    if (!formData.sender_name) newErrors.sender_name = 'Absendername ist erforderlich'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setErrors({})
    
    // Send invitations for all emails
    const invitations = emailList.map(item => ({
      participant_email: item.email,
      participant_name: item.name,
      company_name: 'Hugo at Work', // Default company name
      sender_name: formData.sender_name
    }))
    
    const success = await onSend(invitations)
    
    if (success) {
      setFormData({
        emails: '',
        sender_name: formData.sender_name // Keep sender name
      })
    }
  }
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Mehrere Einladungen senden</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-Mail-Adressen (eine pro Zeile) *
            </label>
            <Textarea
              value={formData.emails}
              onChange={(e) => handleChange('emails', e.target.value)}
              placeholder={`max.mustermann@example.com
Anna Schmidt <anna@example.com>
Peter Müller, peter@example.com`}
              rows={6}
              className={errors.emails ? 'border-red-500' : ''}
            />
            {errors.emails && (
              <p className="text-red-500 text-sm mt-1">{errors.emails}</p>
            )}
            {emailList.length > 0 && (
              <p className="text-green-600 text-sm mt-1">
                {emailList.length} E-Mail-Adresse(n) erkannt
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Absender (Ihr Name) *
            </label>
            <Input
              type="text"
              value={formData.sender_name}
              onChange={(e) => handleChange('sender_name', e.target.value)}
              placeholder="Anna Schmidt"
              className={errors.sender_name ? 'border-red-500' : ''}
            />
            {errors.sender_name && (
              <p className="text-red-500 text-sm mt-1">{errors.sender_name}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || emailList.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Einladungen werden gesendet...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {emailList.length} Einladung(en) senden
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Invitation List Component
function InvitationList({ invitations, onRefresh }) {
  const [copiedToken, setCopiedToken] = useState(null)
  
  const copyToClipboard = async (token) => {
    const link = `${window.location.origin}/assessment/${token}`
    try {
      await navigator.clipboard.writeText(link)
      setCopiedToken(token)
      setTimeout(() => setCopiedToken(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }
  
  const getStatusBadge = (invitation) => {
    if (invitation.is_used) {
      return <Badge className="bg-green-500 text-white">Abgeschlossen</Badge>
    }
    
    const expiresAt = new Date(invitation.expires_at)
    const now = new Date()
    
    if (expiresAt < now) {
      return <Badge variant="destructive">Abgelaufen</Badge>
    }
    
    return <Badge className="bg-blue-500 text-white">Ausstehend</Badge>
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  if (!invitations || invitations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Noch keine Einladungen
          </h3>
          <p className="text-gray-600">
            Sende deine erste Assessment-Einladung über das Formular oben.
          </p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Gesendete Einladungen</span>
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          Aktualisieren
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <motion.div
              key={invitation.token}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">
                        {invitation.participant_name || invitation.participant_email}
                      </span>
                    </div>
                    {getStatusBadge(invitation)}
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>E-Mail: {invitation.participant_email}</p>
                    <p>Firma: {invitation.company_name}</p>
                    <p>Absender: {invitation.sender_name}</p>
                    <div className="flex items-center space-x-4">
                      <span>Erstellt: {formatDate(invitation.created_at)}</span>
                      <span>Läuft ab: {formatDate(invitation.expires_at)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(invitation.token)}
                    disabled={invitation.is_used}
                  >
                    {copiedToken === invitation.token ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Kopiert
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Link kopieren
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/assessment/${invitation.token}`, '_blank')}
                    disabled={invitation.is_used}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Main Invitation Manager Component
export default function InvitationManager() {
  const [invitations, setInvitations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [activeTab, setActiveTab] = useState('single')
  const [message, setMessage] = useState(null)
  
  // Load invitations
  const loadInvitations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat-assessment/invitations')
      if (response.ok) {
        const data = await response.json()
        setInvitations(data)
      }
    } catch (error) {
      console.error('Failed to load invitations:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    loadInvitations()
  }, [])
  
  // Send single invitation
  const sendSingleInvitation = async (invitationData) => {
    setIsSending(true)
    try {
      // Add default company name
      const dataWithCompany = {
        ...invitationData,
        company_name: 'Hugo at Work'
      }
      
      const response = await fetch('/api/chat-assessment/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithCompany)
      })
      
      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Einladung erfolgreich gesendet!'
        })
        loadInvitations()
        return true
      } else {
        const errorData = await response.json()
        setMessage({
          type: 'error',
          text: errorData.detail || 'Fehler beim Senden der Einladung'
        })
        return false
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Verbindungsfehler. Bitte versuche es erneut.'
      })
      return false
    } finally {
      setIsSending(false)
      setTimeout(() => setMessage(null), 5000)
    }
  }
  
  // Send bulk invitations
  const sendBulkInvitations = async (invitationsList) => {
    setIsSending(true)
    let successCount = 0
    let errorCount = 0
    
    try {
      for (const invitationData of invitationsList) {
        try {
          const response = await fetch('/api/chat-assessment/invitations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(invitationData)
          })
          
          if (response.ok) {
            successCount++
          } else {
            errorCount++
          }
        } catch (error) {
          errorCount++
        }
      }
      
      if (successCount > 0) {
        setMessage({
          type: 'success',
          text: `${successCount} Einladung(en) erfolgreich gesendet${errorCount > 0 ? `, ${errorCount} fehlgeschlagen` : ''}!`
        })
        loadInvitations()
        return true
      } else {
        setMessage({
          type: 'error',
          text: 'Alle Einladungen sind fehlgeschlagen'
        })
        return false
      }
    } finally {
      setIsSending(false)
      setTimeout(() => setMessage(null), 5000)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessment-Einladungen</h1>
          <p className="text-gray-600">
            Sende Einladungen für Hugo-Persönlichkeitsassessments an deine Mitarbeiter
          </p>
        </div>
      </div>
      
      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </motion.div>
      )}
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('single')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'single'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Einzelne Einladung
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'bulk'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Mehrere Einladungen
        </button>
        <button
          onClick={() => setActiveTab('chat-test')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
            activeTab === 'chat-test'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat Testen</span>
        </button>
      </div>
      
      {/* Forms */}
      {activeTab === 'single' ? (
        <InvitationForm onSend={sendSingleInvitation} isLoading={isSending} />
      ) : activeTab === 'bulk' ? (
        <BulkInvitationForm onSend={sendBulkInvitations} isLoading={isSending} />
      ) : (
        <TwoStageHugoAssessment />
      )}
      
      {/* Invitations List */}
      {activeTab !== 'chat-test' && (
        <InvitationList invitations={invitations} onRefresh={loadInvitations} />
      )}
    </div>
  )
}
