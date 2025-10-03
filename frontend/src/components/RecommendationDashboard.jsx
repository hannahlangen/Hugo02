import React, { useState, useEffect } from 'react';
import './RecommendationDashboard.css';

const RecommendationDashboard = () => {
  const [stats, setStats] = useState({
    totalRecommendations: 0,
    acceptedRecommendations: 0,
    acceptanceRate: 0,
    averageSynergyImprovement: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('RecommendationDashboard mounted');
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const baseUrl = window.location.port === '3000' 
        ? `http://${window.location.hostname}:8006`
        : '';
      console.log('Fetching stats from:', `${baseUrl}/api/recommendations/stats`);
      const response = await fetch(`${baseUrl}/api/recommendations/stats`);
      if (response.ok) {
        const data = await response.json();
        console.log('Stats received:', data);
        setStats({
          totalRecommendations: data.total_recommendations || 0,
          acceptedRecommendations: data.accepted_recommendations || 0,
          acceptanceRate: data.acceptance_rate || 0,
          averageSynergyImprovement: data.average_synergy_improvement || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = () => {
    console.log('Setting recent activity');
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

  console.log('Rendering RecommendationDashboard', { loading, stats, activityCount: recentActivity.length });

  if (loading) {
    return (
      <div className="recommendation-dashboard">
        <div className="dashboard-header">
          <h1>🎯 Team Recommendations</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendation-dashboard">
      <div className="dashboard-header">
        <h1>🎯 Team Recommendations</h1>
        <p>AI-powered insights for optimal team composition</p>
      </div>

      {/* Action Cards */}
      <div className="action-cards">
        <div className="action-card">
          <div className="card-icon">🔍</div>
          <h3>Find Member</h3>
          <p>Find the perfect addition to your team</p>
          <button className="card-button">Coming Soon</button>
        </div>

        <div className="action-card">
          <div className="card-icon">👥</div>
          <h3>Build Team</h3>
          <p>Create optimal team composition</p>
          <button className="card-button">Coming Soon</button>
        </div>

        <div className="action-card">
          <div className="card-icon">📊</div>
          <h3>Analyze Gaps</h3>
          <p>Identify improvement opportunities</p>
          <button className="card-button">Coming Soon</button>
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
          {recentActivity.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
              No recent activity
            </div>
          ) : (
            recentActivity.map(activity => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationDashboard;
