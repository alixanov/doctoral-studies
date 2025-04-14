import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, TextField, Button, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

// Color scheme
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
    '&.Mui-focused': {
      color: colors.primary,
    },
  },
  marginBottom: 14,
});

const StyledSelect = styled(Select)({
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
  '& .MuiSelect-select': {
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
    color: colors.primary,
  },
});

const RoleBadge = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '2px 8px',
  marginLeft: 8,
  fontSize: 12,
  fontWeight: 600,
  backgroundColor: colors.primary + '20',
  color: colors.primary,
});

const SubmitButton = styled(Button)({
  background: colors.primary,
  color: colors.white,
  padding: '10px 0',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 500,
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
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    login: '',
    password: '',
    role: 'doctoral',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/cabinet');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic form validation
    if (!formData.login || !formData.password) {
      setLoading(false);
      setError('Логин и пароль обязательны');
      return;
    }

    if (!isLoginMode && (!formData.firstName || !formData.lastName)) {
      setLoading(false);
      setError('Имя и фамилия обязательны для регистрации');
      return;
    }

    // Base API URL
    const baseUrl = 'https://doctoral-studies-server.vercel.app';

    if (isLoginMode) {
      try {
        const response = await fetch(`${baseUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            login: formData.login,
            password: formData.password,
            role: formData.role,
          }),
        });

        const result = await response.json();
        setLoading(false);

        if (response.ok) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('userData', JSON.stringify(result.user));

          if (formData.role === 'reviewer') {
            navigate('/reviewer-cabinet');
          } else {
            navigate('/cabinet');
          }
        } else {
          setError(result.error || 'Ошибка авторизации');
        }
      } catch (err) {
        setLoading(false);
        setError('Ошибка сети. Проверьте подключение или попробуйте позже.');
        console.error('Login error:', err);
      }
    } else {
      try {
        const endpoint = formData.role === 'doctoral' ? '/register-doctoral' : '/register-reviewer';

        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            login: formData.login,
            password: formData.password,
          }),
        });

        const result = await response.json();
        setLoading(false);

        if (response.ok) {
          alert('Пользователь успешно зарегистрирован! Теперь войдите.');
          setIsLoginMode(true);
          setFormData({ firstName: '', lastName: '', login: '', password: '', role: formData.role });
        } else {
          setError(result.error || 'Ошибка регистрации');
        }
      } catch (err) {
        setLoading(false);
        setError('Ошибка сети. Проверьте подключение или попробуйте позже.');
        console.error('Registration error:', err);
      }
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'doctoral':
        return 'Докторант';
      case 'reviewer':
        return 'Проверяющий';
      default:
        return role;
    }
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

        {error && (
          <Typography align="center" color={colors.error} sx={{ mb: 2, fontSize: 13 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <>
              <Box display="flex" alignItems="center" mb={1.5}>
                <PersonIcon sx={{ color: colors.textPrimary, mr: 1, fontSize: 26 }} />
                <StyledTextField
                  fullWidth
                  label="Имя"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Box>
              <Box display="flex" alignItems="center" mb={1.5}>
                <PersonIcon sx={{ color: colors.textPrimary, mr: 1, fontSize: 26 }} />
                <StyledTextField
                  fullWidth
                  label="Фамилия"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Box>
            </>
          )}

          <Box display="flex" alignItems="center" mb={1.5}>
            <EmailIcon sx={{ color: colors.textPrimary, mr: 1, fontSize: 26 }} />
            <StyledTextField
              fullWidth
              label="Логин"
              name="login"
              value={formData.login}
              onChange={handleChange}
            />
          </Box>

          <Box display="flex" alignItems="center" mb={1.5}>
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

          <Box display="flex" alignItems="center" mb={1.5}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: colors.textPrimary, fontSize: 14 }}>Роль</InputLabel>
              <StyledSelect
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Роль"
                renderValue={(selected) => (
                  <Box display="flex" alignItems="center">
                    {getRoleLabel(selected)}
                    <RoleBadge>{selected}</RoleBadge>
                  </Box>
                )}
              >
                <MenuItem value="doctoral">
                  <Box display="flex" alignItems="center">
                    Докторант
                    <RoleBadge sx={{ ml: 1 }}>doctoral</RoleBadge>
                  </Box>
                </MenuItem>
                <MenuItem value="reviewer">
                  <Box display="flex" alignItems="center">
                    Проверяющий
                    <RoleBadge sx={{ ml: 1 }}>reviewer</RoleBadge>
                  </Box>
                </MenuItem>
              </StyledSelect>
            </FormControl>
          </Box>

          <SubmitButton fullWidth type="submit" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : isLoginMode ? 'Войти' : 'Зарегистрироваться'}
          </SubmitButton>
        </form>

        <Typography align="center" mt={2} color={colors.textPrimary} sx={{ fontSize: 13 }}>
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