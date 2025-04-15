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
  CardMedia
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImageIcon from '@mui/icons-material/Image';

// Цветовая схема
const colors = {
  primary: '#1A3C59',
  secondary: '#F5F6F5',
  textPrimary: '#1A3C5A',
  white: '#FFFFFF',
  error: '#EF4444',
  success: '#4CAF50',
  warning: '#FF9800',
  hover: '#2A4A6B',
};

// Styled components
const DocumentsContainer = styled(Box)({
  minHeight: '100vh',
  padding: '24px',
  display: 'flex',
  justifyContent: 'center',
});

const ContentWrapper = styled(Box)({
  width: '100%',
  maxWidth: '1200px',
});

const StyledTable = styled(Table)({
  minWidth: 650,
  '& .MuiTableCell-root': {
    padding: '12px 16px',
  },
});

const StatusChip = styled(Chip)({
  fontWeight: 600,
  fontSize: '0.75rem',
});

const DownloadButton = styled(Button)({
  color: colors.primary,
  borderColor: colors.primary,
  '&:hover': {
    backgroundColor: colors.primary + '10',
    borderColor: colors.hover,
  },
});

const ViewButton = styled(Button)({
  color: colors.primary,
  borderColor: colors.primary,
  '&:hover': {
    backgroundColor: colors.primary + '10',
    borderColor: colors.hover,
  },
});

const ImagePreviewDialog = styled(Dialog)({
  '& .MuiDialogContent-root': {
    padding: 0,
  },
});

const ImageCard = styled(Card)({
  maxWidth: '100%',
  overflow: 'hidden',
  marginBottom: '12px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
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

  // API базовый URL - измените на URL вашего API при развертывании
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
          setError(data.error || 'Ошибка при загрузке документов');
        }
      } catch (err) {
        setError('Произошла ошибка: ' + err.message);
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
        // Получаем URL из Cloudinary
        const data = await response.json();

        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        link.href = data.url;
        link.setAttribute('download', data.name);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка при скачивании файла');
      }
    } catch (err) {
      setError('Произошла ошибка: ' + err.message);
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
        setError(errorData.error || 'Ошибка при получении изображения');
      }
    } catch (err) {
      setError('Произошла ошибка: ' + err.message);
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
        return { color: colors.success, label: 'Одобрено' };
      case 'rejected':
        return { color: colors.error, label: 'Отклонено' };
      case 'reviewed':
        return { color: colors.warning, label: 'Рассмотрено' };
      default:
        return { color: colors.primary, label: 'В обработке' };
    }
  };

  if (loading) {
    return (
      <DocumentsContainer>
        <ContentWrapper>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress color="primary" />
          </Box>
        </ContentWrapper>
      </DocumentsContainer>
    );
  }

  if (error) {
    return (
      <DocumentsContainer>
        <ContentWrapper>
          <Typography color="error" align="center" py={4}>
            {error}
          </Typography>
        </ContentWrapper>
      </DocumentsContainer>
    );
  }

  return (
    <DocumentsContainer>
      <ContentWrapper>
        <Typography variant="h4" gutterBottom fontWeight={600} color={colors.textPrimary}>
          Мои документы
        </Typography>

        {documents.length === 0 ? (
          <Typography variant="body1" color={colors.textPrimary} py={4}>
            Вы еще не отправляли документы
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper} elevation={3}>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Тема</TableCell>
                    <TableCell>Получатель</TableCell>
                    <TableCell>Дата отправки</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((doc) => {
                    const status = getStatusColor(doc.status);
                    return (
                      <TableRow key={doc._id}>
                        <TableCell>{doc.subject}</TableCell>
                        <TableCell>{doc.recipient}</TableCell>
                        <TableCell>
                          {new Date(doc.createdAt).toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <StatusChip
                            label={status.label}
                            style={{ backgroundColor: status.color + '20', color: status.color }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleOpenDialog(doc)}
                            >
                              Просмотр
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </StyledTable>
            </TableContainer>

            {/* Диалог просмотра документа */}
            <Dialog
              open={openDialog}
              onClose={handleCloseDialog}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>Детали документа</DialogTitle>
              <DialogContent dividers>
                {selectedDocument && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Тема:</strong> {selectedDocument.subject}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Получатель:</strong> {selectedDocument.recipient}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Дата отправки:</strong> {new Date(selectedDocument.createdAt).toLocaleString('ru-RU')}
                    </Typography>
                    <Box mt={2} mb={2}>
                      <Typography variant="subtitle1" gutterBottom>
                        <strong>Содержание:</strong>
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {selectedDocument.content}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Прикрепленные файлы:</strong>
                    </Typography>

                    {/* Секция с изображениями */}
                    {selectedDocument.files.some(file => isImageFile(file)) && (
                      <Box mt={2} mb={3}>
                        <Typography variant="subtitle1" mb={1}>
                          <strong>Изображения:</strong>
                        </Typography>
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          gap={2}
                        >
                          {selectedDocument.files
                            .filter(file => isImageFile(file))
                            .map((file) => (
                              <ImageCard
                                key={file._id}
                                onClick={() => handlePreviewImage(selectedDocument._id, file._id)}
                                sx={{ width: '150px', cursor: 'pointer' }}
                              >
                                <CardMedia
                                  component="img"
                                  height="120"
                                  image={file.cloudinaryUrl}
                                  alt={file.originalName}
                                />
                                <Box p={1}>
                                  <Typography variant="caption" noWrap>
                                    {file.originalName}
                                  </Typography>
                                </Box>
                              </ImageCard>
                            ))}
                        </Box>
                      </Box>
                    )}

                    {/* Список всех файлов */}
                    {/* <List>
                      {selectedDocument.files.map((file) => (
                        <ListItem
                          key={file._id}
                          secondaryAction={
                            <Box display="flex" gap={1}>
                              {isImageFile(file) && (
                                <ViewButton
                                  variant="outlined"
                                  size="small"
                                  startIcon={<ImageIcon />}
                                  onClick={() => handlePreviewImage(selectedDocument._id, file._id)}
                                >
                                  Просмотр
                                </ViewButton>
                              )}
                              <DownloadButton
                                variant="outlined"
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleDownload(selectedDocument._id, file._id, file.originalName)}
                              >
                                Скачать
                              </DownloadButton>
                            </Box>
                          }
                        >
                          <ListItemText
                            primary={file.fieldName}
                            secondary={file.originalName}
                          />
                        </ListItem>
                      ))}
                    </List> */}
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Закрыть</Button>
              </DialogActions>
            </Dialog>

            {/* Диалог предпросмотра изображения */}
            <ImagePreviewDialog
              open={openImageDialog}
              onClose={closeImageDialog}
              maxWidth="lg"
              fullWidth
            >
              <DialogContent>
                {imagePreview && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      height: 'calc(100vh - 120px)',
                      overflow: 'auto'
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
              <DialogActions>
                <Button onClick={closeImageDialog}>Закрыть</Button>
       
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
                >
                  Скачать
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