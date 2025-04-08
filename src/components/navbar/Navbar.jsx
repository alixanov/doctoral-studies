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
  background: 'linear-gradient(135deg, #A32929 10%, #A8A14E 90%)',
  accent: '#A32929',
  khaki: '#A8A14E',
  glow: 'rgba(255, 255, 255, 0.2)',
  subtleGlow: 'rgba(255, 255, 255, 0.05)',
};

// Стили для боковой панели (десктоп)
const NavbarContainer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 230,
    height: '95vh',
    margin: '10px 10px 10px 10px',
    background: 'rgba(26, 26, 26, 0.4)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(15px)',
    borderRadius: '40px',
    borderRight: 'none',
    boxShadow: '5px 0 25px rgba(0, 0, 0, 0.15)',
    transition: theme.transitions.create(['box-shadow', 'background'], {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.easeInOut,
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
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  padding: '20px 0',
  borderRadius: '20px 20px 0 0',
  boxShadow: '0 -5px 20px rgba(0, 0, 0, 0.2)',
  zIndex: 1300,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  transition: theme.transitions.create(['background', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    background: 'rgba(40, 40, 40, 0.95)',
  },
}));

const LogoContainer = styled(Box)({
  padding: '35px 20px',
  textAlign: 'center',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '0 0 15px 15px',
});

const LogoText = styled(Typography)({
  color: '#ffffff',
  fontSize: 22,
  fontFamily: "'Inter', sans-serif",
  fontWeight: 700,
  letterSpacing: '0.8px',
  textShadow: '0 0 8px rgba(255, 255, 255, 0.2)',
});

const NavItems = styled(Box)(({ isMobile }) => ({
  display: 'flex',
  flexDirection: isMobile ? 'row' : 'column',
  gap: isMobile ? 30 : 12,
  padding: isMobile ? '0 20px' : '25px 15px',
  justifyContent: isMobile ? 'center' : 'flex-start',
  alignItems: 'center',
  width: '100%',
}));

const NavItem = styled(Link)(({ theme, active, isMobile }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: isMobile ? 'center' : 'flex-start',
  gap: isMobile ? 0 : 8,
  flexDirection: isMobile ? 'row' : 'row', // Для десктопа иконка и текст в ряд
  textDecoration: 'none',
  color: '#ffffff',
  padding: isMobile ? 10 : '10px 20px',
  borderRadius: isMobile ? '50%' : '12px', // Круглые кнопки для мобильной версии, прямоугольные для десктопа
  fontSize: isMobile ? 12 : 17,
  fontWeight: active ? 600 : 500,
  background: active ? (isMobile ? colors.background : 'rgba(163, 41, 41, 0.2)') : 'rgba(255, 255, 255, 0.05)',
  transition: theme.transitions.create(['background', 'transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
    easing: theme.transitions.easing.easeInOut,
  }),
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
    transform: isMobile ? 'scale(1.1)' : 'translateY(-2px)',
    boxShadow: `0 5px 15px ${colors.subtleGlow}`,
  },
  '& svg': {
    filter: active ? 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))' : 'none',
  },
  ...(active && !isMobile && {
    transform: 'translateX(4px)',
    background: `linear-gradient(90deg, rgba(163, 41, 41, 0.2), rgba(168, 161, 78, 0.2))`,
  }),
}));

const LanguageToggle = styled(Box)(({ theme, active, isMobile }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: isMobile ? 10 : '10px 20px',
  borderRadius: isMobile ? '50%' : '12px', // Круглые кнопки для мобильной версии, прямоугольные для десктопа
  background: active ? (isMobile ? colors.background : 'rgba(163, 41, 41, 0.2)') : 'rgba(255, 255, 255, 0.05)',
  transition: theme.transitions.create(['background', 'transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
    easing: theme.transitions.easing.easeInOut,
  }),
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
    transform: isMobile ? 'scale(1.1)' : 'translateY(-2px)',
    boxShadow: `0 5px 15px ${colors.subtleGlow}`,
  },
  '& svg': {
    filter: active ? 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))' : 'none',
  },
  ...(active && !isMobile && {
    transform: 'translateX(4px)',
    background: `linear-gradient(90deg, rgba(163, 41, 41, 0.2), rgba(168, 161, 78, 0.2))`,
  }),
}));

const Navbar = ({ sidebarOpen, setSidebarOpen, isMobile }) => {
  const location = useLocation();
  const [language, setLanguage] = useState('uz'); // По умолчанию узбекский

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

  const isAuthenticated = !!localStorage.getItem('userData');

  // Локализация ссылок
  const linkTranslations = {
    uz: {
      authenticated: [
        { to: '/', label: 'Asosiy', icon: HomeFilledIcon, active: location.pathname === '/' },
        { to: '/register', label: ' Royhatdan otish', icon: AccountBoxIcon, active: location.pathname === '/test' },
      ],
      unauthenticated: [
        { to: '/', label: 'Asosiy', icon: HomeFilledIcon, active: location.pathname === '/' },
        { to: '/register', label: ' Royhatdan otish', icon: AccountBoxIcon, active: location.pathname === '/test' },
      ],
    },
    ru: {
      authenticated: [
        { to: '/', label: 'Главная', icon: HomeFilledIcon, active: location.pathname === '/' },
        { to: '/register', label: 'Регистрация', icon: AccountBoxIcon, active: location.pathname === '/test' },
      ],
      unauthenticated: [
        { to: '/', label: 'Главная', icon: HomeFilledIcon, active: location.pathname === '/' },
        { to: '/register', label: 'Регистрация', icon: AccountBoxIcon, active: location.pathname === '/test' },
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
      <Icon sx={{ fontSize: isMobile ? 24 : 30, color: '#fff' }} />
      {!isMobile && (
        <Typography
          sx={{
            background: active ? colors.background : 'none',
            WebkitBackgroundClip: active ? 'text' : 'none',
            WebkitTextFillColor: active ? 'transparent' : '#fff',
            fontSize: 17,
            fontWeight: active ? 600 : 500,
          }}
        >
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
            <LanguageIcon sx={{ fontSize: 24, color: '#fff' }} />
          </LanguageToggle>
        </NavItems>
      </FooterContainer>
    );
  }

  return (
    <NavbarContainer variant="permanent" open={true}>
      <Box>
        <LogoContainer>
          <LogoText>doctoral-studies</LogoText>
        </LogoContainer>
        <NavItems>
          {links.map(renderLink)}
        </NavItems>
      </Box>
      <Box sx={{ padding: '15px 20px', display: 'flex', justifyContent: 'center' }}>
        <LanguageToggle active={language === 'ru'} onClick={handleLanguageToggle} isMobile={false}>
          <LanguageIcon sx={{ fontSize: 30, color: '#fff' }} />
          <Typography
            sx={{
              background: language === 'ru' ? colors.background : 'none',
              WebkitBackgroundClip: language === 'ru' ? 'text' : 'none',
              WebkitTextFillColor: language === 'ru' ? 'transparent' : '#fff',
              fontSize: 17,
              fontWeight: language === 'ru' ? 600 : 500,
              marginLeft: 1,
            }}
          >
            {language === 'uz' ? "O‘zbek" : 'Русский'}
          </Typography>
        </LanguageToggle>
      </Box>
    </NavbarContainer>
  );
};

export default Navbar;