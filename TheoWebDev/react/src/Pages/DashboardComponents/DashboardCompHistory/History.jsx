import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './History.module.css';
import axiosClient from '../../axios';

function History() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            setLoading(false);
            setError("Please log in to view your transaction history.");
        }
    }, []);

    useEffect(() => {
        if (userId) {
            const fetchTransactions = async () => {
                try {
                    const response = await axiosClient.get(`/api/transactions/user?user_id=${userId}`);
                    setTransactions(response.data);
                } catch (err) {
                    console.error("Failed to fetch transactions:", err);
                    setError(err.response?.data?.message || "Failed to load history. Please try again later.");
                } finally {
                    setLoading(false);
                }
            };

            fetchTransactions();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className={styles['history-card']}>
                <div className={styles['history-header']}>
                    <h2>History</h2>
                    <Link to="/history" className={styles['view-history-btn']}>
                        View Full History
                    </Link>
                </div>
                <div className={styles['history-list']}>
                    <p>Loading transactions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles['history-card']}>
                <div className={styles['history-header']}>
                    <h2>History</h2>
                    <Link to="/history" className={styles['view-history-btn']}>
                        View Full History
                    </Link>
                </div>
                <div className={styles['history-list']}>
                    <p className={styles['error-message']}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles['history-card']}>
            <div className={styles['history-header']}>
                <h2>History</h2>
            </div>

            <div className={styles['history-list']}>
                {transactions.length > 0 ? (
                    transactions.map((transaction) => {
                        const isOutgoing = transaction.amount < 0;

                        let categoryLabel = transaction.description || ''; // This is the purpose/category from backend
                        let transactionLabel = ''; // This will be the final display string (e.g., "Food to John Doe")
                        let labelClass = ''; // For dynamic background color

                        if (isOutgoing) {
                            // Outgoing transaction: "Category to Recipient Name"
                            // categoryLabel is already the purpose/category (e.g., "Food", "TRANSFER", "Giberish")
                            const recipientName = transaction.receiver_name || 'User'; // Use actual name, fallback to 'User'
                            transactionLabel = `${categoryLabel} to ${recipientName}`;
                            labelClass = categoryLabel.toLowerCase().replace(/\s/g, '-'); // Create a class name from the category (e.g., "food", "transfer", "giberish")
                        } else {
                            // Incoming transaction: "Received from Sender Name"
                            // Backend's description for incoming is already formatted as "Received from [Sender Name]"
                            transactionLabel = transaction.description;
                            labelClass = 'received'; // A fixed class for received transactions
                        }

                        return (
                            <div key={transaction.id} className={styles['history-item']}>
                                <div className={styles['transaction-details']}>
                                    <span>{transaction.date}</span>
                                    {/* Use a single span for the entire label, apply dynamic class */}
                                    <span className={`${styles['transaction-label']} ${styles[labelClass]}`}>
                                        {transactionLabel}
                                    </span>
                                </div>
                                {transaction.is_pending ? (
                                    <span className={styles.pending}>PENDING</span>
                                ) : (
                                    <span
                                        className={`${styles['transaction-amount']} ${
                                            isOutgoing ? styles.negative : styles.positive
                                        }`}
                                    >
                                        {transaction.displayAmount}
                                    </span>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>No transactions found for this user.</p>
                )}
            </div>
        </div>
    );
}

export default History;