import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Button } from '@mui/material';

const DiagnosesTable = ({ diagnoses, onViewChat }) => {
  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Diagnoses
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Diagnosis ID</TableCell>
            <TableCell>Patient ID</TableCell>
            <TableCell>Practitioner ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Diagnosis Date</TableCell>
            <TableCell>Chat History</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {diagnoses.length > 0 ? (
            diagnoses.map((diagnosis) => (
              <TableRow key={diagnosis.diagnosis_id}>
                <TableCell>{diagnosis.diagnosis_id}</TableCell>
                <TableCell>{diagnosis.patient_id}</TableCell>
                <TableCell>{diagnosis.practitioner_id}</TableCell>
                <TableCell>{diagnosis.status}</TableCell>
                <TableCell>{new Date(diagnosis.diagnosis_date).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => onViewChat(diagnosis)}
                  >
                    View Chat
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body2" color="textSecondary">
                  No diagnoses found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default DiagnosesTable;
