import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';

// Цветовая схема
const colors = {
  primary: '#1A3C59',
  secondary: '#F5F6F5',
  textPrimary: '#1A3C5A',
  white: '#FFFFFF',
  hover: '#2A4A6B',
  success: '#4CAF50',
  error: '#F44336',
  rowBackground: 'linear-gradient(90deg, #F9FAFB 0%, #F1F5F9 100%)',
};

const Header = styled(Box)({
  padding: '20px',
  background: colors.primary,
  color: colors.white,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ContentWrapper = styled(Box)({
  padding: '24px',
  background: colors.secondary,
  minHeight: 'calc(100vh - 80px)',
});

const MainContent = styled(Paper)({
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  background: colors.white,
  marginTop: '20px',
});

const StyledButton = styled(Button)({
  textTransform: 'none',
  borderRadius: '6px',
  padding: '8px 16px',
  '&:hover': {
    background: colors.hover,
  },
});

const UserAvatar = styled(Avatar)({
  background: colors.primary,
  color: colors.white,
  width: '80px',
  height: '80px',
  fontSize: '32px',
  marginBottom: '16px',
});

const StatusChip = styled(Chip)({
  fontWeight: 600,
  fontSize: '0.75rem',
});

const ReviewerCabinet = () => {
  const [userData, setUserData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [decision, setDecision] = useState('');
  const [decisionComment, setDecisionComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      navigate('/');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await fetch('https://doctoral-studies-server.vercel.app/applications', {
          headers: {
            Authorization: token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        } else {
          console.error('Ошибка загрузки заявок');
        }
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const handleOpenDialog = (application) => {
    setSelectedApp(application);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDecision('');
    setDecisionComment('');
  };

  const handleDecisionSubmit = async () => {
    if (!decision || !selectedApp) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://doctoral-studies-server.vercel.app/applications/${selectedApp._id}/decision`, {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: decision,
          comment: decisionComment
        }),
      });

      if (response.ok) {
        const updatedApp = await response.json();
        setApplications(applications.map(app =>
          app._id === updatedApp._id ? updatedApp : app
        ));
        handleCloseDialog();
      } else {
        console.error('Ошибка при обновлении статуса');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://doctoral-studies-server.vercel.app/download-file/${selectedApp._id}/${fileId}`, {
        headers: {
          'Authorization': token,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error('Ошибка при скачивании файла');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return { color: colors.success, label: 'Одобрено' };
      case 'rejected':
        return { color: colors.error, label: 'Отклонено' };
      case 'reviewed':
        return { color: '#FF9800', label: 'Рассмотрено' };
      default:
        return { color: colors.primary, label: 'В обработке' };
    }
  };

  if (!userData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const userInitials = userData.firstName && userData.lastName
    ? `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`
    : 'ПЗ';

  return (
    <Box>
      <Header>
        <Typography variant="h6">Панель проверяющего заявок</Typography>
        <StyledButton
          startIcon={<LogoutIcon />}
          color="inherit"
          onClick={handleLogout}
        >
          Выйти
        </StyledButton>
      </Header>

      <ContentWrapper>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <UserAvatar>{userInitials}</UserAvatar>
          <Typography variant="h5" fontWeight={600} color={colors.textPrimary} mb={1}>
            {userData.firstName} {userData.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Проверяющий
          </Typography>
        </Box>

        <MainContent>
          <Typography variant="h6" fontWeight={500} color={colors.textPrimary} mb={2}>
            Заявки на проверку
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : applications.length > 0 ? (
            <List>
              {applications.map((application, index) => {
                const status = getStatusColor(application.status);
                return (
                  <ListItem
                    key={application._id || index}
                    alignItems="flex-start"
                    sx={{
                      mb: 1,
                      p: 2,
                      borderRadius: '8px',
                      background: colors.rowBackground,
                      '&:hover': {
                        backgroundColor: '#E9EDF2',
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => handleOpenDialog(application)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: colors.primary }}>
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body1" fontWeight={500}>
                            {application.subject || 'Заявка на рассмотрение'}
                          </Typography>
                          <StatusChip
                            label={status.label}
                            style={{
                              backgroundColor: status.color + '20',
                              color: status.color
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary" display="block">
                            <PersonIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                            {application.applicantName || 'Докторант'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Дата подачи: {new Date(application.createdAt).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                Нет активных заявок на проверку
              </Typography>
            </Box>
          )}
        </MainContent>
      </ContentWrapper>

      {/* Диалог просмотра заявки */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Детали заявки</DialogTitle>
        <DialogContent dividers>
          {selectedApp && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Тема:</strong> {selectedApp.subject}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Отправитель:</strong> {selectedApp.applicantName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Дата подачи:</strong> {new Date(selectedApp.createdAt).toLocaleString()}
              </Typography>
              <Box mt={2} mb={2}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Содержание:</strong>
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedApp.content}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                <strong>Прикрепленные файлы:</strong>
              </Typography>
              <List>
                {selectedApp.files.map((file) => (
                  <ListItem
                    key={file._id}
                    secondaryAction={
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadFile(file._id, file.originalName)}
                      >
                        Скачать
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={file.fieldName}
                      secondary={file.originalName}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Решение по заявке:</strong>
                </Typography>
                <Box display="flex" gap={2} mb={2}>
                  <Button
                    variant={decision === 'approved' ? 'contained' : 'outlined'}
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => setDecision('approved')}
                  >
                    Одобрить
                  </Button>
                  <Button
                    variant={decision === 'rejected' ? 'contained' : 'outlined'}
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => setDecision('rejected')}
                  >
                    Отклонить
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  label="Комментарий"
                  multiline
                  rows={4}
                  variant="outlined"
                  value={decisionComment}
                  onChange={(e) => setDecisionComment(e.target.value)}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button
            onClick={handleDecisionSubmit}
            disabled={!decision}
            variant="contained"
            color="primary"
          >
            Сохранить решение
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewerCabinet;