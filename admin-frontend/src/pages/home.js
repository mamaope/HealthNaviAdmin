import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Alert,
  Container,
  Skeleton,
  Grid,
  Tooltip,
  Chip,
  Button
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import PractitionerInput from '../components/input';
import PatientTable from '../components/PatientTable';
import DiagnosesTable from '../components/DiagnosesTable';
import config from '../config'; 

const Home = () => {
  const [practitionerIds, setPractitionerIds] = useState(() => {
    const savedIds = localStorage.getItem('practitionerIds');
    return savedIds ? JSON.parse(savedIds) : [];
  });
  const [patients, setPatients] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [invalidIdError, setInvalidIdError] = useState(null);

  useEffect(() => {
    localStorage.setItem('practitionerIds', JSON.stringify(practitionerIds));
    if (practitionerIds.length > 0) {
      fetchData(practitionerIds);
    } else {
      setPatients([]);
      setDiagnoses([]);
      setIsLoading(false);
      setError(null);
      setInvalidIdError(null);
    }
  }, [practitionerIds]);

  const addPractitionerId = async (newId) => {
    if (newId && !practitionerIds.includes(newId)) {
      const updatedIds = [...practitionerIds, newId];
      setPractitionerIds(updatedIds);
    }  
  };

  const removePractitionerId = (idToRemove) => {
    const updatedIds = practitionerIds.filter(id => id !== idToRemove);
    setPractitionerIds(updatedIds);
  };

  const fetchData = async (ids) => {
    if (ids.length === 0) {
      setPatients([]);
      setDiagnoses([]);
      setIsLoading(false);
      setInvalidIdError(null); 
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      setInvalidIdError(null);
      const [patientsRes, diagnosesRes] = await Promise.all([
        axios.post(`${config.BACKEND_URL}/api/patients`, { practitioner_ids: ids }),
        axios.post(`${config.BACKEND_URL}/api/diagnoses`, { practitioner_ids: ids }),
      ]);

      const fetchedPatients = patientsRes.data;
      const fetchedDiagnoses = diagnosesRes.data;

      setPatients(patientsRes.data);
      setDiagnoses(diagnosesRes.data);

       if (ids.length > 0 && fetchedPatients.length === 0 && fetchedDiagnoses.length === 0) {
        setInvalidIdError("No data found for the provided Practitioner ID(s). Please check if the ID(s) are correct.");
     } else {
        setInvalidIdError(null); 
     }

    } catch (error) {
      console.error('Error fetching data:', error);
      setPatients([]); 
      setDiagnoses([]); 
      setInvalidIdError(null); 
      if (error.response) {
        console.error('Backend error details:', error.response.data);
        setError(`Failed to fetch data: ${error.response.data.detail || error.message}`);
      } else {
        setError('Failed to fetch data. Please check your network connection and try again.');
      }

    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleViewChat = (diagnosis) => {
    navigate(`/chat-history/${diagnosis.diagnosis_id}`, { 
      state: { 
        chatHistory: diagnosis.chat_history,
        doctor_notes: diagnosis.doctor_notes
      }
    });
  };

  const handleViewStats = () => {
    navigate('/statistics', { state: { practitionerIds: practitionerIds } });
 };

  const renderSkeletonTable = () => {
    return (
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={60} sx={{ mb: 1 }} />
        ))}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          gap: { xs: 2, sm: 3 }, 
          mb: 3, 
          width: '100%',
          maxWidth: 800, 
          mx: 'auto', 
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 200 } }}>
          <PractitionerInput onAddId={addPractitionerId} />
        </Box>

        <Box sx={{ flexShrink: 0 }}>
            <Button
                variant="contained"
                onClick={handleViewStats}
                disabled={practitionerIds.length === 0 && !isLoading}
                fullWidth={false} 
            >
                View Statistics
            </Button>
        </Box>
      </Box>

      {practitionerIds.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
          {practitionerIds.map((id) => (
            <Chip
              key={id}
              label={id}
              onDelete={() => removePractitionerId(id)}
              deleteIcon={<Tooltip title="Remove practitioner"><DeleteIcon fontSize="small" /></Tooltip>} 
              color="primary"
              variant="outlined"
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {invalidIdError && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {invalidIdError}
        </Alert>
      )}

      {practitionerIds.length === 0 ? (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', mt: 3 }}>
          <Typography variant="h6" color="textSecondary">
            Please add Practitioner ID(s) above to view patient and diagnosis data.
          </Typography>
        </Paper>
      ) : (
        !invalidIdError && (
          <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              variant="standard"
              sx={{
                '& .MuiTab-root': {
                  fontSize: { xs: '0.9rem', sm: '1.1rem' },
                  fontWeight: 500,
                  minHeight: { xs: 48, sm: 64 },
                },
              }}
            >
              <Tab label="Patients" />
              <Tab label="Diagnoses" />
            </Tabs>
            <Box p={{ xs: 2, sm: 3 }} sx={{ overflowX: 'auto' }}>
              {isLoading ? (
                renderSkeletonTable()
              ) : (
                <>
                  {tabValue === 0 && <PatientTable patients={patients} />}
                  {tabValue === 1 && <DiagnosesTable diagnoses={diagnoses} onViewChat={handleViewChat} />}
                </>
              )}
            </Box>
          </Paper>
        )
      )}
    </Container>  
  );
};

export default Home;
