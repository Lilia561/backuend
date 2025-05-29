
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Paymaya() {
    useEffect(() => {
    document.title = 'Paymaya | Wall-et';
  }, []);
    const navigate = useNavigate();
    return (
    <div>
        <h1 style={{ color: 'white' }}>Paymaya Transfer</h1>
        <button onClick={() => navigate('/')}>
            Transfer Money
        </button>
    </div>
    );
}

export default Paymaya;
