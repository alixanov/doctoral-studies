import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import PersonIcon from '@mui/icons-material/Person';
import QuizIcon from '@mui/icons-material/Quiz';
import LanguageIcon from '@mui/icons-material/Language';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const colors = {
  primaryGradient: 'linear-gradient(135deg,rgb(14, 49, 80) 0%, #1a3c59 100%)',
  secondaryGradient: 'linear-gradient(135deg, #9333EA 0%, #D8B4FE 100%)',
  textPrimary: '#FFFFFF',
  textSecondary: '#D1D5DB',
  activeBg: 'rgba(255, 255, 255, 0.15)',
  hoverBg: 'rgba(255, 255, 255, 0.1)',
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

// Стили для футера (мобильная версия)
const FooterContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  background: colors.primaryGradient,
  padding: '15px 0',
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
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 700,
  letterSpacing: '0.5px',
});

const NavItems = styled(Box)(({ isMobile }) => ({
  display: 'flex',
  flexDirection: isMobile ? 'row' : 'column',
  gap: isMobile ? 40 : 10,
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

const LanguageToggle = styled(Box)(({ theme, active, isMobile }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: isMobile ? 12 : '12px 20px',
  borderRadius: 10,
  color: active ? colors.textPrimary : colors.textSecondary,
  background: active ? colors.activeBg : 'transparent',
  transition: theme.transitions.create(['background', 'color', 'transform'], {
    duration: theme.transitions.duration.short,
  }),
  cursor: 'pointer',
  '&:hover': {
    background: colors.hoverBg,
    color: colors.textPrimary,
    transform: isMobile ? 'scale(1.05)' : 'translateX(5px)',
  },
}));

const Navbar = ({ sidebarOpen, setSidebarOpen, isMobile }) => {
  const location = useLocation();
  const [language, setLanguage] = useState('uz');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.querySelector('.MuiDrawer-paper');
        const menuButton = document.querySelector('.menu-button');
        const clickedSidebar = sidebar && sidebar.contains(event.target);
        const clickedMenuButton = menuButton && menuButton.contains(event.target);
        if (!clickedSidebar && !clickedMenuButton) {
          setSidebarOpen(false);
        }
      }
    };

    if (isMobile && sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, sidebarOpen, setSidebarOpen]);

  const isAuthenticated = !!localStorage.getItem('token'); // Проверяем наличие токена

  const linkTranslations = {
    uz: {
      authenticated: [
        { to: '/', label: 'Asosiy', icon: HomeFilledIcon, active: location.pathname === '/' },
        { to: '/cabinet', label: 'Shaxsiy Kabinet', icon: AccountBoxIcon, active: location.pathname === '/cabinet' }, // Изменили на "Личный кабинет"
      ],
      unauthenticated: [
        { to: '/', label: 'Asosiy', icon: HomeFilledIcon, active: location.pathname === '/' },
        { to: '/register', label: 'Ro‘yxatdan o‘tish', icon: AccountBoxIcon, active: location.pathname === '/register' },
      ],
    },
    ru: {
      authenticated: [
        { to: '/', label: 'Главная', icon: HomeFilledIcon, active: location.pathname === '/' },
        { to: '/cabinet', label: 'Кабинет', icon: AccountBoxIcon, active: location.pathname === '/cabinet' }, // Изменили на "Кабинет"
      ],
      unauthenticated: [
        { to: '/', label: 'Главная', icon: HomeFilledIcon, active: location.pathname === '/' },
        { to: '/register', label: 'Регистрация', icon: AccountBoxIcon, active: location.pathname === '/register' },
      ],
    },
  };

  const links = isAuthenticated
    ? linkTranslations[language].authenticated
    : linkTranslations[language].unauthenticated;

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === 'uz' ? 'ru' : 'uz'));
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
          <LanguageToggle active={language === 'ru'} onClick={handleLanguageToggle} isMobile={true}>
            <LanguageIcon sx={{ fontSize: 24, color: 'inherit' }} />
          </LanguageToggle>
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
      <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <LanguageToggle active={language === 'ru'} onClick={handleLanguageToggle} isMobile={false}>
          <LanguageIcon sx={{ fontSize: 28, color: 'inherit' }} />
          <Typography sx={{ fontSize: 16, fontWeight: language === 'ru' ? 600 : 500, ml: 1 }}>
            {language === 'uz' ? "O‘zbek" : 'Русский'}
          </Typography>
        </LanguageToggle>
      </Box>
    </NavbarContainer>
  );
};

export default Navbar;