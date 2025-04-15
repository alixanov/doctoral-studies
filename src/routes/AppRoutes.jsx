import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { Navbar, Main, Register, Cabinet, ReviewerCabinet, DocumentsList, ReviewerNews, AssessmentsDoctorant } from '../components/';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const AppRoutes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();
  const routeRef = useRef(null);

  // Проверка аутентификации
  const checkAuthentication = () => {
    try {
      const storedData = localStorage.getItem('userData');
      const isValid = storedData && JSON.parse(storedData)?.id;
      setIsAuthenticated(!!isValid);
    } catch (error) {
      console.error('Authentication check failed:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, [location]);

  // Обработка изменения размера окна
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Показ индикатора загрузки, пока проверяется аутентификация
  if (isAuthenticated === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
      />
      <Box
        ref={routeRef}
        className="routes__container"
        sx={{
          flexGrow: 1,
          padding: location.pathname === '/cabinet' ? 0 : 2,
          marginLeft: isMobile ? 0 : '270px',
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/doctoral-register" element={<Register />} />
          <Route path="/reviewer-cabinet" element={<ReviewerCabinet />} />
          <Route path="/documents" element={<DocumentsList />} />
          <Route path='/review-news' element={<ReviewerNews/>}/>
          <Route path='/assessments-doctorant' element={<AssessmentsDoctorant/>} />

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