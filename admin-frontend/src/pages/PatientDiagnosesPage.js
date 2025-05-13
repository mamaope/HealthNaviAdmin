import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Skeleton
} from '@mui/material';
import DiagnosesTable from '../components/DiagnosesTable'; 
import config from '../config';
import { diagnosesCache } from '../utils/cacheService';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const PatientDiagnosesPage = () => {
  const { patientId } = useParams(); 
  const navigate = useNavigate();
  const [diagnoses, setDiagnoses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchPatientDiagnoses = async (retry = 0) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cachedData = diagnosesCache.get(`diagnoses-${patientId}`);
      if (cachedData) {
        setDiagnoses(cachedData);
        setIsLoading(false);
        // Fetch fresh data in background
        fetchFreshData();
        return;
      }

      const response = await axios.get(`${config.BACKEND_URL}/api/diagnoses/patient/${patientId}`);
      setDiagnoses(response.data);
      diagnosesCache.set(`diagnoses-${patientId}`, response.data);
      setRetryCount(0); 
      setIsInitialLoad(false);
    } catch (error) {
      console.error(`Error fetching diagnoses for patient ${patientId}:`, error);
      
      if (error.message.includes('connection is closed') || !error.response) {
        if (retry < MAX_RETRIES) {
          console.log(`Retrying... Attempt ${retry + 1} of ${MAX_RETRIES}`);
          setRetryCount(retry + 1);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return fetchPatientDiagnoses(retry + 1);
        }
      }

      if (error.response) {
        setError(`Failed to fetch diagnoses: ${error.response.data.detail || error.message}`);
      } else {
        setError('Connection error. Please check your network connection.');
      }
      setDiagnoses([]); 
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch fresh data in background
  const fetchFreshData = async () => {
    try {
      const response = await axios.get(`${config.BACKEND_URL}/api/diagnoses/patient/${patientId}`);
      setDiagnoses(response.data);
      diagnosesCache.set(`diagnoses-${patientId}`, response.data);
    } catch (error) {
      console.error('Background fetch error:', error);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientDiagnoses();
    }
  }, [patientId]);

  const handleRetry = () => {
    setRetryCount(0);
    fetchPatientDiagnoses();
  };

  const handleViewChat = (diagnosis) => {
    navigate(`/chat-history/${diagnosis.diagnosis_id}`, { 
      state: { 
        chatHistory: diagnosis.chat_history,
        doctor_notes: diagnosis.doctor_notes
      } 
    });
  };

  const LoadingIndicator = () => (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', my: 4 }}>
      {isInitialLoad ? (
        <>
          <Box sx={{ width: '100%' }}>
            {[...Array(3)].map((_, i) => (
              <Skeleton 
                key={i} 
                variant="rectangular" 
                sx={{ 
                  mb: 2, 
                  height: 60, 
                  borderRadius: 1 
                }} 
              />
            ))}
          </Box>
          <CircularProgress
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-20px',
              marginLeft: '-20px'
            }}
          />
        </>
      ) : (
        <CircularProgress />
      )}
      {retryCount > 0 && (
        <Typography variant="body2" sx={{ mt: 2, position: 'absolute', bottom: -30 }}>
          Retrying... Attempt {retryCount} of {MAX_RETRIES}
        </Typography>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Diagnoses for Patient ID: {patientId}
      </Typography>

      {isLoading && <LoadingIndicator />}

      {error && (
        <Box sx={{ mb: 3 }}>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                RETRY
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
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
