
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Gcash() {
    useEffect(() => {
    document.title = 'Gcash | Wall-et';
  }, []);
    const navigate = useNavigate();
    return (
    <div>
        <h1 style={{ color: 'white' }}>Gcash Transfer</h1>
        <button onClick={() => navigate('/')}>
            Transfer Money
        </button>
    </div>
    );
}

export default Gcash;
