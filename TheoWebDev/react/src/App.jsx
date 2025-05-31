
import './App.module.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import AppRouter from './router';

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

export default App
