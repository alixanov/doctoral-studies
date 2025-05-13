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

// Анимациялар
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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Ранглар палитраси
const colors = {
  primaryGradient: 'linear-gradient(135deg, #143654 0%, #1a3c59 100%)',
  secondaryGradient: 'linear-gradient(135deg, #9333EA 0%, #D8B4FE 100%)',
  textPrimary: '#143654',
  textSecondary: '#4B5E6F',
  background: '#F8FAFC',
  cardBg: '#FFFFFF',
  buttonBg: '#9333EA',
  buttonHover: '#A855F7',
  accent: '#9333EA',
};

// Стиллар
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

const FeatureCard = styled(Paper)(({ theme }) => ({
  width: 320,
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

const NewsCard = styled(Paper)(({ theme, index }) => ({
  padding: theme.spacing(3),
  background: colors.cardBg,
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderLeft: `4px solid ${colors.accent}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  animation: `${fadeIn} 0.5s ease forwards`,
  animationDelay: `${index * 0.2}s`,
  opacity: 0,
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

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
  '&.newsButton': {
    background: colors.textPrimary,
    padding: theme.spacing(1, 3),
    fontSize: '0.9rem',
    '&:hover': {
      background: colors.buttonHover,
    },
  },
}));

// Санани форматлаш функцияси
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Янгиликларни генерация килиш
const generateNewsData = () => {
  const today = new Date();
  return [
    {
      id: 1,
      title: '2025 йилда диссертацияларга янги талаблар',
      date: formatDate(today),
      description: 'Минобрнаука 2025 йил учун докторлик диссертацияларини расмийлаштириш талабларини янгилади...',
    },
    {
      id: 2,
      title: 'Докторантлар учун грантлар',
      date: formatDate(new Date(today.setDate(today.getDate() - 2))),
      description: 'Илмий тадкикотлар учун грантлар олиш бўйича танлов эълон килинди...',
    },
    {
      id: 3,
      title: 'Илмий тадкикотлар бўйича конференция',
      date: formatDate(new Date(today.setDate(today.getDate() - 2))),
      description: 'Докторантларни халқаро конференцияга таклиф қиламиз...',
    },
  ];
};

const newsData = generateNewsData();

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isAuthenticated = !!localStorage.getItem('token');

  const features = [
    {
      icon: <SchoolIcon fontSize="medium" />,
      title: 'Докторантура',
      description: 'Докторантурага ҳужжатларни электрон тарзда топшириш',
    },
    {
      icon: <DescriptionIcon fontSize="medium" />,
      title: 'Ҳужжатлар',
      description: 'Ҳужжатларни бошқариш ва кўриб чиқиш',
    },
    {
      icon: <HowToRegIcon fontSize="medium" />,
      title: 'Текшириш',
      description: 'Аризаларнинг очиқ экспертизаси',
    },
    {
      icon: <PeopleIcon fontSize="medium" />,
      title: 'Алоқа',
      description: 'Иштирокчилар ўртасида самарали ўзаро муносабат',
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: colors.background }}>
      {/* Асосий қисм */}
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
            Докторантнинг илмий тадкикот ишларини бахоловчи интеллектуал тизим
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
            Докторантурага ҳужжатларни топшириш ва текшириш учун замонавий ечим
          </Typography>
        </Container>
      </HeroSection>

      {/* Асосий контент */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Тизим ҳақида */}
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
            Тизим ҳақида
          </Typography>
          <Typography
            variant="body2"
            color={colors.textSecondary}
            maxWidth="700px"
            mx="auto"
            sx={{ fontFamily: "'Inter', sans-serif", fontSize: 15 }}
          >
            Платформа докторантлар ва экспертлар ўртасидаги ҳужжатларни топшириш, текшириш ва
            мулоқотни соддалаштиради.
          </Typography>
        </Box>

        {/* Имкониятлар */}
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
            Афзалликлар
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

        {/* Янгиликлар */}
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
            Таълим янгиликлари
          </Typography>
          <Grid container spacing={3}>
            {newsData.map((news, index) => (
              <Grid item xs={12} sm={6} md={4} key={news.id}>
                <NewsCard elevation={0} index={index}>
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
                    {news.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={colors.textSecondary}
                    sx={{ fontFamily: "'Inter', sans-serif", fontSize: 12 }}
                  >
                    {news.date}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={colors.textSecondary}
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      mt: 1,
                      mb: 2,
                    }}
                  >
                    {news.description}
                  </Typography>
                  <StyledButton
                    variant="contained"
                    size="small"
                    className="newsButton"
                    onClick={() => handleNavigate('/details')}
                  >
                    Батафсил
                  </StyledButton>
                </NewsCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Иш тартиби */}
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
            Иш тартиби қандай?
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
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
                1. Рўйхатдан ўтиш
              </Typography>
              <Typography
                variant="body2"
                color={colors.textSecondary}
                sx={{ fontFamily: "'Inter', sans-serif", fontSize: 14 }}
              >
                Дақиқалар ичида аккаунт яратинг
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
                2. Ҳужжатларни топшириш
              </Typography>
              <Typography
                variant="body2"
                color={colors.textSecondary}
                sx={{ fontFamily: "'Inter', sans-serif", fontSize: 14 }}
              >
                Файлларни бир неча клик билан юкланг
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
                3. Текшириш
              </Typography>
              <Typography
                variant="body2"
                color={colors.textSecondary}
                sx={{ fontFamily: "'Inter', sans-serif", fontSize: 14 }}
              >
                Ариза ҳолатини кўриб боринг
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Чорраха */}
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
            Дарҳол бошланг
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
            Ҳужжатлар билан ишлаш учун қулай платформага қўшилинг
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
            {isAuthenticated ? 'Кабинетга' : 'Синаб кўриш'}
          </StyledButton>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;