import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LanguageIcon from '@mui/icons-material/Language';
import LogoutIcon from '@mui/icons-material/Logout';

const colors = {
  primaryGradient: 'linear-gradient(135deg, rgb(14, 49, 80) 0%, #1a3c59 100%)',
  secondaryGradient: 'linear-gradient(135deg, #9333EA 0%, #D8B4FE 100%)',
  textPrimary: '#FFFFFF',
  textSecondary: '#D1D5DB',
  activeBg: 'rgba(255, 255, 255, 0.15)',
  hoverBg: 'rgba(255, 255, 255, 0.1)',
  error: '#EF4444',
};

// Стили для боковой панели (десктоп)
const NavbarContainer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 240,
    height: '100vh',
    background: colors.primaryGradient,
    borderRight: 'none',
    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
    transition: theme.transitions.create(['box-shadow'], {
      duration: theme.transitions.duration.standard,
    }),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

const FooterContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  background: colors.primaryGradient,
  padding: '10px 0',
  boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.15)',
  zIndex: 1300,
  display: 'flex',
  justifyContent: 'center',
}));

const LogoContainer = styled(Box)({
  padding: '30px 20px',
  textAlign: 'center',
  borderBottom: `1px solid ${colors.hoverBg}`,
});

const LogoText = styled(Typography)({
  color: colors.textPrimary,
  fontSize: 24,
  fontWeight: 700,
  letterSpacing: '0.5px',
});

const NavItems = styled(Box)(({ isMobile }) => ({
  display: 'flex',
  flexDirection: isMobile ? 'row' : 'column',
  gap: isMobile ? 30 : 10,
  padding: isMobile ? '0 20px' : '20px 15px',
  justifyContent: isMobile ? 'center' : 'flex-start',
  alignItems: 'center',
  width: '100%',
}));

const NavItem = styled(Link)(({ theme, active, isMobile }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: isMobile ? 'center' : 'flex-start',
  gap: 10,
  textDecoration: 'none',
  color: active ? colors.textPrimary : colors.textSecondary,
  padding: isMobile ? 12 : '12px 20px',
  borderRadius: 10,
  fontSize: isMobile ? 14 : 16,
  fontWeight: active ? 600 : 500,
  background: active ? colors.activeBg : 'transparent',
  transition: theme.transitions.create(['background', 'color', 'transform'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    background: colors.hoverBg,
    color: colors.textPrimary,
    transform: isMobile ? 'scale(1.05)' : 'translateX(5px)',
  },
}));

const ActionButton = styled(Box)(({ theme, isMobile, isLogout }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: isMobile ? 'center' : 'flex-start',
  gap: 10,
  padding: isMobile ? 12 : '12px 20px',
  borderRadius: 10,
  color: isLogout ? colors.error : colors.textSecondary,
  background: 'transparent',
  transition: theme.transitions.create(['background', 'color', 'transform'], {
    duration: theme.transitions.duration.short,
  }),
  cursor: 'pointer',
  '&:hover': {
    background: colors.hoverBg,
    color: isLogout ? '#D32F2F' : colors.textPrimary,
    transform: isMobile ? 'scale(1.05)' : 'translateX(5px)',
  },
}));

const Navbar = ({ isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('uz');

  const isAuthenticated = !!localStorage.getItem('token');

  const linkTranslations = {
    uz: {
      authenticated: [
        { to: '/', label: 'Asosiy', icon: HomeFilledIcon, active: location.pathname === '/' },
        { to: '/cabinet', label: 'Shaxsiy Kabinet', icon: AccountBoxIcon, active: location.pathname === '/cabinet' },
      ],
      unauthenticated: [
        { to: '/', label: 'Asosiy', icon: HomeFilledIcon, active: location.pathname === '/' },
        { to: '/doctoral-register', label: "Ro‘yxatdan o‘tish", icon: AccountBoxIcon, active: location.pathname === '/doctoral-register' },
      ],
      logout: 'Chiqish',
      language: "O‘zbek",
    },
    ru: {
      authenticated: [
        { to: '/', label: 'Главная', icon: HomeFilledIcon, active: location.pathname === '/' },
        { to: '/cabinet', label: 'Кабинет', icon: AccountBoxIcon, active: location.pathname === '/cabinet' },
      ],
      unauthenticated: [
        { to: '/', label: 'Главная', icon: HomeFilledIcon, active: location.pathname === '/' },
        { to: '/doctoral-register', label: 'Регистрация', icon: AccountBoxIcon, active: location.pathname === '/doctoral-register' },
      ],
      logout: 'Выйти',
      language: 'Русский',
    },
  };

  const links = isAuthenticated
    ? linkTranslations[language].authenticated
    : linkTranslations[language].unauthenticated;

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === 'uz' ? 'ru' : 'uz'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/doctoral-register');
  };

  const renderLink = ({ to, label, icon: Icon, active }) => (
    <NavItem to={to} active={active} isMobile={isMobile} key={to}>
      <Icon sx={{ fontSize: isMobile ? 24 : 28, color: 'inherit' }} />
      {!isMobile && (
        <Typography sx={{ fontSize: 16, fontWeight: active ? 600 : 500 }}>
          {label}
        </Typography>
      )}
    </NavItem>
  );

  if (isMobile) {
    return (
      <FooterContainer>
        <NavItems isMobile={true}>
          {links.map(renderLink)}
          <ActionButton isMobile={true} onClick={handleLanguageToggle}>
            <LanguageIcon sx={{ fontSize: 24, color: 'inherit' }} />
          </ActionButton>
          {isAuthenticated && (
            <ActionButton isMobile={true} isLogout={true} onClick={handleLogout}>
              <LogoutIcon sx={{ fontSize: 24, color: 'inherit' }} />
            </ActionButton>
          )}
        </NavItems>
      </FooterContainer>
    );
  }

  return (
    <NavbarContainer variant="permanent" open={true}>
      <Box>
        <LogoContainer>
          <LogoText>Doctoral Studies</LogoText>
        </LogoContainer>
        <NavItems>
          {links.map(renderLink)}
        </NavItems>
      </Box>
      <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <ActionButton isMobile={false} onClick={handleLanguageToggle}>
          <LanguageIcon sx={{ fontSize: 28, color: 'inherit' }} />
          <Typography sx={{ fontSize: 16, fontWeight: 500, ml: 1 }}>
            {language === 'uz' ? "O‘zbek" : 'Русский'}
          </Typography>
        </ActionButton>
        {isAuthenticated && (
          <ActionButton isMobile={false} isLogout={true} onClick={handleLogout}>
            <LogoutIcon sx={{ fontSize: 28, color: 'inherit' }} />
            <Typography sx={{ fontSize: 16, fontWeight: 500, ml: 1 }}>
              {linkTranslations[language].logout}
            </Typography>
          </ActionButton>
        )}
      </Box>
    </NavbarContainer>
  );
};

export default Navbar;