import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TagIcon from '@mui/icons-material/Tag';

// Цветовая схема
const colors = {
  TableGradient: 'linear-gradient(135deg, #0E3150 0%, #1A3C59 100%)', // Глубокий синий градиент
  darkBlue: '#1A3C5A', // Темно-синий для заголовков
  rowBackground: 'linear-gradient(90deg, #F9FAFB 0%, #F1F5F9 100%)', // Легкий градиент для строк
  lightGray: '#F5F6F5', // Светлый фон для карточек
  accentBlue: '#2A6EBB', // Акцентный синий
  white: '#FFFFFF', // Белый для текста
  hoverBackground: 'rgba(42, 110, 187, 0.15)', // Hover эффект
  borderColor: '#D3DCE6', // Границы
  titleColor:"#1a3c59"
};

// Styled components
const MainContainer = styled('div')(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  padding: '24px',
  // background: colors.rowBackground,
  borderRadius: 12,
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
  },
}));

const StyledTableContainer = styled(TableContainer)({
  background: 'transparent',
  borderRadius: 8,
  border: `1px solid ${colors.borderColor}`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
});

const StyledTable = styled(Table)({
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${colors.borderColor}`,
    padding: '14px',
    fontFamily: "'Roboto', sans-serif",
  },
});

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: colors.darkBlue,
  color: colors.white,
  fontWeight: 600,
  fontSize: 15,
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  padding: '14px',
  borderRight: `1px solid ${colors.darkBlue}80`,
  '&:last-child': {
    borderRight: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 13,
    padding: '10px',
  },
}));

const StyledTableBodyCell = styled(TableCell)(({ theme }) => ({
  color: colors.darkBlue,
  fontSize: 14,
  background: colors.rowBackground,
  borderRight: `1px solid ${colors.borderColor}`,
  '&:last-child': {
    borderRight: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 12,
    padding: '10px',
  },
}));

// Mobile card styles
const CandidateCard = styled(Card)(({ theme }) => ({
  backgroundColor: colors.lightGray,
  color: colors.darkBlue,
  marginBottom: '16px',
  border: `1px solid ${colors.borderColor}`,
  borderRadius: 8,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    backgroundColor: colors.hoverBackground,
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
  },
}));

const CardHeader = styled(Box)({
  backgroundColor: colors.darkBlue,
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '8px 8px 0 0',
});

const CardRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
});

const IconWrapper = styled(Box)({
  color: colors.accentBlue,
  marginRight: '12px',
  display: 'flex',
  alignItems: 'center',
});

const LabelText = styled(Typography)({
  color: colors.accentBlue,
  fontSize: 12,
  fontWeight: 500,
  textTransform: 'uppercase',
});

const ValueText = styled(Typography)({
  color: colors.darkBlue,
  fontSize: 14,
  fontWeight: 400,
});

// Форматирование даты
const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const DoctoralApplications = () => {
  const [candidates, setCandidates] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const tempData = [
      { id: 'DCT-001', name: 'Иван Петров', submissionDate: '2025-03-15', program: 'Физика' },
      { id: 'DCT-002', name: 'Анна Смирнова', submissionDate: '2025-03-20', program: 'Биология' },
      { id: 'DCT-003', name: 'Сергей Иванов', submissionDate: '2025-04-01', program: 'Математика' },
    ];
    setCandidates(tempData);
  }, []);

  // Обработка пустого списка
  const EmptyState = () => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h6" color={colors.white} sx={{ opacity: 0.8 }}>
        Нет данных о заявках
      </Typography>
    </Box>
  );

  // Мобильная версия с карточками
  const MobileCandidateList = () => (
    <Box sx={{ mt: 3 }}>
      {candidates.length === 0 ? (
        <EmptyState />
      ) : (
        candidates.map((candidate, index) => (
          <CandidateCard key={index}>
            <CardHeader>
              <AssignmentIcon sx={{ mr: 1, color: colors.white, fontSize: 20 }} />
              <Typography variant="subtitle1" color={colors.white} fontWeight={600}>
                {candidate.id}
              </Typography>
            </CardHeader>
            <CardContent sx={{ padding: 0 }}>
              <CardRow>
                <IconWrapper>
                  <TagIcon fontSize="small" />
                </IconWrapper>
                <Box>
                  <LabelText>Номер</LabelText>
                  <ValueText>#{index + 1}</ValueText>
                </Box>
              </CardRow>
              <Divider sx={{ borderColor: colors.borderColor }} />
              <CardRow>
                <IconWrapper>
                  <PersonIcon fontSize="small" />
                </IconWrapper>
                <Box>
                  <LabelText>Имя</LabelText>
                  <ValueText>{candidate.name}</ValueText>
                </Box>
              </CardRow>
              <Divider sx={{ borderColor: colors.borderColor }} />
              <CardRow>
                <IconWrapper>
                  <CalendarTodayIcon fontSize="small" />
                </IconWrapper>
                <Box>
                  <LabelText>Дата подачи</LabelText>
                  <ValueText>{formatDate(candidate.submissionDate)}</ValueText>
                </Box>
              </CardRow>
              <Divider sx={{ borderColor: colors.borderColor }} />
              <CardRow>
                <IconWrapper>
                  <SchoolIcon fontSize="small" />
                </IconWrapper>
                <Box>
                  <LabelText>Программа</LabelText>
                  <ValueText>{candidate.program}</ValueText>
                </Box>
              </CardRow>
            </CardContent>
          </CandidateCard>
        ))
      )}
    </Box>
  );

  // Десктопная версия с таблицей
  const DesktopCandidateList = () => (
    <StyledTableContainer component={Paper}>
      <StyledTable>
        <TableHead>
          <TableRow>
            <StyledTableHeadCell sx={{ width: '15%' }}>№</StyledTableHeadCell>
            <StyledTableHeadCell sx={{ width: '20%' }}>ID</StyledTableHeadCell>
            <StyledTableHeadCell sx={{ width: '25%' }}>Имя</StyledTableHeadCell>
            <StyledTableHeadCell sx={{ width: '20%' }}>Дата подачи</StyledTableHeadCell>
            <StyledTableHeadCell sx={{ width: '20%' }}>Программа</StyledTableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {candidates.length === 0 ? (
            <TableRow>
              <StyledTableBodyCell colSpan={5}>
                <EmptyState />
              </StyledTableBodyCell>
            </TableRow>
          ) : (
            candidates.map((candidate, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': {
                    backgroundColor: colors.hoverBackground,
                  },
                  transition: 'background-color 0.3s ease',
                }}
              >
                <StyledTableBodyCell>#{index + 1}</StyledTableBodyCell>
                <StyledTableBodyCell>{candidate.id}</StyledTableBodyCell>
                <StyledTableBodyCell>{candidate.name}</StyledTableBodyCell>
                <StyledTableBodyCell>{formatDate(candidate.submissionDate)}</StyledTableBodyCell>
                <StyledTableBodyCell>{candidate.program}</StyledTableBodyCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );

  return (
    <MainContainer>
      <Typography
        variant="h5"
        align="center"
        sx={{
          mb: 4,
          fontWeight: 700,
          color: colors.titleColor,
          fontFamily: "'Roboto', sans-serif",
          letterSpacing: '1px',
          [theme.breakpoints.down('sm')]: {
            fontSize: 18,
            mb: 3,
          },
        }}
      >
        Заявки на докторантуру
      </Typography>
      {isMobile ? <MobileCandidateList /> : <DesktopCandidateList />}
    </MainContainer>
  );
};

export default DoctoralApplications;