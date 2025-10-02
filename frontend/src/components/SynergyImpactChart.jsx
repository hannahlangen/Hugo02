import React from 'react';

const SynergyImpactChart = ({ currentSynergy, predictedSynergy }) => {
  const improvement = predictedSynergy - currentSynergy;
  const improvementPercent = Math.round(improvement * 100);

  return (
    <div className="synergy-impact-chart">
      <h4>Synergy Impact</h4>
      
      <div className="chart-container">
        <div className="chart-bar current">
          <div className="bar-label">Current</div>
          <div className="bar-wrapper">
            <div 
              className="bar-fill current-fill" 
              style={{ width: `${currentSynergy * 100}%` }}
            >
              <span className="bar-value">{Math.round(currentSynergy * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="arrow-indicator">
          <div className="arrow">↓</div>
          <div className="improvement-badge">
            +{improvementPercent}%
          </div>
        </div>

        <div className="chart-bar predicted">
          <div className="bar-label">Predicted</div>
          <div className="bar-wrapper">
            <div 
              className="bar-fill predicted-fill" 
              style={{ width: `${predictedSynergy * 100}%` }}
            >
              <span className="bar-value">{Math.round(predictedSynergy * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .synergy-impact-chart {
          background: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 1rem 0;
        }

        .synergy-impact-chart h4 {
          margin: 0 0 1rem 0;
          color: #1a1a1a;
          font-size: 1.1rem;
        }

        .chart-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .chart-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .bar-label {
          width: 80px;
          font-weight: 500;
          color: #666;
        }

        .bar-wrapper {
          flex: 1;
          height: 40px;
          background: #e0e0e0;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }

        .bar-fill {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 1rem;
          transition: width 0.5s ease;
        }

        .current-fill {
          background: linear-gradient(90deg, #FFC107, #FFB300);
        }

        .predicted-fill {
          background: linear-gradient(90deg, #4CAF50, #45a049);
        }

        .bar-value {
          color: white;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .arrow-indicator {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-left: 80px;
          margin: 0.5rem 0;
        }

        .arrow {
          font-size: 1.5rem;
          color: #4CAF50;
        }

        .improvement-badge {
          background: #4CAF50;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-weight: 500;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .chart-bar {
            flex-direction: column;
            align-items: flex-start;
          }

          .bar-label {
            width: 100%;
          }

          .arrow-indicator {
            padding-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SynergyImpactChart;
