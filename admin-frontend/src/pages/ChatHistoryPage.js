import React, { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { formatMessage } from '../utils/messageFormatter'; 

const ChatHistoryPage = () => {
  const location = useLocation();
  const { diagnosis_id } = useParams();
  const chatEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const chatHistory = location.state?.chatHistory || [];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
        Chat History {diagnosis_id}
      </Typography>

      <Card sx={{ mb: { xs: 2, sm: 0 } }}>
        <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
          <Box
            className="chat-box"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5, 
              overflowY: 'auto',
              padding: 1.5, 
              borderRadius: 2, 
              backgroundColor: '#f8f9fa',
              width: '100%',
              height: {
                xs: 'calc(100vh - 200px)', 
                sm: 'calc(100vh - 250px)',
              },
              '& > *': {
                flexShrink: 0,
              },
            }}
          >
            {chatHistory.map((chat, index) =>
              chat.sender === 'Doctor' ? (
                <Box
                  key={index}
                  className="chat-message-container doctor-message-container"
                  sx={{
                    alignSelf: 'flex-end',
                    maxWidth: { xs: '90%', sm: '80%' }, 
                  }}
                >
                  <Box
                    className="doctor-bubble"
                    sx={{
                      backgroundColor: '#e9eef6',
                      padding: { xs: 1, sm: 1.5 }, 
                      borderRadius: '18px 18px 0 18px',
                      boxShadow: 1,
                      marginLeft: 'auto',
                      maxWidth: '100%',
                      wordBreak: 'break-word',
                    }}
                  >
                    <Typography variant="body1">{chat.text}</Typography>
                  </Box>
                </Box>
              ) : (
                <Box
                  key={index}
                  className="chat-message-container model-message-container"
                  sx={{
                    alignSelf: 'flex-start',
                    width: '100%',
                    marginBottom: 2, 
                  }}
                >
                  <Box
                    className="model-response"
                    sx={{
                      padding: { xs: 1.5, sm: 2 }, 
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: 'transparent',
                      color: '#333',
                      wordWrap: 'break-word',
                      lineHeight: 1.5,
                      '& p, & ul, & ol, & pre': {
                        wordBreak: 'break-word', 
                        overflowX: 'auto', 
                      },
                      '& pre': {
                         whiteSpace: 'pre-wrap',
                      }
                    }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: formatMessage(chat.text) }} />
                  </Box>
                </Box>
              ),
            )}
            <div ref={chatEndRef} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChatHistoryPage;
