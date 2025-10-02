import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FindMemberWizard from './FindMemberWizard';
import TeamGapsAnalysis from './TeamGapsAnalysis';
import './RecommendationDashboard.css';

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
      const baseUrl = window.location.port === '3000' 
        ? `http://${window.location.hostname}:8006`
        : '';
      const response = await fetch(`${baseUrl}/api/recommendations/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalRecommendations: data.total_recommendations,
          acceptedRecommendations: data.accepted_recommendations,
          acceptanceRate: data.acceptance_rate,
          averageSynergyImprovement: data.average_synergy_improvement
        });
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
