import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  Paper
} from '@mui/material';
import config from '../config';

const StatisticsPage = () => {
  const location = useLocation();
  const practitionerIds = location.state?.practitionerIds || [];
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async (ids) => {
      if (ids.length === 0) {
        setStats({
            "total_patients": 0,
            "total_diagnoses": 0,
            "status_counts": {"in_progress": 0, "paused": 0, "complete": 0, "critical": 0},
            "total_practitioners": 0
        });
        setIsLoading(false);
        setError(null); 
        return;
      }
      try {
        setIsLoading(true);
        setError(null); 
        const response = await axios.post(`${config.BACKEND_URL}/api/stats`, { practitioner_ids: ids });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
         if (error.response) {
           setError(`Failed to fetch statistics: ${error.response.data.detail || error.message}`);
        } else {
           setError('Failed to fetch statistics. Please check your network connection.');
        }
        setStats(null); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats(practitionerIds);

  }, [practitionerIds]); 

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Statistics
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

      {!isLoading && !error && stats && (
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card elevation={3} sx={{ height: '100%' }}> 
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Total Practitioners
                </Typography>
                <Typography variant="h3" component="div">
                  {stats.total_practitioners}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card elevation={3} sx={{ height: '100%' }}> 
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Total Patients
                </Typography>
                <Typography variant="h3" component="div">
                  {stats.total_patients}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Total Diagnoses
                </Typography>
                <Typography variant="h3" component="div">
                  {stats.total_diagnoses}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

           <Grid item xs={12} sm={6} md={6} lg={3}>
            <Card elevation={3} sx={{ height: '100%' }}> 
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Diagnosis Status
                </Typography>
                 {stats.status_counts && Object.entries(stats.status_counts).map(([status, count]) => (
                    <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                       <Typography variant="body1">
                          {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}:
                       </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                           {count}
                        </Typography>
                    </Box>
                 ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {!isLoading && !error && !stats && practitionerIds.length > 0 && (
         <Paper elevation={3} sx={{ p: 3, textAlign: 'center', mt: 3 }}>
            <Typography variant="h6" color="textSecondary">
               Could not load statistics for the provided IDs.
            </Typography>
         </Paper>
      )}

       {!isLoading && !error && practitionerIds.length === 0 && (
         <Paper elevation={3} sx={{ p: 3, textAlign: 'center', mt: 3 }}>
            <Typography variant="h6" color="textSecondary">
               Add Practitioner ID(s) on the home page to view statistics.
            </Typography>
         </Paper>
       )}

    </Container>
  );
};

export default StatisticsPage;
