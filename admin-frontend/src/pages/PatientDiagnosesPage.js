import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import DiagnosesTable from '../components/DiagnosesTable'; 
import config from '../config';

const PatientDiagnosesPage = () => {
  const { patientId } = useParams(); 
  const navigate = useNavigate();
  const [diagnoses, setDiagnoses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientDiagnoses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${config.BACKEND_URL}/api/diagnoses/patient/${patientId}`);
        setDiagnoses(response.data);
      } catch (error) {
        console.error(`Error fetching diagnoses for patient ${patientId}:`, error);
        if (error.response) {
           setError(`Failed to fetch diagnoses: ${error.response.data.detail || error.message}`);
        } else {
           setError('Failed to fetch diagnoses. Please check your network connection.');
        }
        setDiagnoses([]); 
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchPatientDiagnoses();
    }

  }, [patientId]); 

  const handleViewChat = (diagnosis) => {
    navigate(`/chat-history/${diagnosis.diagnosis_id}`, { state: { chatHistory: diagnosis.chat_history } });
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Diagnoses for Patient ID: {patientId}
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!isLoading && !error && (
         <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
           <DiagnosesTable diagnoses={diagnoses} onViewChat={handleViewChat} showVitalSigns={true} />
         </Paper>
      )}

       {!isLoading && !error && diagnoses.length === 0 && (
         <Paper elevation={3} sx={{ p: 3, textAlign: 'center', mt: 3 }}>
            <Typography variant="h6" color="textSecondary">
               No diagnoses found for this patient.
            </Typography>
         </Paper>
       )}

    </Container>
  );
};

export default PatientDiagnosesPage;
