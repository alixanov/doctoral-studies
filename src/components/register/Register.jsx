import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Импортируем для перенаправления
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

// Цветовая схема
const colors = {
  primary: '#1A3C59',
  secondary: '#F5F6F5',
  textPrimary: '#1A3C5A',
  white: '#FFFFFF',
  error: '#EF4444',
  hover: '#2A4A6B',
  rowBackground: 'linear-gradient(90deg, #F9FAFB 0%, #F1F5F9 100%)',
};

// Styled components
const FormContainer = styled(Box)({
  width: '100%',
  background: colors.rowBackground,
  borderRadius: 12,
  padding: 28,
  maxWidth: 380,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 6,
    background: '#F9FAFB',
    color: colors.textPrimary,
    fontSize: 14,
    height: 46,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.primary,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.hover,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.primary,
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    '&.Mui-focused': {
      color: colors.primary,
    },
  },
  marginBottom: 14,
});

const SubmitButton = styled(Button)({
  background: colors.primary,
  color: colors.white,
  padding: '10px 0',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 500,
  fontFamily: "'Inter', sans-serif",
  transition: 'all 0.3s ease',
  '&:hover': {
    background: colors.hover,
    transform: 'translateY(-1px)',
  },
  '&:disabled': {
    background: '#6B7280',
    color: colors.white,
  },
});

const Register = () => {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Для перенаправления

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (isLoginMode) {
        // Сохраняем токен и данные пользователя после авторизации
        const token = 'mock-token-12345'; // Замените на реальный токен с бэкенда
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify({ name: formData.name, email: formData.email }));
        navigate('/cabinet'); // Перенаправляем на личный кабинет
      } else {
        console.log('Регистрация', formData);
      }
    }, 1000);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor={colors.secondary}>
      <FormContainer>
        <Typography
          variant="h5"
          align="center"
          fontWeight={600}
          color={colors.textPrimary}
          sx={{ mb: 2.5, fontSize: 20 }}
        >
          {isLoginMode ? 'Авторизация' : 'Регистрация'}
        </Typography>

        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <Box display="flex" alignItems="center" mb={1.5}>
              <PersonIcon sx={{ color: colors.textPrimary, mr: 1, fontSize: 26 }} />
              <StyledTextField
                fullWidth
                label="Имя и фамилия"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Box>
          )}

          <Box display="flex" alignItems="center" mb={1.5}>
            <EmailIcon sx={{ color: colors.textPrimary, mr: 1, fontSize: 26 }} />
            <StyledTextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <LockIcon sx={{ color: colors.textPrimary, mr: 1, fontSize: 26 }} />
            <StyledTextField
              fullWidth
              label="Пароль"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Box>

          <SubmitButton fullWidth type="submit" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : isLoginMode ? 'Войти' : 'Зарегистрироваться'}
          </SubmitButton>
        </form>

        <Typography
          align="center"
          mt={2}
          color={colors.textPrimary}
          sx={{ fontSize: 13 }}
        >
          {isLoginMode ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <Typography
            component="span"
            color={colors.primary}
            sx={{
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline', color: colors.hover },
            }}
            onClick={() => setIsLoginMode(!isLoginMode)}
          >
            {isLoginMode ? 'Зарегистрироваться' : 'Войти'}
          </Typography>
        </Typography>
      </FormContainer>
    </Box>
  );
};

export default Register;