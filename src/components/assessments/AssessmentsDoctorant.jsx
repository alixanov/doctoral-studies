import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Divider,
  MenuItem,
  Select,
  Paper,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Stack,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { format, isValid, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

const colors = {
  primaryGradient: 'linear-gradient(135deg, #143654 0%, rgb(26, 84, 136) 100%)',
  error: '#EF4444',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
  purple: '#143654'
};

const SubmitButton = styled(Button)(({ error, theme }) => ({
  background: error ? colors.error : colors.primaryGradient,
  color: '#FFFFFF',
  padding: theme.spacing(1.5),
  borderRadius: 8,
  fontSize: theme.typography.body2.fontSize,
  fontWeight: 500,
  textTransform: 'none',
  '&:hover': {
    background: error ? colors.error : colors.primaryGradient,
    opacity: 0.9
  },
  '&:disabled': {
    background: error ? colors.error : colors.primaryGradient,
    opacity: 0.5,
    color: '#FFFFFF'
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    fontSize: theme.typography.caption.fontSize
  }
}));

const StatusChip = ({ status, hasRatings }) => {
  let color;
  let label;

  switch (status) {
    case 'completed':
      color = colors.success; // Исправлено: colorsadvocate -> colors
      label = 'Завершено';
      break;
    case 'pending':
      color = hasRatings ? colors.info : colors.warning;
      label = hasRatings ? 'Результат' : 'На проверке';
      break;
    default:
      color = 'default';
      label = 'Неизвестно';
  }

  return (
    <Chip
      label={label}
      size="medium"
      sx={{
        backgroundColor: color,
        color: 'white',
        fontWeight: 500,
        minHeight: 32
      }}
    />
  );
};

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

const questions = [
  '🔹 Dissertatsiyaning ko‘rsatilgan ixtisoslikka mosligi.',
  '🔹 Dissertatsiyaning ilmiy saviyasi.',
  '🔹 Dissertatsiyaning ilmiy va amaliy ahamiyati.',
  '🔹 Tadqiqot natijalarining asoslanganligi.',
  '🔹 E’lon qilingan ishlarda dissertatsiya natijalarining to‘liq bayon etilganligi.',
  '🔹 Dissertatsiyaning ilmiy natijalarini amaliyotga joriy etilganligi.',
  '🔹 Izlanuvchiga qo‘yilgan talablarning bajarilganligi.',
  '🔹 Dissertatsiya va dissertatsiya avtoreferatini belgilangan talablarga mos ravishda rasmiylashtirilganligi.',
  '🔹 Tavsiya.',
  '🔹 Mavzu bilan grant uchun loyihalarda va tanlovlarda ishtirok etganligi.',
];

const AssessmentsDoctorant = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recipient, setRecipient] = useState('');
  const [reviewers, setReviewers] = useState([]);
  const [fetchingReviewers, setFetchingReviewers] = useState(true);
  const [success, setSuccess] = useState(false);
  const [submittedAssessments, setSubmittedAssessments] = useState([]);
  const [completedAssessments, setCompletedAssessments] = useState([]);
  const [activeTab, setActiveTab] = useState('new');
  const [loadingAssessments, setLoadingAssessments] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        const response = await fetch(`${API_BASE_URL}/reviewers`, {
          headers: {
            'Authorization': token,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setReviewers(data);
        } else {
          setError(data.error || 'Ошибка при загрузке проверяющих');
        }
      } catch (err) {
        setError('Произошла ошибка: ' + err.message);
      } finally {
        setFetchingReviewers(false);
      }
    };

    const fetchAssessments = async () => {
      setLoadingAssessments(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoadingAssessments(false);
          return;
        }

        const pendingRes = await fetch(`${API_BASE_URL}/submitted-assessments`, {
          headers: { 'Authorization': token },
        });

        if (pendingRes.ok) {
          const pendingData = await pendingRes.json();
          setSubmittedAssessments(pendingData);
        }

        const completedRes = await fetch(`${API_BASE_URL}/completed-assessments`, {
          headers: { 'Authorization': token },
        });

        if (completedRes.ok) {
          const completedData = await completedRes.json();
          setCompletedAssessments(completedData);
        }
      } catch (err) {
        console.error('Ошибка при загрузке оценок:', err);
      } finally {
        setLoadingAssessments(false);
      }
    };

    fetchReviewers();
    fetchAssessments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!recipient) {
      setError('Выберите проверяющего');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Необходима авторизация');
        setLoading(false);
        return;
      }

      const questionsData = questions.map(question => ({
        question,
        answer: ''
      }));

      const response = await fetch(`${API_BASE_URL}/submit-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          recipient: recipient,
          answers: questionsData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setRecipient('');
        const updatedRes = await fetch(`${API_BASE_URL}/submitted-assessments`, {
          headers: { 'Authorization': token },
        });
        if (updatedRes.ok) {
          const updatedData = await updatedRes.json();
          setSubmittedAssessments(updatedData);
        }
      } else {
        throw new Error(data.error || 'Ошибка отправки');
      }
    } catch (err) {
      setError(err.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return 'Недействительная дата';
      }
      return format(date, 'dd MMMM yyyy, HH:mm', { locale: ru });
    } catch (error) {
      console.error("Ошибка форматирования даты:", error);
      return 'Ошибка даты';
    }
  };

  const renderAssessmentItem = (assessment) => {
    const hasRatings = assessment.questions.some(q => q.rating > 0);

    // Рассчитываем итоговую оценку
    const grades = assessment.questions.map((q, idx) => getGradeFromRating(q.rating, idx));
    const result = calculateFinalGrade(grades);

    return (
      <Paper elevation={2} sx={{ mb: 2, p: isMobile ? 1.5 : 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} flexDirection={isMobile ? 'column' : 'row'} gap={isMobile ? 1 : 0}>
          <Box display="flex" alignItems="center" width={isMobile ? '100%' : 'auto'}>
            <Avatar
              src={assessment.reviewerInfo?.profilePhoto}
              sx={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, mr: 2 }}
            >
              {assessment.reviewerInfo?.firstName?.charAt(0)}{assessment.reviewerInfo?.lastName?.charAt(0)}
            </Avatar>
            <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} fontWeight={500} sx={{ wordBreak: 'break-word' }}>
              {assessment.reviewerInfo?.firstName} {assessment.reviewerInfo?.lastName}
            </Typography>
          </Box>
          <Box textAlign={isMobile ? 'center' : 'right'} width={isMobile ? '100%' : 'auto'}>
            <StatusChip status={assessment.status} hasRatings={hasRatings} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
              {formatDate(assessment.createdAt)}
            </Typography>
            {hasRatings && (
              <Typography
                variant="body2"
                fontWeight={500}
                mt={1}
                sx={{
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  color: result.status === 'rejected' ? colors.error : colors.success
                }}
              >
                {result.status === 'rejected'
                  ? `Отказ (общий балл: ${result.total})`
                  : `Оценка: ${result.grade} (общий балл: ${result.total})`}
              </Typography>
            )}
          </Box>
        </Box>

        {(assessment.status === 'completed' || hasRatings) && (
          <>
            <Divider sx={{ my: isMobile ? 1 : 2 }} />

            {assessment.feedback && (
              <>
                <Typography variant="body2" fontWeight={500} gutterBottom sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
                  Общий комментарий:
                </Typography>
                <Typography variant="body2" paragraph sx={{ mb: 2, fontSize: isMobile ? '0.8rem' : '0.875rem', wordBreak: 'break-word' }}>
                  {assessment.feedback}
                </Typography>
              </>
            )}

            <Typography variant="body2" fontWeight={500} gutterBottom sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
              {assessment.status === 'completed' ? 'Оценки по вопросам:' : 'Предварительные оценки:'}
            </Typography>
            <List dense>
              {assessment.questions.map((q, idx) => (
                <ListItem key={idx} sx={{ py: isMobile ? 0.5 : 1 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={500} sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
                        {q.question}
                      </Typography>
                    }
                    secondary={
                      q.rating > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" color="text.primary" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                            Баллы: {q.rating}
                          </Typography>
                          <Typography variant="body2" color="text.primary" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                            Оценка: {getGradeFromRating(q.rating, idx)} (Баллы: {(getGradeFromRating(q.rating, idx) * 2.2).toFixed(1)})
                          </Typography>
                          {q.feedback && (
                            <Typography variant="body2" color="text.primary" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                              Комментарий: {q.feedback}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                          {assessment.status === 'completed' ? 'Без оценки' : 'Ожидает оценки'}
                        </Typography>
                      )
                    }
                    sx={{ my: 0 }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Paper>
    );
  };

  return (
    <Box p={isMobile ? 2 : 3} maxWidth={1200} mx="auto">
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        align="center"
        fontWeight={600}
        mb={2}
        color={colors.purple}
      >
        Оценка докторанта
      </Typography>

      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={isMobile ? 1 : 2}
        mb={3}
        sx={{ alignItems: isMobile ? 'stretch' : 'center' }}
      >
        <Button
          variant={activeTab === 'new' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('new')}
          sx={{
            width: isMobile ? '100%' : 'auto',
            fontSize: isMobile ? '0.8rem' : '0.875rem',
            padding: isMobile ? '8px' : '12px',
            ...(activeTab === 'new' && {
              background: colors.primaryGradient,
              color: '#FFFFFF',
              '&:hover': { background: colors.primaryGradient, opacity: 0.9 }
            }),
            ...(activeTab !== 'new' && {
              borderColor: colors.purple,
              color: colors.purple
            })
          }}
        >
          Новая оценка
        </Button>
        <Button
          variant={activeTab === 'submitted' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('submitted')}
          sx={{
            width: isMobile ? '100%' : 'auto',
            fontSize: isMobile ? '0.8rem' : '0.875rem',
            padding: isMobile ? '8px' : '12px',
            ...(activeTab === 'submitted' && {
              background: colors.primaryGradient,
              color: '#FFFFFF',
              '&:hover': { background: colors.primaryGradient, opacity: 0.9 }
            }),
            ...(activeTab !== 'submitted' && {
              borderColor: colors.purple,
              color: colors.purple
            })
          }}
        >
          Отправленные ({submittedAssessments.length})
        </Button>
        <Button
          variant={activeTab === 'completed' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('completed')}
          sx={{
            width: isMobile ? '100%' : 'auto',
            fontSize: isMobile ? '0.8rem' : '0.875rem',
            padding: isMobile ? '8px' : '12px',
            ...(activeTab === 'completed' && {
              background: colors.primaryGradient,
              color: '#FFFFFF',
              '&:hover': { background: colors.primaryGradient, opacity: 0.9 }
            }),
            ...(activeTab !== 'completed' && {
              borderColor: colors.purple,
              color: colors.purple
            })
          }}
        >
          Завершенные ({completedAssessments.length})
        </Button>
      </Stack>

      {activeTab === 'new' && (
        <form onSubmit={handleSubmit}>
          <Box sx={{ background: '#F9FAFB', p: isMobile ? 2 : 3, borderRadius: 6 }}>
            {questions.map((question, index) => (
              <React.Fragment key={index}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: 500
                  }}
                >
                  {question}
                </Typography>
                {index < questions.length - 1 && <Divider sx={{ my: isMobile ? 0.5 : 1 }} />}
              </React.Fragment>
            ))}
          </Box>

          <Typography
            variant="body2"
            sx={{ mt: 3, mb: 1, fontWeight: 500, fontSize: isMobile ? '0.9rem' : '1rem' }}
          >
            Кому отправить:
          </Typography>
          <Select
            fullWidth
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            displayEmpty
            sx={{ whiteSpace: 'normal', '& .MuiSelect-select': { py: isMobile ? 1 : 1.5 } }}
          >
            <MenuItem value="" disabled>
              Выберите проверяющего
            </MenuItem>
            {fetchingReviewers ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
                Загрузка...
              </MenuItem>
            ) : (
              reviewers.map((reviewer) => (
                <MenuItem key={reviewer.id} value={reviewer.email}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: isMobile ? '0.9rem' : '1rem', wordBreak: 'break-word' }}
                  >
                    {reviewer.firstName} {reviewer.lastName}
                  </Typography>
                </MenuItem>
              ))
            )}
          </Select>

          <SubmitButton
            fullWidth
            type="submit"
            disabled={loading || !recipient}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Отправить'}
          </SubmitButton>

          {error && (
            <Typography
              align="center"
              color={colors.error}
              sx={{ mt: 2, fontSize: isMobile ? '0.8rem' : '0.875rem' }}
            >
              {error}
            </Typography>
          )}

          {success && (
            <Typography
              align="center"
              color="green"
              sx={{ mt: 2, fontSize: isMobile ? '0.8rem' : '0.875rem' }}
            >
              Вопросы успешно отправлены на проверку
            </Typography>
          )}
        </form>
      )}

      {activeTab === 'submitted' && (
        <Box>
          {loadingAssessments ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : submittedAssessments.length === 0 ? (
            <Typography
              align="center"
              color="textSecondary"
              sx={{ mt: 4, fontSize: isMobile ? '0.9rem' : '1rem' }}
            >
              У вас нет отправленных оценок
            </Typography>
          ) : (
            <List>
              {submittedAssessments.map((assessment) => (
                <ListItem key={assessment._id} sx={{ p: 0, mb: 2 }}>
                  {renderAssessmentItem(assessment)}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}

      {activeTab === 'completed' && (
        <Box>
          {loadingAssessments ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : completedAssessments.length === 0 ? (
            <Typography
              align="center"
              color="textSecondary"
              sx={{ mt: 4, fontSize: isMobile ? '0.9rem' : '1rem' }}
            >
              У вас нет завершенных оценок
            </Typography>
          ) : (
            <Grid container spacing={isMobile ? 1 : 2}>
              {completedAssessments.map((assessment) => (
                <Grid item xs={12} key={assessment._id}>
                  {renderAssessmentItem(assessment)}
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AssessmentsDoctorant;