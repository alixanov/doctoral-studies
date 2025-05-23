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

// Color palette for the educational theme
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

// Styled components
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

// Grading rules
const getGradeFromRating = (rating, questionIndex) => {
  if (!rating) return 0;
  switch (questionIndex) {
    case 0: // Question 1 (1–5)
    case 1: // Question 2 (1–5)
    case 7: // Question 8 (1–5)
    case 8: // Question 9 (1–5)
    case 9: // Question 10 (1–5)
      return Math.min(5, Math.max(1, Math.round(rating)));
    case 2: // Question 3 (1–20)
    case 4: // Question 5 (1–20)
      if (rating >= 17) return 5;
      if (rating >= 14) return 4;
      if (rating >= 11) return 3;
      return 2;
    case 3: // Question 4 (1–10)
    case 6: // Question 7 (1–10)
      if (rating >= 9) return 5;
      if (rating >= 7) return 4;
      if (rating >= 5) return 3;
      return 2;
    case 5: // Question 6 (1–15)
      if (rating >= 13) return 5;
      if (rating >= 11) return 4;
      if (rating >= 9) return 3;
      return 2;
    default:
      return 0;
  }
};

// Calculate final grade
const calculateFinalGrade = (grades) => {
  const weight = 2.0;
  const total = grades.reduce((sum, grade) => sum + grade * weight, 0);
  if (total < 60) return { grade: 0, status: 'rejected', total: Math.round(total * 10) / 10 };
  if (total >= 90) return { grade: 5, status: 'approved', total: Math.round(total * 10) / 10 };
  if (total >= 70) return { grade: 4, status: 'approved', total: Math.round(total * 10) / 10 };
  if (total >= 60) return { grade: 3, status: 'approved', total: Math.round(total * 10) / 10 };
  return { grade: 0, status: 'rejected', total: Math.round(total * 10) / 10 };
};

