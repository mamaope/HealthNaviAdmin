import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Chip } from '@mui/material';

const PractitionerInput = ({ practitionerIds, onAddId, filterId, onFilter }) => {
  const [newId, setNewId] = useState('');

  const handleAdd = () => {
    onAddId(newId);
    setNewId('');
  };

  return (
    <>
      {/* Input for Practitioner IDs */}
      <Box mb={3}>
        <TextField
          label="Enter Practitioner ID"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Button variant="contained" onClick={handleAdd} sx={{ ml: 2 }}>
          Add ID
        </Button>
      </Box>

      {/* Display Entered Practitioner IDs */}
      <Box mb={3}>
        <Typography variant="h6">Practitioner IDs:</Typography>
        {practitionerIds.length > 0 ? (
          practitionerIds.map((id) => (
            <Chip key={id} label={id} sx={{ m: 0.5 }} />
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No practitioner IDs added yet.
          </Typography>
        )}
      </Box>     
    </>
  );
};

export default PractitionerInput;
