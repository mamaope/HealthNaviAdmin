import React, { useState } from 'react';
import { TextField, Button, Box, IconButton, InputAdornment, Tooltip, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import config from '../config';

const PractitionerInput = ({ onSubmit }) => {
  const [newId, setNewId] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateAndAdd = async () => {
    const id = newId.trim();
    if (!id) return;

    try {
      setIsValidating(true);
      const response = await axios.get(`${config.BACKEND_URL}/api/practitioner/validate/${id}`);
      
      if (response.data.exists) {
        onSubmit(id);
        setNewId('');
      } else {
        alert(`Practitioner ID "${id}" does not exist in the database.`);
      }
    } catch (error) {
      console.error('Error validating practitioner ID:', error);
      alert('Error validating practitioner ID. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !isValidating) {
      validateAndAdd();
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
        disabled={isValidating}
        sx={{ flexGrow: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={isValidating ? "Validating..." : "Add Practitioner ID"}>
                <span>
                  <IconButton 
                    onClick={validateAndAdd} 
                    edge="end" 
                    color="primary"
                    disabled={isValidating || !newId.trim()}
                  >
                    {isValidating ? <CircularProgress size={24} /> : <AddIcon />}
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default PractitionerInput;
