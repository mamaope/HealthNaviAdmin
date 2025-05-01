import React, { useState } from 'react';
import { TextField, Button, Box, IconButton, InputAdornment, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; 

const PractitionerInput = ({ onAddId }) => { 
  const [newId, setNewId] = useState('');

  const handleAdd = () => {
    if (newId.trim()) {
      onAddId(newId.trim());
      setNewId('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
      <TextField
        label="Enter Practitioner ID"
        value={newId}
        onChange={(e) => setNewId(e.target.value)}
        onKeyPress={handleKeyPress} 
        variant="outlined"
        size="small"
        fullWidth
        sx={{ flexGrow: 1 }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Add Practitioner ID">
                  <IconButton onClick={handleAdd} edge="end" color="primary">
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }  
        }}
      />
    </Box>
  );
};

export default PractitionerInput;
