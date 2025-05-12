import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

const DoctorNotes = ({ notes }) => {
  if (!notes) {
    return null;
  }

  return (
    <Card 
      elevation={1}
      sx={{
        bgcolor: '#f8f9fa',
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ 
        p: { xs: 1.5, sm: 2 },
        '&:last-child': { pb: 2 },
      }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: '#1976d2', 
            fontWeight: 500,
            mb: 1
          }}
        >
          Doctor's Notes
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#333',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
          }}
        >
          {notes}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DoctorNotes;
