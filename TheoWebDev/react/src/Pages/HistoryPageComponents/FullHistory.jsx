
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function FullHistory() {
    useEffect(() => {
    document.title = 'History | Wall-et';
  }, []);
    const navigate = useNavigate();
    return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ color: 'white' }}>Full Transaction History</h1>
      <p style={{ color: 'white' }}>All user transactions will appear here in full detail.</p>
      <button onClick={() => navigate('/')}>
            Back
        </button>
    </div>
    );
}

export default FullHistory;
