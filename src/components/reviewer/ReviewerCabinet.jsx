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
  TextField,
  Card,
  CardMedia,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';
import { keyframes } from '@emotion/react';

// Анимация появления
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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
  border: '#E5E7EB',
};

// Стили
const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: colors.primary,
  color: colors.white,
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius:11,
  alignItems: 'center',
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: colors.secondary,
  minHeight: 'calc(100vh - 80px)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const MainContent = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  background: colors.white,
  marginTop: theme.spacing(2),
  animation: `${fadeIn} 0.5s ease forwards`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '6px',
  padding: theme.spacing(1, 2),
  '&:hover': {
    background: colors.hover,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 1.5),
    fontSize: '0.85rem',
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  background: colors.primary,
  color: colors.white,
  width: theme.spacing(10),
  height: theme.spacing(10),
  fontSize: '2rem',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    fontSize: '1.5rem',
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.65rem',
  },
}));

const FileContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const FileLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  fontWeight: 500,
  color: colors.textPrimary,
  marginBottom: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
  },
}));

const FileName = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: colors.textPrimary,
  marginTop: theme.spacing(0.5),
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
  },
}));

const DownloadButton = styled(Button)(({ theme }) => ({
  background: colors.primary,
  color: colors.white,
  padding: theme.spacing(0.75, 1.5),
  borderRadius: '6px',
  fontSize: '0.85rem',
  fontWeight: 500,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: colors.hover,
    transform: 'translateY(-1px)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 1),
    fontSize: '0.75rem',
  },
}));

const ImageCard = styled(Card)(({ theme }) => ({
  maxWidth: '100%',
  overflow: 'hidden',
  marginBottom: theme.spacing(1.5),
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  [theme.breakpoints.down('sm')]: {
    width: '120px',
  },
}));

const ImagePreviewDialog = styled(Dialog)({
  '& .MuiDialogContent-root': {
    padding: 0,
  },
});

const ReviewerCabinet = () => {
  const [userData, setUserData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [decision, setDecision] = useState('');
  const [decisionComment, setDecisionComment] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Список меток файлов
  const fileFields = [
    { name: 'malumotnoma', label: 'Справка' },
    { name: 'photo', label: 'Электронная фотография кандидата' },
    { name: 'passport', label: 'Копия паспорта' },
    { name: 'kengashBayyonomma', label: 'Выписка из протокола заседания ученого совета института' },
    { name: 'dekanatTaqdimnoma', label: 'Рекомендация деканата и кафедры' },
    { name: 'sinovNatijalari', label: 'Электронная ведомость результатов испытаний' },
    { name: 'ilmiyIshlar', label: 'Список научных работ' },
    { name: 'annotatsiya', label: 'Аннотация научных (творческих) работ' },
    { name: 'maqolalar', label: 'Копии научных статей' },
    { name: 'xulosa', label: 'Заключение заведующего кафедрой и научного руководителя' },
    { name: 'testBallari', label: 'Баллы, набранные на вступительных тестах' },
    { name: 'tarjimaiXol', label: 'Автобиография аспиранта' },
    { name: 'reytingDaftarcha', label: 'Рейтинговая книжка' },
    { name: 'guvohnoma', label: 'Свидетельство автора' },
    { name: 'yutuqlar', label: 'Достижения' },
    { name: 'boshqa', label: 'Прочее' },
    { name: 'file', label: 'Общий файл' },
  ];

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
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: decision,
          comment: decisionComment,
        }),
      });

      if (response.ok) {
        const updatedApp = await response.json();
        setApplications(applications.map((app) => (app._id === updatedApp._id ? updatedApp : app)));
        handleCloseDialog();
      } else {
        console.error('Ошибка при обновлении статуса');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const isImageFile = (file) => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.includes(file.mimetype);
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://doctoral-studies-server.vercel.app/download-file/${selectedApp._id}/${fileId}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const link = document.createElement('a');
        link.href = data.url || window.URL.createObjectURL(await response.blob());
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

  const handlePreviewImage = async (fileId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://doctoral-studies-server.vercel.app/download-file/${selectedApp._id}/${fileId}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImagePreview(data.url);
        setOpenImageDialog(true);
      } else {
        console.error('Ошибка при получении изображения');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const closeImageDialog = () => {
    setOpenImageDialog(false);
    setImagePreview(null);
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
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          fontWeight={600}
          sx={{ textAlign: isMobile ? 'center' : 'left' }}
        >
          Кабинет проверяющего
        </Typography>

      </Header>

      <ContentWrapper>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <UserAvatar>{userInitials}</UserAvatar>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            fontWeight={600}
            color={colors.textPrimary}
            mb={1}
          >
            {userData.firstName} {userData.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Проверяющий
          </Typography>
        </Box>

        <MainContent>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            fontWeight={500}
            color={colors.textPrimary}
            mb={2}
          >
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
                      p: isMobile ? 1.5 : 2,
                      borderRadius: '8px',
                      background: colors.rowBackground,
                      '&:hover': {
                        backgroundColor: '#E9EDF2',
                        cursor: 'pointer',
                      },
                      animation: `${fadeIn} 0.3s ease forwards`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                    onClick={() => handleOpenDialog(application)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: colors.primary, width: isMobile ? 36 : 40, height: isMobile ? 36 : 40 }}>
                        <AssignmentIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap={isMobile ? 'wrap' : 'nowrap'}>
                          <Typography
                            variant={isMobile ? 'body2' : 'body1'}
                            fontWeight={500}
                          >
                            {application.subject || 'Заявка на рассмотрение'}
                          </Typography>
                          <StatusChip
                            label={status.label}
                            style={{
                              backgroundColor: status.color + '20',
                              color: status.color,
                              marginTop: isMobile ? theme.spacing(1) : 0,
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            display="block"
                            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                          >
                            <PersonIcon sx={{ fontSize: isMobile ? 12 : 14, verticalAlign: 'middle', mr: 0.5 }} />
                            {application.applicantName || 'Докторант'}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                          >
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        sx={{ '& .MuiDialog-paper': { borderRadius: isMobile ? 0 : '12px' } }}
      >
        <DialogTitle sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
          Детали заявки
        </DialogTitle>
        <DialogContent dividers sx={{ padding: isMobile ? theme.spacing(2) : theme.spacing(3) }}>
          {selectedApp && (
            <Box>
              <Grid container spacing={isMobile ? 1 : 2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    <strong>Тема:</strong> {selectedApp.subject}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    <strong>Отправитель:</strong> {selectedApp.applicantName}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    <strong>Дата подачи:</strong> {new Date(selectedApp.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    <strong>Содержание:</strong>
                  </Typography>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ fontSize: isMobile ? '0.85rem' : '1rem' }}
                  >
                    {selectedApp.content}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: isMobile ? 1 : 2 }} />

              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
              >
                <strong>Прикрепленные файлы:</strong>
              </Typography>

              {/* Секция с изображениями */}
              {selectedApp.files.some(file => isImageFile(file)) && (
                <Box mt={isMobile ? 1 : 2} mb={isMobile ? 2 : 3}>
                  <Typography
                    variant="subtitle1"
                    mb={1}
                    sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                  >
                    <strong>Изображения:</strong>
                  </Typography>
                  <Grid container spacing={isMobile ? 1 : 2}>
                    {selectedApp.files
                      .filter(file => isImageFile(file))
                      .map((file) => (
                        <Grid item xs={6} sm={4} md={3} key={file._id}>
                          <ImageCard
                            onClick={() => handlePreviewImage(file._id)}
                            sx={{ cursor: 'pointer' }}
                          >
                            <CardMedia
                              component="img"
                              height={isMobile ? '100' : '120'}
                              image={file.cloudinaryUrl}
                              alt={file.originalName}
                            />
                            <Box p={isMobile ? 0.5 : 1}>
                              <Typography
                                variant="caption"
                                noWrap
                                sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}
                              >
                                {file.originalName}
                              </Typography>
                            </Box>
                          </ImageCard>
                        </Grid>
                      ))}
                  </Grid>
                </Box>
              )}

    

              <Divider sx={{ my: isMobile ? 1 : 2 }} />

              <Box mt={isMobile ? 2 : 3}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                >
                  <strong>Решение по заявке:</strong>
                </Typography>
                <Box display="flex" gap={isMobile ? 1 : 2} mb={isMobile ? 1 : 2} flexWrap={isMobile ? 'wrap' : 'nowrap'}>
                  <Button
                    variant={decision === 'approved' ? 'contained' : 'outlined'}
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => setDecision('approved')}
                    size={isMobile ? 'small' : 'medium'}
                  >
                    Одобрить
                  </Button>
                  <Button
                    variant={decision === 'rejected' ? 'contained' : 'outlined'}
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => setDecision('rejected')}
                    size={isMobile ? 'small' : 'medium'}
                  >
                    Отклонить
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  label="Комментарий"
                  multiline
                  rows={isMobile ? 3 : 4}
                  variant="outlined"
                  value={decisionComment}
                  onChange={(e) => setDecisionComment(e.target.value)}
                  sx={{ fontSize: isMobile ? '0.85rem' : '1rem' }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: isMobile ? theme.spacing(1) : theme.spacing(2) }}>
          <Button onClick={handleCloseDialog} size={isMobile ? 'small' : 'medium'}>
            Отмена
          </Button>
          <Button
            onClick={handleDecisionSubmit}
            disabled={!decision}
            variant="contained"
            color="primary"
            size={isMobile ? 'small' : 'medium'}
          >
            Сохранить решение
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог предпросмотра изображения */}
      <ImagePreviewDialog
        open={openImageDialog}
        onClose={closeImageDialog}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogContent>
          {imagePreview && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                height: isMobile ? '100vh' : 'calc(100vh - 120px)',
                overflow: 'auto',
              }}
            >
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: isMobile ? theme.spacing(1) : theme.spacing(2) }}>
          <Button onClick={closeImageDialog} size={isMobile ? 'small' : 'medium'}>
            Закрыть
          </Button>
          <Button
            color="primary"
            startIcon={<DownloadIcon />}
            size={isMobile ? 'small' : 'medium'}
            onClick={() => {
              const link = document.createElement('a');
              link.href = imagePreview;
              link.download = imagePreview.split('/').pop();
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Скачать
          </Button>
        </DialogActions>
      </ImagePreviewDialog>
    </Box>
  );
};

export default ReviewerCabinet;