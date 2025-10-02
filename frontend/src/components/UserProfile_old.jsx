import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/RoleBasedAuthContext';

const UserProfile = ({ onBack }) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock Hugo personality data - in real app this would come from API
  const mockHugoProfile = {
    hugoType: "Analytical Thinker",
    hugoCode: "AT",
    description: "You approach problems systematically and value data-driven decisions. You prefer structured environments and clear processes.",
    strengths: [
      "Logical problem-solving",
      "Attention to detail", 
      "Strategic thinking",
      "Quality focus"
    ],
    communicationStyle: {
      preferred: "Direct and fact-based communication",
      tips: [
        "Provide data and evidence to support your points",
        "Be concise and structured in presentations",
        "Allow time for thorough analysis before decisions"
      ]
    },
    workingStyle: {
      environment: "Quiet, organized workspace",
      collaboration: "Small, focused teams",
      decisionMaking: "Methodical and research-based"
    },
    careerSuggestions: [
      "Data Analysis & Research",
      "Quality Assurance",
      "Strategic Planning",
      "Technical Consulting"
    ],
    teamCompatibility: {
      bestWith: ["Creative Innovator", "Practical Organizer"],
      challengesWith: ["Spontaneous Networker"],
      tips: "Works well with detail-oriented and goal-focused team members"
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProfileData(mockHugoProfile);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your Hugo profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900">My Hugo Profile</h1>
            </div>
            <div className="text-sm text-gray-600">
              {user?.first_name} {user?.last_name}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-6">
              <span className="text-3xl font-bold text-white">{profileData.hugoCode}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profileData.hugoType}</h1>
              <p className="text-lg text-gray-600 mt-1">{user?.email}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Hugo Type: {profileData.hugoCode}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-700">{profileData.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Your Strengths
            </h2>
            <ul className="space-y-2">
              {profileData.strengths.map((strength, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Communication Style */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Communication Style
            </h2>
            <p className="text-gray-700 mb-4">{profileData.communicationStyle.preferred}</p>
            <h3 className="font-medium text-gray-900 mb-2">Tips for effective communication:</h3>
            <ul className="space-y-1">
              {profileData.communicationStyle.tips.map((tip, index) => (
                <li key={index} className="text-sm text-gray-600">• {tip}</li>
              ))}
            </ul>
          </div>

          {/* Working Style */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              Working Style
            </h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-900">Environment:</span>
                <span className="ml-2 text-gray-700">{profileData.workingStyle.environment}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Collaboration:</span>
                <span className="ml-2 text-gray-700">{profileData.workingStyle.collaboration}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Decision Making:</span>
                <span className="ml-2 text-gray-700">{profileData.workingStyle.decisionMaking}</span>
              </div>
            </div>
          </div>

          {/* Career Suggestions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="h-6 w-6 text-orange-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Career Development
            </h2>
            <p className="text-gray-600 mb-3">Areas where your Hugo type typically excels:</p>
            <div className="grid grid-cols-1 gap-2">
              {profileData.careerSuggestions.map((career, index) => (
                <div key={index} className="bg-orange-50 p-3 rounded-lg">
                  <span className="text-orange-800 font-medium">{career}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Compatibility */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Team Compatibility
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Works Best With:</h3>
              <ul className="space-y-1">
                {profileData.teamCompatibility.bestWith.map((type, index) => (
                  <li key={index} className="text-green-700 text-sm">• {type}</li>
                ))}
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">May Challenge:</h3>
              <ul className="space-y-1">
                {profileData.teamCompatibility.challengesWith.map((type, index) => (
                  <li key={index} className="text-yellow-700 text-sm">• {type}</li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Team Tips:</h3>
              <p className="text-blue-700 text-sm">{profileData.teamCompatibility.tips}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Retake Assessment
          </button>
          <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            Download Profile
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
