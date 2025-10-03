import React from 'react';

const RecommendationDashboard = () => {
  console.log('=== RECOMMENDATION DASHBOARD RENDERING ===');
  
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#ff0000',
      padding: '50px',
      color: 'white',
      fontSize: '48px',
      fontWeight: 'bold',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '72px', marginBottom: '50px' }}>
        🎯 RECOMMENDATION DASHBOARD
      </h1>
      <p style={{ fontSize: '36px' }}>
        If you can see this red screen, the component is rendering!
      </p>
      <div style={{
        marginTop: '50px',
        backgroundColor: 'white',
        color: 'black',
        padding: '30px',
        borderRadius: '20px'
      }}>
        <h2>This is a test component</h2>
        <p>The recommendation dashboard will be here soon</p>
      </div>
    </div>
  );
};

export default RecommendationDashboard;
