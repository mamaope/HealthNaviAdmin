import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  TableContainer 
} from '@mui/material';

const shortenUuid = (uuid) => {
  if (!uuid) return '';
  const uuidString = String(uuid); 
  return uuidString.substring(0, 8); 
};

const DiagnosesTable = ({ diagnoses, onViewChat, showVitalSigns = false }) => {
  return (
    <>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="diagnoses table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Diagnosis ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Patient ID</TableCell>
              {showVitalSigns && (
                <>
                  <TableCell sx={{ fontWeight: 'bold' }}>Resp. Rate</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>O₂ Sat.</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Height (cm)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Weight (kg)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Heart Rate</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Temp (°C)</TableCell>
                </>
              )}
              <TableCell sx={{ fontWeight: 'bold' }}>Practitioner ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Diagnosis Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Chat History</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diagnoses.length > 0 ? (
              diagnoses.map((diagnosis) => (
                <TableRow
                  key={diagnosis.diagnosis_id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {diagnosis.diagnosis_id}
                  </TableCell>
                  <TableCell>{diagnosis.patient_id}</TableCell>
                  {showVitalSigns && (
                    <>
                      <TableCell>{diagnosis.respiratory_rate ?? 'N/A'}</TableCell>
                      <TableCell>{diagnosis.oxygen_saturation ?? 'N/A'}</TableCell>
                      <TableCell>{diagnosis.height ?? 'N/A'}</TableCell>
                      <TableCell>{diagnosis.weight ?? 'N/A'}</TableCell>
                      <TableCell>{diagnosis.heart_rate ?? 'N/A'}</TableCell>
                      <TableCell>{diagnosis.temperature ?? 'N/A'}</TableCell>
                    </>
                  )}
                  <TableCell>{diagnosis.practitioner_id}</TableCell>
                  <TableCell>{diagnosis.status}</TableCell>
                  <TableCell>{new Date(diagnosis.diagnosis_date).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small" 
                      onClick={() => onViewChat(diagnosis)}
                      disabled={!diagnosis.chat_history || diagnosis.chat_history.length === 0}
                    >
                      View Chat
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={showVitalSigns ? 11 : 6} align="center"> 
                  <Typography variant="body2" color="textSecondary">
                    No diagnoses found for this selection.
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

export default DiagnosesTable;
