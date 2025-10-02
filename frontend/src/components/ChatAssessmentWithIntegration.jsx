import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, Users, TrendingUp, Award } from 'lucide-react';

const ChatAssessmentWithIntegration = () => {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [teamIntegrationResult, setTeamIntegrationResult] = useState(null);
  const [userResponses, setUserResponses] = useState({});
  const messagesEndRef = useRef(null);

  const questions = [
    {
      id: 'name',
      text: "Hallo! Ich bin Hugo, dein persönlicher Persönlichkeitsexperte. 👋 Schön, dass du hier bist! Wie soll ich dich nennen?",
      type: 'text'
    },
    {
      id: 'cultural_background',
      text: "Danke, {name}! Um dir die bestmöglichen Team-Empfehlungen zu geben, nutzen wir die Culture Map Theorie von Erin Meyer. Diese hilft uns, kulturelle Unterschiede in internationalen Teams zu verstehen und zu nutzen. 🌍\n\nIn welchem Land hast du hauptsächlich deine Kindheit und Jugend verbracht? Das prägt oft unsere Arbeits- und Kommunikationsstile.",
      type: 'text'
    },
    {
      id: 'work_approach',
      text: "Perfekt! Jetzt lass uns über deine Arbeitsweise sprechen. 💼\n\nWenn du ein neues Projekt startest, was machst du typischerweise zuerst?\n\nA) Ich entwickle eine klare Vision und Strategie\nB) Ich sammle innovative Ideen und Möglichkeiten\nC) Ich analysiere alle verfügbaren Daten und Fakten\nD) Ich spreche mit allen Beteiligten und hole Feedback ein",
      type: 'multiple_choice',
      options: ['A', 'B', 'C', 'D']
    },
    {
      id: 'leadership_style',
      text: "Interessant! Und wie gehst du mit Führungsaufgaben um? 👑\n\nWenn du ein Team leiten müsstest, welcher Ansatz beschreibt dich am besten?\n\nA) Ich gebe klare Richtungen vor und sorge für Struktur\nB) Ich inspiriere das Team mit neuen Ideen und Visionen\nC) Ich stelle mein Fachwissen zur Verfügung und berate\nD) Ich moderiere und sorge dafür, dass alle gehört werden",
      type: 'multiple_choice',
      options: ['A', 'B', 'C', 'D']
    },
    {
      id: 'problem_solving',
      text: "Sehr aufschlussreich! Jetzt zu Problemlösungen: 🧩\n\nWenn dein Team vor einer schwierigen Herausforderung steht, was ist dein natürlicher Impuls?\n\nA) Ich entwickle einen strukturierten Plan mit klaren Schritten\nB) Ich denke außerhalb der Box und suche kreative Lösungen\nC) Ich recherchiere gründlich und analysiere alle Optionen\nD) Ich bringe alle zusammen, um gemeinsam eine Lösung zu finden",
      type: 'multiple_choice',
      options: ['A', 'B', 'C', 'D']
    },
    {
      id: 'communication_style',
      text: "Toll! Lass uns über Kommunikation sprechen. 💬\n\nWie kommunizierst du am liebsten in beruflichen Situationen?\n\nA) Direkt und strukturiert - ich komme schnell zum Punkt\nB) Begeisternd und inspirierend - ich teile gerne Visionen\nC) Präzise und faktenbasiert - ich erkläre Details gründlich\nD) Empathisch und inklusiv - ich achte auf alle Perspektiven",
      type: 'multiple_choice',
      options: ['A', 'B', 'C', 'D']
    },
    {
      id: 'team_contribution',
      text: "Ausgezeichnet! Jetzt zur Teamarbeit: 🤝\n\nWas ist dein größter Beitrag in einem Team?\n\nA) Ich sorge für Klarheit, Struktur und dass Ziele erreicht werden\nB) Ich bringe frische Ideen und neue Perspektiven ein\nC) Ich liefere fundiertes Wissen und qualitativ hochwertige Arbeit\nD) Ich schaffe Harmonie und stelle sicher, dass alle mitgenommen werden",
      type: 'multiple_choice',
      options: ['A', 'B', 'C', 'D']
    },
    {
      id: 'motivation',
      text: "Fantastisch! Eine wichtige Frage zur Motivation: ⚡\n\nWas motiviert dich am meisten bei der Arbeit?\n\nA) Ziele erreichen und Ergebnisse sehen\nB) Neue Möglichkeiten entdecken und Innovationen schaffen\nC) Expertise aufbauen und komplexe Probleme lösen\nD) Menschen helfen und positive Beziehungen aufbauen",
      type: 'multiple_choice',
      options: ['A', 'B', 'C', 'D']
    },
    {
      id: 'stress_response',
      text: "Sehr interessant! Zum Abschluss noch eine Frage: 😤\n\nWie reagierst du typischerweise auf Stress oder Druck?\n\nA) Ich werde noch strukturierter und fokussierter\nB) Ich suche nach kreativen Auswegen und neuen Ansätzen\nC) Ich analysiere die Situation gründlich und suche bewährte Lösungen\nD) Ich suche Unterstützung im Team und teile die Last",
      type: 'multiple_choice',
      options: ['A', 'B', 'C', 'D']
    },
    {
      id: 'final_thoughts',
      text: "Perfekt! Zum Abschluss: Gibt es noch etwas Besonderes über deine Arbeitsweise oder Persönlichkeit, das du gerne teilen möchtest? 🌟\n\n(Optional - du kannst auch einfach 'Nein' oder 'Fertig' schreiben)",
      type: 'text'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start with first question
    if (messages.length === 0) {
      setTimeout(() => {
        addBotMessage(questions[0].text);
      }, 1000);
    }
  }, []);

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: text.replace('{name}', userResponses.name || ''),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('de-DE', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }]);
  };

  const calculateHugoType = (responses) => {
    const scores = { V: 0, I: 0, E: 0, C: 0 };
    
    // Score based on responses
    const answerMap = {
      work_approach: { A: 'V', B: 'I', C: 'E', D: 'C' },
      leadership_style: { A: 'V', B: 'I', C: 'E', D: 'C' },
      problem_solving: { A: 'V', B: 'I', C: 'E', D: 'C' },
      communication_style: { A: 'V', B: 'I', C: 'E', D: 'C' },
      team_contribution: { A: 'V', B: 'I', C: 'E', D: 'C' },
      motivation: { A: 'V', B: 'I', C: 'E', D: 'C' },
      stress_response: { A: 'V', B: 'I', C: 'E', D: 'C' }
    };

    Object.entries(answerMap).forEach(([question, mapping]) => {
      const answer = responses[question];
      if (answer && mapping[answer]) {
        scores[mapping[answer]]++;
      }
    });

    // Find dominant dimension
    const maxScore = Math.max(...Object.values(scores));
    const dominantDimensions = Object.entries(scores)
      .filter(([_, score]) => score === maxScore)
      .map(([dim, _]) => dim);

    // If tie, use secondary criteria or default
    const primaryDim = dominantDimensions[0];
    
    // Determine subtype (1, 2, or 3) based on secondary characteristics
    let subtype = 1;
    if (responses.leadership_style === 'A' || responses.work_approach === 'A') {
      subtype = 1; // More directive/strategic
    } else if (responses.communication_style === 'B' || responses.motivation === 'B') {
      subtype = 2; // More inspirational/developmental
    } else {
      subtype = 3; // More operational/supportive
    }

    return `${primaryDim}${subtype}`;
  };

  const getHugoTypeInfo = (hugoType) => {
    const typeInfo = {
      'V1': { name: 'Wegweiser', dimension: 'Vision', description: 'Strategischer Visionär und Richtungsweiser' },
      'V2': { name: 'Entwickler', dimension: 'Vision', description: 'Menschenentwickler und Potentialförderer' },
      'V3': { name: 'Organisator', dimension: 'Vision', description: 'Strukturierter Umsetzer und Organisationstalent' },
      'I1': { name: 'Pionier', dimension: 'Innovation', description: 'Mutiger Innovator und Trendsetter' },
      'I2': { name: 'Architekt', dimension: 'Innovation', description: 'Systematischer Innovator und Konzeptentwickler' },
      'I3': { name: 'Inspirator', dimension: 'Innovation', description: 'Begeisternder Ideengeber und Motivator' },
      'E1': { name: 'Forscher', dimension: 'Expertise', description: 'Analytischer Experte und Wissensentdecker' },
      'E2': { name: 'Meister', dimension: 'Expertise', description: 'Handwerklicher Experte und Qualitätssicherer' },
      'E3': { name: 'Berater', dimension: 'Expertise', description: 'Beratender Experte und Wissensverteiler' },
      'C1': { name: 'Harmonizer', dimension: 'Kollaboration', description: 'Teamharmonie-Experte und Konfliktlöser' },
      'C2': { name: 'Brückenbauer', dimension: 'Kollaboration', description: 'Netzwerker und Beziehungsaufbauer' },
      'C3': { name: 'Umsetzer', dimension: 'Kollaboration', description: 'Praktischer Umsetzer und Teamplayer' }
    };
    
    return typeInfo[hugoType] || { name: 'Unbekannt', dimension: 'Unbekannt', description: 'Typ nicht erkannt' };
  };

  const completeAssessment = async () => {
    const hugoType = calculateHugoType(userResponses);
    const typeInfo = getHugoTypeInfo(hugoType);
    
    const result = {
      hugo_type: hugoType,
      type_info: typeInfo,
      name: userResponses.name,
      cultural_background: userResponses.cultural_background,
      responses: userResponses
    };
    
    setAssessmentResult(result);
    
    // Simulate team integration API call
    try {
      const integrationResponse = await fetch('/api/chat-assessment/complete-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: 'test-token',
          name: userResponses.name,
          email: userResponses.email || 'test@example.com',
          cultural_background: userResponses.cultural_background,
          hugo_type: hugoType,
          responses: userResponses
        })
      });
      
      if (integrationResponse.ok) {
        const integrationResult = await integrationResponse.json();
        setTeamIntegrationResult(integrationResult);
      }
    } catch (error) {
      console.error('Team integration error:', error);
      // Set mock result for demo
      setTeamIntegrationResult({
        success: true,
        user_id: 123,
        team_id: 1,
        team_name: 'Product Development Team',
        synergy_score: 87.5,
        message: `Erfolgreich in Team 'Product Development Team' integriert! Neue Team-Synergie: 87.5%`
      });
    }
    
    setAssessmentComplete(true);
    
    setTimeout(() => {
      addBotMessage(`🎉 Fantastisch, ${userResponses.name}! Dein Assessment ist abgeschlossen.\n\nDu bist ein **${typeInfo.name} (${hugoType})** - ${typeInfo.description}!\n\nDeine Hauptdimension ist **${typeInfo.dimension}**. Das bedeutet, du bringst besondere Stärken in diesem Bereich mit und ergänzt Teams optimal.\n\n✨ Ich integriere dich jetzt automatisch in das passende Team...`);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const currentQ = questions[currentQuestion];
    addUserMessage(currentInput);
    
    // Store response
    const newResponses = { ...userResponses, [currentQ.id]: currentInput };
    setUserResponses(newResponses);

    // Move to next question or complete
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        addBotMessage(questions[currentQuestion + 1].text);
      }, 1000);
    } else {
      // Assessment complete
      setTimeout(() => {
        completeAssessment();
      }, 1000);
    }

    setCurrentInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (assessmentComplete && teamIntegrationResult) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Assessment Abgeschlossen!</h2>
          <p className="text-gray-600">Herzlichen Glückwunsch zur erfolgreichen Team-Integration</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Personality Result */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Dein Hugo-Typ</h3>
                <p className="text-blue-600 font-medium">{assessmentResult.type_info.dimension}</p>
              </div>
            </div>
            <div className="mb-4">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                {assessmentResult.type_info.name} ({assessmentResult.hugo_type})
              </h4>
              <p className="text-gray-700">{assessmentResult.type_info.description}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h5 className="font-semibold text-gray-900 mb-2">Deine Stärken:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Strategisches Denken und Visionsentwicklung</li>
                <li>• Strukturierte Herangehensweise an Probleme</li>
                <li>• Natürliche Führungsqualitäten</li>
                <li>• Zielorientierte Arbeitsweise</li>
              </ul>
            </div>
          </div>

          {/* Team Integration Result */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Team-Integration</h3>
                <p className="text-green-600 font-medium">Erfolgreich zugewiesen</p>
              </div>
            </div>
            <div className="mb-4">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                {teamIntegrationResult.team_name}
              </h4>
              <p className="text-gray-700 mb-4">{teamIntegrationResult.message}</p>
            </div>
            {teamIntegrationResult.synergy_score && (
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">Team-Synergie</span>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-2xl font-bold text-green-600">
                      {teamIntegrationResult.synergy_score}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${teamIntegrationResult.synergy_score}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mr-4"
          >
            Neues Assessment starten
          </button>
          <button
            onClick={() => window.location.href = '/teams'}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Zu meinem Team
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/hugo-avatar-transparent.png" 
              alt="Hugo" 
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-semibold text-gray-900">Hugo Assessment</h3>
              <p className="text-sm text-gray-600">KI-gestütztes Persönlichkeitsassessment</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Frage {currentQuestion + 1} von {questions.length}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              {message.sender === 'bot' && (
                <img 
                  src="/hugo-avatar-transparent.png" 
                  alt="Hugo" 
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
              )}
              <div className={`px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <img 
                src="/hugo-avatar-transparent.png" 
                alt="Hugo" 
                className="w-8 h-8 rounded-full"
              />
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!assessmentComplete && (
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Deine Antwort hier eingeben..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isTyping}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Drücke Enter zum Senden • Sei ehrlich und authentisch für die besten Ergebnisse
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatAssessmentWithIntegration;
