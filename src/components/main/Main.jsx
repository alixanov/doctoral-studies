import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PeopleIcon from '@mui/icons-material/People';
import { keyframes } from '@emotion/react';

// Анимация для баннера
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Цветовая палитра
const colors = {
  primaryGradient: 'linear-gradient(135deg, rgb(14, 49, 80) 0%, #1a3c59 100%)',
  secondaryGradient: 'linear-gradient(135deg, #9333EA 0%, #D8B4FE 100%)',
  textPrimary: '#1A3C59',
  textSecondary: '#4B5E6F',
  background: '#F8FAFC',
  cardBg: '#FFFFFF',
  buttonBg: '#9333EA',
  buttonHover: '#A855F7',
  accent: '#9333EA',
};

// Стили для герой-секции
const HeroSection = styled(Box)(({ theme }) => ({
  background: colors.primaryGradient,
  color: '#FFFFFF',
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  borderRadius: 10,
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  animation: `${slideIn} 0.8s ease forwards`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 0),
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1), transparent 50%)',
    opacity: 0.5,
  },
}));

// Стили для карточек функций
const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: colors.cardBg,
  borderRadius: 10,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
  },
}));

// Стили для иконок функций
const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: '12px',
  background: colors.secondaryGradient,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  color: '#FFFFFF',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

// Стили для кнопок
const StyledButton = styled(Button)(({ theme }) => ({
  background: colors.buttonBg,
  color: '#FFFFFF',
  borderRadius: 8,
  padding: theme.spacing(1.5, 4),
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  textTransform: 'none',
  transition: 'background 0.3s ease, transform 0.2s ease',
  '&:hover': {
    background: colors.buttonHover,
    transform: 'translateY(-2px)',
  },
  '&.outlined': {
    background: 'transparent',
    color: '#FFFFFF',
    border: `1px solid #FFFFFF`,
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.15)',
      transform: 'translateY(-2px)',
    },
  },
}));

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isAuthenticated = !!localStorage.getItem('token');

  const features = [
    {
      icon: <SchoolIcon fontSize="medium" />,
      title: 'Докторантура',
      description: 'Электронная подача документов для поступления',
    },
    {
      icon: <DescriptionIcon fontSize="medium" />,
      title: 'Документы',
      description: 'Управление и отслеживание документов',
    },
    {
      icon: <HowToRegIcon fontSize="medium" />,
      title: 'Проверка',
      description: 'Прозрачная экспертиза заявок',
    },
    {
      icon: <PeopleIcon fontSize="medium" />,
      title: 'Коммуникация',
      description: 'Эффективное взаимодействие участников',
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: colors.background }}>
      {/* Герой-секция */}
      <HeroSection>
        <Container maxWidth="md">
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            component="h1"
            gutterBottom
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}
          >
            Система для докторантуры
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              mb: 4,
              fontFamily: "'Inter', sans-serif",
              maxWidth: '700px',
              mx: 'auto',
              fontSize: { xs: 16, sm: 18 },
            }}
          >
            Современное решение для подачи и проверки документов в докторантуру
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {!isAuthenticated ? (
              <>
                <StyledButton
                  variant="contained"
                  size="large"
                  onClick={() => handleNavigate('/doctoral-register')}
                >
                  Начать
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  size="large"
                  className="outlined"
                  onClick={() => handleNavigate('/login')}
                >
                  Войти
                </StyledButton>
              </>
            ) : (
              <StyledButton
                variant="contained"
                size="large"
                onClick={() => {
                  const userData = JSON.parse(localStorage.getItem('userData'));
                  handleNavigate(userData.role === 'reviewer' ? '/reviewer-cabinet' : '/cabinet');
                }}
              >
                В кабинет
              </StyledButton>
            )}
          </Box>
        </Container>
      </HeroSection>

      {/* Основной контент */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* О системе */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: colors.textPrimary,
            }}
          >
            О системе
          </Typography>
          <Typography
            variant="body2"
            color={colors.textSecondary}
            maxWidth="700px"
            mx="auto"
            sx={{ fontFamily: "'Inter', sans-serif", fontSize: 15 }}
          >
            Платформа упрощает подачу документов, их проверку и коммуникацию между докторантами и экспертами.
          </Typography>
        </Box>

        {/* Особенности */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 4,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: colors.textPrimary,
            }}
          >
            Преимущества
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard elevation={0}>
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <Typography
                    variant="subtitle1"
                    component="h4"
                    gutterBottom
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      color: colors.textPrimary,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={colors.textSecondary}
                    sx={{ fontFamily: "'Inter', sans-serif", fontSize: 14 }}
                  >
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Как это работает */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: colors.textPrimary,
            }}
          >
            Как это работает?
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Typography
                variant="subtitle1"
                component="h4"
                gutterBottom
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  color: colors.textPrimary,
                }}
              >
                1. Регистрация
              </Typography>
              <Typography
                variant="body2"
                color={colors.textSecondary}
                sx={{ fontFamily: "'Inter', sans-serif", fontSize: 14 }}
              >
                Создайте аккаунт за минуту
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                variant="subtitle1"
                component="h4"
                gutterBottom
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  color: colors.textPrimary,
                }}
              >
                2. Подача документов
              </Typography>
              <Typography
                variant="body2"
                color={colors.textSecondary}
                sx={{ fontFamily: "'Inter', sans-serif", fontSize: 14 }}
              >
                Загрузите файлы в пару кликов
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                variant="subtitle1"
                component="h4"
                gutterBottom
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  color: colors.textPrimary,
                }}
              >
                3. Проверка
              </Typography>
              <Typography
                variant="body2"
                color={colors.textSecondary}
                sx={{ fontFamily: "'Inter', sans-serif", fontSize: 14 }}
              >
                Следите за статусом заявки
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Призыв к действию */}
        <Box
          sx={{
            background: colors.cardBg,
            borderRadius: 10,
            padding: theme.spacing(4),
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: colors.textPrimary,
            }}
          >
            Начните прямо сейчас
          </Typography>
          <Typography
            variant="body2"
            color={colors.textSecondary}
            sx={{
              mb: 3,
              maxWidth: '600px',
              mx: 'auto',
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
            }}
          >
            Присоединяйтесь к платформе для удобной работы с документами
          </Typography>
          <StyledButton
            variant="contained"
            size="large"
            onClick={() =>
              handleNavigate(
                isAuthenticated
                  ? JSON.parse(localStorage.getItem('userData')).role === 'reviewer'
                    ? '/reviewer-cabinet'
                    : '/cabinet'
                  : '/doctoral-register'
              )
            }
          >
            {isAuthenticated ? 'В кабинет' : 'Попробовать'}
          </StyledButton>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;