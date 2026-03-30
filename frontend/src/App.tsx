import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main Home Page */}
          <Route path="/" element={
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1>Adjournment AI</h1>
              <p>The future of legal case management.</p>
              <Link to="/dashboard" style={{
                background: '#60a5fa', 
                color: 'white', 
                padding: '10px 25px', 
                borderRadius: '8px', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}>
                Open Dashboard
              </Link>
            </header>
          } />

          {/* Dashboard Page */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;