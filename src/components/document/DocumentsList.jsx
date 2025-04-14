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
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

const DocumentsList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('https://doctoral-studies-server.vercel.app/user-documents', {
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
  }, [navigate]);

  const handleDownload = async (documentId, fileId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://doctoral-studies-server.vercel.app/download-file/${documentId}/${fileId}`, {
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
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка при скачивании файла');
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
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
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
                    <List>
                      {selectedDocument.files.map((file) => (
                        <ListItem
                          key={file._id}
                          secondaryAction={
                            <DownloadButton
                              variant="outlined"
                              size="small"
                              startIcon={<DownloadIcon />}
                              onClick={() => handleDownload(selectedDocument._id, file._id, file.originalName)}
                            >
                              Скачать
                            </DownloadButton>
                          }
                        >
                          <ListItemText
                            primary={file.fieldName}
                            secondary={file.originalName}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Закрыть</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </ContentWrapper>
    </DocumentsContainer>
  );
};

export default DocumentsList;