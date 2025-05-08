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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { keyframes } from '@emotion/react';
import work from '../../assets/21f3eb966f759c7783373edda03170f9.jpg';
import study from '../../assets/875f6084113d652d17c0be0281e92904.jpg';
import univer from '../../assets/a198bd6db0ae65ffe1141629a0476951.jpg';

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

const StepCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: colors.cardBg,
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderLeft: `4px solid ${colors.accent}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  animation: `${fadeIn} 0.5s ease forwards`,
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)',
  },
}));

const StepImage = styled('img')(({ theme }) => ({
  width: '40%',
  height: 'auto',
  borderRadius: 8,
  objectFit: 'cover',
  maxHeight: 200,
  marginRight: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    maxHeight: 150,
    marginRight: 0,
    marginBottom: theme.spacing(2),
  },
}));

const StepContent = styled(Box)(({ theme }) => ({
  width: '60%',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center',
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '10px',
  background: colors.secondaryGradient,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(1.5),
  color: '#FFFFFF',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: 'auto',
    marginRight: 'auto',
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
  '&.backButton': {
    background: 'transparent',
    color: colors.textPrimary,
    border: `1px solid ${colors.textPrimary}`,
    padding: theme.spacing(1, 3),
    '&:hover': {
      background: 'rgba(20, 54, 84, 0.1)',
    },
  },
}));

const Details = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isAuthenticated = !!localStorage.getItem('token');

  const steps = [
    {
      title: '1. Рўйхатдан ўтиш',
      description:
        'Платформада рўйхатдан ўтиш учун сизга фақат электрон почта манзили ва парол керак. Рўйхатдан ўтиш жараёни оддий ва тезкор бўлиб, бир неча дақиқа вақт олади. Рўйхатдан ўтганингиздан сўнг, сизга шахсий кабинет тақдим этилади, унда барча керакли функциялар мавжуд. Агар сизда аллақачон аккаунт бўлса, тизимга киришингиз мумкин.',
      icon: <SchoolIcon fontSize="medium" />,
      image: univer,
      alt: 'Университетда рўйхатдан ўтиш жараёни',
    },
    {
      title: '2. Ҳужжатларни топшириш',
      description:
        'Шахсий кабинeтингизда докторлик диссертациясига тегишли ҳужжатларни юклаш имконияти мавжуд. Юкланадиган ҳужжатларга диссертация, автореферат, илмий мақолалар ва бошқа зарур материаллар киради. Файлларни PDF ёки бошқа қабул қилинадиган форматда юклашингиз мумкин. Юклашдан олдин ҳужжатларнинг тўлиқлигини текшириб чиқинг.',
      icon: <DescriptionIcon fontSize="medium" />,
      image: study,
      alt: 'Ҳужжатларни юклаш жараёни',
    },
    {
      title: '3. Текшириш',
      description:
        'Ҳужжатлар юкланганидан сўнг, улар экспертлар томонидан кўриб чиқилади. Сиз шахсий кабинetingизda аризангизнинг ҳолатини реал вақтда кузатишингиз мумкин. Текшириш жараёни очиқ ва шаффоф бўлиб, сизга ҳар бир босқичда хабарномалар юборилади. Агар қўшимча маълумот талаб қилинса, сизга хабар берилади.',
      icon: <HowToRegIcon fontSize="medium" />,
      image: work,
      alt: 'Ариза ҳолатини текшириш жараёни',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: colors.background }}>
      {/* Hero Section */}
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
            Докторантурага қабул қилиш жараёни
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
            Рўйхатдан ўтиш, ҳужжатларни топшириш ва ариза ҳолатини кузатиш бўйича батафсил йўриқнома
          </Typography>
       
        </Container>
      </HeroSection>

      {/* Основной контент */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Заголовок */}
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
            Иш тартибининг батафсил тавсифи
          </Typography>
          <Typography
            variant="body2"
            color={colors.textSecondary}
            maxWidth="700px"
            mx="auto"
            sx={{ fontFamily: "'Inter', sans-serif", fontSize: 15 }}
          >
            Ушбу бўлимда докторантурага қабул қилиш жараёнининг ҳар бир босқичи ҳақида тўлиқ маълумот берилган.
          </Typography>
        </Box>

        {/* Шаги */}
        <Grid container spacing={3}>
          {steps.map((step, index) => (
            <Grid item xs={12} key={index}>
              <StepCard elevation={0} style={{ animationDelay: `${index * 0.2}s` }}>
                <StepImage src={step.image} alt={step.alt} />
                <StepContent>
                  <FeatureIcon>{step.icon}</FeatureIcon>
                  <Typography
                    variant="subtitle1"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      color: colors.textPrimary,
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={colors.textSecondary}
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                    }}
                  >
                    {step.description}
                  </Typography>
                </StepContent>
              </StepCard>
            </Grid>
          ))}
        </Grid>

        {/* Призыв к действию */}
        <Box
          sx={{
            mt: 5,
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
            Энди бошланг
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
            Докторантурага қабул жараёнини бошлаш учун платформага қўшилинг
          </Typography>
          <StyledButton
            variant="contained"
            size="large"
            onClick={() =>
              navigate(
                isAuthenticated
                  ? JSON.parse(localStorage.getItem('userData')).role === 'reviewer'
                    ? '/reviewer-cabinet'
                    : '/cabinet'
                  : '/doctoral-register'
              )
            }
          >
            {isAuthenticated ? 'Кабинетга' : 'Рўйхатдан ўтиш'}
          </StyledButton>
        </Box>
      </Container>
    </Box>
  );
};

export default Details;