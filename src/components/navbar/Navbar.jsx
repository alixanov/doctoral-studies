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
import FileOpenIcon from '@mui/icons-material/FileOpen';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const colors = {
  primaryGradient: 'linear-gradient(135deg, rgb(14, 49, 80) 0%, #1a3c59 100%)',
  secondaryGradient: 'linear-gradient(135deg, #9333EA 0%, #D8B4FE 100%)',
  textPrimary: '#FFFFFF',
  textSecondary: '#D1D5DB',
  activeBg: 'rgba(255, 255, 255, 0.15)',
  hoverBg: 'rgba(255, 255, 255, 0.1)',
  error: '#EF4444',
};

// Стили
const NavbarContainer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 240,
    height: '100vh',
    background: colors.primaryGradient,
    borderRight: 'none',
    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
    transition: theme.transitions.create(['box-shadow']),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

const FooterContainer = styled(Box)({
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
});

const LogoContainer = styled(Box)({
  padding: '30px 20px',
  textAlign: 'center',
  borderBottom: `1px solid ${colors.hoverBg}`,
});

const LogoText = styled(Typography)({
  color: colors.textPrimary,
  fontSize: 24,
  fontWeight: 700,
});

const NavItems = styled(Box)(({ ismobile }) => ({
  display: 'flex',
  flexDirection: ismobile ? 'row' : 'column',
  gap: ismobile ? 30 : 10,
  padding: ismobile ? '0 20px' : '20px 15px',
  justifyContent: ismobile ? 'center' : 'flex-start',
  alignItems: 'center',
  width: '100%',
}));

const NavItem = styled(Link)(({ theme, active, ismobile }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: ismobile ? 'center' : 'flex-start',
  gap: 10,
  textDecoration: 'none',
  color: active ? colors.textPrimary : colors.textSecondary,
  padding: ismobile ? 12 : '12px 20px',
  borderRadius: 10,
  fontSize: ismobile ? 14 : 16,
  fontWeight: active ? 600 : 500,
  background: active ? colors.activeBg : 'transparent',
  transition: theme.transitions.create(['background', 'color', 'transform']),
  '&:hover': {
    background: colors.hoverBg,
    color: colors.textPrimary,
    transform: ismobile ? 'scale(1.05)' : 'translateX(5px)',
  },
}));

const ActionButton = styled(Box)(({ theme, ismobile, islogout }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: ismobile ? 'center' : 'flex-start',
  gap: 10,
  padding: ismobile ? 12 : '12px 20px',
  borderRadius: 10,
  color: islogout ? colors.error : colors.textSecondary,
  background: 'transparent',
  transition: theme.transitions.create(['background', 'color', 'transform']),
  cursor: 'pointer',
  '&:hover': {
    background: colors.hoverBg,
    color: islogout ? '#D32F2F' : colors.textPrimary,
    transform: ismobile ? 'scale(1.05)' : 'translateX(5px)',
  },
}));

const Navbar = ({ isMobile = false, sidebarOpen = false, setSidebarOpen = () => { } }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('uz');

  // Получаем данные пользователя из localStorage
  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = userData?.role || '';

  // Локализация
  const translations = {
    uz: {
      links: [
        { to: '/', label: 'Asosiy', icon: HomeFilledIcon },
        isAuthenticated && userRole === 'doctoral' &&
        { to: '/documents', label: 'Arizalarim', icon: FileOpenIcon },
        isAuthenticated && userRole === 'reviewer' &&
        { to: '/review-applications', label: 'Arizalarni tekshirish', icon: AssignmentTurnedInIcon },
        isAuthenticated
          ? {
            to: userRole === 'reviewer' ? '/reviewer-cabinet' : '/cabinet',
            label: userRole === 'reviewer' ? 'Tekshiruvchi kabineti' : 'Shaxsiy Kabinet',
            icon: AccountBoxIcon
          }
          : { to: '/doctoral-register', label: "Ro‘yxatdan o‘tish", icon: AccountBoxIcon },
      ].filter(Boolean), // Удаляем null/undefined элементы
      logout: 'Chiqish',
      language: "O‘zbek",
    },
    ru: {
      links: [
        { to: '/', label: 'Главная', icon: HomeFilledIcon },
        isAuthenticated && userRole === 'doctoral' &&
        { to: '/documents', label: 'Мои заявки', icon: FileOpenIcon },
        isAuthenticated && userRole === 'reviewer' &&
        { to: '/review-applications', label: 'Проверка заявок', icon: AssignmentTurnedInIcon },
        isAuthenticated
          ? {
            to: userRole === 'reviewer' ? '/reviewer-cabinet' : '/cabinet',
            label: userRole === 'reviewer' ? 'Кабинет проверяющего' : 'Личный кабинет',
            icon: AccountBoxIcon
          }
          : { to: '/doctoral-register', label: 'Регистрация', icon: AccountBoxIcon },
      ].filter(Boolean),
      logout: 'Выйти',
      language: 'Русский',
    },
  };

  const links = translations[language].links;

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === 'uz' ? 'ru' : 'uz'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/doctoral-register');
  };

  const renderLink = ({ to, label, icon: Icon }) => (
    <NavItem
      to={to}
      active={location.pathname === to ? 1 : 0}
      ismobile={isMobile ? 1 : 0}
      key={to}
    >
      <Icon sx={{ fontSize: isMobile ? 24 : 28, color: 'inherit' }} />
      {!isMobile && (
        <Typography sx={{ fontSize: 16, fontWeight: location.pathname === to ? 600 : 500 }}>
          {label}
        </Typography>
      )}
    </NavItem>
  );

  if (isMobile) {
    return (
      <FooterContainer>
        <NavItems ismobile={1}>
          {links.map(renderLink)}
          <ActionButton ismobile={1} onClick={handleLanguageToggle}>
            <LanguageIcon sx={{ fontSize: 24, color: 'inherit' }} />
          </ActionButton>
          {isAuthenticated && (
            <ActionButton ismobile={1} islogout={1} onClick={handleLogout}>
              <LogoutIcon sx={{ fontSize: 24, color: 'inherit' }} />
            </ActionButton>
          )}
        </NavItems>
      </FooterContainer>
    );
  }

  return (
    <NavbarContainer variant="permanent" open>
      <Box>
        <LogoContainer>
          <LogoText>Doctoral Studies</LogoText>
        </LogoContainer>
        <NavItems>{links.map(renderLink)}</NavItems>
      </Box>
      <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
   
        {isAuthenticated && (
          <ActionButton ismobile={0} islogout={1} onClick={handleLogout}>
            <LogoutIcon sx={{ fontSize: 28, color: 'inherit' }} />
            <Typography sx={{ fontSize: 16, fontWeight: 500, ml: 1 }}>
              {translations[language].logout}
            </Typography>
          </ActionButton>
        )}
      </Box>
    </NavbarContainer>
  );
};

export default Navbar;