// Maximum ratings per question (total) and sub-ratings
const maxRatings = [5, 5, 20, 10, 20, 15, 10, 5, 5, 5];
const subMaxRatings = {
  2: [5, 5, 10], // Question 3: 5 + 5 + 10 = 20
  4: [5, 5, 10], // Question 5: 5 + 5 + 10 = 20
  5: [5, 5, 5],  // Question 6: 5 + 5 + 5 = 15
};

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
  const [ratings, setRatings] = useState([]); // Total ratings per question
  const [subRatings, setSubRatings] = useState([]); // Sub-ratings for Questions 3, 5, 6
  const [inputValues, setInputValues] = useState([]); // Input display values (includes sub-ratings)
  const [inputErrors, setInputErrors] = useState([]); // Input validation errors (includes sub-ratings)
  const [questionFeedbacks, setQuestionFeedbacks] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [debugOpen, setDebugOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // API response inspection for debugging
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

  // Fetch assessments
  const fetchAssessments = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Авторизация токени топилмади');
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
          `HTTP хатолиги! статус: ${response.status}`
        );
      }
      const assessmentsData = Array.isArray(debugData.parsedJson) ? debugData.parsedJson : [];
      setAssessments(assessmentsData);
      await fetchCompletedAssessments();
    } catch (err) {
      setError(`Баҳоларни юклаб бўлмади: ${err.message}`);
      console.error('API хатолиги:', err);
      console.log('Debug маълумотлари:', debugInfo);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch completed assessments
  const fetchCompletedAssessments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Авторизация токени топилмади');
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
          `HTTP хатолиги! статус: ${response.status}`
        );
      }
      const completedData = Array.isArray(debugData.parsedJson) ? debugData.parsedJson : [];
      setCompletedAssessments(completedData);
    } catch (err) {
      console.error('Текширилган баҳоларни юклаб бўлмади:', err);
      setError('Текширилган ишларни юклаб бўлмади');
      setCompletedAssessments([]);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  // Select assessment
  const handleSelectAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setSelectedCompletedAssessment(null);
    const initialRatings = assessment.answers?.length
      ? assessment.answers.map(answer => answer.rating || 0)
      : Array(10).fill(0);
    const initialSubRatings = assessment.answers?.length
      ? assessment.answers.map((answer, index) => {
        if ([2, 4, 5].includes(index)) {
          return answer.subRatings || Array(3).fill(0);
        }
        return [];
      })
      : Array(10).fill([]);
    const initialInputValues = initialRatings.map((rating, index) => {
      if ([2, 4, 5].includes(index)) {
        return initialSubRatings[index].map(r => (r > 0 ? r.toString() : ''));
      }
      return rating > 0 ? rating.toString() : '';
    });
    const initialInputErrors = initialRatings.map((rating, index) => {
      if ([2, 4, 5].includes(index)) {
        return Array(3).fill('');
      }
      return '';
    });
    const initialFeedbacks = assessment.answers?.length
      ? assessment.answers.map(answer => answer.feedback || '')
      : Array(10).fill('');
    setRatings(initialRatings);
    setSubRatings(initialSubRatings);
    setInputValues(initialInputValues);
    setInputErrors(initialInputErrors);
    setQuestionFeedbacks(initialFeedbacks);
    setFeedback(assessment.feedback || '');
    setError('');
    setSuccess('');
    if (isMobile) setDrawerOpen(false);
  };

  // Select completed assessment
  const handleSelectCompletedAssessment = (assessment) => {
    setSelectedCompletedAssessment(assessment);
    setSelectedAssessment(null);
    setError('');
    setSuccess('');
    if (isMobile) setDrawerOpen(false);
  };

  // Handle rating input change
  const handleRatingChange = (index, subIndex, value) => {
    const newInputValues = [...inputValues];
    const newInputErrors = [...inputErrors];
    if ([2, 4, 5].includes(index)) {
      newInputValues[index][subIndex] = value;
      setInputValues(newInputValues);

      // Validate input
      const numericValue = parseFloat(value);
      const max = subMaxRatings[index][subIndex];
      let error = '';
      if (value === '') {
        error = ''; // Allow empty input during typing
      } else if (isNaN(numericValue)) {
        error = 'Фақат рақамлар';
      } else if (numericValue < 1) {
        error = `Мин: 1`;
      } else if (numericValue > max) {
        error = `Макс: ${max}`;
      }
      newInputErrors[index][subIndex] = error;
    } else {
      newInputValues[index] = value;
      setInputValues(newInputValues);

      // Validate input
      const numericValue = parseFloat(value);
      const max = maxRatings[index];
      let error = '';
      if (value === '') {
        error = ''; // Allow empty input during typing
      } else if (isNaN(numericValue)) {
        error = 'Фақат рақамлар';
      } else if (numericValue < 1) {
        error = `Мин: 1`;
      } else if (numericValue > max) {
        error = `Макс: ${max}`;
      }
      newInputErrors[index] = error;
    }
    setInputErrors(newInputErrors);
  };

  // Commit rating on blur
  const handleRatingBlur = (index, subIndex) => {
    const newInputValues = [...inputValues];
    const newInputErrors = [...inputErrors];
    const newSubRatings = [...subRatings];
    const newRatings = [...ratings];

    if ([2, 4, 5].includes(index)) {
      const value = newInputValues[index][subIndex];
      let numericValue = parseFloat(value);
      if (isNaN(numericValue) || value === '') {
        numericValue = 0;
      } else {
        numericValue = Math.min(subMaxRatings[index][subIndex], Math.max(1, Math.round(numericValue)));
      }

      newSubRatings[index][subIndex] = numericValue;
      newInputValues[index][subIndex] = numericValue > 0 ? numericValue.toString() : '';
      newInputErrors[index][subIndex] = '';

      // Update total rating for the question
      newRatings[index] = newSubRatings[index].reduce((sum, val) => sum + val, 0);
    } else {
      const value = newInputValues[index];
      let numericValue = parseFloat(value);
      if (isNaN(numericValue) || value === '') {
        numericValue = 0;
      } else {
        numericValue = Math.min(maxRatings[index], Math.max(1, Math.round(numericValue)));
      }

      newRatings[index] = numericValue;
      newInputValues[index] = numericValue > 0 ? numericValue.toString() : '';
      newInputErrors[index] = '';
    }

    setRatings(newRatings);
    setSubRatings(newSubRatings);
    setInputValues(newInputValues);
    setInputErrors(newInputErrors);
  };

  // Handle question feedback change
  const handleQuestionFeedbackChange = (index, value) => {
    const newFeedbacks = [...questionFeedbacks];
    newFeedbacks[index] = value;
    setQuestionFeedbacks(newFeedbacks);
  };

  // Tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedAssessment(null);
    setSelectedCompletedAssessment(null);
  };

  // Submit review
  const handleSubmitReview = async () => {
    if (!selectedAssessment) return;
    if (ratings.some(rating => rating === 0)) {
      setError('Илтимос, барча жавобларни баҳоланг');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Авторизация токени топилмади');
      const reviewData = {
        assessmentId: selectedAssessment._id,
        answers: selectedAssessment.answers.map((answerItem, index) => ({
          rating: ratings[index],
          subRatings: [2, 4, 5].includes(index) ? subRatings[index] : undefined,
          feedback: questionFeedbacks[index]
        })),
        feedback
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
          `HTTP хатолиги! статус: ${response.status}`
        );
      }
      setSuccess('Баҳо муваффақиятли жўнатилди');
      setAssessments(assessments.filter(assessment =>
        assessment._id !== selectedAssessment._id
      ));
      setSelectedAssessment(null);
      setRatings([]);
      setSubRatings([]);
      setInputValues([]);
      setInputErrors([]);
      setQuestionFeedbacks([]);
      setFeedback('');
      await fetchAssessments();
    } catch (err) {
      setError(`Баҳони жўнатиб бўлмади: ${err.message}`);
      console.error('Жўнатиш хатолиги:', err);
      console.log('Debug маълумотлари:', debugInfo);
    } finally {
      setSubmitting(false);
    }
  };

  // Render status chip
  const renderStatus = (status) => {
    return <StyledChip
      label={
        status === 'pending' ? 'Текшириш кутилмокда' :
          status === 'reviewed' ? 'Текширилган' :
            status === 'completed' ? 'Баҳоланган' :
              'Номаълум'
      }
      status={status}
    />;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('uz-UZ', {
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

  // Calculate result
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
      borderRadius: 3,
      minHeight: 'calc(100vh - 32px)'
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <SchoolIcon sx={{ fontSize: { xs: 28, md: 32 }, color: colors.primary, mr: 1.5 }} />
          <Typography variant="h5" fontWeight={700} color={colors.primary} sx={{ fontSize: { xs: '1.4rem', md: '1.5rem' } }}>
            Академик ишларни текшириш
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
            Ишлар рўйхати
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
          label={isMobile ? 'Текшириш учун' : 'Текшириш учун ишлар'}
          id="tab-pending"
          sx={{ minHeight: 48 }}
        />
        <Tab
          icon={<DoneIcon sx={{ fontSize: { xs: 20, md: 24 } }} />}
          iconPosition="start"
          label={isMobile ? 'Текширилган' : 'Текширилган ишлар'}
          id="tab-completed"
          sx={{ minHeight: 48 }}
        />
      </Tabs>

      <Grid container spacing={3}>
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
                {isMobile ? 'Текшириш учун' : 'Текшириш учун ишлар рўйхати'}
              </Typography>
            </Box>

            {!assessments || assessments.length === 0 ? (
              <Box bgcolor="#FFFFFF" p={3} borderRadius={2} textAlign="center" border={`1px dashed ${colors.borderColor}`}>
                <Typography color={colors.lightText} fontSize={15}>
                  Текшириш учун ишлар мавжуд эмас
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
                        {assessment.userInfo?.firstName || 'Номаълум'} {assessment.userInfo?.lastName || ''}
                      </Typography>
                      <Typography fontSize={13} color={colors.lightText} noWrap>
                        Топширилган сана: {formatDate(assessment.createdAt)}
                      </Typography>
                    </Box>
                    {renderStatus(assessment.status || 'pending')}
                  </Box>
                </AssessmentCard>
              ))
            )}
          </Grid>
        )}

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
                {isMobile ? 'Текширилган' : 'Текширилган ишлар рўйхати'}
              </Typography>
            </Box>

            {!completedAssessments || completedAssessments.length === 0 ? (
              <Box bgcolor="#FFFFFF" p={3} borderRadius={2} textAlign="center" border={`1px dashed ${colors.borderColor}`}>
                <Typography color={colors.lightText} fontSize={15}>
                  Текширилган ишлар мавжуд эмас
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
                        {assessment.userInfo?.firstName || 'Номаълум'} {assessment.userInfo?.lastName || ''}
                      </Typography>
                      <Typography fontSize={13} color={colors.lightText} noWrap>
                        Текширилган сана: {formatDate(assessment.completedAt)}
                      </Typography>
                    </Box>
                    {renderStatus('completed')}
                  </Box>
                </AssessmentCard>
              ))
            )}
          </Grid>
        )}

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
                  Талоба ишини текшириш
                </Typography>
              </Box>

              <Box p={2} mb={3} bgcolor={colors.highlight} borderRadius={2}>
                <Typography fontWeight={600} fontSize={15} color={colors.text}>
                  {selectedAssessment.userInfo?.firstName || 'Номаълум'} {selectedAssessment.userInfo?.lastName || ''}
                </Typography>
                <Typography fontSize={14} color={colors.lightText}>
                  Топширилган сана: {formatDate(selectedAssessment.createdAt)}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {selectedAssessment.answers?.map((item, index) => (
                <StyledAccordion key={index} defaultExpanded={!isMobile}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: colors.primary }} />}
                  >
                    <Typography fontWeight={600} fontSize={15} color={colors.text}>
                      Савол {index + 1}: {item.question || 'Номсиз'}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 2 }}>
                    <Box mb={2}>
                      <Typography fontWeight={600} fontSize={14} color={colors.text} mb={1}>
                        Талоба жавоби:
                      </Typography>
                      <Typography fontSize={14} color={colors.lightText} whiteSpace="pre-wrap">
                        {item.answer || 'Жавоб йўқ'}
                      </Typography>
                    </Box>
                    <Box mt={2}>
                      <Typography fontWeight={600} fontSize={14} color={colors.text} sx={{ mb: 1 }}>
                        Балллар (Жами: 1–{maxRatings[index]}):
                      </Typography>
                      {[2, 4, 5].includes(index) ? (
                        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                          {subMaxRatings[index].map((max, subIndex) => (
                            <Box key={subIndex} display="flex" alignItems="center" sx={{ mb: { xs: 1, sm: 0 } }}>
                              <StyledTextField
                                type="text"
                                value={inputValues[index][subIndex] || ''}
                                onChange={(e) => handleRatingChange(index, subIndex, e.target.value)}
                                onBlur={() => handleRatingBlur(index, subIndex)}
                                error={!!inputErrors[index][subIndex]}
                                helperText={inputErrors[index][subIndex]}
                                size="small"
                                sx={{ width: 100 }}
                                placeholder={`1–${max}`}
                                inputProps={{
                                  pattern: '[0-9]*',
                                }}
                              />
                              <Typography sx={{ ml: 1, fontSize: 14, color: colors.text }}>
                                Макс: {max}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Box display="flex" alignItems="center" sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } }}>
                          <StyledTextField
                            type="text"
                            value={inputValues[index] || ''}
                            onChange={(e) => handleRatingChange(index, null, e.target.value)}
                            onBlur={() => handleRatingBlur(index, null)}
                            error={!!inputErrors[index]}
                            helperText={inputErrors[index]}
                            size="small"
                            sx={{ width: 100, mb: { xs: 1, sm: 0 } }}
                            placeholder={`1–${maxRatings[index]}`}
                            inputProps={{
                              pattern: '[0-9]*',
                            }}
                          />
                        </Box>
                      )}
                      {ratings[index] > 0 && (
                        <Typography sx={{ mt: 1, fontSize: 14, color: colors.text }}>
                          Баҳо: {getGradeFromRating(ratings[index], index)} (Балллар: {(getGradeFromRating(ratings[index], index) * 2.0).toFixed(1)})
                        </Typography>
                      )}
                    </Box>
                    <Box mt={2}>
                      <Typography fontWeight={600} fontSize={14} color={colors.text} mb={1}>
                        Изоҳ:
                      </Typography>
                      <StyledTextField
                        fullWidth
                        multiline
                        rows={2}
                        value={questionFeedbacks[index] || ''}
                        onChange={(e) => handleQuestionFeedbackChange(index, e.target.value)}
                        placeholder="Жавоб учун изоҳ ёзинг"
                        variant="outlined"
                      />
                    </Box>
                  </AccordionDetails>
                </StyledAccordion>
              ))}

              <Box mt={4} mb={2} display="flex" alignItems="center">
                <CommentIcon sx={{ color: colors.primary, mr: 1 }} />
                <Typography fontWeight={600} fontSize={15} color={colors.text}>
                  Якуний изоҳ:
                </Typography>
              </Box>

              <StyledTextField
                fullWidth
                multiline
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Талоба учун умумий изоҳ ва таклифлар ёзинг"
                variant="outlined"
                sx={{ mb: 3 }}
              />

              {ratings.every(r => r > 0) && (
                <Box bgcolor={colors.highlight} p={2} borderRadius={2} mb={3}>
                  <Typography fontWeight={600} fontSize={15} color={colors.text} mb={1}>
                    Якуний натижа:
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
                          ? `Рад этилди (жами балл: ${result.total})`
                          : `Баҳо: ${result.grade} (жами балл: ${result.total})`}
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
                  'Иш аллақачон текширилган'
                ) : (
                  'Баҳони жўнатиш'
                )}
              </SubmitButton>
            </Box>
          </Grid>
        )}

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
                  Текширилган иш
                </Typography>
              </Box>

              <Box p={2} mb={3} bgcolor={colors.highlight} borderRadius={2}>
                <Typography fontWeight={600} fontSize={15} color={colors.text}>
                  {selectedCompletedAssessment.userInfo?.firstName || 'Номаълум'} {selectedCompletedAssessment.userInfo?.lastName || ''}
                </Typography>
                <Typography fontSize={14} color={colors.lightText}>
                  Текширилган сана: {formatDate(selectedCompletedAssessment.completedAt)}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {selectedCompletedAssessment.questions?.map((item, index) => (
                <StyledAccordion key={index} defaultExpanded={!isMobile}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: colors.primary }} />}
                  >
                    <Typography fontWeight={600} fontSize={15} color={colors.text}>
                      Савол {index + 1}: {item.question || 'Номсиз'}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 2 }}>
                    <Box mb={2}>
                      <Typography fontWeight={600} fontSize={14} color={colors.text} mb={1}>
                        Талоба жавоби:
                      </Typography>
                      <Typography fontSize={14} color={colors.lightText} whiteSpace="pre-wrap">
                        {item.answer || 'Жавоб йўқ'}
                      </Typography>
                    </Box>
                    <Box mb={2}>
                      <Typography fontWeight={600} fontSize={14} color={colors.text} mb={1}>
                        Баҳо:
                      </Typography>
                      <Box display="flex" flexDirection="column">
                        {[2, 4, 5].includes(index) && item.subRatings ? (
                          item.subRatings.map((subRating, subIndex) => (
                            <Typography key={subIndex} fontSize={14} color={colors.text} mb={0.5}>
                              Балл {subIndex + 1} (макс: {subMaxRatings[index][subIndex]}): {subRating || 'Баҳо йўқ'}
                            </Typography>
                          ))
                        ) : (
                          <Typography fontSize={14} color={colors.text} mb={0.5}>
                            Балллар: {item.rating || 'Баҳо йўқ'}
                          </Typography>
                        )}
                        <Typography fontSize={14} color={colors.text} mb={0.5}>
                          Баҳо: {getGradeFromRating(item.rating, index)} (Балллар: {(getGradeFromRating(item.rating, index) * 2.0).toFixed(1)})
                        </Typography>
                        {item.feedback && (
                          <Typography fontSize={14} color={colors.text}>
                            Изоҳ: {item.feedback}
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
                      Якуний изоҳ:
                    </Typography>
                  </Box>
                  <Box bgcolor={colors.highlight} p={2} borderRadius={2}>
                    <Typography fontSize={14} color={colors.text} whiteSpace="pre-wrap">
                      {selectedCompletedAssessment.feedback}
                    </Typography>
                  </Box>
                </>
              )}

              <Box bgcolor={colors.highlight} p={2} borderRadius={2} mt={3}>
                <Typography fontWeight={600} fontSize={15} color={colors.text} mb={1}>
                  Якуний натижа:
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
                        ? `Рад этилди (жами балл: ${result.total})`
                        : `Баҳо: ${result.grade} (жами балл: ${result.total})`}
                    </Typography>
                  );
                })()}
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>

      <Dialog open={debugOpen} onClose={handleDebugClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: colors.highlight }}>
          Debug маълумотлари
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
                  Сарлавҳалар:
                </Typography>
                <pre style={{ fontSize: 12, backgroundColor: colors.highlight, padding: 12, borderRadius: 8 }}>
                  {JSON.stringify(debugInfo.headers, null, 2)}
                </pre>
              </Box>
              <Box mt={2}>
                <Typography variant="subtitle2" fontWeight={600} color={colors.text}>
                  Жавоб матни:
                </Typography>
                <pre style={{ fontSize: 12, backgroundColor: colors.highlight, padding: 12, borderRadius: 8 }}>
                  {debugInfo.body}
                </pre>
              </Box>
              {debugInfo.jsonError && (
                <Typography color={colors.error} mt={1} fontSize={14}>
                  JSON таҳлил хатоси: {debugInfo.jsonError}
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: colors.highlight }}>
          <Button onClick={handleDebugClose} sx={{ color: colors.primary, fontSize: 14, fontWeight: 600 }}>
            Ёпиш
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewerAssessments;