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

// Анимация
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

// Ранг схемаси
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

// Стиллар
const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: colors.primary,
  color: colors.white,
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: 11,
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

  // Файллар рўйхати
  const fileFields = [
    { name: 'malumotnoma', label: 'Малұмотнома' },
    { name: 'photo', label: 'Номзоднинг электрон расми' },
    { name: 'passport', label: 'Паспорт нусхаси' },
    { name: 'kengashBayyonomma', label: 'Институт илмий кенгашининг баённомаси' },
    { name: 'dekanatTaqdimnoma', label: 'Деканат ва кафедранинг такдимномаси' },
    { name: 'sinovNatijalari', label: 'Синнав натижалари ведомости' },
    { name: 'ilmiyIshlar', label: 'Илмий ишлар рўйхати' },
    { name: 'annotatsiya', label: 'Илмий (ижодий) ишлар аннотацияси' },
    { name: 'maqolalar', label: 'Илмий мақолалар нусхаси' },
    { name: 'xulosa', label: 'Кафедра мудири ва илмий раҳбарнинг хулосаси' },
    { name: 'testBallari', label: 'Кириш тестларида тўпланган баллар' },
    { name: 'tarjimaiXol', label: 'Номзоднинг автобиографияси' },
    { name: 'reytingDaftarcha', label: 'Рейтинг дафтарчаси' },
    { name: 'guvohnoma', label: 'Муаллифлик гувоҳномаси' },
    { name: 'yutuqlar', label: 'Ютуқлар' },
    { name: 'boshqa', label: 'Бошқалар' },
    { name: 'file', label: 'Умумий файл' },
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
          console.error('Аризаларни юклашда хатолик');
        }
      } catch (error) {
        console.error('Хатолик:', error);
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
        console.error('Ҳолатни янгилашда хатолик');
      }
    } catch (error) {
      console.error('Хатолик:', error);
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
        console.error('Файлни юклаб олишда хатолик');
      }
    } catch (error) {
      console.error('Хатолик:', error);
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
        console.error('Расмни олишда хатолик');
      }
    } catch (error) {
      console.error('Хатолик:', error);
    }
  };

  const closeImageDialog = () => {
    setOpenImageDialog(false);
    setImagePreview(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return { color: colors.success, label: 'Қабул қилинди' };
      case 'rejected':
        return { color: colors.error, label: 'Рад этилди' };
      case 'reviewed':
        return { color: '#FF9800', label: 'Кўриб чиқилди' };
      default:
        return { color: colors.primary, label: 'Жараёнда' };
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
    : 'ТК';

  return (
    <Box>
      <Header>
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          fontWeight={600}
          sx={{ textAlign: isMobile ? 'center' : 'left' }}
        >
          Текширувчи кабинети
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
            Текширувчи
          </Typography>
        </Box>

        <MainContent>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            fontWeight={500}
            color={colors.textPrimary}
            mb={2}
          >
            Текшириш учун аризалар
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
                            {application.subject || 'Кўриб чиқиш учун ариза'}
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
                            Топширилган сана: {new Date(application.createdAt).toLocaleDateString()}
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
                Текшириш учун аризалар мавжуд эмас
              </Typography>
            </Box>
          )}
        </MainContent>
      </ContentWrapper>

      {/* Ариза тафсилотлари диалоги */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        sx={{ '& .MuiDialog-paper': { borderRadius: isMobile ? 0 : '12px' } }}
      >
        <DialogTitle sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
          Ариза тафсилотлари
        </DialogTitle>
        <DialogContent dividers sx={{ padding: isMobile ? theme.spacing(2) : theme.spacing(3) }}>
          {selectedApp && (
            <Box>
              <Grid container spacing={isMobile ? 1 : 2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    <strong>Мавзу:</strong> {selectedApp.subject}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    <strong>Жўнатувчи:</strong> {selectedApp.applicantName}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    <strong>Топширилган сана:</strong> {new Date(selectedApp.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    <strong>Мазмуни:</strong>
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
                <strong>Илова қилинган файллар:</strong>
              </Typography>

              {/* Расмлар секцияси */}
              {selectedApp.files.some(file => isImageFile(file)) && (
                <Box mt={isMobile ? 1 : 2} mb={isMobile ? 2 : 3}>
                  <Typography
                    variant="subtitle1"
                    mb={1}
                    sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                  >
                    <strong>Расмлар:</strong>
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
                  <strong>Ариза бўйича қарор:</strong>
                </Typography>
                <Box display="flex" gap={isMobile ? 1 : 2} mb={isMobile ? 1 : 2} flexWrap={isMobile ? 'wrap' : 'nowrap'}>
                  <Button
                    variant={decision === 'approved' ? 'contained' : 'outlined'}
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => setDecision('approved')}
                    size={isMobile ? 'small' : 'medium'}
                  >
                    Қабул қилиш
                  </Button>
                  <Button
                    variant={decision === 'rejected' ? 'contained' : 'outlined'}
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => setDecision('rejected')}
                    size={isMobile ? 'small' : 'medium'}
                  >
                    Рад этиш
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  label="Изох"
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
            Бекор қилиш
          </Button>
          <Button
            onClick={handleDecisionSubmit}
            disabled={!decision}
            variant="contained"
            color="primary"
            size={isMobile ? 'small' : 'medium'}
          >
            Қарорни сақлаш
          </Button>
        </DialogActions>
      </Dialog>

      {/* Расмни кўриш диалоги */}
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
            Ёпиш
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
            Юклаб олиш
          </Button>
        </DialogActions>
      </ImagePreviewDialog>
    </Box>
  );
};

export default ReviewerCabinet;