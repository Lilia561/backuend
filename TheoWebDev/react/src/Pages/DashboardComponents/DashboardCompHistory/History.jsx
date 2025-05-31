import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './History.css'; // Ensure this CSS file exists for styling

function History() {
    // State to store transactions, loading status, and error
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); // State to store the current user's ID

    // This useEffect hook runs once when the component mounts to get the user ID
    useEffect(() => {
        // Retrieve user_id from localStorage
        // This assumes your login/register functions store the user_id in localStorage
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            // If no user ID is found, set loading to false and indicate no user is logged in
            setLoading(false);
            setError("Please log in to view your transaction history.");
        }
    }, []); // Empty dependency array means this effect runs only once after the initial render

    // This useEffect hook runs when userId changes (after it's fetched from localStorage)
    useEffect(() => {
        // Only fetch transactions if a userId is available
        if (userId) {
            const fetchTransactions = async () => {
                try {
                    // Replace with your actual backend API URL.
                    // Assuming your Laravel API is running on http://localhost:8000
                    // and the route is /api/transactions/user
                    // Now dynamically using the fetched userId
                    const response = await fetch(`http://localhost:8000/api/transactions/user?user_id=${userId}`);

                    // Check if the response was successful
                    if (!response.ok) {
                        // If response is not OK (e.g., 404, 500), throw an error
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    // Parse the JSON response
                    const data = await response.json();
                    setTransactions(data); // Update the state with fetched transactions
                } catch (err) {
                    // Catch any errors during the fetch operation
                    console.error("Failed to fetch transactions:", err);
                    setError("Failed to load history. Please try again later.");
                } finally {
                    // Set loading to false once fetching is complete (success or error)
                    setLoading(false);
                }
            };

            fetchTransactions(); // Call the fetch function
        }
    }, [userId]); // This effect runs whenever the userId state changes

    // Render loading state
    if (loading) {
        return (
            <div className="history-card">
                <div className="history-header">
                    <h2>History</h2>
                    <Link to="/history" className="view-history-btn">
                        View Full History
                    </Link>
                </div>
                <div className="history-list">
                    <p>Loading transactions...</p>
                </div>
            </div>
        );
    }

    // Render error state (e.g., not logged in, or API error)
    if (error) {
        return (
            <div className="history-card">
                <div className="history-header">
                    <h2>History</h2>
                    <Link to="/history" className="view-history-btn">
                        View Full History
                    </Link>
                </div>
                <div className="history-list">
                    <p className="error-message">{error}</p>
                </div>
            </div>
        );
    }

    // Render component with fetched data
    return (
        <div className="history-card">
            <div className="history-header">
                <h2>History</h2>
                <Link to="/history" className="view-history-btn">
                    View Full History
                </Link>
            </div>

            <div className="history-list">
                {transactions.length > 0 ? (
                    // Map over the transactions array and render each item
                    transactions.map((transaction) => (
                        <div key={transaction.id} className="history-item">
                            <div className="transaction-details">
                                <span>{transaction.date}</span>
                                {/* Dynamically apply class based on transaction type for styling */}
                                <span className={`transaction-type ${transaction.type.toLowerCase().replace(/\s/g, '-')}`}>
                                    {transaction.type}
                                </span>
                            </div>
                            {/* Render amount or pending status */}
                            {transaction.is_pending ? (
                                <span className="pending">PENDING</span>
                            ) : (
                                <span className="transaction-amount">
                                    {/* Format amount with currency symbol and handle sign */}
                                    {transaction.amount < 0 ? '-' : '+'}₱{Math.abs(transaction.amount).toFixed(2)}
                                </span>
                            )}
                        </div>
                    ))
                ) : (
                    // Message if no transactions are found
                    <p>No transactions found for this user.</p>
                )}
            </div>
        </div>
    );
}

export default History;
