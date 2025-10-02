import React, { useState, useEffect } from 'react';

const TeamGapsAnalysis = ({ onBack }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const analyzeTeam = async (teamId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8006/api/recommendations/team-gaps/${teamId}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      } else {
        alert('Failed to analyze team');
      }
    } catch (error) {
      console.error('Error analyzing team:', error);
      alert('Error analyzing team');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSelect = async (teamId) => {
    const team = teams.find(t => t.id === teamId);
    setSelectedTeam(team);
    await analyzeTeam(teamId);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'high': '#f44336',
      'medium': '#ff9800',
      'low': '#ffc107'
    };
    return colors[severity] || '#666';
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return '#4CAF50';
    if (score >= 0.6) return '#FFC107';
    return '#f44336';
  };

  return (
    <div className="team-gaps-analysis">
      <div className="analysis-header">
        <h1>📊 Team Gap Analysis</h1>
        <p>Identify improvement opportunities in your teams</p>
      </div>

      {/* Team Selection */}
      <div className="team-selection">
        <h2>Select Team to Analyze</h2>
        <div className="team-grid">
          {teams.map(team => (
            <div
              key={team.id}
              className={`team-card ${selectedTeam?.id === team.id ? 'selected' : ''}`}
              onClick={() => handleTeamSelect(team.id)}
            >
              <h3>{team.name}</h3>
              <div className="team-info">
                <span>{team.member_count || 0} members</span>
                {team.synergy_score && (
                  <span className="synergy">
                    {Math.round(team.synergy_score * 100)}% synergy
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Results */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing team...</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="analysis-results">
          {/* Overall Score */}
          <div className="overall-score">
            <h2>Overall Team Health</h2>
            <div className="score-circle" style={{ borderColor: getScoreColor(analysis.current_synergy) }}>
              <div className="score-value">{Math.round(analysis.current_synergy * 100)}%</div>
              <div className="score-label">Synergy Score</div>
            </div>
          </div>

          {/* Detailed Scores */}
          {analysis.detailed_scores && (
            <div className="detailed-scores">
              <h3>Detailed Analysis</h3>
              <div className="scores-grid">
                {Object.entries(analysis.detailed_scores).map(([key, value]) => {
                  if (key === 'total') return null;
                  const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  return (
                    <div key={key} className="score-item">
                      <div className="score-bar-container">
                        <div className="score-bar-label">{label}</div>
                        <div className="score-bar-wrapper">
                          <div 
                            className="score-bar-fill" 
                            style={{ 
                              width: `${value * 100}%`,
                              background: getScoreColor(value)
                            }}
                          ></div>
                        </div>
                        <div className="score-bar-value">{Math.round(value * 100)}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gaps */}
          {analysis.gaps && analysis.gaps.length > 0 && (
            <div className="gaps-section">
              <h3>Identified Gaps</h3>
              <div className="gaps-list">
                {analysis.gaps.map((gap, index) => (
                  <div key={index} className="gap-card">
                    <div className="gap-header">
                      <div className="gap-type">{gap.type.replace(/_/g, ' ')}</div>
                      <div 
                        className="gap-severity" 
                        style={{ background: getSeverityColor(gap.severity) }}
                      >
                        {gap.severity}
                      </div>
                    </div>
                    <div className="gap-dimension">
                      <strong>{gap.dimension}</strong>
                    </div>
                    <div className="gap-impact">{gap.impact}</div>
                    <div className="gap-recommendation">
                      💡 <strong>Recommendation:</strong> {gap.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.gaps && analysis.gaps.length === 0 && (
            <div className="no-gaps">
              <div className="success-icon">✅</div>
              <h3>Great Job!</h3>
              <p>No major gaps identified. Your team composition is solid.</p>
            </div>
          )}

          {/* Insights */}
          {analysis.insights && (
            <div className="insights-section">
              <div className="insights-grid">
                {/* Strengths */}
                {analysis.insights.strengths && analysis.insights.strengths.length > 0 && (
                  <div className="insight-card strengths">
                    <h4>✨ Strengths</h4>
                    <ul>
                      {analysis.insights.strengths.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {analysis.insights.weaknesses && analysis.insights.weaknesses.length > 0 && (
                  <div className="insight-card weaknesses">
                    <h4>⚠️ Areas for Improvement</h4>
                    <ul>
                      {analysis.insights.weaknesses.map((weakness, idx) => (
                        <li key={idx}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.insights.recommendations && analysis.insights.recommendations.length > 0 && (
                  <div className="insight-card recommendations">
                    <h4>💡 Recommendations</h4>
                    <ul>
                      {analysis.insights.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dimension Distribution */}
          {analysis.insights && analysis.insights.dimension_distribution && (
            <div className="dimension-section">
              <h3>Dimension Distribution</h3>
              <div className="dimension-chart">
                {Object.entries(analysis.insights.dimension_distribution).map(([dim, value]) => {
                  const dimNames = {
                    'V': 'Vision',
                    'I': 'Innovation',
                    'E': 'Expertise',
                    'C': 'Connection'
                  };
                  const dimColors = {
                    'V': '#9C27B0',
                    'I': '#FF9800',
                    'E': '#2196F3',
                    'C': '#4CAF50'
                  };
                  return (
                    <div key={dim} className="dimension-item">
                      <div className="dimension-label">{dimNames[dim]}</div>
                      <div className="dimension-bar-wrapper">
                        <div 
                          className="dimension-bar-fill" 
                          style={{ 
                            width: `${value * 100}%`,
                            background: dimColors[dim]
                          }}
                        ></div>
                      </div>
                      <div className="dimension-value">{Math.round(value * 100)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="actions">
        <button onClick={onBack} className="btn-back">← Back to Dashboard</button>
      </div>

      <style jsx>{`
        .team-gaps-analysis {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .analysis-header {
          margin-bottom: 2rem;
        }

        .analysis-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
        }

        .analysis-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .team-selection {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }

        .team-selection h2 {
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
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
          transform: translateY(-2px);
        }

        .team-card.selected {
          border-color: #4CAF50;
          background: #f1f8f4;
        }

        .team-card h3 {
          margin: 0 0 0.5rem 0;
          color: #1a1a1a;
        }

        .team-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #666;
        }

        .team-info .synergy {
          color: #4CAF50;
          font-weight: 500;
        }

        .loading {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f0f0f0;
          border-top: 4px solid #4CAF50;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .analysis-results {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .overall-score {
          text-align: center;
          margin-bottom: 3rem;
        }

        .overall-score h2 {
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }

        .score-circle {
          width: 200px;
          height: 200px;
          border: 10px solid;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .score-value {
          font-size: 3rem;
          font-weight: bold;
          color: #1a1a1a;
        }

        .score-label {
          font-size: 1rem;
          color: #666;
        }

        .detailed-scores {
          margin-bottom: 3rem;
        }

        .detailed-scores h3 {
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }

        .scores-grid {
          display: grid;
          gap: 1rem;
        }

        .score-item {
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 8px;
        }

        .score-bar-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .score-bar-label {
          width: 150px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .score-bar-wrapper {
          flex: 1;
          height: 24px;
          background: #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
        }

        .score-bar-fill {
          height: 100%;
          transition: width 0.5s ease;
        }

        .score-bar-value {
          width: 50px;
          text-align: right;
          font-weight: 500;
          color: #666;
        }

        .gaps-section {
          margin-bottom: 3rem;
        }

        .gaps-section h3 {
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }

        .gaps-list {
          display: grid;
          gap: 1rem;
        }

        .gap-card {
          background: #fff8f0;
          border-left: 4px solid #ff9800;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .gap-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .gap-type {
          font-weight: 500;
          color: #1a1a1a;
          text-transform: capitalize;
        }

        .gap-severity {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          color: white;
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .gap-dimension {
          margin-bottom: 0.5rem;
          color: #1a1a1a;
        }

        .gap-impact {
          color: #666;
          margin-bottom: 1rem;
        }

        .gap-recommendation {
          background: white;
          padding: 1rem;
          border-radius: 6px;
          color: #1a1a1a;
        }

        .no-gaps {
          text-align: center;
          padding: 3rem;
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .no-gaps h3 {
          color: #4CAF50;
          margin-bottom: 0.5rem;
        }

        .no-gaps p {
          color: #666;
        }

        .insights-section {
          margin-bottom: 3rem;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .insight-card {
          padding: 1.5rem;
          border-radius: 8px;
        }

        .insight-card.strengths {
          background: #e8f5e9;
          border-left: 4px solid #4CAF50;
        }

        .insight-card.weaknesses {
          background: #fff3e0;
          border-left: 4px solid #ff9800;
        }

        .insight-card.recommendations {
          background: #e3f2fd;
          border-left: 4px solid #2196F3;
        }

        .insight-card h4 {
          margin: 0 0 1rem 0;
          color: #1a1a1a;
        }

        .insight-card ul {
          margin: 0;
          padding-left: 1.5rem;
          color: #666;
        }

        .insight-card li {
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        .dimension-section {
          margin-bottom: 2rem;
        }

        .dimension-section h3 {
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }

        .dimension-chart {
          display: grid;
          gap: 1rem;
        }

        .dimension-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .dimension-label {
          width: 100px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .dimension-bar-wrapper {
          flex: 1;
          height: 32px;
          background: #e0e0e0;
          border-radius: 16px;
          overflow: hidden;
        }

        .dimension-bar-fill {
          height: 100%;
          transition: width 0.5s ease;
        }

        .dimension-value {
          width: 60px;
          text-align: right;
          font-weight: 500;
          color: #666;
        }

        .actions {
          margin-top: 2rem;
          text-align: center;
        }

        .btn-back {
          padding: 0.75rem 2rem;
          background: #f0f0f0;
          color: #666;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-back:hover {
          background: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default TeamGapsAnalysis;
