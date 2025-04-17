import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Button,
  TextField,
  Avatar,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BookIcon from '@mui/icons-material/Book';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CommentIcon from '@mui/icons-material/Comment';
import DoneIcon from '@mui/icons-material/Done';
import HistoryIcon from '@mui/icons-material/History';

// Educational theme color palette
const colors = {
  primary: '#1565C0', // Deep blue for headers and buttons
  secondary: '#F5F7FA', // Light blue-gray for backgrounds
  accent: '#4CAF50', // Green for success and completed status
  error: '#D32F2F', // Red for errors
  warning: '#FF9800', // Orange for pending status
  text: '#37474F', // Dark blue-gray for text
  lightText: '#78909C', // Lighter text for secondary information
  highlight: '#E3F2FD', // Very light blue for highlights
  borderColor: '#BBDEFB', // Light blue for borders
};

const SubmitButton = styled(Button)(({ disabled }) => ({
  backgroundColor: disabled ? '#CFD8DC' : colors.primary,
  color: '#FFFFFF',
  padding: '10px 24px',
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: disabled ? '#CFD8DC' : '#0D47A1',
  },
  boxShadow: disabled ? 'none' : '0 2px 4px rgba(21, 101, 192, 0.2)',
  transition: 'all 0.3s ease',
}));

const StyledChip = styled(Chip)(({ status }) => ({
  backgroundColor:
    status === 'pending' ? colors.warning : status === 'reviewed' || status === 'completed' ? colors.accent : '#90A4AE',
  color: '#FFFFFF',
  fontSize: 12,
  fontWeight: 600,
  height: 26,
  borderRadius: 13,
}));

const StyledAccordion = styled(Accordion)({
  boxShadow: 'none',
  border: `1px solid ${colors.borderColor}`,
  borderRadius: '8px !important',
  marginBottom: 12,
  '&:before': {
    display: 'none',
  },
  '& .MuiAccordionSummary-root': {
    borderRadius: '8px 8px 0 0',
    backgroundColor: colors.highlight,
    padding: '8px 16px',
    minHeight: '48px !important',
    '& .MuiAccordionSummary-content': {
      margin: '8px 0',
    }
  },
  '& .MuiAccordionDetails-root': {
    padding: '8px 16px 16px',
  }
});

const AssessmentCard = styled(Box)(({ selected }) => ({
  backgroundColor: '#FFFFFF',
  padding: 16,
  marginBottom: 12,
  borderRadius: 8,
  cursor: 'pointer',
  border: selected ? `2px solid ${colors.primary}` : `1px solid ${colors.borderColor}`,
  boxShadow: selected ? '0 3px 10px rgba(21, 101, 192, 0.1)' : 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 3px 10px rgba(21, 101, 192, 0.1)',
  }
}));

// Custom TextField with education theme
const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    fontSize: 15,
    '& fieldset': {
      borderColor: colors.borderColor,
    },
    '&:hover fieldset': {
      borderColor: colors.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.primary,
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: 14,
  }
});

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://doctoral-studies-server.vercel.app';

