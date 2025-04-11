import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { Navbar, Main, Register, Cabinet } from '../components/';
import Box from '@mui/material/Box';

const AppRoutes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();
  const routeRef = useRef(null);

  const checkAuthentication = () => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData && parsedData.id) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, [location]); // Обновляем проверку при изменении маршрута

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isAuthenticated === null) {
    return null; // Можно показать индикатор загрузки, пока проверяется авторизация
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} />
      <Box
        ref={routeRef}
        className="routes__container"
        sx={{
          flexGrow: 1,
          padding: location.pathname === '/cabinet' ? '0px' : '0px',
          marginLeft: isMobile ? 0 : '230px',
        }}
      >
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/doctoral-register" element={<Register />} />
          <Route
            path="/cabinet"
            element={
              isAuthenticated ? (
                <Cabinet />
              ) : (
                <Navigate to="/doctoral-register" replace />
              )
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default AppRoutes;