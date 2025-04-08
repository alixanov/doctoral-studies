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
import BadgeIcon from '@mui/icons-material/Badge';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import TagIcon from '@mui/icons-material/Tag';

// Army color scheme
const colors = {
  armyGreen: '#3D4A26', // Dark green for table headers
  rowBackground: 'transparent', // Прозрачный фон для строк
  black: '#1C2526', // Main dark background
  khaki: '#D4A017', // Golden hue for text headers
  white: '#EDEDED', // White for text in table
  accent: '#A32929', // Red accent
  hoverBackground: 'rgba(58, 70, 71, 0.3)', // Полупрозрачный ховер эффект
};

// Styled components
const MainContainer = styled('div')(({ theme }) => ({
  width: '100%',
  margin: '70px auto',
  padding: '12px',
  [theme.breakpoints.down('sm')]: {
    margin: '20px auto',
    padding: '8px',
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: 'transparent', // Прозрачный фон для всей таблицы
  border: `1px solid ${colors.armyGreen}`,
  borderRadius: 8,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
  [theme.breakpoints.down('sm')]: {
    borderRadius: 6,
  },
}));

const StyledTable = styled(Table)({
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${colors.armyGreen}50`,
    padding: '8px', // Уменьшенные отступы для компактности
    fontFamily: "'Montserrat', sans-serif",
  },
});

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: colors.armyGreen, // Green background for table headers
  color: colors.white, // White text for headers
  fontWeight: 600,
  fontSize: 14,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  padding: '10px', // Уменьшенные отступы
  borderRight: `1px solid ${colors.armyGreen}80`, // Добавляем вертикальные линии
  '&:last-child': {
    borderRight: 'none', // Убираем линию у последнего столбца
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 12,
    padding: '8px',
  },
}));

const StyledTableBodyCell = styled(TableCell)(({ theme }) => ({
  color: colors.white, // White text in rows
  fontSize: 14,
  backgroundColor: colors.rowBackground, // Прозрачный фон для ячеек
  borderRight: `1px solid ${colors.armyGreen}50`, // Добавляем вертикальные линии
  '&:last-child': {
    borderRight: 'none', // Убираем линию у последнего столбца
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 12,
    padding: '6px',
  },
}));

// Mobile card styles
const UserCard = styled(Card)(({ theme }) => ({
  backgroundColor: colors.rowBackground, // Прозрачный фон для карточек
  color: colors.white,
  marginBottom: '16px',
  border: `1px solid ${colors.armyGreen}`,
  borderRadius: 6,
  transition: 'transform 0.2s ease, background-color 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    backgroundColor: colors.hoverBackground, // Ховер эффект для карточек
    boxShadow: `0 6px 12px rgba(0, 0, 0, 0.5)`,
  },
}));

const CardHeader = styled(Box)({
  backgroundColor: colors.armyGreen,
  padding: '10px 16px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '6px 6px 0 0',
});

const CardRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 0',
});

const IconWrapper = styled(Box)({
  color: colors.khaki,
  marginRight: '12px',
  display: 'flex',
  alignItems: 'center',
});

const LabelText = styled(Typography)({
  color: colors.khaki,
  fontSize: 12,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

const ValueText = styled(Typography)({
  color: colors.white,
  fontSize: 14,
  fontWeight: 400,
});

// Date formatting function
const formatDateToDogTag = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const Main = () => {
  const [users, setUsers] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
  }, []);

  // Mobile version uses cards instead of table
  const MobileUserList = () => (
    <Box sx={{ mt: 2 }}>
      {users.map((user, index) => (
        <UserCard key={index}>
          <CardHeader>
            <FingerprintIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
            <Typography variant="subtitle1" fontWeight={600}>
              ID: {user.id}
            </Typography>
          </CardHeader>
          <CardContent>
            <CardRow>
              <IconWrapper>
                <TagIcon fontSize="small" />
              </IconWrapper>
              <Box>
                <LabelText>Serial Number</LabelText>
                <ValueText>#{index + 1}</ValueText>
              </Box>
            </CardRow>

            <Divider sx={{ my: 1, borderColor: `${colors.armyGreen}50` }} />

            <CardRow>
              <IconWrapper>
                <PersonIcon fontSize="small" />
              </IconWrapper>
              <Box>
                <LabelText>Username</LabelText>
                <ValueText>{user.username}</ValueText>
              </Box>
            </CardRow>

            <Divider sx={{ my: 1, borderColor: `${colors.armyGreen}50` }} />

            <CardRow>
              <IconWrapper>
                <CalendarTodayIcon fontSize="small" />
              </IconWrapper>
              <Box>
                <LabelText>Date of Birth</LabelText>
                <ValueText>{formatDateToDogTag(user.birthDate)}</ValueText>
              </Box>
            </CardRow>

            <Divider sx={{ my: 1, borderColor: `${colors.armyGreen}50` }} />

            <CardRow>
              <IconWrapper>
                <BadgeIcon fontSize="small" />
              </IconWrapper>
              <Box>
                <LabelText>Rank</LabelText>
                <ValueText>{user.rank || 'PRIVATE'}</ValueText>
              </Box>
            </CardRow>
          </CardContent>
        </UserCard>
      ))}
    </Box>
  );

  // Desktop version uses table
  const DesktopUserList = () => (
    <StyledTableContainer component={Paper}>
      <StyledTable>
        <TableHead>
          <TableRow>
            <StyledTableHeadCell sx={{ width: '10%', textAlign: 'center' }}>
              Serial Number
            </StyledTableHeadCell>
            <StyledTableHeadCell sx={{ width: '20%' }}>ID</StyledTableHeadCell>
            <StyledTableHeadCell sx={{ width: '25%' }}>Username</StyledTableHeadCell>
            <StyledTableHeadCell sx={{ width: '25%' }}>Date of Birth</StyledTableHeadCell>
            <StyledTableHeadCell sx={{ width: '20%' }}>Rank</StyledTableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={index}
              sx={{
                '&:hover': {
                  backgroundColor: colors.hoverBackground, // Полупрозрачный ховер эффект
                  boxShadow: `0 2px 8px rgba(0, 0, 0, 0.3)`, // Тень при ховере
                },
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <StyledTableBodyCell sx={{ textAlign: 'center' }}>
                #{index + 1}
              </StyledTableBodyCell>
              <StyledTableBodyCell>{user.id}</StyledTableBodyCell>
              <StyledTableBodyCell>{user.username}</StyledTableBodyCell>
              <StyledTableBodyCell>{formatDateToDogTag(user.birthDate)}</StyledTableBodyCell>
              <StyledTableBodyCell>{user.rank || 'PRIVATE'}</StyledTableBodyCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );

  return (
    <MainContainer>
      <Typography
        variant="h4"
        align="center"
        sx={{
          mb: 4,
          fontWeight: 700,
          color: colors.white,
          fontFamily: "'Montserrat', sans-serif",
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          background: `linear-gradient(90deg, ${colors.accent}, ${colors.khaki})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: isMobile ? '1.75rem' : '2.125rem',
        }}
      >
        User List
      </Typography>

      {isMobile ? <MobileUserList /> : <DesktopUserList />}
    </MainContainer>
  );
};

export default Main;