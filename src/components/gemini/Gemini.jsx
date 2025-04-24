import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import { format, parseISO } from 'date-fns';
import { uz } from 'date-fns/locale';

// Ранглар палитраси
const colors = {
  primary: '#173957',
  secondary: '#F5F7FA',
  accent: '#4CAF50',
  error: '#EF4444',
  text: '#37474F',
  lightText: '#78909C',
  background: '#FFFFFF',
  userMessage: '#E3F2FD',
  assistantMessage: '#F1F8E9',
};

// Стилланган компонентлар
const ChatContainer = styled(Box)(({ theme }) => ({
  maxWidth: "100%",
  margin: 'auto',
  height: 'calc(100vh - 64px)',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: colors.secondary,
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    height: 'calc(100vh - 32px)',
    borderRadius: 0,
  },
}));

const MessageList = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundColor: colors.background,
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${colors.lightText}`,
  backgroundColor: colors.secondary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: colors.background,
    '& fieldset': {
      borderColor: colors.lightText,
    },
    '&:hover fieldset': {
      borderColor: colors.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.primary,
    },
  },
  '& .MuiInputBase-input': {
    fontSize: 14,
    padding: theme.spacing(1.5),
  },
}));

const SendButton = styled(Button)(({ theme }) => ({
  backgroundColor: colors.primary,
  color: '#FFFFFF',
  borderRadius: 8,
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#0D47A1',
  },
  '&:disabled': {
    backgroundColor: colors.lightText,
    color: '#FFFFFF',
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 48,
    padding: theme.spacing(1),
  },
}));

// Намуна хабарлар
const fakeMessages = [
  {
    id: 1,
    role: 'user',
    content: 'Салом! Космос хақида нима дейола оласан?',
    timestamp: '2025-04-22T10:00:00Z',
  },
  {
    id: 2,
    role: 'assistant',
    content: 'Космос - бу юлдузлар, галактикалар ва сирлар билан тўл чексиз фазо! Қора дўликлар ёки Марсга сафарлар хақида билмокчимисан?',
    timestamp: '2025-04-22T10:01:00Z',
  },
  {
    id: 3,
    role: 'user',
    content: 'Қора дўликлар хақида айтиб бер.',
    timestamp: '2025-04-22T10:02:00Z',
  },
  {
    id: 4,
    role: 'assistant',
    content: 'Қора дўликлар - бу гравитация жуда кучли бўлиб, ҳатто нур хам қочиб қутула олмайдиган фазо минтақалари. Улар ўз массаси остида қулайдиган юлдузлардан ҳосил бўлади. Қизиқарли факт: уларнинг воқеа уфуқи - қайтиб бўлмайдиган нуқта!',
    timestamp: '2025-04-22T10:03:00Z',
  },
];

// Gemini компоненти
const Gemini = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [messages, setMessages] = useState(fakeMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messageListRef = useRef(null);

  // Охирги хабарга ўтиш
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Вақтни форматлаш
  const formatTimestamp = (timestamp) => {
    try {
      const date = parseISO(timestamp);
      return format(date, 'HH:mm, dd MMMM yyyy', { locale: uz });
    } catch (error) {
      return 'Вақт хатоси';
    }
  };

  // Хабар жўнатиш
  const handleSend = () => {
    if (!input.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newUserMessage]);
    setInput('');
    setLoading(true);

    // Бот жавобини симуляция қилиш
    setTimeout(() => {
      const fakeResponse = {
        id: messages.length + 2,
        role: 'assistant',
        content: `Бу сизнинг "${input}" саволингизга жавобим. Мен ҳозирча ишлашни симуляция қиляпман, лекин қизиқарли нарсалар айтиб бера оламан! 😊 Кўпроқ билмокчимисиз?`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fakeResponse]);
      setLoading(false);
    }, 1000);
  };

  // Enter босишни қайта ишлаш
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatContainer>
      {/* Сарлавҳа */}
      <Box
        sx={{
          padding: theme.spacing(2),
          backgroundColor: colors.primary,
          color: '#FFFFFF',
          textAlign: 'center',
          borderBottom: `1px solid ${colors.lightText}`,
        }}
      >
        <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={600}>
          Gemini Чат
        </Typography>
      </Box>

      {/* Хабарлар рўйхати */}
      <MessageList ref={messageListRef}>
        <List>
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                  padding: theme.spacing(1, 2),
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    backgroundColor:
                      message.role === 'user' ? colors.userMessage : colors.assistantMessage,
                    borderRadius: 8,
                    padding: theme.spacing(1.5),
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <ListItemAvatar
                    sx={{
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                      minWidth: 0,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: message.role === 'user' ? colors.primary : colors.accent,
                      }}
                    >
                      {message.role === 'user' ? 'М' : 'G'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{ fontSize: isMobile ? 14 : 16, color: colors.text }}
                      >
                        {message.content}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{ color: colors.lightText, fontSize: isMobile ? 12 : 13 }}
                      >
                        {formatTimestamp(message.timestamp)}
                      </Typography>
                    }
                    sx={{
                      textAlign: message.role === 'user' ? 'right' : 'left',
                      margin: 0,
                    }}
                  />
                </Box>
              </ListItem>
              <Divider sx={{ margin: theme.spacing(1, 2) }} />
            </React.Fragment>
          ))}
          {loading && (
            <ListItem sx={{ justifyContent: 'center' }}>
              <CircularProgress size={24} sx={{ color: colors.primary }} />
            </ListItem>
          )}
        </List>
      </MessageList>

      {/* Кириш майдони */}
      <InputContainer>
        <StyledTextField
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Хабарингизни ёзинг..."
          variant="outlined"
          disabled={loading}
        />
        <SendButton
          onClick={handleSend}
          disabled={loading || !input.trim()}
          startIcon={isMobile ? null : <SendIcon />}
        >
          {isMobile ? <SendIcon /> : 'Жўнатиш'}
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Gemini;