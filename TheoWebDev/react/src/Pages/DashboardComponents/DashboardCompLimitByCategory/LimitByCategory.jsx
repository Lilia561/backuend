import React from 'react';
import styles from './LimitByCategory.module.css';

function LimitByCategory({ limits }) {
  return (
    <div className={styles['limit-by-category-card']}>
      <h2>Limit by Category</h2>
      <p>Track your Limits</p>
      {limits && limits.map((category) => (
        <div className={styles['limit-category']} key={category.name}>
          <div className={styles['limit-category-item']}>
            <span>{category.name}</span>
            <span>₱{category.spent.toFixed(2)} of ₱{category.limit.toFixed(2)}</span>
          </div>
          <div className={styles['progress-bar-container']}>
            <div
              className={styles['progress-bar']}
              style={{
                width: `${(category.spent / category.limit) * 100}%`,
                backgroundColor:
                  category.spent > category.limit ? '#f44336' : '#4caf50',
              }}
            ></div>
          </div>
        </div>
      ))}
      {!limits && <p>No spending limits set.</p>}
    </div>
  );
}

export default LimitByCategory;
