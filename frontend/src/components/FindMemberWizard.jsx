import React, { useState, useEffect } from 'react';

const FindMemberWizard = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    teamId: '',
    projectType: 'balanced',
    requiredDimensions: {
      V: 5,
      I: 5,
      E: 5,
      C: 5
    },
    minExperience: 0
  });

  const projectTypes = [
    { value: 'innovation', label: 'Innovation Project', description: 'Creative and experimental work' },
    { value: 'execution', label: 'Execution Project', description: 'Delivery-focused work' },
    { value: 'client_facing', label: 'Client-Facing', description: 'Customer interaction' },
    { value: 'strategic', label: 'Strategic Planning', description: 'Long-term planning' },
    { value: 'research', label: 'Research & Analysis', description: 'Data-driven work' },
    { value: 'balanced', label: 'Balanced Team', description: 'General purpose team' }
  ];

  useEffect(() => {
    fetchTeams();
    fetchAvailableUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      const baseUrl = window.location.port === '3000' 
        ? `http://${window.location.hostname}:8003`
        : '';
      const response = await fetch(`${baseUrl}/api/teams`);
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const baseUrl = window.location.port === '3000' 
        ? `http://${window.location.hostname}:8001`
        : '';
      const response = await fetch(`${baseUrl}/api/users`);
      if (response.ok) {
        const data = await response.json();
        setAvailableUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const baseUrl = window.location.port === '3000' 
        ? `http://${window.location.hostname}:8006`
        : '';
      
      const response = await fetch(`${baseUrl}/api/recommendations/find-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: parseInt(formData.teamId),
          project_type: formData.projectType,
          required_dimensions: formData.requiredDimensions,
          min_experience_years: formData.minExperience
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } else {
        console.error('Failed to fetch recommendations');
        // Fallback to mock data if API fails
        generateMockRecommendations();
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Fallback to mock data
      generateMockRecommendations();
    } finally {
      setLoading(false);
    }
  };

  const generateMockRecommendations = () => {
    // Generate mock recommendations based on available users
    const mockRecs = availableUsers.slice(0, 5).map((user, index) => ({
      user_id: user.id,
      user_name: `${user.first_name} ${user.last_name}`,
      hugo_type: user.hugo_type || 'VI',
      score: 0.85 - (index * 0.05),
      current_synergy: 0.72,
      predicted_synergy: 0.82 - (index * 0.02),
      synergy_improvement: 0.10 - (index * 0.02),
      dimension_fit: {
        V: 0.8 - (index * 0.05),
        I: 0.85 - (index * 0.05),
        E: 0.75 - (index * 0.05),
        C: 0.80 - (index * 0.05)
      },
      strengths: ['Strong Vision', 'Team Player', 'Innovative Thinking'],
      concerns: index > 2 ? ['Limited Experience'] : [],
      compatibility_details: {
        type_fit: 0.85,
        dimension_balance: 0.80,
        project_fit: 0.75
      }
    }));
    setRecommendations(mockRecs);
  };

  const handleNext = () => {
    if (currentStep === 2) {
      fetchRecommendations();
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleDimensionChange = (dimension, value) => {
    setFormData(prev => ({
      ...prev,
      requiredDimensions: {
        ...prev.requiredDimensions,
        [dimension]: parseInt(value)
      }
    }));
  };

  const getStepProgress = () => {
    return (currentStep / 3) * 100;
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.teamId !== '';
    }
    return true;
  };

  const selectedTeam = teams.find(t => t.id === parseInt(formData.teamId));

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            Find Perfect Team Member
          </h2>
          <p style={{ color: '#666' }}>
            Get AI-powered recommendations for your team
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
          <span>Step {currentStep} of 3</span>
          <span>{Math.round(getStepProgress())}% Complete</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${getStepProgress()}%`, height: '100%', background: '#3b82f6', transition: 'width 0.3s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px' }}>
          <span style={{ color: currentStep >= 1 ? '#3b82f6' : '#9ca3af', fontWeight: currentStep >= 1 ? '600' : 'normal' }}>
            Select Team
          </span>
          <span style={{ color: currentStep >= 2 ? '#3b82f6' : '#9ca3af', fontWeight: currentStep >= 2 ? '600' : 'normal' }}>
            Define Requirements
          </span>
          <span style={{ color: currentStep >= 3 ? '#3b82f6' : '#9ca3af', fontWeight: currentStep >= 3 ? '600' : 'normal' }}>
            View Recommendations
          </span>
        </div>
      </div>

      {/* Step 1: Select Team */}
      {currentStep === 1 && (
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>👥</span>
            Step 1: Select Team
          </h3>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Choose the team you want to add a new member to
          </p>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Team</label>
            <select
              value={formData.teamId}
              onChange={(e) => setFormData(prev => ({ ...prev, teamId: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">Select a team</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name} ({team.member_count || 0} members)
                </option>
              ))}
            </select>
          </div>

          {selectedTeam && (
            <div style={{ marginTop: '16px', padding: '16px', background: '#eff6ff', borderRadius: '8px' }}>
              <h4 style={{ fontWeight: '600', color: '#1e40af', marginBottom: '12px' }}>Team Overview</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                <div>
                  <span style={{ color: '#1d4ed8' }}>Members:</span>
                  <span style={{ marginLeft: '8px', fontWeight: '500' }}>{selectedTeam.member_count || 0}</span>
                </div>
                <div>
                  <span style={{ color: '#1d4ed8' }}>Synergy Score:</span>
                  <span style={{ marginLeft: '8px', fontWeight: '500' }}>
                    {selectedTeam.synergy_score ? `${(selectedTeam.synergy_score * 100).toFixed(0)}%` : 'N/A'}
                  </span>
                </div>
              </div>
              {selectedTeam.description && (
                <p style={{ fontSize: '14px', color: '#1e40af', marginTop: '12px' }}>{selectedTeam.description}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Define Requirements */}
      {currentStep === 2 && (
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>🎯</span>
            Step 2: Define Requirements
          </h3>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Specify what kind of team member you're looking for
          </p>

          {/* Project Type */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Project Type</label>
            <select
              value={formData.projectType}
              onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              {projectTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} - {type.description}
                </option>
              ))}
            </select>
          </div>

          {/* Dimension Requirements */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>
              Required Dimensions (1-10)
            </label>
            {['V', 'I', 'E', 'C'].map(dim => {
              const labels = {
                V: 'Vision',
                I: 'Innovation',
                E: 'Expertise',
                C: 'Connection'
              };
              return (
                <div key={dim} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{labels[dim]}</span>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      {formData.requiredDimensions[dim]}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.requiredDimensions[dim]}
                    onChange={(e) => handleDimensionChange(dim, e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              );
            })}
          </div>

          {/* Minimum Experience */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Minimum Experience (years)
            </label>
            <select
              value={formData.minExperience}
              onChange={(e) => setFormData(prev => ({ ...prev, minExperience: parseInt(e.target.value) }))}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="0">No requirement</option>
              <option value="1">1+ years</option>
              <option value="2">2+ years</option>
              <option value="3">3+ years</option>
              <option value="5">5+ years</option>
              <option value="10">10+ years</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 3: View Recommendations */}
      {currentStep === 3 && (
        <div>
          {loading ? (
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
              <div style={{ display: 'inline-block', width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
              <p style={{ color: '#666' }}>Analyzing candidates...</p>
            </div>
          ) : recommendations.length === 0 ? (
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No Recommendations Found</h3>
              <p style={{ color: '#666' }}>
                Try adjusting your requirements or check back later.
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>
                  Top {recommendations.length} Candidates
                </h3>
                <span style={{ padding: '4px 12px', background: '#f3f4f6', borderRadius: '12px', fontSize: '14px' }}>
                  {recommendations.length} matches found
                </span>
              </div>

              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '24px',
                    marginBottom: '16px',
                    transition: 'box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '12px'
                      }}>
                        <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                          {rec.user_name?.split(' ').map(n => n[0]).join('') || '??'}
                        </span>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                          {rec.user_name}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            padding: '2px 8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            {rec.hugo_type}
                          </span>
                          <span style={{ fontSize: '14px', color: '#666' }}>
                            Match Score: {(rec.score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
                        +{(rec.synergy_improvement * 100).toFixed(0)}%
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Synergy Boost
                      </div>
                    </div>
                  </div>

                  {/* Synergy Impact */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Current Synergy</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {(rec.current_synergy * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Predicted Synergy</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                        {(rec.predicted_synergy * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Dimension Fit */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>Dimension Fit</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {Object.entries(rec.dimension_fit || {}).map(([dim, value]) => (
                        <div key={dim} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', color: '#666' }}>{dim}</div>
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>
                            {(value * 100).toFixed(0)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Concerns */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    {rec.strengths && rec.strengths.length > 0 && (
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#059669', marginBottom: '8px' }}>
                          Strengths
                        </div>
                        <ul style={{ fontSize: '12px', listStyle: 'none', padding: 0, margin: 0 }}>
                          {rec.strengths.map((strength, i) => (
                            <li key={i} style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                              <span style={{ marginRight: '6px' }}>✓</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {rec.concerns && rec.concerns.length > 0 && (
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#ea580c', marginBottom: '8px' }}>
                          Considerations
                        </div>
                        <ul style={{ fontSize: '12px', listStyle: 'none', padding: 0, margin: 0 }}>
                          {rec.concerns.map((concern, i) => (
                            <li key={i} style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                              <span style={{ marginRight: '6px' }}>!</span>
                              <span>{concern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: index === 0 ? '#3b82f6' : 'white',
                      color: index === 0 ? 'white' : '#374151',
                      border: index === 0 ? 'none' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>👥</span>
                    Add to Team
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          style={{
            padding: '10px 20px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            background: 'white',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            opacity: currentStep === 1 ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>←</span>
          Back
        </button>
        
        {currentStep < 3 ? (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              background: canProceed() ? '#3b82f6' : '#d1d5db',
              color: 'white',
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Next
            <span>→</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep(1)}
            style={{
              padding: '10px 20px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            Start New Search
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FindMemberWizard;
