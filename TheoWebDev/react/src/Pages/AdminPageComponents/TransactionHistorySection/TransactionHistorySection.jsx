import React, { useState, useEffect, useCallback } from "react";
import styles from "./TransactionHistorySection.module.css";
import axiosClient from "../../axios"; // Import your Axios client

const TransactionHistorySection = () => {
  // State to store the list of transactions fetched from the API
  const [transactions, setTransactions] = useState([]);
  // State to manage loading status
  const [isLoading, setIsLoading] = useState(true);
  // State to store any errors
  const [error, setError] = useState(null);
  // State for the search term
  const [searchTerm, setSearchTerm] = useState("");

  // Memoized function to fetch transactions from the API
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Make a GET request to your Laravel API endpoint for transactions
      // Pass the search term as a query parameter if it exists
      const response = await axiosClient.get("api/admin/transactions", {
        params: {
          search: searchTerm, // Send the search term to the backend
        },
      });
      // Assuming the API response has a 'transactions' key
      setTransactions(response.data.transactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      if (err.response) {
        setError(err.response.data.message || "Failed to fetch transactions.");
      } else if (err.request) {
        setError("No response from server. Please check your network connection.");
      } else {
        setError("An unexpected error occurred while fetching transactions.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]); // Re-run when searchTerm changes

  // Effect hook to trigger data fetching when the component mounts or searchTerm changes
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // Dependency on fetchTransactions (memoized)

  return (
    <div className={styles.adminSection}>
      <h2>Transaction History</h2>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by User Name (Original User, Sender, or Receiver)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {isLoading && <p>Loading transactions...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {!isLoading && !error && (
        <table className={styles.transactionTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Original User</th> {/* New/Renamed column for user_id */}
              <th>Sender</th>      {/* New column */}
              <th>Receiver</th>    {/* New column */}
              <th>Amount Spent</th> {/* Original name */}
              <th>Description</th>
              <th>Date</th>
              <th>Status</th>      {/* New column */}
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.noDataMessage}> {/* Updated colspan */}
                  {searchTerm ? "No matching transactions found." : "No transactions found."}
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{tx.user ? tx.user.name : 'N/A'}</td>            {/* Display original user's name */}
                  <td>{tx.sender ? tx.sender.name : 'N/A'}</td>      {/* Display sender's name */}
                  <td>{tx.receiver ? tx.receiver.name : 'N/A'}</td>    {/* Display receiver's name */}
                  <td>${parseFloat(tx.amount_spent || 0).toFixed(2)}</td> {/* Use amount_spent */}
                  <td>{tx.description || 'N/A'}</td>
                  <td>{new Date(tx.transaction_date || tx.created_at).toLocaleDateString()}</td> {/* Use transaction_date or fallback to created_at */}
                  <td>
                    <span
                      className={`${styles.status} ${
                        styles[`status${tx.status}`] || ""
                      }`}
                    >
                      {tx.status || 'N/A'} {/* Display status */}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionHistorySection;
