import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const canGoBack = location.key !== 'default';

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/'); 
  };

  return (
    <AppBar 
        position="fixed" 
        sx={{ 
            bgcolor: '#ffffff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }}
    >
      <Toolbar>
        <Typography
            variant="h6" 
            component="div"
            onClick={handleGoHome}
            sx={{
                cursor: 'pointer',
                fontWeight: 700,
                letterSpacing: '-0.5px',
                fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
        >
            <span className="text-blue">Health</span>
            <span className="text-red">Navi Admin</span>
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {canGoBack && (
            <Tooltip title="Go Back">
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="back"
                    onClick={handleGoBack}
                    sx={{ mr: 2, color: "#6991EA" }}
                >
                    <ArrowBackIcon />
                </IconButton>
            </Tooltip>    
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
