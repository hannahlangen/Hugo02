import React, { useState, useEffect } from 'react';
import RecommendationCard from './RecommendationCard';
import SynergyImpactChart from './SynergyImpactChart';

const FindMemberWizard = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [projectType, setProjectType] = useState('balanced');
  const [recommendations, setRecommendations] = useState([]);
  const [currentTeamAnalysis, setCurrentTeamAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8004/api/teams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleTeamSelect = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    setSelectedTeam(team);
  };

  const generateRecommendations = async () => {
    if (!selectedTeam) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8006/api/recommendations/find-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          team_id: selectedTeam.id,
          project_type: projectType,
          top_n: 5
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
        setCurrentTeamAnalysis(data.current_team_analysis || null);
        setStep(3);
      } else {
        alert('Failed to generate recommendations');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      alert('Error generating recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = (candidateId) => {
    setSelectedCandidates(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      } else {
        return [...prev, candidateId];
      }
    });
  };

  const addMemberToTeam = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8004/api/teams/${selectedTeam.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId })
      });

      if (response.ok) {
        alert('Member added successfully!');
        // Submit feedback
        await submitFeedback(userId, true);
        onBack();
      } else {
        alert('Failed to add member');
      }
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Error adding member');
    }
  };

  const submitFeedback = async (userId, accepted) => {
    try {
      await fetch('http://localhost:8006/api/recommendations/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recommendation_id: `${selectedTeam.id}-${userId}-${Date.now()}`,
          accepted: accepted,
          comments: null
        })
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const renderStep1 = () => (
    <div className="wizard-step">
      <h2>Step 1: Select Team</h2>
      <p>Choose the team you want to add a member to</p>

      <div className="team-list">
        {teams.map(team => (
          <div
            key={team.id}
            className={`team-card ${selectedTeam?.id === team.id ? 'selected' : ''}`}
            onClick={() => handleTeamSelect(team.id)}
          >
            <div className="team-header">
              <h3>{team.name}</h3>
              <span className="team-badge">{team.member_count || 0} members</span>
            </div>
            <p className="team-description">{team.description || 'No description'}</p>
            {team.synergy_score && (
              <div className="team-synergy">
                Current Synergy: <strong>{Math.round(team.synergy_score * 100)}%</strong>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="wizard-actions">
        <button onClick={onBack} className="btn-secondary">← Back</button>
        <button
          onClick={() => setStep(2)}
          disabled={!selectedTeam}
          className="btn-primary"
        >
          Next →
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="wizard-step">
      <h2>Step 2: Project Type</h2>
      <p>What type of project is this team working on?</p>

      <div className="project-types">
        {[
          { value: 'innovation', label: 'Innovation', icon: '💡', desc: 'Creative, new ideas' },
          { value: 'execution', label: 'Execution', icon: '⚡', desc: 'Get things done' },
          { value: 'balanced', label: 'Balanced', icon: '⚖️', desc: 'Well-rounded' },
          { value: 'client_facing', label: 'Client-Facing', icon: '🤝', desc: 'Customer interaction' },
          { value: 'strategic', label: 'Strategic', icon: '🎯', desc: 'Long-term planning' },
          { value: 'research', label: 'Research', icon: '🔬', desc: 'Deep analysis' }
        ].map(type => (
          <div
            key={type.value}
            className={`project-type-card ${projectType === type.value ? 'selected' : ''}`}
            onClick={() => setProjectType(type.value)}
          >
            <div className="type-icon">{type.icon}</div>
            <h4>{type.label}</h4>
            <p>{type.desc}</p>
          </div>
        ))}
      </div>

      <div className="wizard-actions">
        <button onClick={() => setStep(1)} className="btn-secondary">← Back</button>
        <button onClick={generateRecommendations} className="btn-primary" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Recommendations →'}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="wizard-step">
      <h2>Step 3: Review Recommendations</h2>
      <p>Top candidates for {selectedTeam?.name}</p>

      {/* Current Team Analysis */}
      {currentTeamAnalysis && (
        <div className="current-analysis">
          <h3>Current Team Status</h3>
          <div className="analysis-grid">
            <div className="analysis-card">
              <div className="analysis-label">Current Synergy</div>
              <div className="analysis-value">{Math.round(currentTeamAnalysis.synergy_score * 100)}%</div>
            </div>
            <div className="analysis-card">
              <div className="analysis-label">Dimension Balance</div>
              <div className="dimension-bars">
                {Object.entries(currentTeamAnalysis.dimension_balance || {}).map(([dim, value]) => (
                  <div key={dim} className="dimension-bar">
                    <span className="dim-label">{dim}</span>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: `${value * 100}%` }}></div>
                    </div>
                    <span className="dim-value">{Math.round(value * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {currentTeamAnalysis.missing_dimensions && currentTeamAnalysis.missing_dimensions.length > 0 && (
            <div className="missing-dimensions">
              <strong>Missing Dimensions:</strong> {currentTeamAnalysis.missing_dimensions.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      <div className="recommendations-list">
        {recommendations.map((rec, index) => (
          <RecommendationCard
            key={rec.user_id}
            recommendation={rec}
            rank={index + 1}
            onSelect={() => handleCandidateSelect(rec.user_id)}
            onAddToTeam={() => addMemberToTeam(rec.user_id)}
            isSelected={selectedCandidates.includes(rec.user_id)}
          />
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="no-recommendations">
          <p>No recommendations available. This could mean:</p>
          <ul>
            <li>All suitable candidates are already in the team</li>
            <li>No users with Hugo personality types in the system</li>
          </ul>
        </div>
      )}

      <div className="wizard-actions">
        <button onClick={() => setStep(2)} className="btn-secondary">← Back</button>
        <button onClick={onBack} className="btn-primary">Done</button>
      </div>
    </div>
  );

  return (
    <div className="find-member-wizard">
      <div className="wizard-header">
        <h1>🔍 Find Best Team Member</h1>
        <div className="wizard-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Select Team</div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Project Type</div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Recommendations</div>
        </div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      <style jsx>{`
        .find-member-wizard {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .wizard-header {
          margin-bottom: 2rem;
        }

        .wizard-header h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .wizard-progress {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .progress-step {
          flex: 1;
          padding: 1rem;
          background: #f0f0f0;
          border-radius: 8px;
          text-align: center;
          font-weight: 500;
          color: #999;
          transition: all 0.3s ease;
        }

        .progress-step.active {
          background: #4CAF50;
          color: white;
        }

        .wizard-step {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .wizard-step h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
        }

        .wizard-step > p {
          color: #666;
          margin-bottom: 2rem;
        }

        .team-list {
          display: grid;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .team-card {
          padding: 1.5rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .team-card:hover {
          border-color: #4CAF50;
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
        }

        .team-card.selected {
          border-color: #4CAF50;
          background: #f1f8f4;
        }

        .team-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .team-header h3 {
          margin: 0;
          color: #1a1a1a;
        }

        .team-badge {
          background: #e0e0e0;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
        }

        .team-description {
          color: #666;
          margin: 0.5rem 0;
        }

        .team-synergy {
          color: #4CAF50;
          font-size: 0.9rem;
        }

        .project-types {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .project-type-card {
          padding: 1.5rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .project-type-card:hover {
          border-color: #4CAF50;
          transform: translateY(-2px);
        }

        .project-type-card.selected {
          border-color: #4CAF50;
          background: #f1f8f4;
        }

        .type-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .project-type-card h4 {
          margin: 0.5rem 0;
          color: #1a1a1a;
        }

        .project-type-card p {
          margin: 0;
          font-size: 0.85rem;
          color: #666;
        }

        .current-analysis {
          background: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .current-analysis h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .analysis-card {
          background: white;
          padding: 1rem;
          border-radius: 8px;
        }

        .analysis-label {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .analysis-value {
          font-size: 2rem;
          font-weight: bold;
          color: #4CAF50;
        }

        .dimension-bars {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .dimension-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dim-label {
          width: 20px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .bar-container {
          flex: 1;
          height: 20px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #4CAF50, #45a049);
          transition: width 0.3s ease;
        }

        .dim-value {
          width: 40px;
          text-align: right;
          font-size: 0.85rem;
          color: #666;
        }

        .missing-dimensions {
          background: #fff3cd;
          padding: 1rem;
          border-radius: 8px;
          color: #856404;
        }

        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .no-recommendations {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .no-recommendations ul {
          text-align: left;
          display: inline-block;
          margin-top: 1rem;
        }

        .wizard-actions {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn-primary, .btn-secondary {
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-primary {
          background: #4CAF50;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #45a049;
        }

        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f0f0f0;
          color: #666;
        }

        .btn-secondary:hover {
          background: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default FindMemberWizard;
