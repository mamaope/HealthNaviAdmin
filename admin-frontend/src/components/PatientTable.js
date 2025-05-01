import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
  Button,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

const PatientTable = ({ patients }) => {

  const navigate = useNavigate();
  const handleViewPatient = (patientId) => {
    navigate(`/patient-diagnoses/${patientId}`);
  };

  return (
    <>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="patient table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Patient ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Age</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Practitioner ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <TableRow
                  key={patient.patient_id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer', 
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                  onClick={() => handleViewPatient(patient.patient_id)}
                >
                  <TableCell component="th" scope="row">
                    {patient.patient_id}
                  </TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.practitioner_id}</TableCell>
                  <TableCell>{new Date(patient.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(event) => {
                         event.stopPropagation(); 
                         handleViewPatient(patient.patient_id);
                      }}
                    >
                      View Patient
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                 <Typography variant="body2" color="textSecondary">
                    No patients found for this selection.
                 </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PatientTable;
