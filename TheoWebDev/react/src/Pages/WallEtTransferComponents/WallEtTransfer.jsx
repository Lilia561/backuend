
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function WallEtTransfer() {
    useEffect(() => {
    document.title = 'Wall-et Transfer | Wall-et';
  }, []);
    const navigate = useNavigate();
    return (
    <div>
        <h1 style={{ color: 'white' }}>Wall-et Transfer</h1>
        <button onClick={() => navigate('/')}>
            Transfer Money
        </button>
    </div>
    );
}

export default WallEtTransfer;
