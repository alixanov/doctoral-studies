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
import { ru } from 'date-fns/locale';

// Цветовая палитра, совместимая с предыдущими компонентами
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

// Стилизованные компоненты
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

// Фейковые данные
const fakeMessages = [
  {
    id: 1,
    role: 'user',
    content: 'Привет! Что ты можешь рассказать о космосе?',
    timestamp: '2025-04-22T10:00:00Z',
  },
  {
    id: 2,
    role: 'assistant',
    content: 'Космос — это бесконечное пространство, полное звезд, галактик и загадок! Хочешь узнать о черных дырах или о миссиях на Марс?',
    timestamp: '2025-04-22T10:01:00Z',
  },
  {
    id: 3,
    role: 'user',
    content: 'Расскажи про черные дыры.',
    timestamp: '2025-04-22T10:02:00Z',
  },
  {
    id: 4,
    role: 'assistant',
    content: 'Черные дыры — это области пространства, где гравитация настолько сильна, что даже свет не может вырваться. Они образуются из массивных звезд, которые коллапсируют под собственной массой. Интересный факт: их горизонт событий — точка невозврата!',
    timestamp: '2025-04-22T10:03:00Z',
  },
];

// Компонент Gemini
const Gemini = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [messages, setMessages] = useState(fakeMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messageListRef = useRef(null);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Форматирование времени
  const formatTimestamp = (timestamp) => {
    try {
      const date = parseISO(timestamp);
      return format(date, 'HH:mm, dd MMMM yyyy', { locale: ru });
    } catch (error) {
      return 'Ошибка времени';
    }
  };

  // Отправка сообщения
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

    // Имитация ответа бота (фейковый ответ)
    setTimeout(() => {
      const fakeResponse = {
        id: messages.length + 2,
        role: 'assistant',
        content: `Это мой ответ на твой вопрос: "${input}". Я пока только имитирую работу, но могу ответить что-то интересное! 😊 Хочешь узнать больше?`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fakeResponse]);
      setLoading(false);
    }, 1000);
  };

  // Обработка нажатия Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatContainer>
      {/* Заголовок */}
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

      {/* Список сообщений */}
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
                      {message.role === 'user' ? 'Я' : 'G'}
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

      {/* Поле ввода */}
      <InputContainer>
        <StyledTextField
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Напишите ваше сообщение..."
          variant="outlined"
          disabled={loading}
        />
        <SendButton
          onClick={handleSend}
          disabled={loading || !input.trim()}
          startIcon={isMobile ? null : <SendIcon />}
        >
          {isMobile ? <SendIcon /> : 'Отправить'}
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Gemini;