/**
 * Hugo Personality Assessment - Evaluation Logic
 */

import { PERSONALITY_TYPES } from '../data/personality/personalityTypes';
import { ASSESSMENT_QUESTIONS } from '../data/personality/assessmentQuestions';

/**
 * Calculate personality scores from assessment answers
 * @param {Object} answers - Object with question IDs as keys and scores (1-5) as values
 * @returns {Object} - Scores for each personality type
 */
export const calculatePersonalityScores = (answers) => {
  const scores = {};
  
  // Initialize scores for all types
  Object.keys(PERSONALITY_TYPES).forEach(typeId => {
    scores[typeId] = 0;
  });
  
  // Calculate scores based on answers
  ASSESSMENT_QUESTIONS.forEach(question => {
    const answer = answers[question.id];
    if (answer !== undefined && answer !== null) {
      scores[question.type] += answer;
    }
  });
  
  return scores;
};

/**
 * Determine primary personality type
 * @param {Object} scores - Scores for each personality type
 * @returns {string} - Primary personality type ID
 */
export const getPrimaryType = (scores) => {
  let maxScore = 0;
  let primaryType = null;
  
  Object.entries(scores).forEach(([typeId, score]) => {
    if (score > maxScore) {
      maxScore = score;
      primaryType = typeId;
    }
  });
  
  return primaryType;
};

/**
 * Get top N personality types
 * @param {Object} scores - Scores for each personality type
 * @param {number} n - Number of top types to return
 * @returns {Array} - Array of {typeId, score} objects sorted by score
 */
export const getTopTypes = (scores, n = 3) => {
  return Object.entries(scores)
    .map(([typeId, score]) => ({ typeId, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
};

/**
 * Calculate dimension scores
 * @param {Object} scores - Scores for each personality type
 * @returns {Object} - Scores for each dimension
 */
export const calculateDimensionScores = (scores) => {
  const dimensionScores = {
    vision: 0,
    innovation: 0,
    expertise: 0,
    collaboration: 0
  };
  
  Object.entries(scores).forEach(([typeId, score]) => {
    const type = PERSONALITY_TYPES[typeId];
    if (type) {
      dimensionScores[type.dimension] += score;
    }
  });
  
  return dimensionScores;
};

/**
 * Get personality profile with detailed information
 * @param {Object} answers - Assessment answers
 * @returns {Object} - Complete personality profile
 */
export const getPersonalityProfile = (answers) => {
  const scores = calculatePersonalityScores(answers);
  const primaryType = getPrimaryType(scores);
  const topTypes = getTopTypes(scores, 3);
  const dimensionScores = calculateDimensionScores(scores);
  
  // Calculate percentages
  const maxPossibleScore = 15; // 3 questions × 5 points max
  const percentages = {};
  Object.entries(scores).forEach(([typeId, score]) => {
    percentages[typeId] = Math.round((score / maxPossibleScore) * 100);
  });
  
  return {
    primaryType,
    primaryTypeData: PERSONALITY_TYPES[primaryType],
    topTypes: topTypes.map(t => ({
      ...t,
      data: PERSONALITY_TYPES[t.typeId],
      percentage: percentages[t.typeId]
    })),
    scores,
    percentages,
    dimensionScores,
    completedAt: new Date().toISOString()
  };
};

/**
 * Check if assessment is complete
 * @param {Object} answers - Assessment answers
 * @returns {boolean} - True if all questions are answered
 */
export const isAssessmentComplete = (answers) => {
  return ASSESSMENT_QUESTIONS.every(q => 
    answers[q.id] !== undefined && answers[q.id] !== null
  );
};

/**
 * Get assessment progress
 * @param {Object} answers - Assessment answers
 * @returns {Object} - Progress information
 */
export const getAssessmentProgress = (answers) => {
  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const answeredQuestions = Object.keys(answers).length;
  const percentage = Math.round((answeredQuestions / totalQuestions) * 100);
  
  return {
    total: totalQuestions,
    answered: answeredQuestions,
    remaining: totalQuestions - answeredQuestions,
    percentage,
    isComplete: answeredQuestions === totalQuestions
  };
};

export default {
  calculatePersonalityScores,
  getPrimaryType,
  getTopTypes,
  calculateDimensionScores,
  getPersonalityProfile,
  isAssessmentComplete,
  getAssessmentProgress
};
