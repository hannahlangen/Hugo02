import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FindMemberWizard from './FindMemberWizard';
import TeamGapsAnalysis from './TeamGapsAnalysis';

const RecommendationDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState({
    totalRecommendations: 0,
    acceptedRecommendations: 0,
    acceptanceRate: 0,
    averageSynergyImprovement: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8006/api/recommendations/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    // Mock data for now
    setRecentActivity([
      {
        id: 1,
        type: 'member_added',
        description: 'Sarah M. added to Product Team',
        synergy: 89,
        timestamp: new Date().toISOString(),
        status: 'completed'
      },
      {
        id: 2,
        type: 'team_analysis',
        description: 'Innovation Team composition pending review',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'pending'
      },
      {
        id: 3,
        type: 'gap_analysis',
        description: 'Customer Support gap analysis completed',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'completed'
      }
    ]);
  };

  const renderDashboard = () => (
    <div className="recommendation-dashboard">
      <div className="dashboard-header">
        <h1>🎯 Team Recommendations</h1>
        <p>AI-powered insights for optimal team composition</p>
      </div>

      {/* Action Cards */}
      <div className="action-cards">
        <div className="action-card" onClick={() => setActiveView('find-member')}>
          <div className="card-icon">🔍</div>
          <h3>Find Member</h3>
          <p>Find the perfect addition to your team</p>
          <button className="card-button">Get Started →</button>
        </div>

        <div className="action-card" onClick={() => setActiveView('build-team')}>
          <div className="card-icon">👥</div>
          <h3>Build Team</h3>
          <p>Create optimal team composition</p>
          <button className="card-button">Coming Soon</button>
        </div>

        <div className="action-card" onClick={() => setActiveView('analyze-gaps')}>
          <div className="card-icon">📊</div>
          <h3>Analyze Gaps</h3>
          <p>Identify improvement opportunities</p>
          <button className="card-button">Analyze →</button>
        </div>
      </div>

      {/* Success Metrics */}
      <div className="metrics-section">
        <h2>Success Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value">{stats.totalRecommendations}</div>
            <div className="metric-label">Total Recommendations</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{stats.acceptanceRate}%</div>
            <div className="metric-label">Acceptance Rate</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">+{stats.averageSynergyImprovement}%</div>
            <div className="metric-label">Avg Synergy Improvement</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{stats.acceptedRecommendations}</div>
            <div className="metric-label">Recommendations Accepted</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.map(activity => (
            <div key={activity.id} className={`activity-item status-${activity.status}`}>
              <div className="activity-icon">
                {activity.type === 'member_added' && '✅'}
                {activity.type === 'team_analysis' && '⏳'}
                {activity.type === 'gap_analysis' && '📈'}
              </div>
              <div className="activity-content">
                <div className="activity-description">{activity.description}</div>
                <div className="activity-timestamp">
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
              {activity.synergy && (
                <div className="activity-synergy">{activity.synergy}% Synergy</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .recommendation-dashboard {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
        }

        .dashboard-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .action-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .action-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }

        .card-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .action-card h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
        }

        .action-card p {
          color: #666;
          margin-bottom: 1.5rem;
        }

        .card-button {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .card-button:hover {
          background: #45a049;
        }

        .metrics-section {
          margin-bottom: 3rem;
        }

        .metrics-section h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .metric-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
        }

        .metric-value {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .recent-activity h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .activity-list {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .activity-item {
          display: flex;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.2s ease;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-item:hover {
          background: #f9f9f9;
        }

        .activity-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
        }

        .activity-content {
          flex: 1;
        }

        .activity-description {
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .activity-timestamp {
          font-size: 0.85rem;
          color: #999;
        }

        .activity-synergy {
          background: #4CAF50;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .status-pending .activity-icon {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );

  return (
    <div>
      {activeView === 'dashboard' && renderDashboard()}
      {activeView === 'find-member' && (
        <FindMemberWizard onBack={() => setActiveView('dashboard')} />
      )}
      {activeView === 'analyze-gaps' && (
        <TeamGapsAnalysis onBack={() => setActiveView('dashboard')} />
      )}
    </div>
  );
};

export default RecommendationDashboard;
