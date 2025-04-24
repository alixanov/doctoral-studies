import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, Button, Input, Select, MenuItem, CircularProgress, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';

// Ранг схемаси
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

// Стилланган компонентлар
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
    firstName: 'Исмоил',
    lastName: 'Хасанов',
    login: 'ismail.hasanov',
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
    // Фойдаланувчи маълумотларини юклаш
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
        console.error('Фойдаланувчи маълумотларини юклашда хатолик:', err);
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
            { id: '1', firstName: 'Админ', lastName: 'Тизим', email: 'admin@example.com' },
            { id: '2', firstName: 'Қўлланма', lastName: 'Ходими', email: 'support@example.com' },
          ]);
        }
      } catch (err) {
        console.error('Текширувчилар рўйхатини олишда хатолик:', err);
        setReviewers([
          { id: '1', firstName: 'Админ', lastName: 'Тизим', email: 'admin@example.com' },
          { id: '2', firstName: 'Қўлланма', lastName: 'Ходими', email: 'support@example.com' },
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

        // localStorage-да фойдаланувчи маълумотларини янгилаш
        const userData = JSON.parse(localStorage.getItem('userData'));
        localStorage.setItem('userData', JSON.stringify({
          ...userData,
          profilePhoto: result.profilePhotoUrl
        }));
      } else {
        throw new Error('Расмни юклаб бўлмади');
      }
    } catch (err) {
      console.error('Профил расмини юклашда хатолик:', err);
      setError('Профил расмини юклаб бўлмади');
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
      setError('Барча матн майдонлари тўлдирилиши шарт');
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
        throw new Error(errorData.error || 'Ҳужжатларни жўнатишда хатолик');
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
      setError(err.message || 'Жўнатишда хатолик юз берди');
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
    { name: 'malumotnoma', label: 'Малұмотнома' },
    { name: 'photo', label: 'Номзоднинг электрон расми' },
    { name: 'passport', label: 'Паспорт нусхаси' },
    { name: 'kengashBayyonomma', label: 'Институт илмий кенгашининг баённомаси' },
    { name: 'dekanatTaqdimnoma', label: 'Деканат ва кафедранинг такдимномаси' },
    { name: 'sinovNatijalari', label: 'Тарих, чет тили ва информатикадан биринчи босқичдаги синов натижалари' },
    { name: 'ilmiyIshlar', label: 'Илмий ишлар рўйхати' },
    { name: 'annotatsiya', label: 'Илмий (ижодий) ишлар аннотацияси' },
    { name: 'maqolalar', label: 'Илмий мақолалар нусхаси' },
    { name: 'xulosa', label: 'Кафедра мудири ва илмий раҳбарнинг номзод илмий фаолияти ҳақида хулосаси' },
    { name: 'testBallari', label: 'Кириш тестларида тўпланган баллар' },
    { name: 'tarjimaiXol', label: 'Номзоднинг автобиографияси' },
    { name: 'reytingDaftarcha', label: 'Рейтинг дафтарчаси' },
    { name: 'guvohnoma', label: 'Муаллифлик гувоҳномаси' },
    { name: 'yutuqlar', label: 'Ютуқлар' },
    { name: 'boshqa', label: 'Бошқалар' },
  ];

  return (
    <CabinetContainer>
      <ContentWrapper>
        <LeftColumn>
          <Typography variant="h6" fontWeight={600} color={colors.textPrimary} mb={2}>
            Шахсий маълумотлар
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
              Исм
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
            Чиқиш
          </LogoutButton>
        </LeftColumn>

        <RightColumn>
          <Typography variant="h6" fontWeight={600} color={colors.textPrimary} mb={2}>
            Ҳужжатларни жўнатиш
          </Typography>
          {error && (
            <Typography align="center" color={colors.error} sx={{ mb: 2, fontSize: 13 }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              label="Хат мавзуси"
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
                if (!selected) return 'Кимга жўнатилсин';
                const selectedReviewer = reviewers.find((rev) => rev.email === selected);
                return selectedReviewer ? `${selectedReviewer.firstName} ${selectedReviewer.lastName}` : selected;
              }}
              disabled={fetchingReviewers}
            >
              <MenuItem value="" disabled>
                Кимга жўнатилсин
              </MenuItem>
              {fetchingReviewers ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                  Юкланмоқда...
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
              label="Қисқа мазмуни"
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
                {formData.file ? formData.file.name : 'Файл танланмаган'}
              </Typography>
            </Box>

            {fileFields.map((field) => (
              <Box key={field.name} mt={2} mb={2}>
                <Typography variant="body2" color={colors.textPrimary} fontWeight={500} mb={1}>
                  {field.label}
                </Typography>
                <StyledInput type="file" name={field.name} onChange={handleChange} fullWidth />
                <Typography variant="caption" color={colors.textPrimary} mt={1}>
                  {formData[field.name] ? formData[field.name].name : 'Файл танланмаган'}
                </Typography>
              </Box>
            ))}

            <SubmitButton fullWidth type="submit" disabled={loading || success} success={success ? 1 : 0}>
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  1 дақиқагача кутинг
                </>
              ) : success ? (
                'Муваффақиятли жўнатилди'
              ) : (
                'Жўнатиш'
              )}
            </SubmitButton>
          </form>
        </RightColumn>
      </ContentWrapper>
    </CabinetContainer>
  );
};

export default Cabinet;