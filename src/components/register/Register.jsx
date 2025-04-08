import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  TextField,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

// Цветовая схема
const colors = {
  primaryGradient: 'linear-gradient(135deg, #2A6EBB 0%, #1A3C5A 100%)', // Линейный градиент
  accentBlue: '#2A6EBB', // Основной акцент
  darkBlue: '#1A3C5A', // Темный фон текста
  white: '#FFFFFF', // Белый для текста
  hoverGradient: 'linear-gradient(135deg, #3A8DE5 0%, #2A6EBB 100%)', // Ховер эффект
  transparent: 'rgba(255, 255, 255, 0)', // Полная прозрачность
};

// Styled components
const RegisterContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
  },
}));

const FormContainer = styled(Box)(({ theme }) => ({
  background: colors.transparent, // Полная прозрачность
  backdropFilter: 'blur(5px)', // Легкое размытие для эффекта стекла
  borderRadius: 16,
  padding: '40px',
  width: '100%',
  maxWidth: '450px',
  border: `1px solid rgba(255, 255, 255, 0.1)`, // Легкая граница
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
    borderRadius: 12,
  },
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    background: 'rgba(255, 255, 255, 0.1)', // Очень легкий фон для полей
    color: colors.white,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 0.3)',
      boxShadow: `0 0 8px ${colors.accentBlue}50`,
    },
  },
  '& .MuiInputLabel-root': {
    color: colors.white,
    fontFamily: "'Roboto', sans-serif",
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  '& .MuiInputBase-input': {
    color: colors.white, // Белый текст в полях
  },
  marginBottom: '20px',
});

const SubmitButton = styled(Button)({
  background: colors.primaryGradient,
  color: colors.white,
  padding: '12px 0',
  borderRadius: 8,
  textTransform: 'uppercase',
  fontWeight: 600,
  letterSpacing: '1px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: colors.hoverGradient,
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${colors.accentBlue}50`,
  },
});

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Здесь можно добавить логику отправки данных
  };

  return (
    <RegisterContainer>
      <FormContainer>
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 4,
            fontWeight: 700,
            color: colors.white,
            fontFamily: "'Roboto', sans-serif",
            background: colors.primaryGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: isMobile ? '1.75rem' : '2.25rem',
          }}
        >
          Регистрация
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ color: colors.accentBlue, mr: 1 }} />
            <StyledTextField
              fullWidth
              label="Имя и фамилия"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmailIcon sx={{ color: colors.accentBlue, mr: 1 }} />
            <StyledTextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LockIcon sx={{ color: colors.accentBlue, mr: 1 }} />
            <StyledTextField
              fullWidth
              label="Пароль"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
            />
          </Box>

          <SubmitButton fullWidth type="submit">
            Зарегистрироваться
          </SubmitButton>
        </form>

        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 2,
            color: colors.white,
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          Уже есть аккаунт?{' '}
          <a href="#" style={{ color: colors.accentBlue }}>
            Войти
          </a>
        </Typography>
      </FormContainer>
    </RegisterContainer>
  );
};

export default Register;