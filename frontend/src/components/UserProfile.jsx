import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/RoleBasedAuthContext';

const UserProfile = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // Mock Hugo personality data - in real app this would come from API
  // Using V1 (Der Wegweiser / The Pathfinder) as example
  const mockHugoProfile = {
    hugoType: "Der Wegweiser",
    hugoTypeEn: "The Pathfinder",
    hugoCode: "V1",
    dimension: "Vision",
    description: "Zeigt den Weg zu einer besseren Zukunft. Natürlicher Stratege, der komplexe Situationen durchdringt und klare Richtungen vorgibt.",
    descriptionEn: "Shows the way to a better future. Natural strategist who penetrates complex situations and provides clear direction.",
    strengths: [
      "Strategisches Denken",
      "Entscheidungskraft", 
      "Führungsqualität",
      "Visionäre Ausrichtung"
    ],
    communicationStyle: {
      preferred: "Direkt, inspirierend, zukunftsorientiert",
      tips: [
        "Kommunizieren Sie die Vision klar und überzeugend",
        "Fokussieren Sie auf das große Ganze",
        "Geben Sie klare Richtungen vor"
      ]
    },
    workingStyle: {
      environment: "Dynamisches, strategisches Umfeld",
      collaboration: "Führungsrolle in visionären Teams",
      decisionMaking: "Schnell und entschlossen"
    },
    careerSuggestions: [
      "CEO",
      "Strategie-Direktor",
      "Innovations-Lead",
      "Unternehmer"
    ],
    teamCompatibility: {
      bestWith: ["Der Organisator (V3)", "Der Umsetzer (C3)"],
      challengesWith: ["Detailorientierte Typen ohne Vision"],
      tips: "Arbeitet am besten mit umsetzungsstarken Teammitgliedern, die die Vision in die Realität umsetzen"
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
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Hamburger Menu */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Back Button and Title */}
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
            </div>
            
            {/* User Info and Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.first_name} {user?.last_name}
              </span>
              
              {/* Hamburger Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.first_name} {user?.last_name}</div>
                      <div className="text-gray-500">{user?.email}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {user?.role === 'hugo_manager' ? 'Platform Administrator' : 
                         user?.role === 'hr_manager' ? 'Company Administrator' : 'Team Member'}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg className="inline h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{profileData.hugoCode}</span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Active
                </div>
              </div>
              
              {/* Basic Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-gray-600">{user?.email}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {profileData.hugoType}
                  </span>
                  <span className="text-sm text-gray-500">
                    Hugo Type: {profileData.hugoCode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hugo Personality Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personality Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                🎯 Your Hugo Personality
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Type Description</h3>
                  <p className="text-gray-600 text-sm mt-1">{profileData.description}</p>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                💪 Your Strengths
              </h2>
              <div className="space-y-2">
                {profileData.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication Style */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                💬 Communication Style
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Preferred Style</h3>
                  <p className="text-gray-600 text-sm mt-1">{profileData.communicationStyle.preferred}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Tips for You</h3>
                  <ul className="mt-2 space-y-1">
                    {profileData.communicationStyle.tips.map((tip, index) => (
                      <li key={index} className="text-gray-600 text-sm flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Working Style */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                🏢 Working Style
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900">Ideal Environment</h3>
                  <p className="text-gray-600 text-sm">{profileData.workingStyle.environment}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Collaboration Preference</h3>
                  <p className="text-gray-600 text-sm">{profileData.workingStyle.collaboration}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Decision Making</h3>
                  <p className="text-gray-600 text-sm">{profileData.workingStyle.decisionMaking}</p>
                </div>
              </div>
            </div>

            {/* Career Development */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📈 Career Development
              </h2>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Suggested Career Paths</h3>
                <div className="space-y-2">
                  {profileData.careerSuggestions.map((career, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">{career}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Compatibility */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                👥 Team Compatibility
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Works Best With</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profileData.teamCompatibility.bestWith.map((type, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">May Challenge With</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profileData.teamCompatibility.challengesWith.map((type, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Team Tips</h3>
                  <p className="text-gray-600 text-sm mt-1">{profileData.teamCompatibility.tips}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🚀 Next Steps
            </h2>
            <div className="flex flex-wrap gap-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Profile Report
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share with Team
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default UserProfile;
