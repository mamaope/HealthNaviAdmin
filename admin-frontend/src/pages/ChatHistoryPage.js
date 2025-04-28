import React, { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, useMediaQuery, useTheme } from '@mui/material';
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
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
        Chat History {diagnosis_id}
      </Typography>

      <Card className="chat-container" sx={{ mb: isMobile ? 2 : 0 }}>
        <CardContent sx={{ p: isMobile ? 1 : 2 }}>
          <Box className="chat-box">
            {chatHistory.map((chat, index) => (
              chat.sender === "Doctor" ? (
                <Box key={index} className="chat-message-container doctor-message-container">
                  <Box className="doctor-bubble">
                    <Typography variant="body1">{chat.text}</Typography>
                  </Box>
                </Box>
              ) : (
                <Box key={index} className="chat-message-container model-message-container">
                  <Box className="model-response">
                    <div dangerouslySetInnerHTML={{ __html: formatMessage(chat.text) }} />
                  </Box>
                </Box>
              )
            ))}
            <div ref={chatEndRef} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChatHistoryPage;
