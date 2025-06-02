import { useNavigate } from 'react-router-dom';
import styles from './SetGoalLimitScreen.module.css';
import TargetBalance from '../DashboardCompTargetBalance/TargetBalance';
import GoalPlanner from '../DashboardCompGoalPlanner/GoalPlanner';
import React, { useEffect, useState, useCallback } from 'react';
import axiosClient from '../../axios'; // Import your Axios client

function SetGoalLimitScreen() {
    const navigate = useNavigate();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [goalPurpose, setGoalPurpose] = useState('');
    const [goalTargetBalance, setGoalTargetBalance] = useState('');
    const [goalTargetDate, setGoalTargetDate] = useState('');
    const [goals, setGoals] = useState([]);
    const [currentMoney, setCurrentMoney] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = 'Set Goal & Limits | Wall-et';
    }, []);

    // Consolidated data fetching function wrapped in useCallback
    const fetchData = useCallback(async () => {
        setLoading(true); // Start loading for both fetches
        setError(null);
        let isMounted = true; // Flag to prevent state updates on unmounted component

        try {
            const token = localStorage.getItem('ACCESS_TOKEN');
            if (!token) {
                navigate('/login');
                return;
            }

            // Fetch goals
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
            console.error('Error fetching data:', err);
            if (isMounted) {
                let errorMessage = 'An unexpected error occurred. Please try again.';
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                }
                setError(errorMessage);
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            }
        } finally {
            if (isMounted) setLoading(false);
        }

        return () => {
            isMounted = false; // Cleanup: set flag to false when component unmounts
        };
    }, [navigate]); // Dependencies for useCallback

    // useEffect to call fetchData when the component mounts or fetchData changes
    useEffect(() => {
        fetchData();
    }, [fetchData]); // fetchData is now the only dependency

    const handleDoneClick = async () => {
        if (!goalPurpose || !goalTargetBalance) {
            alert('Please fill in both Purpose and Target Balance.');
            return;
        }

        const newGoal = {
            purpose: goalPurpose,
            target_balance: parseFloat(goalTargetBalance),
            target_date: goalTargetDate || null,
        };

        try {
            const token = localStorage.getItem('ACCESS_TOKEN');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axiosClient.post('api/goals', newGoal);

            console.log('Goal set successfully:', response.data);

            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);

            setGoalPurpose('');
            setGoalTargetBalance('');
            setGoalTargetDate('');

            // Re-fetch all data to update the display
            fetchData(); // Call the consolidated fetchData function

        } catch (err) {
            console.error('Error setting goal:', err);
            let errorMessage = 'An unexpected error occurred. Please try again.';
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.response && err.response.data && err.response.data.errors) {
                const firstError = Object.values(err.response.data.errors)[0][0];
                errorMessage = firstError || errorMessage;
            }
            alert(`Error: ${errorMessage}`);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleBackClick = () => {
        navigate('/dashboard');
    };

    // Calculate total target balance from all goals
    const totalTargetBalance = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

    // Calculate remaining goal: total target balance minus current money
    const remainingToGoal = Math.max(0, totalTargetBalance - currentMoney);

    // Calculate overall progress for the GoalPlanner's progress bar
    const progressPercentage = totalTargetBalance > 0
        ? Math.min(100, (currentMoney / totalTargetBalance) * 100)
        : 0;

    return (
        <div className={styles.dashboardRoot}>
            <div className={styles.authWrapper}>
                <div className={styles.dashboardContainer} style={{ position: 'relative' }}>
                    {showSuccessMessage && (
                        <div className={styles.successPopup}>
                            Goal has been set successfully
                        </div>
                    )}

                    {/* Back button */}
                    <button className={styles.backButton} onClick={handleBackClick}>
                        ← Back
                    </button>

                    <div className={styles.dashboardHeader}>
                        <h1>Set Goal and Limits</h1>
                    </div>

                    <div className={styles.setGoalGrid}>
                        <div className={styles.leftColumn}>
                            <h2 className={styles.subtitle}>Set New Goal</h2>
                            <div className={styles.inputGroup}>
                                <label htmlFor="goal-purpose">Purpose</label>
                                <input
                                    type="text"
                                    id="goal-purpose"
                                    placeholder="e.g., New Camera"
                                    value={goalPurpose}
                                    onChange={(e) => setGoalPurpose(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="goal-target-balance">Target Balance for Purpose (PHP)</label>
                                <input
                                    type="number"
                                    id="goal-target-balance"
                                    placeholder="Enter amount"
                                    value={goalTargetBalance}
                                    onChange={(e) => setGoalTargetBalance(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="goal-target-date">Target Date (Optional)</label>
                                <input
                                    type="date"
                                    id="goal-target-date"
                                    value={goalTargetDate}
                                    onChange={(e) => setGoalTargetDate(e.target.value)}
                                />
                            </div>

                            <button className={styles.doneButton} onClick={handleDoneClick}>
                                Set Goal
                            </button>
                        </div>

                        <div className={styles.rightColumn}>
                            {/* Display overall target balance from all goals */}
                            <TargetBalance
                                targetBalance={totalTargetBalance}
                                remainingToGoal={remainingToGoal}
                            />
                            {/* GoalPlanner will now receive dynamic goals */}
                            {loading ? (
                                <p>Loading goals and balance...</p>
                            ) : error ? (
                                <p className={styles.errorMessage}>Error: {error}</p>
                            ) : (
                                <GoalPlanner
                                    progress={progressPercentage}
                                    targetBalance={totalTargetBalance}
                                    currentBalance={currentMoney}
                                    goalDetails={goals}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SetGoalLimitScreen;
