import React from 'react';
import { Link } from 'react-router-dom';
import './History.css';

function History() {
    return (
        <div className="history-card">
            <div className="history-header">
                <h2>History</h2>
                <Link to="/history" className="view-history-btn">
                    View Full History
                </Link>
            </div>

            <div className="history-list">
                <div className="history-item">
                    <div className="transaction-details">
                        <span>10/10/2025</span>
                        <span className="transaction-type grocery">GROCERY</span>
                    </div>
                    <span className="pending">PENDING</span>
                </div>
                <div className="history-item">
                    <div className="transaction-details">
                        <span>10/10/1999</span>
                        <span className="transaction-type salary">SALARY</span>
                    </div>
                    <span className="transaction-amount">+₱300.00</span>
                </div>
                <div className="history-item">
                    <div className="transaction-details">
                        <span>09/10/1999</span>
                        <span className="transaction-type electric-bill">ELECTRIC BILL</span>
                    </div>
                    <span className="transaction-amount">-₱120.00</span>
                </div>
                <div className="history-item">
                    <div className="transaction-details">
                        <span>08/10/1999</span>
                        <span className="transaction-type shopping">SHOPPING</span>
                    </div>
                    <span className="transaction-amount">-₱55.00</span>
                </div>
                <div className="history-item">
                    <div className="transaction-details">
                        <span>07/10/1999</span>
                        <span className="transaction-type food">FOOD</span>
                    </div>
                    <span className="transaction-amount">-₱25.00</span>
                </div>
                <div className="history-item">
                    <div className="transaction-details">
                        <span>06/10/1999</span>
                        <span className="transaction-type transfer">TRANSFER</span>
                    </div>
                    <span className="transaction-amount">-₱100.00</span>
                </div>
                <div className="history-item">
                    <div className="transaction-details">
                        <span>05/10/1999</span>
                        <span className="transaction-type salary">SALARY</span>
                    </div>
                    <span className="transaction-amount">+₱350.00</span>
                </div>
            </div>
        </div>
    );
}

export default History;
