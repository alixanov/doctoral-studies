import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardMedia,
  useMediaQuery,
  useTheme,
  Grid,
  IconButton,
  Avatar,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImageIcon from '@mui/icons-material/Image';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Ранг схемаси
const colors = {
  primary: '#1A3C59',
  secondary: '#F5F6F5',
  textPrimary: '#1A3C5A',
  white: '#FFFFFF',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  hover: '#2A4A6B',
  background: '#F8FAFC',
  border: '#E2E8F0',
};

// Стилланган компонентлар
const DocumentsContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1200px',
  backgroundColor: colors.white,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[1],
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    boxShadow: 'none',
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
  '& .MuiTableCell-root': {
    padding: theme.spacing(1.5, 2),
    borderColor: colors.border,
  },
  '& .MuiTableHead-root': {
    backgroundColor: colors.primary + '08',
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  borderRadius: theme.shape.borderRadius,
}));

const DocumentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s ease',
  border: `1px solid ${colors.border}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
    borderColor: colors.primary,
  },
}));

const ImageCard = styled(Card)(({ theme }) => ({
  maxWidth: '100%',
  overflow: 'hidden',
  marginBottom: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  border: `1px solid ${colors.border}`,
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[3],
  },
}));

const ImagePreviewDialog = styled(Dialog)({
  '& .MuiDialogContent-root': {
    padding: 0,
  },
});

const DocumentsList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://doctoral-studies-server.vercel.app';

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/user-documents`, {
          headers: {
            'Authorization': token,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setDocuments(data);
        } else {
          setError(data.error || 'Ҳужжатларни юклашда хатолик');
        }
      } catch (err) {
        setError('Хатолик юз берди: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [navigate, API_BASE_URL]);

  const handleDownload = async (documentId, fileId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/file/${documentId}/${fileId}`, {
        headers: {
          'Authorization': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const link = document.createElement('a');
        link.href = data.url;
        link.setAttribute('download', data.name);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Файлни юклаб олишда хатолик');
      }
    } catch (err) {
      setError('Хатолик юз берди: ' + err.message);
    }
  };

  const isImageFile = (file) => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.includes(file.mimetype);
  };

  const handlePreviewImage = async (documentId, fileId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/file/${documentId}/${fileId}`, {
        headers: {
          'Authorization': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImagePreview(data.url);
        setOpenImageDialog(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Расмни олишда хатолик');
      }
    } catch (err) {
      setError('Хатолик юз берди: ' + err.message);
    }
  };

  const handleOpenDialog = (document) => {
    setSelectedDocument(document);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const closeImageDialog = () => {
    setOpenImageDialog(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return { color: colors.success, label: 'Қабул қилинди', icon: '✅' };
      case 'rejected':
        return { color: colors.error, label: 'Рад этилди', icon: '❌' };
      case 'reviewed':
        return { color: colors.warning, label: 'Кўриб чиқилди', icon: '🔍' };
      default:
        return { color: colors.primary, label: 'Жараёнда', icon: '⏳' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Мобил учун ҳужжатлар рўйхати
  const MobileDocumentsList = () => (
    <Stack spacing={2} alignItems="center">
      {documents.map((doc) => {
        const status = getStatusColor(doc.status);
        return (
          <DocumentCard
            key={doc._id}
            sx={{
              width: '100%',
              maxWidth: '300px'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar sx={{ bgcolor: colors.primary + '20', color: colors.primary }}>
                <DescriptionIcon />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight={600} noWrap>
                  {doc.subject}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <StatusChip
                    label={status.label}
                    size="small"
                    style={{
                      backgroundColor: status.color + '10',
                      color: status.color,
                      border: `1px solid ${status.color}`
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {status.icon}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {doc.recipient}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(doc.createdAt)}
                  </Typography>
                </Stack>
              </Box>

              <IconButton
                size="small"
                onClick={() => handleOpenDialog(doc)}
                sx={{ alignSelf: 'center' }}
              >
                <MoreVertIcon />
              </IconButton>
            </Stack>
          </DocumentCard>
        );
      })}
    </Stack>
  );

  // Десктоп учун ҳужжатлар рўйхати
  const DesktopDocumentsList = () => (
    <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${colors.border}` }}>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Мавзу</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Қабул қилувчи</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Юборилган сана</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Ҳолати</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Ҳаракатлар</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc) => {
            const status = getStatusColor(doc.status);
            return (
              <TableRow
                key={doc._id}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {doc.subject}
                  </Typography>
                </TableCell>
                <TableCell>{doc.recipient}</TableCell>
                <TableCell>{formatDate(doc.createdAt)}</TableCell>
                <TableCell>
                  <StatusChip
                    label={status.label}
                    size="small"
                    style={{
                      backgroundColor: status.color + '10',
                      color: status.color,
                      border: `1px solid ${status.color}`
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleOpenDialog(doc)}
                    sx={{
                      borderColor: colors.border,
                      '&:hover': {
                        borderColor: colors.primary,
                        backgroundColor: colors.primary + '08',
                      }
                    }}
                  >
                    Кўриш
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );

  if (loading) {
    return (
      <DocumentsContainer>
        <ContentWrapper>
          <Box display="flex" flexDirection="column" alignItems="center" py={4}>
            <CircularProgress color="primary" size={60} thickness={4} />
            <Typography variant="body1" mt={2} color="text.secondary">
              Ҳужжатларингиз юкланмоқда...
            </Typography>
          </Box>
        </ContentWrapper>
      </DocumentsContainer>
    );
  }

  if (error) {
    return (
      <DocumentsContainer>
        <ContentWrapper>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            py={4}
            textAlign="center"
          >
            <Typography color="error" variant="h6" gutterBottom>
              Юклашда хатолик
            </Typography>
            <Typography color="text.secondary" paragraph>
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              Қайта уриниш
            </Button>
          </Box>
        </ContentWrapper>
      </DocumentsContainer>
    );
  }

  return (
    <DocumentsContainer>
      <ContentWrapper>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          gutterBottom
          fontWeight={700}
          color={colors.textPrimary}
          sx={{ mb: 3 }}
        >
          Менинг ҳужжатларим
        </Typography>

        {documents.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            py={6}
            textAlign="center"
          >
            <DescriptionIcon sx={{ fontSize: 60, color: colors.border, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Ҳужжатлар топилмади
            </Typography>
            <Typography variant="body1" color={colors.textPrimary}>
              Сиз ҳали ҳужжат юбормагансиз ёки улар юкланмаган
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => navigate('/create-document')}
            >
              Ҳужжат яратиш
            </Button>
          </Box>
        ) : (
          <>
            {isMobile ? <MobileDocumentsList /> : <DesktopDocumentsList />}

            {/* Ҳужжат тафсилотлари диалоги */}
            <Dialog
              open={openDialog}
              onClose={handleCloseDialog}
              maxWidth="md"
              fullWidth
              fullScreen={isMobile}
              PaperProps={{
                sx: {
                  borderRadius: isMobile ? 0 : theme.shape.borderRadius * 2
                }
              }}
            >
              {isMobile && (
                <DialogTitle sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: `1px solid ${colors.border}`
                }}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleCloseDialog}
                    aria-label="close"
                    sx={{ mr: 1 }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  Ҳужжат тафсилотлари
                </DialogTitle>
              )}

              {!isMobile && (
                <DialogTitle sx={{
                  borderBottom: `1px solid ${colors.border}`,
                  fontWeight: 600
                }}>
                  Ҳужжат тафсилотлари
                </DialogTitle>
              )}

              <DialogContent dividers sx={{ pt: isMobile ? 2 : 3 }}>
                {selectedDocument && (
                  <Stack spacing={3}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Мавзу
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {selectedDocument.subject}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={4}>
                      <Stack spacing={1} flex={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Қабул қилувчи
                        </Typography>
                        <Typography variant="body1">
                          {selectedDocument.recipient}
                        </Typography>
                      </Stack>

                      <Stack spacing={1} flex={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Юборилган сана
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedDocument.createdAt)}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Ҳолати
                      </Typography>
                      <StatusChip
                        label={getStatusColor(selectedDocument.status).label}
                        style={{
                          backgroundColor: getStatusColor(selectedDocument.status).color + '10',
                          color: getStatusColor(selectedDocument.status).color,
                          border: `1px solid ${getStatusColor(selectedDocument.status).color}`,
                          alignSelf: 'flex-start'
                        }}
                      />
                    </Stack>

                    <Divider />

                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Матн
                      </Typography>
                      <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                        {selectedDocument.content}
                      </Typography>
                    </Stack>

                    {selectedDocument.files && selectedDocument.files.length > 0 && (
                      <>
                        <Divider />

                        <Stack spacing={2}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Илова қилинган файллар ({selectedDocument.files.length})
                          </Typography>

                          {/* Расмлар */}
                          {selectedDocument.files.some(file => isImageFile(file)) && (
                            <Stack spacing={1}>
                              <Typography variant="subtitle2">
                                Расмлар
                              </Typography>
                              <Grid container spacing={2}>
                                {selectedDocument.files
                                  .filter(file => isImageFile(file))
                                  .map((file) => (
                                    <Grid item xs={6} sm={4} md={3} key={file._id}>
                                      <ImageCard
                                        onClick={() => handlePreviewImage(selectedDocument._id, file._id)}
                                        sx={{ cursor: 'pointer' }}
                                      >
                                        <CardMedia
                                          component="img"
                                          height="140"
                                          image={file.cloudinaryUrl}
                                          alt={file.originalName}
                                          sx={{
                                            objectFit: 'cover',
                                            aspectRatio: '4/3'
                                          }}
                                        />
                                        <Box p={1.5}>
                                          <Typography
                                            variant="caption"
                                            noWrap
                                            sx={{
                                              display: 'block',
                                              textOverflow: 'ellipsis',
                                              overflow: 'hidden'
                                            }}
                                          >
                                            {file.originalName}
                                          </Typography>
                                        </Box>
                                      </ImageCard>
                                    </Grid>
                                  ))}
                              </Grid>
                            </Stack>
                          )}

                          {/* Бошқа файллар */}
                          {selectedDocument.files.some(file => !isImageFile(file)) && (
                            <Stack spacing={1}>
                              <Typography variant="subtitle2">
                                Ҳужжатлар
                              </Typography>
                              <List dense sx={{
                                backgroundColor: colors.background,
                                borderRadius: theme.shape.borderRadius
                              }}>
                                {selectedDocument.files
                                  .filter(file => !isImageFile(file))
                                  .map((file) => (
                                    <ListItem
                                      key={file._id}
                                      secondaryAction={
                                        <IconButton
                                          edge="end"
                                          aria-label="download"
                                          onClick={() => handleDownload(selectedDocument._id, file._id, file.originalName)}
                                        >
                                          <DownloadIcon />
                                        </IconButton>
                                      }
                                      sx={{
                                        borderBottom: `1px solid ${colors.border}`,
                                        '&:last-child': {
                                          borderBottom: 'none'
                                        }
                                      }}
                                    >
                                      <ListItemText
                                        primary={file.originalName}
                                        primaryTypographyProps={{
                                          variant: 'body2',
                                          noWrap: true
                                        }}
                                      />
                                    </ListItem>
                                  ))}
                              </List>
                            </Stack>
                          )}
                        </Stack>
                      </>
                    )}
                  </Stack>
                )}
              </DialogContent>

              <DialogActions sx={{
                borderTop: `1px solid ${colors.border}`,
                padding: theme.spacing(2)
              }}>
                <Button
                  onClick={handleCloseDialog}
                  sx={{
                    color: colors.textPrimary,
                    '&:hover': {
                      backgroundColor: colors.primary + '08'
                    }
                  }}
                >
                  Ёпиш
                </Button>
                {selectedDocument?.files?.some(file => isImageFile(file)) && (
                  <Button
                    startIcon={<ImageIcon />}
                    onClick={() => {
                      const firstImage = selectedDocument.files.find(file => isImageFile(file));
                      if (firstImage) {
                        handlePreviewImage(selectedDocument._id, firstImage._id);
                      }
                    }}
                    sx={{
                      color: colors.primary,
                      '&:hover': {
                        backgroundColor: colors.primary + '08'
                      }
                    }}
                  >
                    Расмларни кўриш
                  </Button>
                )}
              </DialogActions>
            </Dialog>

            {/* Расмни кўриш диалоги */}
            <ImagePreviewDialog
              open={openImageDialog}
              onClose={closeImageDialog}
              maxWidth="lg"
              fullWidth
              fullScreen={isMobile}
              PaperProps={{
                sx: {
                  borderRadius: isMobile ? 0 : theme.shape.borderRadius * 2,
                  maxHeight: '90vh'
                }
              }}
            >
              {isMobile && (
                <DialogTitle sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: `1px solid ${colors.border}`
                }}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={closeImageDialog}
                    aria-label="close"
                    sx={{ mr: 1 }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  Расмни кўриш
                </DialogTitle>
              )}

              {!isMobile && (
                <DialogTitle sx={{
                  borderBottom: `1px solid ${colors.border}`,
                  fontWeight: 600
                }}>
                  Расмни кўриш
                </DialogTitle>
              )}

              <DialogContent>
                {imagePreview && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      height: isMobile ? 'calc(100vh - 136px)' : 'calc(90vh - 120px)',
                      overflow: 'auto',
                      backgroundColor: '#000',
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                )}
              </DialogContent>

              <DialogActions sx={{
                borderTop: `1px solid ${colors.border}`,
                padding: theme.spacing(2)
              }}>
                <Button
                  onClick={closeImageDialog}
                  sx={{
                    color: colors.textPrimary,
                    '&:hover': {
                      backgroundColor: colors.primary + '08'
                    }
                  }}
                >
                  Ёпиш
                </Button>
                <Button
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = imagePreview;
                    link.download = imagePreview.split('/').pop();
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  sx={{
                    '&:hover': {
                      backgroundColor: colors.primary + '08'
                    }
                  }}
                >
                  Юклаб олиш
                </Button>
              </DialogActions>
            </ImagePreviewDialog>
          </>
        )}
      </ContentWrapper>
    </DocumentsContainer>
  );
};

export default DocumentsList;