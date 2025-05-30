import React, { useState } from 'react';
import './Progress.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const dailyData = [
  { name: 'Mon', progress: 100 },
  { name: 'Tue', progress: 15 },
  { name: 'Wed', progress: 90 },
  { name: 'Thu', progress: 55 },
  { name: 'Fri', progress: 10 },
  { name: 'Sat', progress: 95 },
  { name: 'Sun', progress: 100 },
];

const weeklyData = [
  { name: 'Week 1', progress: 90 },
  { name: 'Week 2', progress: 10 },
  { name: 'Week 3', progress: 50 },
  { name: 'Week 4', progress: 100 },
];

const monthlyData = [
  { name: 'Jan', progress: 80 },
  { name: 'Feb', progress: 25 },
  { name: 'Mar', progress: 10 },
  { name: 'Apr', progress: 80 },
  { name: 'May', progress: 100 },
];

function Progress() {
  const [view, setView] = useState('daily');

  const getData = () => {
    switch (view) {
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      default:
        return dailyData;
    }
  };

  return (
    <div className="progress-card">
      <div className="progress-header">
        <h2>Progress</h2>
        <div className="toggle-buttons">
          <button
            className={view === 'daily' ? 'active' : ''}
            onClick={() => setView('daily')}
          >
            Daily
          </button>
          <button
            className={view === 'weekly' ? 'active' : ''}
            onClick={() => setView('weekly')}
          >
            Weekly
          </button>
          <button
            className={view === 'monthly' ? 'active' : ''}
            onClick={() => setView('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={getData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="progress"
              stroke="#29b6f6"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Progress;
