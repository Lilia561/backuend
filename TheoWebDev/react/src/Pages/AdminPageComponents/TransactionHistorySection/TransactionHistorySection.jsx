import React from "react";
import styles from "./TransactionHistorySection.module.css";

const TransactionHistorySection = () => {
  const transactions = [
    {
      id: 1,
      user: "Alice Wonderland",
      amount: 120.5,
      date: "2024-05-25",
      status: "Completed",
    },
    {
      id: 2,
      user: "Bob The Builder",
      amount: 75.0,
      date: "2024-05-26",
      status: "Pending",
    },
    {
      id: 3,
      user: "Charlie Brown",
      amount: 210.99,
      date: "2024-05-26",
      status: "Failed",
    },
  ];

  return (
    <div className={styles.adminSection}>
      <h2>Transaction History</h2>
      <table className={styles.transactionTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.user}</td>
              <td>${tx.amount.toFixed(2)}</td>
              <td>{tx.date}</td>
              <td>
                <span
                  className={`${styles.status} ${
                    styles[`status${tx.status}`] || ""
                  }`}
                >
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistorySection;
