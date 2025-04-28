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
  useTheme,
  IconButton,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { format, isValid, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Send as SendIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const colors = {
  primaryGradient: 'linear-gradient(135deg, #143654 0%, rgb(26, 84, 136) 100%)',
  error: '#EF4444',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
  purple: '#143654',
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
    opacity: 0.9,
  },
  '&:disabled': {
    background: error ? colors.error : colors.primaryGradient,
    opacity: 0.5,
    color: '#FFFFFF',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    fontSize: theme.typography.caption.fontSize,
  },
}));

const StatusChip = ({ status, hasRatings }) => {
  let color;
  let label;
  let icon;

  switch (status) {
    case 'completed':
      color = colors.success;
      label = 'Тугалланди';
      icon = <CheckCircleIcon fontSize="small" />;
      break;
    case 'pending':
      color = hasRatings ? colors.info : colors.warning;
      label = hasRatings ? 'Натижа' : 'Текширувда';
      icon = <HourglassEmptyIcon fontSize="small" />;
      break;
    default:
      color = 'default';
      label = 'Номаълум';
      icon = null;
  }

  return (
    <Chip
      label={label}
      icon={icon}
      size="medium"
      sx={{
        backgroundColor: color,
        color: 'white',
        fontWeight: 500,
        minHeight: 32,
      }}
    />
  );
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://doctoral-studies-server.vercel.app';

const getGradeFromRating = (rating, questionIndex) => {
  if (!rating) return 0;
  switch (questionIndex) {
    case 0:
    case 1:
    case 8:
      return Math.min(5, Math.max(1, Math.round(rating)));
    case 2:
    case 4:
      if (rating >= 17) return 5;
      if (rating >= 14) return 4;
      if (rating >= 11) return 3;
      return 2;
    case 3:
    case 6:
    case 7:
    case 9:
      if (rating >= 9) return 5;
      if (rating >= 7) return 4;
      if (rating >= 5) return 3;
      return 2;
    case 5:
      if (rating >= 13) return 5;
      if (rating >= 11) return 4;
      if (rating >= 9) return 3;
      return 2;
    default:
      return 0;
  }
};

const calculateFinalGrade = (grades) => {
  const weight = 2.2;
  const total = grades.reduce((sum, grade) => sum + grade * weight, 0);
  if (total < 60) return { grade: 0, status: 'rejected', total: Math.round(total * 10) / 10 };
  if (total >= 90) return { grade: 5, status: 'approved', total: Math.round(total * 10) / 10 };
  if (total >= 70) return { grade: 4, status: 'approved', total: Math.round(total * 10) / 10 };
  if (total >= 60) return { grade: 3, status: 'approved', total: Math.round(total * 10) / 10 };
  return { grade: 0, status: 'rejected', total: Math.round(total * 10) / 10 };
};

const questions = [
  '🔹 Диссертациянинг кўрсатилган ихтисосликка мослиги.',
  '🔹 Диссертациянинг илмий савияси.',
  '🔹 Диссертациянинг илмий ва амалий аҳамияти.',
  '🔹 Тадқиқот натижаларининг асосланганлиги.',
  '🔹 Эълон қилинган ишларда диссертация натижаларининг тўлиқ баён этилганлиги.',
  '🔹 Диссертациянинг илмий натижаларини амалиётга жорий этганлиги.',
  '🔹 Изланувчига қўйилган талабларнинг бажарилганлиги.',
  '🔹 Диссертация ва диссертация авторефератини белгиланган талабларга мувофиқ расмийлаштирилганлиги.',
  '🔹 Тавсия.',
  '🔹 Мавзу билан грант учун лойиҳаларда ва танловларда иштирок этганлиги.',
];

const generateAssessmentPDF = (assessment, setError, setDownloading) => {
  setDownloading(true);
  try {
    const doc = new jsPDF({ format: 'a4', unit: 'mm', putOnlyUsedFonts: true });
    doc.setFont('Helvetica'); // Use built-in font
    doc.setFontSize(16);
    doc.setTextColor(20, 54, 84);

    // Add title
    doc.text('Диссертация баҳолаш натижалари', 105, 15, { align: 'center', charSpace: 0 });

    let yPosition = 30;

    // Add general feedback
    const feedback = assessment.feedback || 'итоговый комментарий';
    doc.setFontSize(14);
    doc.setTextColor(20, 54, 84);
    doc.text('Умумий изоҳ:', 14, yPosition);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const feedbackLines = doc.splitTextToSize(feedback, 180);
    doc.text(feedbackLines, 14, yPosition + 10);
    yPosition += 20 + feedbackLines.length * 5;

    // Add preliminary ratings
    doc.setFontSize(14);
    doc.setTextColor(20, 54, 84);
    doc.text('Олдиндан баҳолар:', 14, yPosition);
    yPosition += 10;

    // Ensure all 10 questions are included
    const tableData = questions.map((defaultQuestion, idx) => {
      const q = assessment.questions && assessment.questions[idx] ? assessment.questions[idx] : {};
      const grade = getGradeFromRating(q.rating || 0, idx);
      return [
        idx + 1,
        q.question || defaultQuestion,
        q.rating || '0',
        grade,
        (grade * 2.2).toFixed(1),
        q.feedback || 'yangi izoh qoshildi',
      ];
    });

    // Apply autoTable
    autoTable(doc, {
      startY: yPosition,
      head: [['№', 'Савол', 'Балл', 'Баҳо', 'Ҳисобланиши', 'Изоҳ']],
      body: tableData,
      margin: { left: 14 },
      headStyles: {
        fillColor: [20, 54, 84],
        textColor: 255,
        fontSize: 10,
        font: 'Helvetica',
      },
      bodyStyles: {
        fontSize: 9,
        font: 'Helvetica',
        cellWidth: 'wrap',
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 70 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 30 },
        5: { cellWidth: 'auto' },
      },
      styles: {
        overflow: 'linebreak',
        minCellHeight: 10,
        font: 'Helvetica',
        halign: 'left',
      },
      didDrawPage: () => {
        doc.setFont('Helvetica'); // Ensure font consistency
      },
    });

    doc.save(`disertation_baholash_${assessment._id || 'unknown'}.pdf`);
  } catch (error) {
    console.error('PDF generation failed:', error);
    setError(`PDF юклаб олишда хатолик: ${error.message}`);
  } finally {
    setDownloading(false);
  }
};

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
  const [downloading, setDownloading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Авторизация талаб қилинади');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/reviewers`, {
          headers: { 'Authorization': token },
        });

        const data = await response.json();
        if (response.ok) {
          setReviewers(data);
        } else {
          setError(data.error || 'Текширувчиларни юклашда хатолик');
        }
      } catch (err) {
        setError('Хатолик юз берди: ' + err.message);
      } finally {
        setFetchingReviewers(false);
      }
    };

    const fetchAssessments = async () => {
      setLoadingAssessments(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Авторизация талаб қилинади');
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
        console.error('Баҳоларни юклашда хатолик:', err);
        setError('Баҳоларни юклашда хатолик: ' + err.message);
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
      setError('Текширувчини танланг');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Авторизация талаб қилинади');
        setLoading(false);
        return;
      }

      const questionsData = questions.map((question) => ({
        question,
        answer: '',
      }));

      const response = await fetch(`${API_BASE_URL}/submit-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          recipient: recipient,
          answers: questionsData,
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
        throw new Error(data.error || 'Юборишда хатолик');
      }
    } catch (err) {
      setError(err.message || 'Хатолик');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Сана белгиланмаган';
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Нотўғри сана';
      return format(date, 'dd MMMM yyyy, HH:mm', { locale: ru });
    } catch (error) {
      console.error('Сана форматлашда хатолик:', error);
      return 'Сана хатоси';
    }
  };

  const renderAssessmentItem = (assessment) => {
    const hasRatings = assessment.questions?.some((q) => q.rating > 0) || false;
    const grades = assessment.questions?.map((q, idx) => getGradeFromRating(q.rating, idx)) || [];
    const result = calculateFinalGrade(grades);

    return (
      <Paper elevation={2} sx={{ mb: 2, p: isMobile ? 1.5 : 2, position: 'relative' }}>
        {(assessment.status === 'completed' || hasRatings) && (
          <IconButton
            onClick={() => generateAssessmentPDF(assessment, setError, setDownloading)}
            disabled={downloading}
            sx={{
              position: 'absolute',
              top: isMobile ? 8 : 16,
              right: isMobile ? 8 : 16,
              color: colors.purple,
            }}
            title="PDF юклаб олиш"
          >
            {downloading ? (
              <CircularProgress size={20} sx={{ color: colors.purple }} />
            ) : (
              <FileDownloadIcon />
            )}
          </IconButton>
        )}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
          flexDirection={isMobile ? 'column' : 'row'}
          gap={isMobile ? 1 : 0}
        >
          <Box display="flex" alignItems="center" width={isMobile ? '100%' : 'auto'}>
            <Avatar
              src={assessment.reviewerInfo?.profilePhoto}
              sx={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, mr: 2 }}
            >
              {assessment.reviewerInfo?.firstName?.charAt(0) || '?'}
              {assessment.reviewerInfo?.lastName?.charAt(0) || ''}
            </Avatar>
            <Typography
              variant={isMobile ? 'subtitle2' : 'subtitle1'}
              fontWeight={500}
              sx={{ wordBreak: 'break-word' }}
            >
              {assessment.reviewerInfo?.firstName || 'Номаълум'} {assessment.reviewerInfo?.lastName || ''}
            </Typography>
          </Box>
          <Box textAlign={isMobile ? 'center' : 'right'} width={isMobile ? '100%' : 'auto'}>
            <StatusChip status={assessment.status || 'pending'} hasRatings={hasRatings} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
            >
              {formatDate(assessment.createdAt)}
            </Typography>
            {hasRatings && (
              <Typography
                variant="body2"
                fontWeight={500}
                mt={1}
                sx={{
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  color: result.status === 'rejected' ? colors.error : colors.success,
                }}
              >
                {result.status === 'rejected'
                  ? `Рад этилди (умумрий балл: ${result.total})`
                  : `Баҳо: ${result.grade} (умумрий балл: ${result.total})`}
              </Typography>
            )}
          </Box>
        </Box>

        {(assessment.status === 'completed' || hasRatings) && (
          <>
            <Divider sx={{ my: isMobile ? 1 : 2 }} />

            {assessment.feedback && (
              <>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  gutterBottom
                  sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                >
                  <AssignmentIcon
                    sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem', mr: 0.5, verticalAlign: 'middle' }}
                  />
                  Умумий изоҳ:
                </Typography>
                <Typography
                  variant="body2"
                  paragraph
                  sx={{ mb: 2, fontSize: isMobile ? '0.8rem' : '0.875rem', wordBreak: 'break-word' }}
                >
                  {assessment.feedback}
                </Typography>
              </>
            )}

            <Typography
              variant="body2"
              fontWeight={500}
              gutterBottom
              sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
            >
              <StarIcon sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem', mr: 0.5, verticalAlign: 'middle' }} />
              {assessment.status === 'completed' ? 'Саволлар бўйича баҳолар:' : 'Олдиндан баҳолар:'}
            </Typography>
            <List dense>
              {(assessment.questions || []).map((q, idx) => (
                <ListItem key={idx} sx={{ py: isMobile ? 0.5 : 1 }}>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                      >
                        {q.question || questions[idx]}
                      </Typography>
                    }
                    secondary={
                      q.rating > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                          >
                            <PersonIcon
                              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', mr: 0.5, verticalAlign: 'middle' }}
                            />
                            Баллар: {q.rating}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                          >
                            <StarIcon
                              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', mr: 0.5, verticalAlign: 'middle' }}
                            />
                            Баҳо: {getGradeFromRating(q.rating, idx)} (Баллар:{' '}
                            {(getGradeFromRating(q.rating, idx) * 2.2).toFixed(1)})
                          </Typography>
                          {q.feedback && (
                            <Typography
                              variant="body2"
                              color="text.primary"
                              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                            >
                              <AssignmentIcon
                                sx={{
                                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                                  mr: 0.5,
                                  verticalAlign: 'middle',
                                }}
                              />
                              Изоҳ: {q.feedback}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                        >
                          {assessment.status === 'completed' ? 'Баҳо йўқ' : 'Баҳо кутилмоқда'}
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
        <DescriptionIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Докторантни баҳолаш
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
              '&:hover': { background: colors.primaryGradient, opacity: 0.9 },
            }),
            ...(activeTab !== 'new' && {
              borderColor: colors.purple,
              color: colors.purple,
            }),
          }}
        >
          Янги баҳолаш
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
              '&:hover': { background: colors.primaryGradient, opacity: 0.9 },
            }),
            ...(activeTab !== 'submitted' && {
              borderColor: colors.purple,
              color: colors.purple,
            }),
          }}
        >
          Юборилган ({submittedAssessments.length})
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
              '&:hover': { background: colors.primaryGradient, opacity: 0.9 },
            }),
            ...(activeTab !== 'completed' && {
              borderColor: colors.purple,
              color: colors.purple,
            }),
          }}
        >
          Тугалланган ({completedAssessments.length})
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

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
                    fontWeight: 500,
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
            <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Кимга юбориш:
          </Typography>
          <Select
            fullWidth
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            displayEmpty
            sx={{ whiteSpace: 'normal', '& .MuiSelect-select': { py: isMobile ? 1 : 1.5 } }}
          >
            <MenuItem value="" disabled>
              Текширувчини танланг
            </MenuItem>
            {fetchingReviewers ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
                Юкланмоқда...
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
            startIcon={<SendIcon />}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Юбориш'}
          </SubmitButton>

          {success && (
            <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess(false)}>
              Саволлар текширишга муваффақиятли юборилди
            </Alert>
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
              Сизда юборилган баҳолар йўқ
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
              Сизда тугалланган баҳолар йўқ
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