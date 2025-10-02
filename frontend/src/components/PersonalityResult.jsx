import React from 'react';
import { Download, Share2, ArrowRight, Star, Target, TrendingUp, Users, Briefcase, Heart, MessageCircle, Award } from 'lucide-react';
import PERSONALITY_TYPES from '../data/personality/personalityTypes';

const PersonalityResult = ({ assessmentData, userData, onDownload, onShare }) => {
  const { finalType } = assessmentData;
  const typeInfo = PERSONALITY_TYPES[finalType];

  if (!typeInfo) return null;

  const dimensionColors = {
    V: 'from-purple-500 to-pink-500',
    I: 'from-blue-500 to-cyan-500',
    E: 'from-green-500 to-emerald-500',
    C: 'from-orange-500 to-amber-500'
  };

  const dimensionColor = dimensionColors[finalType[0]];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <div className={`bg-gradient-to-r ${dimensionColor} rounded-2xl p-8 text-white shadow-xl`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium mb-3">
              {finalType}
            </div>
            <h1 className="text-4xl font-bold mb-2">{typeInfo.name.en}</h1>
            <p className="text-xl text-white/90 mb-4">{typeInfo.tagline.en}</p>
            <p className="text-white/80 leading-relaxed">{typeInfo.description.en}</p>
          </div>
          <div className="ml-6 flex space-x-2">
            <button
              onClick={onDownload}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-lg transition-all"
              title="Download Report"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onShare}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-lg transition-all"
              title="Share Results"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cultural Profile */}
      {userData.culturalProfile && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🌍</span>
            Cultural Background
          </h2>
          <p className="text-gray-700 mb-4">
            You grew up in <strong>{userData.country}</strong>, which has shaped your communication style and work preferences.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Hofstede Dimensions</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>Power Distance: {userData.culturalProfile.hofstede.powerDistance}</li>
                <li>Individualism: {userData.culturalProfile.hofstede.individualism}</li>
                <li>Uncertainty Avoidance: {userData.culturalProfile.hofstede.uncertaintyAvoidance}</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Communication Style</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>Context: {userData.culturalProfile.erinMeyer.communicating}</li>
                <li>Feedback: {userData.culturalProfile.erinMeyer.evaluating}</li>
                <li>Decision Making: {userData.culturalProfile.erinMeyer.deciding}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Strengths */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Star className="w-6 h-6 mr-3 text-yellow-500" />
          Your Strengths
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {typeInfo.strengths.en.map((strength, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">{strength}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Development Areas */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-blue-500" />
          Growth Opportunities
        </h2>
        <p className="text-gray-600 mb-4">
          Every personality type has areas where growth and development can enhance effectiveness:
        </p>
        <div className="space-y-3">
          {typeInfo.developmentAreas?.en?.map((area, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <ArrowRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">{area}</p>
            </div>
          )) || (
            <p className="text-gray-500 italic">Development areas will be added based on your specific type profile.</p>
          )}
        </div>
      </div>

      {/* Communication Style */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <MessageCircle className="w-6 h-6 mr-3 text-purple-500" />
          Communication DNA
        </h2>
        <div className="prose max-w-none text-gray-700">
          <p>
            As a <strong>{typeInfo.name.en}</strong>, your communication style is characterized by clarity, purpose, and authenticity. 
            You naturally adapt your approach based on the situation and the people you're interacting with.
          </p>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Key Communication Traits:</h3>
            <ul className="space-y-2">
              <li>Direct and solution-oriented</li>
              <li>Values both data and intuition</li>
              <li>Adapts style to audience needs</li>
              <li>Balances listening and contributing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Work Style */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Briefcase className="w-6 h-6 mr-3 text-green-500" />
          Work & Leadership Style
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-green-600">How You Work Best</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Thrives in environments with clear goals and autonomy</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Prefers structured yet flexible approaches</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Values both collaboration and independent work</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Motivated by meaningful challenges</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3 text-green-600">Leadership Approach</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Leads by example and empowerment</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Balances strategic vision with practical execution</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Encourages innovation while maintaining focus</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Values team input in decision-making</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Team Contribution */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Users className="w-6 h-6 mr-3 text-indigo-500" />
          Your Team Contribution
        </h2>
        <p className="text-gray-700 mb-4">
          You bring unique value to any team through your natural abilities and perspective:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-indigo-700">Problem Solving</h3>
            <p className="text-sm text-gray-600">You approach challenges with a balanced mix of analysis and creativity</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-indigo-700">Team Dynamics</h3>
            <p className="text-sm text-gray-600">You help maintain productive relationships while driving results</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-indigo-700">Innovation</h3>
            <p className="text-sm text-gray-600">You contribute fresh perspectives while staying grounded in reality</p>
          </div>
        </div>
      </div>

      {/* Ideal Roles */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Award className="w-6 h-6 mr-3 text-amber-500" />
          Ideal Roles & Career Paths
        </h2>
        <p className="text-gray-700 mb-4">
          Based on your personality type, you're likely to thrive in roles that leverage your natural strengths:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border-2 border-amber-200 rounded-lg">
            <h3 className="font-semibold mb-2 text-amber-700">Primary Roles</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Strategic Leadership Positions</li>
              <li>• Project Management</li>
              <li>• Business Development</li>
              <li>• Consulting & Advisory</li>
            </ul>
          </div>
          <div className="p-4 border-2 border-amber-200 rounded-lg">
            <h3 className="font-semibold mb-2 text-amber-700">Growth Paths</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Executive Leadership (C-Suite)</li>
              <li>• Entrepreneurship</li>
              <li>• Strategic Planning</li>
              <li>• Change Management</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compatibility Hint */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Heart className="w-6 h-6 mr-3 text-pink-500" />
          Team Compatibility
        </h2>
        <p className="text-gray-700 mb-3">
          You work particularly well with personality types that complement your strengths and challenge you to grow:
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-4 py-2 bg-white rounded-full text-sm font-medium shadow-sm">High Compatibility: V2, I1, C2</span>
          <span className="px-4 py-2 bg-white rounded-full text-sm font-medium shadow-sm">Growth Partners: E3, I3</span>
        </div>
        <p className="text-sm text-gray-500 mt-3 italic">
          Note: All personality types can work well together with mutual understanding and respect.
        </p>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-8 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
        <p className="mb-6 text-white/90">
          Now that you know your personality type, here are some ways to make the most of this insight:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Share with Your Team</h3>
            <p className="text-sm text-white/80">Help your colleagues understand how to work best with you</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Download Your Report</h3>
            <p className="text-sm text-white/80">Keep a copy of your detailed personality profile</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Explore Team Dynamics</h3>
            <p className="text-sm text-white/80">See how your type interacts with others on your team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityResult;
