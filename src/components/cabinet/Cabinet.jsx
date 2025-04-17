import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, Button, Input, Select, MenuItem, CircularProgress, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';

// Color scheme
const colors = {
  primary: '#1A3C59',
  secondary: '#F5F6F5',
  textPrimary: '#1A3C5A',
  white: '#FFFFFF',
  hover: '#2A4A6B',
  border: '#E5E7EB',
  error: '#D32F2F',
  success: '#2ECC71',
};

// Styled components
const CabinetContainer = styled(Box)({
  minHeight: '100vh',
  padding: '24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
});

const ContentWrapper = styled(Box)({
  display: 'flex',
  width: '100%',
  maxWidth: '1200px',
  gap: '24px',
  flexWrap: 'wrap',
});

const LeftColumn = styled(Box)({
  flex: '1 1 300px',
  background: colors.white,
  borderRadius: 8,
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  border: `1px solid ${colors.border}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const RightColumn = styled(Box)({
  flex: '2 1 600px',
  background: colors.white,
  borderRadius: 8,
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  border: `1px solid ${colors.border}`,
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 6,
    background: colors.secondary,
    color: colors.textPrimary,
    fontSize: 14,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.border,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.primary,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.primary,
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: colors.textPrimary,
    fontSize: 14,
    '&.Mui-focused': {
      color: colors.primary,
    },
  },
  marginBottom: 16,
});

const StyledSelect = styled(Select)({
  borderRadius: 6,
  background: colors.secondary,
  color: colors.textPrimary,
  fontSize: 14,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: colors.border,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: colors.primary,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  marginBottom: 16,
});

const StyledInput = styled(Input)({
  padding: '8px 0',
  fontSize: 14,
  color: colors.textPrimary,
  '&:before': {
    borderBottom: `1px solid ${colors.border}`,
  },
  '&:hover:not(.Mui-disabled):before': {
    borderBottom: `1px solid ${colors.primary}`,
  },
  '&:after': {
    borderBottom: `2px solid ${colors.primary}`,
  },
});

const SubmitButton = styled(Button)(({ success }) => ({
  background: success ? colors.success : colors.primary,
  color: colors.white,
  padding: '10px 0',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 500,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: success ? '#27AE60' : colors.hover,
    transform: 'translateY(-1px)',
  },
  '&:disabled': {
    background: '#6B7280',
    color: colors.white,
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  textTransform: 'none',
}));

const LogoutButton = styled(Button)({
  background: colors.error,
  color: colors.white,
  padding: '8px 16px',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 500,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: '#ae2525',
    transform: 'translateY(-1px)',
  },
});

const ProfileAvatar = styled(Avatar)({
  width: 120,
  height: 120,
  marginBottom: 16,
  border: `3px solid ${colors.primary}`,
});

const AvatarUploadButton = styled(IconButton)({
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: colors.primary,
  '&:hover': {
    backgroundColor: colors.hover,
  },
});

const AvatarContainer = styled(Box)({
  position: 'relative',
  display: 'inline-block',
  marginBottom: 16,
});

const Cabinet = () => {
  const user = JSON.parse(localStorage.getItem('userData')) || {
    firstName: 'Иван',
    lastName: 'Петров',
    login: 'ivan.petrov',
  };
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: '',
    recipient: '',
    content: '',
    file: null,
    malumotnoma: null,
    photo: null,
    passport: null,
    kengashBayyonomma: null,
    dekanatTaqdimnoma: null,
    sinovNatijalari: null,
    ilmiyIshlar: null,
    annotatsiya: null,
    maqolalar: null,
    xulosa: null,
    testBallari: null,
    tarjimaiXol: null,
    reytingDaftarcha: null,
    guvohnoma: null,
    yutuqlar: null,
    boshqa: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewers, setReviewers] = useState([]);
  const [fetchingReviewers, setFetchingReviewers] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    // Load user data including profile photo
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://doctoral-studies-server.vercel.app/me', {
          headers: {
            Authorization: token,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData.profilePhoto) {
            setPhotoPreview(userData.profilePhoto);
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchReviewers = async () => {
      setFetchingReviewers(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://doctoral-studies-server.vercel.app/reviewers', {
          headers: {
            Authorization: token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setReviewers(data);
        } else {
          setReviewers([
            { id: '1', firstName: 'Администратор', lastName: 'Системы', email: 'admin@example.com' },
            { id: '2', firstName: 'Сотрудник', lastName: 'Поддержки', email: 'support@example.com' },
          ]);
        }
      } catch (err) {
        console.error('Ошибка при получении списка проверяющих:', err);
        setReviewers([
          { id: '1', firstName: 'Администратор', lastName: 'Системы', email: 'admin@example.com' },
          { id: '2', firstName: 'Сотрудник', lastName: 'Поддержки', email: 'support@example.com' },
        ]);
      } finally {
        setFetchingReviewers(false);
      }
    };

    fetchReviewers();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    setProfilePhoto(file);

    try {
      const formData = new FormData();
      formData.append('profilePhoto', file);

      const token = localStorage.getItem('token');
      const response = await fetch('https://doctoral-studies-server.vercel.app/upload-profile-photo', {
        method: 'POST',
        headers: {
          'Authorization': token,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setPhotoPreview(result.profilePhotoUrl);

        // Update user data in localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        localStorage.setItem('userData', JSON.stringify({
          ...userData,
          profilePhoto: result.profilePhotoUrl
        }));
      } else {
        throw new Error('Failed to upload photo');
      }
    } catch (err) {
      console.error('Error uploading profile photo:', err);
      setError('Failed to upload profile photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!formData.subject || !formData.recipient || !formData.content) {
      setLoading(false);
      setError('Все текстовые поля обязательны');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('recipient', formData.recipient);
    formDataToSend.append('content', formData.content);

    Object.keys(formData).forEach((key) => {
      if (formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://doctoral-studies-server.vercel.app/submit-documents', {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при отправке документов');
      }

      const result = await response.json();
      setSuccess(true);
      setFormData({
        subject: '',
        recipient: '',
        content: '',
        file: null,
        malumotnoma: null,
        photo: null,
        passport: null,
        kengashBayyonomma: null,
        dekanatTaqdimnoma: null,
        sinovNatijalari: null,
        ilmiyIshlar: null,
        annotatsiya: null,
        maqolalar: null,
        xulosa: null,
        testBallari: null,
        tarjimaiXol: null,
        reytingDaftarcha: null,
        guvohnoma: null,
        yutuqlar: null,
        boshqa: null,
      });
    } catch (err) {
      setError(err.message || 'Произошла ошибка при отправке');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/doctoral-register');
  };

  const fileFields = [
    { name: 'malumotnoma', label: 'Справка' },
    { name: 'photo', label: 'Электронная фотография кандидата' },
    { name: 'passport', label: 'Копия паспорта' },
    { name: 'kengashBayyonomma', label: 'Выписка из протокола заседания ученого совета института' },
    { name: 'dekanatTaqdimnoma', label: 'Рекомендация деканата и кафедры' },
    { name: 'sinovNatijalari', label: 'Электронная ведомость результатов испытаний по истории, иностранному языку и информатике на первом этапе' },
    { name: 'ilmiyIshlar', label: 'Список научных работ' },
    { name: 'annotatsiya', label: 'Аннотация научных (творческих) работ' },
    { name: 'maqolalar', label: 'Копии научных статей' },
    { name: 'xulosa', label: 'Заключение заведующего кафедрой и научного руководителя о научной деятельности аспиранта' },
    { name: 'testBallari', label: 'Баллы, набранные на вступительных тестах' },
    { name: 'tarjimaiXol', label: 'Автобиография аспиранта' },
    { name: 'reytingDaftarcha', label: 'Рейтинговая книжка' },
    { name: 'guvohnoma', label: 'Свидетельство автора' },
    { name: 'yutuqlar', label: 'Достижения' },
    { name: 'boshqa', label: 'Прочее' },
  ];

  return (
    <CabinetContainer>
      <ContentWrapper>
        <LeftColumn>
          <Typography variant="h6" fontWeight={600} color={colors.textPrimary} mb={2}>
            Личная информация
          </Typography>

          <AvatarContainer>
            {uploadingPhoto ? (
              <CircularProgress size={120} />
            ) : (
              <ProfileAvatar
                src={photoPreview || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=${colors.primary.replace('#', '')}&color=fff`}
                alt={`${user.firstName} ${user.lastName}`}
              />
            )}
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-photo-upload"
              type="file"
              onChange={handlePhotoChange}
            />
            <label htmlFor="profile-photo-upload">
              <AvatarUploadButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </AvatarUploadButton>
            </label>
          </AvatarContainer>

          <Box mb={2} width="100%">
            <Typography variant="body2" color={colors.textPrimary} fontWeight={500}>
              Имя
            </Typography>
            <Typography variant="body1" color={colors.textPrimary}>
              {user.firstName}
            </Typography>
          </Box>
          <Box mb={2} width="100%">
            <Typography variant="body2" color={colors.textPrimary} fontWeight={500}>
              Фамилия
            </Typography>
            <Typography variant="body1" color={colors.textPrimary}>
              {user.lastName}
            </Typography>
          </Box>
          <Box mb={2} width="100%">
            <Typography variant="body2" color={colors.textPrimary} fontWeight={500}>
              Логин
            </Typography>
            <Typography variant="body1" color={colors.textPrimary}>
              {user.login}
            </Typography>
          </Box>
          <LogoutButton fullWidth onClick={handleLogout}>
            Выйти
          </LogoutButton>
        </LeftColumn>

        <RightColumn>
          <Typography variant="h6" fontWeight={600} color={colors.textPrimary} mb={2}>
            Отправить документы
          </Typography>
          {error && (
            <Typography align="center" color={colors.error} sx={{ mb: 2, fontSize: 13 }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              label="Тема письма"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              variant="outlined"
            />
            <StyledSelect
              fullWidth
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) return 'Кому отправить';
                const selectedReviewer = reviewers.find((rev) => rev.email === selected);
                return selectedReviewer ? `${selectedReviewer.firstName} ${selectedReviewer.lastName}` : selected;
              }}
              disabled={fetchingReviewers}
            >
              <MenuItem value="" disabled>
                Кому отправить
              </MenuItem>
              {fetchingReviewers ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                  Загрузка...
                </MenuItem>
              ) : (
                reviewers.map((reviewer) => (
                  <MenuItem key={reviewer.id || reviewer.email} value={reviewer.email}>
                    {reviewer.firstName} {reviewer.lastName}
                  </MenuItem>
                ))
              )}
            </StyledSelect>
            <StyledTextField
              fullWidth
              label="Краткое содержание"
              name="content"
              value={formData.content}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
            />
            <Box mt={2} mb={2}>
              <Typography variant="body2" color={colors.textPrimary} fontWeight={500} mb={1}>
                Файл
              </Typography>
              <StyledInput type="file" name="file" onChange={handleChange} fullWidth />
              <Typography variant="caption" color={colors.textPrimary} mt={1}>
                {formData.file ? formData.file.name : 'Файл не выбран'}
              </Typography>
            </Box>

            {fileFields.map((field) => (
              <Box key={field.name} mt={2} mb={2}>
                <Typography variant="body2" color={colors.textPrimary} fontWeight={500} mb={1}>
                  {field.label}
                </Typography>
                <StyledInput type="file" name={field.name} onChange={handleChange} fullWidth />
                <Typography variant="caption" color={colors.textPrimary} mt={1}>
                  {formData[field.name] ? formData[field.name].name : 'Файл не выбран'}
                </Typography>
              </Box>
            ))}

            <SubmitButton fullWidth type="submit" disabled={loading || success} success={success ? 1 : 0}>
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  Отправка идет, подождите до 1 минуты
                </>
              ) : success ? (
                'Успешно отправлено'
              ) : (
                'Отправить'
              )}
            </SubmitButton>
          </form>
        </RightColumn>
      </ContentWrapper>
    </CabinetContainer>
  );
};

export default Cabinet;