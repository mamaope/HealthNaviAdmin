import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Tabs, Tab, Paper, Alert, Container, Skeleton } from '@mui/material';
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

  useEffect(() => {
    localStorage.setItem('practitionerIds', JSON.stringify(practitionerIds));
    if (practitionerIds.length > 0) {
      fetchData(practitionerIds);
    }
  }, [practitionerIds]);

  const addPractitionerId = async (newId) => {
    if (newId && !practitionerIds.includes(newId)) {
      const updatedIds = [...practitionerIds, newId];
      setPractitionerIds(updatedIds);
    }
  };

  const fetchData = async (ids) => {
    try {
      setIsLoading(true);
      setError(null);
      const [patientsRes, diagnosesRes] = await Promise.all([
        axios.post(`${config.BACKEND_URL}/api/patients`, { practitioner_ids: ids }),
        axios.post(`${config.BACKEND_URL}/api/diagnoses`, { practitioner_ids: ids }),
      ]);
      setPatients(patientsRes.data);
      setDiagnoses(diagnosesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response) {
        console.error('Backend error details:', error.response.data);
        setError(`Failed to fetch data: ${error.response.data.detail || error.message}`);
      } else {
        setError('Failed to fetch data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewChat = (diagnosis) => {
    navigate(`/chat-history/${diagnosis.diagnosis_id}`, { state: { chatHistory: diagnosis.chat_history } });
  };

  const renderSkeletonTable = () => {
    return (
      <Box sx={{ width: '100%' }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={60} sx={{ mb: 1 }} />
        ))}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        mb={6}
        sx={{ textAlign: 'center' }}
      >
        <Typography variant="h3" className="brand-title" sx={{ mb: 4 }}>
          <span className="text-blue">Health</span>
          <span className="text-red">Navi Admin</span>
        </Typography>

        <Box sx={{ width: '100%', maxWidth: 600 }}>
          <PractitionerInput
            practitionerIds={practitionerIds}
            onAddId={addPractitionerId}
          />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ width: '100%' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered
          sx={{
            '& .MuiTab-root': {
              fontSize: '1.1rem',
              fontWeight: 500,
            }
          }}
        >
          <Tab label="Patients" />
          <Tab label="Diagnoses" />
        </Tabs>
        <Box p={3}>
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
    </Container>
  );
};

export default Home;
