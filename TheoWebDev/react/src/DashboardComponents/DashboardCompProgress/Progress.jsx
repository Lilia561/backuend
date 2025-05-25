import React from 'react';
import './Progress.css';

function Progress() {
    return (
        <div className="progress-card">
            <h2>Progress</h2>
            <div className="progress-steps">
                <div className="step active">1</div>
                <div className="step">2</div>
                <div className="step">3</div>
                <span>📈</span>
            </div>
        </div>
    );
}

export default Progress;