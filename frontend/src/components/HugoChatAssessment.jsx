import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, User, Bot } from 'lucide-react';
import { getCulturalProfile, interpretCulturalDimensions } from '../data/cultural/culturalDimensions';
import { personalityTypes } from '../data/personality/personalityTypes';
import { dimensionQuestions, analyzeDimensionResponse, analyzeTypeResponse } from '../data/assessment/openEndedQuestions';

const HugoChatAssessment = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [conversationState, setConversationState] = useState('welcome');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    country: '',
    culturalProfile: null
  });
  const [assessmentData, setAssessmentData] = useState({
    currentPhase: 'phase1', // phase1 = dimension identification, phase2 = type identification
    currentQuestionIndex: 0,
    currentDimension: null,
    dimensionScores: { vision: 0, innovation: 0, expertise: 0, collaboration: 0 },
    typeScores: {},
    responses: [],
    finalType: null
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation
  useEffect(() => {
    const welcomeMessage = {
      type: 'hugo',
      content: getWelcomeMessage(),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [i18n.language]);

  const getWelcomeMessage = () => {
    const messages = {
      de: `Hallo! 👋 Ich bin Hugo, dein persönlicher Persönlichkeits-Coach!\n\nIch freue mich, dich kennenzulernen und gemeinsam mit dir deine einzigartige Persönlichkeit zu entdecken. Dieses Assessment ist anders - wir führen ein echtes Gespräch, bei dem ich dich besser kennenlerne.\n\nBevor wir beginnen, möchte ich gerne wissen: **Wie heißt du?**`,
      en: `Hello! 👋 I'm Hugo, your personal personality coach!\n\nI'm excited to get to know you and discover your unique personality together. This assessment is different - we'll have a real conversation where I get to know you better.\n\nBefore we start, I'd like to know: **What's your name?**`,
      da: `Hej! 👋 Jeg er Hugo, din personlige personlighedscoach!\n\nJeg glæder mig til at lære dig at kende og opdage din unikke personlighed sammen. Denne vurdering er anderledes - vi vil have en ægte samtale, hvor jeg lærer dig bedre at kende.\n\nFør vi starter, vil jeg gerne vide: **Hvad hedder du?**`
    };
    return messages[i18n.language] || messages.en;
  };

  const addHugoMessage = (content, delay = 500) => {
    setTimeout(() => {
      const hugoMessage = {
        type: 'hugo',
        content: content,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, hugoMessage]);
    }, delay);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Process user input based on conversation state
    processUserInput(inputValue);
    setInputValue('');
  };

  const processUserInput = (input) => {
    switch (conversationState) {
      case 'welcome':
        handleNameInput(input);
        break;
      case 'askEmail':
        handleEmailInput(input);
        break;
      case 'askCountry':
        handleCountryInput(input);
        break;
      case 'dimensionQuestions':
        handleDimensionQuestionResponse(input);
        break;
      case 'typeQuestions':
        handleTypeQuestionResponse(input);
        break;
      default:
        break;
    }
  };

  const handleNameInput = (name) => {
    setUserData(prev => ({ ...prev, name }));
    const responses = {
      de: `Schön, dich kennenzulernen, ${name}! 😊\n\nUm deine Ergebnisse später speichern und dir zusenden zu können, benötige ich deine **E-Mail-Adresse**. Keine Sorge, deine Daten sind bei uns sicher!`,
      en: `Nice to meet you, ${name}! 😊\n\nTo save your results and send them to you later, I need your **email address**. Don't worry, your data is safe with us!`,
      da: `Rart at møde dig, ${name}! 😊\n\nFor at gemme dine resultater og sende dem til dig senere, har jeg brug for din **e-mailadresse**. Bare rolig, dine data er sikre hos os!`
    };
    addHugoMessage(responses[i18n.language]);
    setConversationState('askEmail');
  };

  const handleEmailInput = (email) => {
    setUserData(prev => ({ ...prev, email }));
    const responses = {
      de: `Perfekt, ${userData.name}!\n\nJetzt eine interessante Frage: **In welchem Land hast du deine Jugend (ca. 10-20 Jahre) verbracht?**\n\nDas ist wichtig, weil unsere kulturelle Prägung einen großen Einfluss auf unsere Persönlichkeitsentwicklung hat. Ich nutze die Erkenntnisse von Erin Meyer und Geert Hofstede, um deine kulturellen Präferenzen besser zu verstehen.\n\n*Bitte gib das Länderkürzel ein (z.B. DE, US, DK, FR, etc.)*`,
      en: `Perfect, ${userData.name}!\n\nNow an interesting question: **In which country did you spend your youth (approximately ages 10-20)?**\n\nThis is important because our cultural background has a significant influence on our personality development. I use insights from Erin Meyer and Geert Hofstede to better understand your cultural preferences.\n\n*Please enter the country code (e.g., DE, US, DK, FR, etc.)*`,
      da: `Perfekt, ${userData.name}!\n\nNu et interessant spørgsmål: **I hvilket land tilbragte du din ungdom (ca. 10-20 år)?**\n\nDette er vigtigt, fordi vores kulturelle baggrund har en betydelig indflydelse på vores personlighedsudvikling. Jeg bruger indsigter fra Erin Meyer og Geert Hofstede til bedre at forstå dine kulturelle præferencer.\n\n*Indtast venligst landekoden (f.eks. DE, US, DK, FR, etc.)*`
    };
    addHugoMessage(responses[i18n.language]);
    setConversationState('askCountry');
  };

  const handleCountryInput = (input) => {
    const countryCode = input.toUpperCase();
    const profile = getCulturalProfile(countryCode);
    
    if (profile) {
      setUserData(prev => ({ 
        ...prev, 
        country: countryCode,
        culturalProfile: profile
      }));
      
      const interpretations = interpretCulturalDimensions(countryCode, i18n.language);
      const responses = {
        de: `Interessant! Du bist in **${profile.name.de}** aufgewachsen. 🌍\n\nDas bedeutet, dass du kulturell geprägt bist von:\n• ${interpretations.communicating}\n• ${interpretations.evaluating}\n• ${interpretations.leading}\n• ${interpretations.deciding}\n\nDiese kulturellen Einflüsse fließen in unsere Analyse ein und helfen mir, deine Persönlichkeit noch besser zu verstehen.\n\nJetzt lass uns mit den eigentlichen Fragen beginnen! 🚀`,
        en: `Interesting! You grew up in **${profile.name.en}**. 🌍\n\nThis means you're culturally influenced by:\n• ${interpretations.communicating}\n• ${interpretations.evaluating}\n• ${interpretations.leading}\n• ${interpretations.deciding}\n\nThese cultural influences flow into our analysis and help me understand your personality even better.\n\nNow let's start with the actual questions! 🚀`,
        da: `Interessant! Du voksede op i **${profile.name.da}**. 🌍\n\nDet betyder, at du er kulturelt påvirket af:\n• ${interpretations.communicating}\n• ${interpretations.evaluating}\n• ${interpretations.leading}\n• ${interpretations.deciding}\n\nDisse kulturelle påvirkninger indgår i vores analyse og hjælper mig med at forstå din personlighed endnu bedre.\n\nLad os nu starte med de egentlige spørgsmål! 🚀`
      };
      
      addHugoMessage(responses[i18n.language]);
      
      // Start dimension questions
      setTimeout(() => {
        const startResponses = {
          de: `Ich stelle dir jetzt einige offene Fragen, um herauszufinden, welche der vier Hauptdimensionen am besten zu dir passt:\n\n🎯 **VISION** - Wegweiser, Entwickler, Organisator\n💡 **INNOVATION** - Pionier, Architekt, Inspirator\n📚 **EXPERTISE** - Forscher, Meister, Berater\n🤝 **KOLLABORATION** - Harmonizer, Brückenbauer, Umsetzer\n\nBereit? Dann lass uns starten! 😊`,
          en: `I'll now ask you some open-ended questions to find out which of the four main dimensions fits you best:\n\n🎯 **VISION** - Pathfinder, Developer, Organizer\n💡 **INNOVATION** - Pioneer, Architect, Inspirator\n📚 **EXPERTISE** - Researcher, Master, Advisor\n🤝 **COLLABORATION** - Harmonizer, Bridge Builder, Implementer\n\nReady? Let's get started! 😊`,
          da: `Jeg vil nu stille dig nogle åbne spørgsmål for at finde ud af, hvilken af de fire hoveddimensioner der passer bedst til dig:\n\n🎯 **VISION** - Vejviser, Udvikler, Organisator\n💡 **INNOVATION** - Pioner, Arkitekt, Inspirator\n📚 **EKSPERTISE** - Forsker, Mester, Rådgiver\n🤝 **SAMARBEJDE** - Harmonizer, Brobygger, Implementer\n\nKlar? Lad os komme i gang! 😊`
        };
        addHugoMessage(startResponses[i18n.language], 0);
        
        // Ask first dimension question
        setTimeout(() => {
          askNextDimensionQuestion();
        }, 2000);
      }, 2000);
      
      setConversationState('dimensionQuestions');
    } else {
      const errorResponses = {
        de: `Entschuldigung, ich konnte das Land "${input}" nicht finden. Bitte gib ein gültiges Länderkürzel ein (z.B. DE, US, DK, FR).`,
        en: `Sorry, I couldn't find the country "${input}". Please enter a valid country code (e.g., DE, US, DK, FR).`,
        da: `Undskyld, jeg kunne ikke finde landet "${input}". Indtast venligst en gyldig landekode (f.eks. DE, US, DK, FR).`
      };
      addHugoMessage(errorResponses[i18n.language]);
    }
  };

  const askNextDimensionQuestion = () => {
    const questionIndex = assessmentData.currentQuestionIndex;
    if (questionIndex >= dimensionQuestions.phase1.length) {
      // Phase 1 complete - determine primary dimension
      determinePrimaryDimension();
      return;
    }

    const question = dimensionQuestions.phase1[questionIndex];
    const questionText = question.question[i18n.language];
    addHugoMessage(questionText, 0);
  };

  const handleDimensionQuestionResponse = (response) => {
    const questionIndex = assessmentData.currentQuestionIndex;
    const question = dimensionQuestions.phase1[questionIndex];
    
    // Analyze response
    const scores = analyzeDimensionResponse(response, question.id);
    
    // Update dimension scores
    setAssessmentData(prev => ({
      ...prev,
      dimensionScores: {
        vision: prev.dimensionScores.vision + scores.vision,
        innovation: prev.dimensionScores.innovation + scores.innovation,
        expertise: prev.dimensionScores.expertise + scores.expertise,
        collaboration: prev.dimensionScores.collaboration + scores.collaboration
      },
      responses: [...prev.responses, { questionId: question.id, response, scores }],
      currentQuestionIndex: prev.currentQuestionIndex + 1
    }));

    // Acknowledgment
    const acknowledgments = {
      de: ['Interessant! 🤔', 'Danke für deine Antwort! 👍', 'Das hilft mir sehr! 😊', 'Verstehe! 💡'],
      en: ['Interesting! 🤔', 'Thanks for your answer! 👍', 'That helps me a lot! 😊', 'I see! 💡'],
      da: ['Interessant! 🤔', 'Tak for dit svar! 👍', 'Det hjælper mig meget! 😊', 'Jeg forstår! 💡']
    };
    const randomAck = acknowledgments[i18n.language][Math.floor(Math.random() * 4)];
    addHugoMessage(randomAck);

    // Ask next question
    setTimeout(() => {
      askNextDimensionQuestion();
    }, 1500);
  };

  const determinePrimaryDimension = () => {
    const scores = assessmentData.dimensionScores;
    const maxScore = Math.max(scores.vision, scores.innovation, scores.expertise, scores.collaboration);
    let primaryDimension = '';
    
    if (scores.vision === maxScore) primaryDimension = 'vision';
    else if (scores.innovation === maxScore) primaryDimension = 'innovation';
    else if (scores.expertise === maxScore) primaryDimension = 'expertise';
    else if (scores.collaboration === maxScore) primaryDimension = 'collaboration';

    setAssessmentData(prev => ({
      ...prev,
      currentDimension: primaryDimension,
      currentPhase: 'phase2',
      currentQuestionIndex: 0
    }));

    const dimensionNames = {
      vision: { de: 'VISION', en: 'VISION', da: 'VISION' },
      innovation: { de: 'INNOVATION', en: 'INNOVATION', da: 'INNOVATION' },
      expertise: { de: 'EXPERTISE', en: 'EXPERTISE', da: 'EKSPERTISE' },
      collaboration: { de: 'KOLLABORATION', en: 'COLLABORATION', da: 'SAMARBEJDE' }
    };

    const responses = {
      de: `Großartig! 🎉 Basierend auf deinen Antworten sehe ich, dass du stark in der **${dimensionNames[primaryDimension].de}**-Dimension ausgeprägt bist!\n\nJetzt möchte ich noch etwas genauer werden und herausfinden, welcher spezifische Typ innerhalb dieser Dimension du bist. Ich stelle dir noch ein paar Fragen...`,
      en: `Great! 🎉 Based on your answers, I can see that you're strongly aligned with the **${dimensionNames[primaryDimension].en}** dimension!\n\nNow I'd like to get more specific and find out which exact type within this dimension you are. I'll ask you a few more questions...`,
      da: `Fantastisk! 🎉 Baseret på dine svar kan jeg se, at du er stærkt tilknyttet **${dimensionNames[primaryDimension].da}**-dimensionen!\n\nNu vil jeg gerne være mere specifik og finde ud af, hvilken præcis type inden for denne dimension du er. Jeg vil stille dig et par spørgsmål mere...`
    };

    addHugoMessage(responses[i18n.language], 1000);
    
    setTimeout(() => {
      setConversationState('typeQuestions');
      askNextTypeQuestion();
    }, 3000);
  };

  const askNextTypeQuestion = () => {
    const questionIndex = assessmentData.currentQuestionIndex;
    const dimension = assessmentData.currentDimension;
    const questions = dimensionQuestions[dimension];
    
    if (questionIndex >= questions.length) {
      // Phase 2 complete - determine final type
      determineFinalType();
      return;
    }

    const question = questions[questionIndex];
    const questionText = question.question[i18n.language];
    addHugoMessage(questionText, 0);
  };

  const handleTypeQuestionResponse = (response) => {
    const questionIndex = assessmentData.currentQuestionIndex;
    const dimension = assessmentData.currentDimension;
    const questions = dimensionQuestions[dimension];
    const question = questions[questionIndex];
    
    // Analyze response
    const scores = analyzeTypeResponse(response, dimension, question.id);
    
    // Update type scores
    setAssessmentData(prev => {
      const newTypeScores = { ...prev.typeScores };
      Object.keys(scores).forEach(type => {
        newTypeScores[type] = (newTypeScores[type] || 0) + scores[type];
      });
      
      return {
        ...prev,
        typeScores: newTypeScores,
        responses: [...prev.responses, { questionId: question.id, response, scores }],
        currentQuestionIndex: prev.currentQuestionIndex + 1
      };
    });

    // Acknowledgment
    const acknowledgments = {
      de: ['Verstehe! 💡', 'Danke! 😊', 'Interessant! 🤔', 'Gut! 👍'],
      en: ['I see! 💡', 'Thanks! 😊', 'Interesting! 🤔', 'Good! 👍'],
      da: ['Jeg forstår! 💡', 'Tak! 😊', 'Interessant! 🤔', 'Godt! 👍']
    };
    const randomAck = acknowledgments[i18n.language][Math.floor(Math.random() * 4)];
    addHugoMessage(randomAck);

    // Ask next question
    setTimeout(() => {
      askNextTypeQuestion();
    }, 1500);
  };

  const determineFinalType = () => {
    const scores = assessmentData.typeScores;
    const maxScore = Math.max(...Object.values(scores));
    const finalType = Object.keys(scores).find(type => scores[type] === maxScore);

    setAssessmentData(prev => ({
      ...prev,
      finalType
    }));

    const typeInfo = personalityTypes.find(t => t.id === finalType);
    
    const responses = {
      de: `🎉 **Fantastisch!** Ich habe deine Persönlichkeit analysiert!\n\nDu bist ein **${typeInfo.name.de}** (${finalType})!\n\n**${typeInfo.tagline.de}**\n\n${typeInfo.description.de}\n\n**Deine Stärken:**\n${typeInfo.strengths.de.slice(0, 3).map(s => `• ${s}`).join('\n')}\n\nMöchtest du mehr über deinen Typ erfahren? 😊`,
      en: `🎉 **Fantastic!** I've analyzed your personality!\n\nYou are a **${typeInfo.name.en}** (${finalType})!\n\n**${typeInfo.tagline.en}**\n\n${typeInfo.description.en}\n\n**Your Strengths:**\n${typeInfo.strengths.en.slice(0, 3).map(s => `• ${s}`).join('\n')}\n\nWould you like to learn more about your type? 😊`,
      da: `🎉 **Fantastisk!** Jeg har analyseret din personlighed!\n\nDu er en **${typeInfo.name.da}** (${finalType})!\n\n**${typeInfo.tagline.da}**\n\n${typeInfo.description.da}\n\n**Dine styrker:**\n${typeInfo.strengths.da.slice(0, 3).map(s => `• ${s}`).join('\n')}\n\nVil du gerne vide mere om din type? 😊`
    };

    addHugoMessage(responses[i18n.language], 2000);
    setConversationState('complete');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Hugo</h1>
            <p className="text-sm text-gray-500">{t('assessment.chatbot.subtitle', 'Your Personal Personality Coach')}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[70%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user'
                    ? 'bg-blue-500'
                    : 'bg-gradient-to-br from-blue-500 to-green-500'
                }`}
              >
                {message.type === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('assessment.chatbot.inputPlaceholder', 'Type your message...')}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={conversationState === 'complete'}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || conversationState === 'complete'}
            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HugoChatAssessment;
