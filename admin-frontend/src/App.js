import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import ChatHistoryPage from './pages/ChatHistoryPage';
import PatientDiagnosesPage from './pages/PatientDiagnosesPage';
import StatisticsPage from './pages/Statistics';
import './App.css';
import Navbar from './components/Navbar';
import { Box } from '@mui/material';

function App() {  
  return (
    <Router>
      <Navbar />
      <Box
        sx={{
          pt: { xs: '56px', sm: '64px' },
          minHeight: '100vh', 
          bgcolor: '#f5f5f5',
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat-history/:diagnosisId" element={<ChatHistoryPage />} />
          <Route path="/patient-diagnoses/:patientId" element={<PatientDiagnosesPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
        </Routes>
      </Box>  
    </Router>
  );
}

export default App;
