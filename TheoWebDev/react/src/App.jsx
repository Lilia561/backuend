// App.jsx
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router'; // Import the new AppRouter component

/**
 * Main App component.
 * This component now focuses on setting up the Router and rendering the AppRouter.
 * It keeps the main application file clean and modular.
 */
function App() {
  return (
    <Router>
      <div className='routes'>
        {/* Render the AppRouter component which contains all your defined routes */}
        <AppRouter />
      </div>
    </Router>
  );
}

export default App;
