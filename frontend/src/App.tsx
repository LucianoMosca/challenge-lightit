import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientList from './components/ListPatients';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Patient Registration System</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<PatientList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
