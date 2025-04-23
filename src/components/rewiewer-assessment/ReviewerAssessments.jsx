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
  primary: '#1565C0',
  secondary: '#F5F7FA',
  accent: '#4CAF50',
  error: '#D32F2F',
  warning: '#FF9800',
  text: '#37474F',
  lightText: '#78909C',
  highlight: '#E3F2FD',
  borderColor: '#BBDEFB',
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

// Правила преобразования баллов в оценки
const getGradeFromRating = (rating, questionIndex) => {
  if (!rating) return 0;
  switch (questionIndex) {
    case 0: // Вопрос 1 (1–5)
    case 1: // Вопрос 2 (1–5)
    case 8: // Вопрос 9 (1–5)
      return Math.min(5, Math.max(1, Math.round(rating)));
    case 2: // Вопрос 3 (1–20)
    case 4: // Вопрос 5 (1–20)
      if (rating >= 17) return 5;
      if (rating >= 14) return 4;
      if (rating >= 11) return 3;
      return 2;
    case 3: // Вопрос 4 (1–10)
    case 6: // Вопрос 7 (1–10)
    case 7: // Вопрос 8 (1–10)
    case 9: // Вопрос 10 (1–10)
      if (rating >= 9) return 5;
      if (rating >= 7) return 4;
      if (rating >= 5) return 3;
      return 2;
    case 5: // Вопрос 6 (1–15)
      if (rating >= 13) return 5;
      if (rating >= 11) return 4;
      if (rating >= 9) return 3;
      return 2;
    default:
      return 0;
  }
};

// Вычисление итогового балла и оценки
const calculateFinalGrade = (grades) => {
  const weight = 2.2; // Вес для преобразования оценок в баллы (5 × 2.2 = 11)
  const total = grades.reduce((sum, grade) => sum + grade * weight, 0);
  if (total < 60) return { grade: 0, status: 'rejected', total: Math.round(total * 10) / 10 };
  if (total >= 90) return { grade: 5, status: 'approved', total: Math.round(total * 10) / 10 };
  if (total >= 70) return { grade: 4, status: 'approved', total: Math.round(total * 10) / 10 };
  if (total >= 60) return { grade: 3, status: 'approved', total: Math.round(total * 10) / 10 };
  return { grade: 0, status: 'rejected', total: Math.round(total * 10) / 10 };
};

