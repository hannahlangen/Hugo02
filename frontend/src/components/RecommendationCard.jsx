import React, { useState } from 'react';

const RecommendationCard = ({ recommendation, rank, onSelect, onAddToTeam, isSelected }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getSynergyColor = (score) => {
    if (score >= 0.85) return '#4CAF50';
    if (score >= 0.70) return '#FFC107';
    return '#FF9800';
  };

  const getTypeColor = (hugoType) => {
    const dimension = hugoType[0];
    const colors = {
      'V': '#9C27B0',
      'I': '#FF9800',
      'E': '#2196F3',
      'C': '#4CAF50'
    };
    return colors[dimension] || '#666';
  };

  const getTypeName = (hugoType) => {
    const types = {
      'V1': 'Visionary',
      'V2': 'Strategist',
      'V3': 'Architect',
      'I1': 'Creator',
      'I2': 'Innovator',
      'I3': 'Pioneer',
      'E1': 'Expert',
      'E2': 'Specialist',
      'E3': 'Master',
      'C1': 'Networker',
      'C2': 'Collaborator',
      'C3': 'Facilitator'
    };
    return types[hugoType] || hugoType;
  };

  return (
    <div className={`recommendation-card ${isSelected ? 'selected' : ''}`}>
      <div className="card-header">
        <div className="rank-badge">#{rank}</div>
        <div className="candidate-info">
          <h3>{recommendation.name}</h3>
          <div className="hugo-type" style={{ background: getTypeColor(recommendation.hugo_type) }}>
            {recommendation.hugo_type} - {getTypeName(recommendation.hugo_type)}
          </div>
        </div>
        <div className="synergy-score" style={{ color: getSynergyColor(recommendation.synergy_score) }}>
          <div className="score-value">{Math.round(recommendation.synergy_score * 100)}%</div>
          <div className="score-label">Synergy</div>
        </div>
      </div>

      <div className="card-body">
        <div className="reasoning">
          <strong>Why {recommendation.name.split(' ')[0]}?</strong>
          <p>{recommendation.reasoning}</p>
        </div>

        {/* Impact Analysis */}
        {recommendation.impact_analysis && (
          <div className="impact-analysis">
            <div className="impact-item">
              <span className="impact-label">Current Synergy:</span>
              <span className="impact-value">{Math.round(recommendation.impact_analysis.current_synergy * 100)}%</span>
            </div>
            <div className="impact-arrow">→</div>
            <div className="impact-item">
              <span className="impact-label">Predicted Synergy:</span>
              <span className="impact-value highlight">{Math.round(recommendation.impact_analysis.predicted_synergy * 100)}%</span>
            </div>
            <div className="impact-improvement">
              +{Math.round(recommendation.impact_analysis.improvement * 100)}% improvement
            </div>
          </div>
        )}

        {/* Strengths and Challenges */}
        <div className="strengths-challenges">
          <div className="strengths">
            <h4>✅ Strengths</h4>
            <ul>
              {recommendation.strengths.map((strength, idx) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
          </div>
          <div className="challenges">
            <h4>⚠️ Considerations</h4>
            <ul>
              {recommendation.challenges.map((challenge, idx) => (
                <li key={idx}>{challenge}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card-actions">
        <button onClick={() => setShowDetails(!showDetails)} className="btn-details">
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
        <button onClick={onAddToTeam} className="btn-add">
          Add to Team
        </button>
      </div>

      <style jsx>{`
        .recommendation-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .recommendation-card:hover {
          border-color: #4CAF50;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .recommendation-card.selected {
          border-color: #4CAF50;
          background: #f1f8f4;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .rank-badge {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .candidate-info {
          flex: 1;
        }

        .candidate-info h3 {
          margin: 0 0 0.5rem 0;
          color: #1a1a1a;
          font-size: 1.3rem;
        }

        .hugo-type {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 16px;
          color: white;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .synergy-score {
          text-align: center;
        }

        .score-value {
          font-size: 2rem;
          font-weight: bold;
        }

        .score-label {
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .card-body {
          margin-bottom: 1.5rem;
        }

        .reasoning {
          margin-bottom: 1.5rem;
        }

        .reasoning strong {
          color: #1a1a1a;
          display: block;
          margin-bottom: 0.5rem;
        }

        .reasoning p {
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .impact-analysis {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .impact-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .impact-label {
          font-size: 0.85rem;
          color: #666;
        }

        .impact-value {
          font-size: 1.3rem;
          font-weight: bold;
          color: #1a1a1a;
        }

        .impact-value.highlight {
          color: #4CAF50;
        }

        .impact-arrow {
          font-size: 1.5rem;
          color: #4CAF50;
        }

        .impact-improvement {
          margin-left: auto;
          background: #4CAF50;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .strengths-challenges {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .strengths, .challenges {
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 8px;
        }

        .strengths h4, .challenges h4 {
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
          color: #1a1a1a;
        }

        .strengths ul, .challenges ul {
          margin: 0;
          padding-left: 1.25rem;
          color: #666;
        }

        .strengths li, .challenges li {
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .card-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .btn-details, .btn-add {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-weight: 500;
        }

        .btn-details {
          background: #f0f0f0;
          color: #666;
        }

        .btn-details:hover {
          background: #e0e0e0;
        }

        .btn-add {
          background: #4CAF50;
          color: white;
        }

        .btn-add:hover {
          background: #45a049;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
        }

        @media (max-width: 768px) {
          .card-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .strengths-challenges {
            grid-template-columns: 1fr;
          }

          .impact-analysis {
            flex-direction: column;
            align-items: flex-start;
          }

          .impact-arrow {
            transform: rotate(90deg);
          }
        }
      `}</style>
    </div>
  );
};

export default RecommendationCard;
