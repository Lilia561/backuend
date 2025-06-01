import React, { useEffect, useState, useCallback } from 'react';
import styles from './TargetBalance.module.css';
import axiosClient from '../../axios'; // Import your Axios client
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function TargetBalance() {
    const navigate = useNavigate();
    const [goals, setGoals] = useState([]);
    const [currentMoney, setCurrentMoney] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Consolidated data fetching function for TargetBalance
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        let isMounted = true; // Flag to prevent state updates on unmounted component

        try {
            const token = localStorage.getItem('ACCESS_TOKEN');
            if (!token) {
                if (isMounted) navigate('/login'); // Redirect if no token
                return;
            }

            // Fetch goals to calculate total target balance
            const goalsResponse = await axiosClient.get('api/goals', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (isMounted) setGoals(goalsResponse.data);

            // Fetch current money
            const moneyResponse = await axiosClient.get('api/user/money', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (isMounted) setCurrentMoney(moneyResponse.data.current_money);

        } catch (err) {
            console.error('Error fetching data for TargetBalance:', err);
            if (isMounted) {
                let errorMessage = 'An unexpected error occurred. Please try again.';
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                }
                setError(errorMessage);
                if (err.response && err.response.status === 401) {
                    navigate('/login'); // Redirect to login on 401 Unauthorized
                }
            }
        } finally {
            if (isMounted) setLoading(false);
        }

        return () => {
            isMounted = false; // Cleanup: set flag to false when component unmounts
        };
    }, [navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Calculate total target balance from all goals
    const totalTargetBalance = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

    // Calculate remaining goal: total target balance minus current money
    const remainingToGoal = Math.max(0, totalTargetBalance - currentMoney);

    // Calculate progress for the internal bar (how much of the target has been reached)
    const reached = totalTargetBalance - remainingToGoal;
    const progress = totalTargetBalance > 0 ? (reached / totalTargetBalance) * 100 : 0;

    if (loading) {
        return (
            <div className={styles.targetBalanceCard}>
                <p>Loading target balance...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.targetBalanceCard}>
                <p className={styles.errorMessage}>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className={styles.targetBalanceCard}>
            <h2 className={styles.heading}>Target Balance</h2>
            <div className={styles.targetBalanceInfo}>
                <span>Target Balance</span>
                <span>₱{totalTargetBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={styles.remainingGoalInfo}>
                <span>Remaining Goal</span>
                <span>&nbsp; ₱{remainingToGoal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}

export default TargetBalance;