// Максимальные баллы для каждого вопроса
const maxRatings = [5, 5, 20, 10, 20, 15, 10, 10, 5, 10];

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
  const [questionFeedbacks, setQuestionFeedbacks] = useState([]); // Комментарии для каждого вопроса
  const [feedback, setFeedback] = useState(''); // Итоговый комментарий
  const [debugInfo, setDebugInfo] = useState(null);
  const [debugOpen, setDebugOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // Load assessments
  const fetchAssessments = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authorization token not found');

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

      const assessmentsData = Array.isArray(debugData.parsedJson) ? debugData.parsedJson : [];
      setAssessments(assessmentsData);
      await fetchCompletedAssessments();
    } catch (err) {
      setError(`Не удалось загрузить оценки: ${err.message}`);
      console.error('API Error:', err);
      console.log('Debug Info:', debugInfo);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  // Load completed assessments
  const fetchCompletedAssessments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authorization token not found');

      const response = await fetch(`${API_BASE_URL}/completed-assessments-reviewer`, {
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

      const completedData = Array.isArray(debugData.parsedJson) ? debugData.parsedJson : [];
      setCompletedAssessments(completedData);
    } catch (err) {
      console.error('Failed to fetch completed assessments:', err);
      setError('Не удалось загрузить проверенные работы');
      setCompletedAssessments([]);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  // Handle assessment selection
  const handleSelectAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setSelectedCompletedAssessment(null);
    const initialRatings = assessment.answers?.length
      ? assessment.answers.map(answer => answer.rating || 0)
      : Array(10).fill(0);
    const initialFeedbacks = assessment.answers?.length
      ? assessment.answers.map(answer => answer.feedback || '')
      : Array(10).fill('');
    setRatings(initialRatings);
    setQuestionFeedbacks(initialFeedbacks);
    setFeedback(assessment.feedback || '');
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

  // Handle rating changes
  const handleRatingChange = (index, value) => {
    let numericValue = Number(value);
    if (isNaN(numericValue)) numericValue = 0;
    numericValue = Math.min(maxRatings[index], Math.max(1, numericValue));

    const newRatings = [...ratings];
    newRatings[index] = numericValue;
    setRatings(newRatings);
  };

  // Handle question feedback changes
  const handleQuestionFeedbackChange = (index, value) => {
    const newFeedbacks = [...questionFeedbacks];
    newFeedbacks[index] = value;
    setQuestionFeedbacks(newFeedbacks);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedAssessment(null);
    setSelectedCompletedAssessment(null);
  };

  // Handle submit review
  const handleSubmitReview = async () => {
    if (!selectedAssessment) return;

    if (ratings.some(rating => rating === 0)) {
      setError('Пожалуйста, оцените все ответы');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authorization token not found');

      const reviewData = {
        assessmentId: selectedAssessment._id,
        answers: selectedAssessment.answers.map((answerItem, index) => ({
          rating: ratings[index],
          feedback: questionFeedbacks[index] // Комментарий к каждому вопросу
        })),
        feedback // Итоговый комментарий
      };

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
      setRatings([]);
      setQuestionFeedbacks([]);
      setFeedback('');
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
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Debug dialog
  const handleDebugClose = () => setDebugOpen(false);
  const handleDebugOpen = () => setDebugOpen(true);

  // Вычисление итогового результата
  const calculateResult = () => {
    const grades = ratings.map((rating, index) => getGradeFromRating(rating, index));
    return calculateFinalGrade(grades);
  };

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
        {isMobile && (selectedAssessment || selectedCompletedAssessment) && (
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

            {!assessments || assessments.length === 0 ? (
              <Box bgcolor="#FFFFFF" p={3} borderRadius={2} textAlign="center" border={`1px dashed ${colors.borderColor}`}>
                <Typography color={colors.lightText} fontSize={15}>
                  Нет работ для проверки
                </Typography>
              </Box>
            ) : (
              assessments.map((assessment) => (
                <AssessmentCard
                  key={assessment._id || Math.random()}
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
                    {renderStatus(assessment.status || 'pending')}
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

            {!completedAssessments || completedAssessments.length === 0 ? (
              <Box bgcolor="#FFFFFF" p={3} borderRadius={2} textAlign="center" border={`1px dashed ${colors.borderColor}`}>
                <Typography color={colors.lightText} fontSize={15}>
                  Нет проверенных работ
                </Typography>
              </Box>
            ) : (
              completedAssessments.map((assessment) => (
                <AssessmentCard
                  key={assessment._id || Math.random()}
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

              {selectedAssessment.answers?.map((item, index) => (
                <StyledAccordion key={index} defaultExpanded={!isMobile}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: colors.primary }} />}
                  >
                    <Typography fontWeight={600} fontSize={15} color={colors.text}>
                      Вопрос {index + 1}: {item.question || 'Без названия'}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 2 }}>
                    <Box mb={2}>
                      <Typography fontWeight={600} fontSize={14} color={colors.text} mb={1}>
                        Ответ студента:
                      </Typography>
                      <Typography fontSize={14} color={colors.lightText} whiteSpace="pre-wrap">
                        {item.answer || 'Нет ответа'}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mt={2} sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } }}>
                      <Typography fontWeight={600} fontSize={14} color={colors.text} sx={{ mb: { xs: 1, sm: 0 } }}>
                        Баллы (1–{maxRatings[index]}):
                      </Typography>
                      <TextField
                        type="number"
                        value={ratings[index] || ''}
                        onChange={(e) => handleRatingChange(index, e.target.value)}
                        inputProps={{
                          min: 1,
                          max: maxRatings[index],
                          step: 1
                        }}
                        size="small"
                        sx={{ width: 100, ml: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}
                        placeholder={`1–${maxRatings[index]}`}
                      />
                      {ratings[index] > 0 && (
                        <Typography sx={{ ml: { xs: 0, sm: 2 }, fontSize: 14, color: colors.text }}>
                          Оценка: {getGradeFromRating(ratings[index], index)} (Баллы: {(getGradeFromRating(ratings[index], index) * 2.2).toFixed(1)})
                        </Typography>
                      )}
                    </Box>
                    <Box mt={2}>
                      <Typography fontWeight={600} fontSize={14} color={colors.text} mb={1}>
                        Комментарий:
                      </Typography>
                      <StyledTextField
                        fullWidth
                        multiline
                        rows={2}
                        value={questionFeedbacks[index] || ''}
                        onChange={(e) => handleQuestionFeedbackChange(index, e.target.value)}
                        placeholder="Напишите комментарий к ответу"
                        variant="outlined"
                      />
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

              {/* Итоговый результат */}
              {ratings.every(r => r > 0) && (
                <Box bgcolor={colors.highlight} p={2} borderRadius={2} mb={3}>
                  <Typography fontWeight={600} fontSize={15} color={colors.text} mb={1}>
                    Итоговый результат:
                  </Typography>
                  {(() => {
                    const result = calculateResult();
                    return (
                      <Typography
                        fontSize={14}
                        color={result.status === 'rejected' ? colors.error : colors.accent}
                        fontWeight={600}
                      >
                        {result.status === 'rejected'
                          ? `Отказ (общий балл: ${result.total})`
                          : `Оценка: ${result.grade} (общий балл: ${result.total})`}
                      </Typography>
                    );
                  })()}
                </Box>
              )}

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

              {selectedCompletedAssessment.questions?.map((item, index) => (
                <StyledAccordion key={index} defaultExpanded={!isMobile}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: colors.primary }} />}
                  >
                    <Typography fontWeight={600} fontSize={15} color={colors.text}>
                      Вопрос {index + 1}: {item.question || 'Без названия'}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 2 }}>
                    <Box mb={2}>
                      <Typography fontWeight={600} fontSize={14} color={colors.text} mb={1}>
                        Ответ студента:
                      </Typography>
                      <Typography fontSize={14} color={colors.lightText} whiteSpace="pre-wrap">
                        {item.answer || 'Нет ответа'}
                      </Typography>
                    </Box>
                    <Box mb={2}>
                      <Typography fontWeight={600} fontSize={14} color={colors.text} mb={1}>
                        Оценка:
                      </Typography>
                      <Box display="flex" flexDirection="column">
                        <Typography fontSize={14} color={colors.text} mb={0.5}>
                          Баллы: {item.rating || 'Нет оценки'}
                        </Typography>
                        <Typography fontSize={14} color={colors.text} mb={0.5}>
                          Оценка: {getGradeFromRating(item.rating, index)} (Баллы: {(getGradeFromRating(item.rating, index) * 2.2).toFixed(1)})
                        </Typography>
                        {item.feedback && (
                          <Typography fontSize={14} color={colors.text}>
                            Комментарий: {item.feedback}
                          </Typography>
                        )}
                      </Box>
                    </Box>
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

              {/* Итоговый результат для завершенной работы */}
              <Box bgcolor={colors.highlight} p={2} borderRadius={2} mt={3}>
                <Typography fontWeight={600} fontSize={15} color={colors.text} mb={1}>
                  Итоговый результат:
                </Typography>
                {(() => {
                  const grades = selectedCompletedAssessment.questions.map((item, index) =>
                    getGradeFromRating(item.rating, index)
                  );
                  const result = calculateFinalGrade(grades);
                  return (
                    <Typography
                      fontSize={14}
                      color={result.status === 'rejected' ? colors.error : colors.accent}
                      fontWeight={600}
                    >
                      {result.status === 'rejected'
                        ? `Отказ (общий балл: ${result.total})`
                        : `Оценка: ${result.grade} (общий балл: ${result.total})`}
                    </Typography>
                  );
                })()}
              </Box>
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