import React, { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
} from '@mui/material';
import { formatMessage } from '../utils/messageFormatter';
import DoctorNotes from '../components/DoctorNotes';

const ChatHistoryPage = () => {
  const location = useLocation();
  const { diagnosis_id } = useParams();
  const chatEndRef = useRef(null);

  const chatHistory = location.state?.chatHistory || [];
  const doctorNotes = location.state?.doctor_notes || '';

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: 'calc(100vh - 64px)',
        p: { xs: 1, sm: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
        Chat History {diagnosis_id}
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 300px' }, 
          gap: 3,
          overflow: 'hidden', 
        }}
      >
        <Box
          sx={{
            order: { xs: -1, md: 1 },
            overflowY: 'auto',
            height: { md: '100%' }, 
          }}
        >
          <DoctorNotes notes={doctorNotes} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 0, 
            overflowY: 'auto', 
            p: 1,
          }}
        >
          {chatHistory.map((chat, index) =>
            chat.sender === 'Doctor' ? (
              <Box
                key={index}
                sx={{
                  alignSelf: 'flex-end', 
                  maxWidth: { xs: '85%', sm: '70%' },
                  mb: 2, 
                }}
              >
                <Box
                  sx={{
                    backgroundColor: '#e9eef6',
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: '18px 18px 0 18px', 
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    wordBreak: 'break-word',
                  }}
                >
                  <Typography variant="body1">{chat.text}</Typography>
                </Box>
              </Box>
            ) : (
              <Box
                key={index}
                sx={{
                  alignSelf: 'flex-start', 
                  width: '100%', 
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    color: '#333',
                    lineHeight: 1.6,
                    '& p': { m: 0, mb: 1.5, '&:last-child': { mb: 0 } },
                    '& ul, & ol': { m: 0, mb: 1.5, pl: 3, '&:last-child': { mb: 0 } },
                    '& pre': {
                      m: 0, my: 1.5, p: 2, bgcolor: '#f5f5f5',
                      borderRadius: 1, whiteSpace: 'pre-wrap', fontSize: '0.9em',
                    },
                    '& .section-heading': { mt: 2, mb: 1, color: '#2c3e50', fontWeight: 600 },
                    '& .alert-section': {
                      bgcolor: '#f8d7da', color: '#721c24', p: 2, my: 2,
                      borderRadius: 1, borderLeft: '4px solid #f5c6cb',
                    },
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: formatMessage(chat.text) }} />
                </Box>
              </Box>
            )
          )}
          <div ref={chatEndRef} />
        </Box>
      </Box>
    </Container>
  );
};

export default ChatHistoryPage;
