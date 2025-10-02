import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ASSESSMENT_QUESTIONS, ANSWER_SCALE } from '../data/personality/assessmentQuestions';
import { getPersonalityProfile, getAssessmentProgress } from '../utils/personalityAssessment';
import { DIMENSIONS } from '../data/personality/personalityTypes';

const HugoPersonalityAssessment = ({ onComplete }) => {
  const { t, i18n } = useTranslation();
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [profile, setProfile] = useState(null);

  const lang = i18n.language;
  const progress = getAssessmentProgress(answers);
  const question = ASSESSMENT_QUESTIONS[currentQuestion];

  const handleAnswer = (value) => {
    const newAnswers = {
      ...answers,
      [question.id]: value
    };
    setAnswers(newAnswers);

    // Auto-advance to next question
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      // Assessment complete
      setTimeout(() => {
        const personalityProfile = getPersonalityProfile(newAnswers);
        setProfile(personalityProfile);
        setShowResults(true);
        if (onComplete) {
          onComplete(personalityProfile);
        }
      }, 300);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  if (showResults && profile) {
    return <AssessmentResults profile={profile} lang={lang} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {lang === 'de' ? 'Hugo Persönlichkeits-Assessment' : 'Hugo Personality Assessment'}
          </CardTitle>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                {lang === 'de' ? 'Frage' : 'Question'} {currentQuestion + 1} {lang === 'de' ? 'von' : 'of'} {ASSESSMENT_QUESTIONS.length}
              </span>
              <span>{progress.percentage}%</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-lg font-medium text-gray-800">
              {question.question[lang]}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {ANSWER_SCALE.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  answers[question.id] === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.label[lang]}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[question.id] === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[question.id] === option.value && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={currentQuestion === 0}
            >
              {lang === 'de' ? '← Zurück' : '← Previous'}
            </Button>
            <Button
              variant="outline"
              onClick={goToNext}
              disabled={currentQuestion === ASSESSMENT_QUESTIONS.length - 1 || !answers[question.id]}
            >
              {lang === 'de' ? 'Weiter →' : 'Next →'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AssessmentResults = ({ profile, lang }) => {
  const primaryType = profile.primaryTypeData;
  const dimension = DIMENSIONS[primaryType.dimension.toUpperCase()];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Primary Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {lang === 'de' ? 'Ihr Persönlichkeitsprofil' : 'Your Personality Profile'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">{dimension.icon}</div>
            <h2 className="text-3xl font-bold text-blue-600 mb-2">
              {primaryType.name[lang]}
            </h2>
            <p className="text-xl text-gray-600 italic mb-4">
              "{primaryType.tagline[lang]}"
            </p>
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
              {dimension.name[lang]}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-3">
              {lang === 'de' ? 'Kernpersönlichkeit' : 'Core Personality'}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {primaryType.core[lang]}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">
              {lang === 'de' ? 'Ihre Stärken' : 'Your Strengths'}
            </h3>
            <ul className="space-y-2">
              {primaryType.strengths[lang].map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Types */}
      <Card>
        <CardHeader>
          <CardTitle>
            {lang === 'de' ? 'Ihre Top 3 Persönlichkeitstypen' : 'Your Top 3 Personality Types'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.topTypes.map((type, index) => {
              const typeDimension = DIMENSIONS[type.data.dimension.toUpperCase()];
              return (
                <div key={type.typeId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{typeDimension.icon}</span>
                    <div>
                      <p className="font-semibold">{type.data.name[lang]}</p>
                      <p className="text-sm text-gray-600">{type.data.tagline[lang]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{type.percentage}%</p>
                    <p className="text-xs text-gray-500">
                      {lang === 'de' ? 'Übereinstimmung' : 'Match'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dimension Scores */}
      <Card>
        <CardHeader>
          <CardTitle>
            {lang === 'de' ? 'Ihre Dimensionen' : 'Your Dimensions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(profile.dimensionScores).map(([dimId, score]) => {
              const dim = DIMENSIONS[dimId.toUpperCase()];
              const maxScore = 45; // 3 types × 3 questions × 5 points
              const percentage = Math.round((score / maxScore) * 100);
              
              return (
                <div key={dimId}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{dim.icon}</span>
                      <span className="font-semibold">{dim.name[lang]}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-3" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HugoPersonalityAssessment;