const ReviewerAssessments = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [completedAssessments, setCompletedAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedCompletedAssessment, setSelectedCompletedAssessment] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [debugOpen, setDebugOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Convert numeric rating to grade (1-20 to 2-5)
  const getGradeFromRating = (rating) => {
    if (rating >= 17) return '5';
    if (rating >= 14) return '4';
    if (rating >= 11) return '3';
    return '2'; // For ratings below 11
  };

  // Debug function to inspect API responses
  const inspectResponse = async (response) => {
    const debugData = {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: null
    };

    try {
      const text = await response.clone().text();
      debugData.body = text;
      try {
        debugData.parsedJson = JSON.parse(text);
      } catch (e) {
        debugData.jsonError = e.message;
      }
    } catch (e) {
      debugData.bodyError = e.message;
    }

    return debugData;
  };

  // Load assessments with detailed error handling
  const fetchAssessments = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authorization token not found');
      }

      const response = await fetch(`${API_BASE_URL}/reviewer-assessments`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
      });

      const debugData = await inspectResponse(response);
      setDebugInfo(debugData);

      if (!response.ok) {
        throw new Error(
          debugData.parsedJson?.error ||
          debugData.body ||
          `HTTP error! status: ${response.status}`
        );
      }

      if (!debugData.parsedJson) {
        throw new Error('Server returned invalid JSON format');
      }

      setAssessments(debugData.parsedJson);

      // Fetch completed assessments
      await fetchCompletedAssessments();
    } catch (err) {
      setError(`Не удалось загрузить оценки: ${err.message}`);
      console.error('API Error:', err);
      console.log('Debug Info:', debugInfo);
    } finally {
      setLoading(false);
    }
  };

  // Load completed assessments
  const fetchCompletedAssessments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authorization token not found');
      }

      const response = await fetch(`${API_BASE_URL}/completed-assessments-reviewer`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setCompletedAssessments(data);
    } catch (err) {
      console.error('Failed to fetch completed assessments:', err);
      setError('Не удалось загрузить проверенные работы');
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  // Handle assessment selection
  const handleSelectAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setSelectedCompletedAssessment(null);
    setRatings(Array(assessment.answers.length).fill(0));
    setFeedback('');
    setError('');
    setSuccess('');
    if (isMobile) setDrawerOpen(false);
  };

  // Handle completed assessment selection
  const handleSelectCompletedAssessment = (assessment) => {
    setSelectedCompletedAssessment(assessment);
    setSelectedAssessment(null);
    setError('');
    setSuccess('');
    if (isMobile) setDrawerOpen(false);
  };

  // Handle rating changes (1-20)
  const handleRatingChange = (index, value) => {
    // Convert to number and ensure it's within 1-20 range
    let numericValue = Number(value);
    if (isNaN(numericValue)) numericValue = 0;
    numericValue = Math.min(20, Math.max(1, numericValue));

    const newRatings = [...ratings];
    newRatings[index] = numericValue;
    setRatings(newRatings);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedAssessment(null);
    setSelectedCompletedAssessment(null);
  };

  const handleSubmitReview = async () => {
    if (ratings.some(rating => rating === 0)) {
      setError('Пожалуйста, оцените все ответы');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authorization token not found');
      }

      const reviewData = {
        assessmentId: selectedAssessment._id,
        answers: selectedAssessment.answers.map((answerItem, index) => ({
          rating: ratings[index]
        })),
        feedback: feedback
      };

      console.log('Отправляемые данные:', reviewData);

      const response = await fetch(`${API_BASE_URL}/submit-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(reviewData),
      });

      const debugData = await inspectResponse(response);
      setDebugInfo(debugData);

      if (!response.ok) {
        throw new Error(
          debugData.parsedJson?.error ||
          debugData.body ||
          `HTTP error! status: ${response.status}`
        );
      }

      setSuccess('Оценка успешно отправлена');
      setAssessments(assessments.filter(assessment =>
        assessment._id !== selectedAssessment._id
      ));
      setSelectedAssessment(null);

      // Refresh assessments list after successful submission
      await fetchAssessments();
    } catch (err) {
      setError(`Не удалось отправить оценку: ${err.message}`);
      console.error('Submission Error:', err);
      console.log('Debug Info:', debugInfo);
    } finally {
      setSubmitting(false);
    }
  };

  // Render status chip
  const renderStatus = (status) => {
    return <StyledChip
      label={
        status === 'pending' ? 'Ожидает проверки' :
          status === 'reviewed' ? 'Проверено' :
            status === 'completed' ? 'Оценено' :
              'Неизвестно'
      }
      status={status}
    />;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Debug dialog
  const handleDebugClose = () => setDebugOpen(false);
  const handleDebugOpen = () => setDebugOpen(true);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress size={40} thickness={4} sx={{ color: colors.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      p: { xs: 2, md: 3 },
      maxWidth: 1200,
      mx: 'auto',
      bgcolor: colors.secondary,
      borderRadius: 3,
      minHeight: 'calc(100vh - 32px)'
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <SchoolIcon sx={{ fontSize: { xs: 28, md: 32 }, color: colors.primary, mr: 1.5 }} />
          <Typography variant="h5" fontWeight={700} color={colors.primary} sx={{ fontSize: { xs: '1.4rem', md: '1.5rem' } }}>
            Проверка академических работ
          </Typography>
        </Box>
        {isMobile && selectedAssessment && (
          <Button
            onClick={() => setDrawerOpen(true)}
            variant="outlined"
            sx={{
              borderColor: colors.primary,
              color: colors.primary,
              textTransform: 'none',
              fontSize: 14
            }}
          >
            Список работ
          </Button>
        )}
      </Box>

      {error && (
        <Box bgcolor="#FFEBEE" p={2} borderRadius={2} mb={3}>
          <Typography color={colors.error} sx={{ fontSize: 15 }}>
            {error}
          </Typography>
        </Box>
      )}

      {success && (
        <Box bgcolor="#E8F5E9" p={2} borderRadius={2} mb={3}>
          <Typography color={colors.accent} sx={{ fontSize: 15 }}>
            {success}
          </Typography>
        </Box>
      )}

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          borderBottom: `1px solid ${colors.borderColor}`,
          '& .MuiTab-root': {
            fontSize: { xs: 14, md: 15 },
            fontWeight: 600,
            textTransform: 'none',
            minWidth: { xs: 'auto', md: 180 },
            px: { xs: 1, md: 2 },
          },
          '& .Mui-selected': {
            color: colors.primary,
          },
          '& .MuiTabs-indicator': {
            backgroundColor: colors.primary,
            height: 3,
          }
        }}
      >
        <Tab
          icon={<AssignmentIcon sx={{ fontSize: { xs: 20, md: 24 } }} />}
          iconPosition="start"
          label={isMobile ? 'На проверку' : 'Работы на проверку'}
          id="tab-pending"
          sx={{ minHeight: 48 }}
        />
        <Tab
          icon={<DoneIcon sx={{ fontSize: { xs: 20, md: 24 } }} />}
          iconPosition="start"
          label={isMobile ? 'Проверенные' : 'Проверенные работы'}
          id="tab-completed"
          sx={{ minHeight: 48 }}
        />
      </Tabs>

      <Grid container spacing={3}>
        {/* Assessments list - Pending tab */}
        {activeTab === 0 && (
          <Grid item xs={12} md={selectedAssessment ? (isMobile && !drawerOpen ? 0 : 4) : 12}
            sx={{
              display: isMobile && selectedAssessment && !drawerOpen ? 'none' : 'block',
              transition: 'all 0.3s ease'
            }}
          >
            <Box mb={2} display="flex" alignItems="center">
              <AssignmentIcon sx={{ color: colors.primary, mr: 1 }} />
              <Typography variant="h6" fontWeight={600} color={colors.text}>
                {isMobile ? 'На проверку' : 'Список работ на проверку'}
              </Typography>
            </Box>

            {assessments.length === 0 ? (
              <Box bgcolor="#FFFFFF" p={3} borderRadius={2} textAlign="center" border={`1px dashed ${colors.borderColor}`}>
                <Typography color={colors.lightText} fontSize={15}>
                  Нет работ для проверки
                </Typography>
              </Box>
            ) : (
              assessments.map((assessment) => (
                <AssessmentCard
                  key={assessment._id}
                  selected={selectedAssessment?._id === assessment._id}
                  onClick={() => handleSelectAssessment(assessment)}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={assessment.userInfo?.profilePhoto}
                      alt={assessment.userInfo?.firstName}
                      sx={{
                        mr: 2,
                        width: 40,
                        height: 40,
                        bgcolor: colors.primary
                      }}
                    >
                      {assessment.userInfo?.firstName?.[0] || '?'}
                    </Avatar>
                    <Box flexGrow={1} sx={{ overflow: 'hidden' }}>
                      <Typography fontWeight={600} fontSize={15} color={colors.text} noWrap>
                        {assessment.userInfo?.firstName || 'Неизвестно'} {assessment.userInfo?.lastName || ''}
                      </Typography>
                      <Typography fontSize={13} color={colors.lightText} noWrap>
                        Дата сдачи: {formatDate(assessment.createdAt)}
                      </Typography>
                    </Box>
                    {renderStatus(assessment.status)}
                  </Box>
                </AssessmentCard>
              ))
            )}
          </Grid>
        )}

        {/* Completed Assessments list */}
        {activeTab === 1 && (
          <Grid item xs={12} md={selectedCompletedAssessment ? (isMobile && !drawerOpen ? 0 : 4) : 12}
            sx={{
              display: isMobile && selectedCompletedAssessment && !drawerOpen ? 'none' : 'block',
              transition: 'all 0.3s ease'
            }}
          >
            <Box mb={2} display="flex" alignItems="center">
              <DoneIcon sx={{ color: colors.primary, mr: 1 }} />
              <Typography variant="h6" fontWeight={600} color={colors.text}>
                {isMobile ? 'Проверенные' : 'Проверенные работы'}
              </Typography>
            </Box>

            {completedAssessments.length === 0 ? (
              <Box bgcolor="#FFFFFF" p={3} borderRadius={2} textAlign="center" border={`1px dashed ${colors.borderColor}`}>
                <Typography color={colors.lightText} fontSize={15}>
                  Нет проверенных работ
                </Typography>
              </Box>
            ) : (
              completedAssessments.map((assessment) => (
                <AssessmentCard
                  key={assessment._id}
                  selected={selectedCompletedAssessment?._id === assessment._id}
                  onClick={() => handleSelectCompletedAssessment(assessment)}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={assessment.userInfo?.profilePhoto}
                      alt={assessment.userInfo?.firstName}
                      sx={{
                        mr: 2,
                        width: 40,
                        height: 40,
                        bgcolor: colors.primary
                      }}
                    >
                      {assessment.userInfo?.firstName?.[0] || '?'}
                    </Avatar>
                    <Box flexGrow={1} sx={{ overflow: 'hidden' }}>
                      <Typography fontWeight={600} fontSize={15} color={colors.text} noWrap>
                        {assessment.userInfo?.firstName || 'Неизвестно'} {assessment.userInfo?.lastName || ''}
                      </Typography>
                      <Typography fontSize={13} color={colors.lightText} noWrap>
                        Проверено: {formatDate(assessment.completedAt)}
                      </Typography>
                    </Box>
                    {renderStatus('completed')}
                  </Box>
                </AssessmentCard>
              ))
            )}
          </Grid>
        )}

        {/* Assessment details for pending */}
        {activeTab === 0 && selectedAssessment && (
          <Grid item xs={12} md={8}
            sx={{
              display: isMobile && drawerOpen ? 'none' : 'block',
              transition: 'all 0.3s ease'
            }}
          >
            <Box bgcolor="#FFFFFF" p={3} borderRadius={2} border={`1px solid ${colors.borderColor}`}>
              <Box display="flex" alignItems="center" mb={2}>
                <SchoolIcon sx={{ color: colors.primary, mr: 1.5 }} />
                <Typography variant="h6" fontWeight={600} color={colors.primary}>
                  Проверка работы студента
                </Typography>
              </Box>

              <Box p={2} mb={3} bgcolor={colors.highlight} borderRadius={2}>
                <Typography fontWeight={600} fontSize={15} color={colors.text}>
                  {selectedAssessment.userInfo?.firstName || 'Неизвестно'} {selectedAssessment.userInfo?.lastName || ''}
                </Typography>
                <Typography fontSize={14} color={colors.lightText}>
                  Дата сдачи: {formatDate(selectedAssessment.createdAt)}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {selectedAssessment.answers.map((item, index) => (
                <StyledAccordion key={index} defaultExpanded={!isMobile}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: colors.primary }} />}
                  >
                    <Typography fontWeight={600} fontSize={15} color={colors.text}>
                      Вопрос {index + 1}: {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 2 }}>
                    <Box mb={2}>
                      <Typography fontWeight={600} fontSize={14} color={colors.text} mb={1}>
                        Ответ студента:
                      </Typography>
                      <Typography fontSize={14} color={colors.lightText} whiteSpace="pre-wrap">
                        {item.answer}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mt={2} sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } }}>
                      <Typography fontWeight={600} fontSize={14} color={colors.text} sx={{ mb: { xs: 1, sm: 0 } }}>
                        Оценка (1-20):
                      </Typography>
                      <TextField
                        type="number"
                        value={ratings[index] || ''}
                        onChange={(e) => handleRatingChange(index, e.target.value)}
                        inputProps={{
                          min: 1,
                          max: 20,
                          step: 1
                        }}
                        size="small"
                        sx={{ width: 100, ml: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}
                        placeholder="1-20"
                      />
                      {ratings[index] > 0 && (
                        <Typography sx={{ ml: { xs: 0, sm: 2 }, fontSize: 14, color: colors.text }}>
                          Итоговая оценка: {getGradeFromRating(ratings[index])}
                        </Typography>
                      )}
                    </Box>
                  </AccordionDetails>
                </StyledAccordion>
              ))}

              <Box mt={4} mb={2} display="flex" alignItems="center">
                <CommentIcon sx={{ color: colors.primary, mr: 1 }} />
                <Typography fontWeight={600} fontSize={15} color={colors.text}>
                  Итоговый комментарий:
                </Typography>
              </Box>

              <StyledTextField
                fullWidth
                multiline
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Напишите общие замечания и рекомендации для студента"
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <SubmitButton
                fullWidth
                onClick={handleSubmitReview}
                disabled={submitting || selectedAssessment.status === 'reviewed'}
                startIcon={selectedAssessment.status !== 'reviewed' && !submitting && <AssignmentIcon />}
              >
                {submitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : selectedAssessment.status === 'reviewed' ? (
                  'Работа уже проверена'
                ) : (
                  'Отправить оценку'
                )}
              </SubmitButton>
            </Box>
          </Grid>
        )}

        {/* Completed Assessment details */}
        {activeTab === 1 && selectedCompletedAssessment && (
          <Grid item xs={12} md={8}
            sx={{
              display: isMobile && drawerOpen ? 'none' : 'block',
              transition: 'all 0.3s ease'
            }}
          >
            <Box bgcolor="#FFFFFF" p={3} borderRadius={2} border={`1px solid ${colors.borderColor}`}>
              <Box display="flex" alignItems="center" mb={2}>
                <SchoolIcon sx={{ color: colors.primary, mr: 1.5 }} />
                <Typography variant="h6" fontWeight={600} color={colors.primary}>
                  Проверенная работа
                </Typography>
              </Box>

              <Box p={2} mb={3} bgcolor={colors.highlight} borderRadius={2}>
                <Typography fontWeight={600} fontSize={15} color={colors.text}>
                  {selectedCompletedAssessment.userInfo?.firstName || 'Неизвестно'} {selectedCompletedAssessment.userInfo?.lastName || ''}
                </Typography>
                <Typography fontSize={14} color={colors.lightText}>
                  Проверено: {formatDate(selectedCompletedAssessment.completedAt)}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {selectedCompletedAssessment.answers.map((item, index) => (
                <StyledAccordion key={index} defaultExpanded={!isMobile}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: colors.primary }} />}
                  >
                    <Typography fontWeight={600} fontSize={15} color={colors.text}>
                      Вопрос {index + 1}: {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 2 }}>
                    <Box mb={2}>
                      <Typography fontWeight={600} fontSize={14} color={colors.text} mb={1}>
                        Ответ студента:
                      </Typography>
                      <Typography fontSize={14} color={colors.lightText} whiteSpace="pre-wrap">
                        {item.answer}
                      </Typography>
                    </Box>
                    <Box mb={2}>
                      <Typography fontWeight={600} fontSize={14} color={colors.text} mb={1}>
                        Оценка:
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <Typography fontSize={14} color={colors.text} mr={2}>
                          Баллы: {item.rating || 'Нет оценки'}
                        </Typography>
                        <Typography fontSize={14} color={colors.text}>
                          Оценка: {item.rating ? getGradeFromRating(item.rating) : 'Нет оценки'}
                        </Typography>
                      </Box>
                    </Box>
                    {item.feedback && (
                      <Box>
                        <Typography fontWeight={600} fontSize={14} color={colors.text} mb={1}>
                          Комментарий:
                        </Typography>
                        <Typography fontSize={14} color={colors.lightText} whiteSpace="pre-wrap">
                          {item.feedback}
                        </Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </StyledAccordion>
              ))}

              {selectedCompletedAssessment.feedback && (
                <>
                  <Box mt={4} mb={2} display="flex" alignItems="center">
                    <CommentIcon sx={{ color: colors.primary, mr: 1 }} />
                    <Typography fontWeight={600} fontSize={15} color={colors.text}>
                      Итоговый комментарий:
                    </Typography>
                  </Box>
                  <Box bgcolor={colors.highlight} p={2} borderRadius={2}>
                    <Typography fontSize={14} color={colors.text} whiteSpace="pre-wrap">
                      {selectedCompletedAssessment.feedback}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Debug Dialog */}
      <Dialog open={debugOpen} onClose={handleDebugClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: colors.highlight }}>
          Отладочная информация
          <IconButton
            onClick={handleDebugClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: colors.text }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: '#FFFFFF' }}>
          {debugInfo && (
            <>
              <DialogContentText sx={{ mb: 1, fontSize: 14, color: colors.text }}>
                <strong>URL:</strong> {debugInfo.url}
              </DialogContentText>
              <DialogContentText sx={{ mb: 1, fontSize: 14, color: colors.text }}>
                <strong>Статус:</strong> {debugInfo.status} {debugInfo.statusText}
              </DialogContentText>
              <Box mt={2}>
                <Typography variant="subtitle2" fontWeight={600} color={colors.text}>
                  Заголовки:
                </Typography>
                <pre style={{ fontSize: 12, backgroundColor: colors.highlight, padding: 12, borderRadius: 8 }}>
                  {JSON.stringify(debugInfo.headers, null, 2)}
                </pre>
              </Box>
              <Box mt={2}>
                <Typography variant="subtitle2" fontWeight={600} color={colors.text}>
                  Тело ответа:
                </Typography>
                <pre style={{ fontSize: 12, backgroundColor: colors.highlight, padding: 12, borderRadius: 8 }}>
                  {debugInfo.body}
                </pre>
              </Box>
              {debugInfo.jsonError && (
                <Typography color={colors.error} mt={1} fontSize={14}>
                  Ошибка разбора JSON: {debugInfo.jsonError}
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: colors.highlight }}>
          <Button onClick={handleDebugClose} sx={{ color: colors.primary, fontSize: 14, fontWeight: 600 }}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewerAssessments;