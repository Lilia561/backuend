
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function FeedBack() {
    useEffect(() => {
    document.title = 'FeedBack | Wall-et';
  }, []);
    const navigate = useNavigate();
    return (
    <div>
        <h1 style={{ color: 'white' }}>FeedBack Center</h1>
        <button onClick={() => navigate('/')}>
            Back
        </button>
    </div>
    );
}

export default FeedBack;
