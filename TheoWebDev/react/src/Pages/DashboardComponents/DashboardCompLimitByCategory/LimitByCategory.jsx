import React, { useState, useEffect } from 'react';
import styles from './LimitByCategory.module.css';
import axiosClient from '../../axios'; // Import your Axios client

function LimitByCategory() {
  const [categoryLimits, setCategoryLimits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryLimitsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get('api/user/category-limits'); // Use the new API endpoint
        setCategoryLimits(response.data.category_limits); // Access the 'category_limits' key from the response
      } catch (err) {
        console.error('Error fetching category limits:', err);
        setError(err.response?.data?.message || 'Failed to load category limits.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryLimitsData();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <div className={styles['limit-by-category-card']}>
        <h2>Limit by Category</h2>
        <p>Loading category limits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['limit-by-category-card']}>
        <h2>Limit by Category</h2>
        <p className={styles.errorMessage}>{error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className={styles['limit-by-category-card']}>
      <h2>Limit by Category</h2>
      {categoryLimits.length > 0 ? (
        categoryLimits.map((category) => (
          <div className={styles['limit-category']} key={category.id}> {/* Use category.id as key */}
            <div className={styles['limit-category-item']}>
              <span>{category.category_name}</span> {/* Use category_name */}
              <span>
                ₱{category.current_spent_amount.toFixed(2)} of ₱{category.limit_amount.toFixed(2)}
              </span>
            </div>
            <div className={styles['progress-bar-container']}>
              <div
                className={styles['progress-bar']}
                style={{
                  width: `${Math.min(100, category.progressPercentage)}%`, // Use progressPercentage from backend
                  backgroundColor:
                    category.current_spent_amount > category.limit_amount ? '#f44336' : '#4caf50',
                }}
              ></div>
            </div>
            {category.remaining < 0 && category.limit_amount > 0 && (
                <p className={styles.categoryOverLimit}>
                    Over by ₱{(-category.remaining).toFixed(2)}
                </p>
            )}
          </div>
        ))
      ) : (
        <p>No spending limits set for categories.</p>
      )}
    </div>
  );
}

export default LimitByCategory;