import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import ChatHistoryPage from './pages/ChatHistoryPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat-history/:diagnosisId" element={<ChatHistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
