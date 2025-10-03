import React, { useState, useEffect } from 'react';

const RecommendationDashboard = () => {
  const [stats, setStats] = useState({
    totalRecommendations: 0,
    acceptedRecommendations: 0,
    acceptanceRate: 0,
    averageSynergyImprovement: 0
  });

  useEffect(() => {
    console.log('=== RecommendationDashboard MOUNTED ===');
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const baseUrl = window.location.port === '3000' 
        ? `http://${window.location.hostname}:8006`
        : '';
      console.log('Fetching from:', `${baseUrl}/api/recommendations/stats`);
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
    }
  };

  console.log('=== RENDERING RecommendationDashboard ===', stats);

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '500px'
    }}>
      <div style={{
        marginBottom: '2rem',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '0.5rem',
          color: '#1a1a1a'
        }}>🎯 Team Recommendations</h1>
        <p style={{
          color: '#666',
          fontSize: '1.1rem'
        }}>AI-powered insights for optimal team composition</p>
      </div>

      {/* Action Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>Find Member</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>Find the perfect addition to your team</p>
          <button style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>Coming Soon</button>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>Build Team</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>Create optimal team composition</p>
          <button style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>Coming Soon</button>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>Analyze Gaps</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>Identify improvement opportunities</p>
          <button style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>Coming Soon</button>
        </div>
      </div>

      {/* Success Metrics */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '1rem',
          color: '#1a1a1a'
        }}>Success Metrics</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>{stats.totalRecommendations}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Recommendations</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>{stats.acceptanceRate}%</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Acceptance Rate</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>+{stats.averageSynergyImprovement}%</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Avg Synergy Improvement</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>{stats.acceptedRecommendations}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Recommendations Accepted</div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '1rem',
          color: '#1a1a1a'
        }}>About Team Recommendations</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          Our AI-powered recommendation engine analyzes team dynamics, personality types, 
          and project requirements to suggest optimal team compositions. The system considers 
          multiple factors including Hugo personality types, cultural dimensions, and historical 
          team performance to provide actionable insights for HR managers.
        </p>
      </div>
    </div>
  );
};

export default RecommendationDashboard;
