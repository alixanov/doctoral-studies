
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  useMediaQuery,
  Slide,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import GradingIcon from '@mui/icons-material/Grading';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

// Color palette
const colors = {
  primaryGradient: 'linear-gradient(135deg, rgb(14, 49, 80) 0%, #1a3c59 100%)',
  secondaryGradient: 'linear-gradient(135deg, #9333EA 0%, #D8B4FE 100%)',
  textPrimary: '#FFFFFF',
  textSecondary: '#D1D5DB',
  activeBg: 'rgba(255, 255, 255, 0.15)',
  hoverBg: 'rgba(255, 255, 255, 0.1)',
  error: '#EF4444',
};

// Styled components
const NavbarContainer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 270,
    height: '100vh',
    background: colors.primaryGradient,
    borderRight: 'none',
    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
    transition: theme.transitions.create(['box-shadow']),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'start',
  },
}));

const MobileTopBar = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  background: colors.primaryGradient,
  padding: theme.spacing(1.5),
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
  zIndex: 1300,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 240,
    background: colors.primaryGradient,
    padding: theme.spacing(2),
    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.2)',
  },
}));

const LogoContainer = styled(Box)(({ theme, isMobile }) => ({
  padding: isMobile ? theme.spacing(2) : theme.spacing(3, 2.5),
  textAlign: 'center',
  display: isMobile ? 'none' : 'flex',
  alignItems: 'center',
  justifyContent: isMobile ? 'flex-start' : 'center',
  gap: '10px',
  borderBottom: !isMobile ? `1px solid ${ colors.hoverBg } ` : 'none',
  
}));

const LogoText = styled(Typography)(({ isMobile }) => ({
  color: colors.textPrimary,
  fontSize: isMobile ? 20 : 24,
  fontWeight: 700,

}));

const NavItems = styled(Box)(({ isMobile }) => ({
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'column',
  gap: isMobile ? 12 : 10,
  padding: isMobile ? '16px 0' : '20px 15px',
  width: '100%',
}));

const NavItem = styled(Link)(({ theme, active, isMobile }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  textDecoration: 'none',
  color: active ? colors.textPrimary : colors.textSecondary,
  padding: isMobile ? '12px 16px' : '12px 20px',
  borderRadius: 10,
  fontSize: isMobile ? 15 : 16,
  fontWeight: active ? 600 : 500,
  background: active ? colors.activeBg : 'transparent',
  transition: theme.transitions.create(['background', 'color', 'transform']),
  '&:hover': {
    background: colors.hoverBg,
    color: colors.textPrimary,
    transform: isMobile ? 'scale(1.02)' : 'translateX(5px)',
  },
}));

const ActionButton = styled(Box)(({ theme, isMobile, isLogout }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: isMobile ? '12px 16px' : '12px 20px',
  borderRadius: 10,
  color: isLogout ? colors.error : colors.textSecondary,
  background: 'transparent',
  transition: theme.transitions.create(['background', 'color', 'transform']),
  cursor: 'pointer',
  '&:hover': {
    background: colors.hoverBg,
    color: isLogout ? '#D32F2F' : colors.textPrimary,
    transform: isMobile ? 'scale(1.02)' : 'translateX(5px)',
  },
}));

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 600px)');

  // User data
  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = userData?.role || '';

  // Update active path
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // Navigation links
  const links = [
    { to: '/', label: 'Бош саҳифа', icon: HomeFilledIcon },
    isAuthenticated && userRole === 'doctoral' && {
      to: '/documents',
      label: 'Менинг аризаларим',
      icon: FileOpenIcon,
    },
    isAuthenticated && userRole === 'doctoral' && {
      to: '/assessments-doctorant',
      label: 'Баҳолаш аризаси',
      icon: AssessmentIcon,
    },
    { to: '/testing', label: 'Текшириш', icon: DriveFileRenameOutlineIcon },
    // { to: '/result', label: 'Натижа', icon: GradingIcon },
    { to: '/gemini', label: 'ChatAi', icon: MarkChatUnreadIcon },
    isAuthenticated
      ? {
          to: userRole === 'reviewer' ? '/reviewer-cabinet' : '/cabinet',
          label: userRole === 'reviewer' ? 'Кабинет' : 'Шахсий кабинет',
          icon: AccountBoxIcon,
        }
      : { to: '/doctoral-register', label: 'Рўйхатдан ўтиш', icon: AccountBoxIcon },
    isAuthenticated && userRole === 'reviewer' && {
      to: '/review-news',
      label: 'Янгиликлар',
      icon: AssignmentTurnedInIcon,
    },
    isAuthenticated && userRole === 'reviewer' && {
      to: '/reviewer-assessments',
      label: 'Баҳолаш',
      icon: AssessmentIcon,
    },
  ].filter(Boolean);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/doctoral-register');
    setActivePath('/doctoral-register');
    setMobileOpen(false);
  };

  const handleNavClick = (path) => {
    setActivePath(path);
    setMobileOpen(false);
  };

  const renderLink = ({ to, label, icon: Icon }) => (
    <NavItem
      to={to}
      active={activePath === to ? 1 : 0}
      isMobile={isMobile ? 1 : 0}
      key={to}
      onClick={() => handleNavClick(to)}
    >
      <Icon sx={{ fontSize: isMobile ? 24 : 28, color: 'inherit' }} />
      <Typography sx={{ fontSize: isMobile ? 15 : 16, fontWeight: activePath === to ? 600 : 500 }}>
        {label}
      </Typography>
    </NavItem>
  );

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <LogoContainer isMobile={isMobile}>
        <SchoolIcon sx={{ color: colors.textPrimary, fontSize: isMobile ? 28 : 32 }} />
        <LogoText isMobile={isMobile}>PHD</LogoText>
      </LogoContainer>
      <NavItems isMobile={isMobile}>{links.map(renderLink)}</NavItems>
      <Box sx={{ flexGrow: 1 }} />
      {isAuthenticated && (
        <ActionButton isMobile={isMobile} isLogout={1} onClick={handleLogout}>
          <LogoutIcon sx={{ fontSize: isMobile ? 24 : 28, color: 'inherit' }} />
          <Typography sx={{ fontSize: isMobile ? 15 : 16, fontWeight: 500 }}>
            Чиқиш
          </Typography>
        </ActionButton>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <MobileTopBar>
          <IconButton
            color="inherit"
            aria-label="open navigation drawer"
            onClick={() => setMobileOpen(true)}
            sx={{ color: colors.textPrimary }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
          <LogoContainer isMobile={1}>
            <SchoolIcon sx={{ color: colors.textPrimary, fontSize: 28 }} />
            <LogoText isMobile={1}>PHD</LogoText>
          </LogoContainer>
          <Box sx={{ width: 48 }} />
        </MobileTopBar>
        <MobileDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          TransitionComponent={Slide}
          TransitionProps={{ direction: 'left' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: colors.textPrimary }}>
              <CloseIcon />
            </IconButton>
          </Box>
          {drawerContent}
        </MobileDrawer>
      </>
    );
  }

  return (
    <NavbarContainer variant="permanent" open>
      {drawerContent}
    </NavbarContainer>
  );
};

export default Navbar;
