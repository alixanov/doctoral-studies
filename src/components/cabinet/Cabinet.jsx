import React, { useEffect, useState } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import './cabinet.css';
// Import MUI icons
import SecurityIcon from '@mui/icons-material/Security';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';

// Определение анимаций с помощью keyframes
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(170, 30, 30, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(170, 30, 30, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(170, 30, 30, 0); }
`;

const glow = keyframes`
  0% { text-shadow: 0 0 5px rgba(170, 30, 30, 0.5); }
  50% { text-shadow: 0 0 15px rgba(170, 30, 30, 0.8), 0 0 25px rgba(170, 30, 30, 0.5); }
  100% { text-shadow: 0 0 5px rgba(170, 30, 30, 0.5); }
`;

// Updated color palette to match the screenshot
const colors = {
  primary: '#aa1e1e', // Dark red color from the register button
  secondary: '#c68c53', // Orange-brown from "REGISTRATION" text
  darkGray: 'rgba(32, 32, 32, 0.8)',
  darkGrayHover: 'rgba(42, 42, 42, 0.9)',
  hoverPrimary: '#c52626',
  black: '#1C1C1C',
  textLight: '#c68c53',
};

// Стилизованные компоненты
const CabinetContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.textLight,
  padding: '0px',
  animation: `${fadeIn} 1s ease-out`,
  backgroundSize: 'cover',
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
    marginTop: -40,
  },
}));

const ProfileBox = styled(Box)({
  maxWidth: '1000px',
  width: '100%',
  margin: '0 auto',
  opacity: 0,
  animation: `${fadeIn} 1.2s ease-out forwards`,
  animationDelay: '0.3s',
});

const InfoSection = styled(Box)({
  marginBottom: '20px',
  padding: '15px',
  backgroundColor: colors.darkGray,
  borderLeft: `4px solid ${colors.primary}`,
  transition: 'all 0.3s ease',
  opacity: 0,
  animation: `${fadeIn} 0.8s ease-out forwards`,
  display: 'flex',
  alignItems: 'center',
  '&:nth-of-type(1)': { animationDelay: '0.5s' },
  '&:nth-of-type(2)': { animationDelay: '0.6s' },
  '&:nth-of-type(3)': { animationDelay: '0.7s' },
  '&:nth-of-type(4)': { animationDelay: '0.8s' },
  '&:nth-of-type(5)': { animationDelay: '0.9s' },
  '&:hover': {
    transform: 'translateX(5px)',
    backgroundColor: colors.darkGrayHover,
    boxShadow: `0 0 15px rgba(170, 30, 30, 0.3)`,
  },
});

const IconWrapper = styled(Box)({
  marginRight: '15px',
  color: colors.secondary,
});

const LogoutButton = styled(Button)({
  marginTop: '20px',
  padding: '12px 30px',
  backgroundColor: 'transparent',
  color: colors.primary,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  border: `2px solid ${colors.primary}`,
  borderRadius: '0px', // Прямые углы для милитари-стиля
  transition: 'all 0.3s ease',
  opacity: 0,
  animation: `${fadeIn} 1s ease-out forwards`, // Плавное появление вместо пульсации
  animationDelay: '1s',
  '&:hover': {
    backgroundColor: colors.primary,
    color: colors.black,
    transform: 'translateY(-3px)',
    boxShadow: `0 5px 15px rgba(170, 30, 30, 0.5)`,
  },
});

const Cabinet = ({ setIsAuthenticated }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData) {
      setUserData(storedData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    navigate('/register');
  };

  if (!userData) {
    return (
      <CabinetContainer>
        <Typography
          variant="h4"
          sx={{
            color: colors.primary,
            textShadow: `0 0 10px rgba(170, 30, 30, 0.5)`,
            letterSpacing: '3px',
            animation: `${glow} 3s infinite`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LockIcon sx={{ mr: 2, fontSize: '2rem' }} /> ACCESS DENIED
        </Typography>
      </CabinetContainer>
    );
  }

  const formatDateToDogTag = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}◆${month}◆${year}`;
  };

  const formattedDate = formatDateToDogTag(userData.birthDate);

  return (
    <CabinetContainer>
      <Typography
        variant="h3"
        sx={{
          color: colors.secondary,
          marginBottom: '40px',
          textTransform: 'uppercase',
          letterSpacing: '5px',
          fontWeight: 'bold',
          animation: `${glow} 3s infinite`,
        }}
      >
        Classified
      </Typography>

      <ProfileBox className="profile-container">
        <InfoSection>
          <IconWrapper>
            <SecurityIcon fontSize="medium" />
          </IconWrapper>
          <Typography className="service-number">
            SERVICE NUMBER: {userData.id}
          </Typography>
        </InfoSection>

        <InfoSection>
          <IconWrapper>
            <MilitaryTechIcon fontSize="medium" />
          </IconWrapper>
          <Typography className="rank-badge">
            {userData.rank || 'PRIVATE'}
          </Typography>
        </InfoSection>

        <InfoSection>
          <IconWrapper>
            <PersonIcon fontSize="medium" />
          </IconWrapper>
          <Typography sx={{ fontSize: '1.2rem', letterSpacing: '2px' }}>
            {userData.username}
          </Typography>
        </InfoSection>

        <InfoSection>
          <IconWrapper>
            <CalendarTodayIcon fontSize="medium" />
          </IconWrapper>
          <Typography className="military-date">{formattedDate}</Typography>
        </InfoSection>

        <InfoSection>
          <IconWrapper>
            <RadioButtonCheckedIcon fontSize="medium" />
          </IconWrapper>
          <Typography
            sx={{
              color: colors.secondary,
              opacity: 0.8,
              fontStyle: 'italic',
              letterSpacing: '1px',
            }}
          >
            STATUS: ACTIVE
          </Typography>
        </InfoSection>

        <LogoutButton onClick={handleLogout} startIcon={<LogoutIcon />}>
          LOGOUT
        </LogoutButton>
      </ProfileBox>
    </CabinetContainer>
  );
};

export default Cabinet;