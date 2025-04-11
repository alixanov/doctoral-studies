import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, Button, Input, Select, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Цветовая схема
const colors = {
  primary: '#1A3C59',
  secondary: '#F5F6F5',
  textPrimary: '#1A3C5A',
  white: '#FFFFFF',
  hover: '#2A4A6B',
  border: '#E5E7EB',
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

const SubmitButton = styled(Button)({
  background: colors.primary,
  color: colors.white,
  padding: '10px 0',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 500,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: colors.hover,
    transform: 'translateY(-1px)',
  },
  '&:disabled': {
    background: '#6B7280',
    color: colors.white,
  },
});

const LogoutButton = styled(Button)({
  background: colors.error,
  color: colors.white,
  padding: '8px 16px',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 500,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: '#D32F2F',
    transform: 'translateY(-1px)',
  },
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Валидация
    if (!formData.subject || !formData.recipient || !formData.content) {
      setLoading(false);
      setError('Все текстовые поля обязательны');
      return;
    }

    // Подготовка FormData для отправки файлов
    const formDataToSend = new FormData();
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('recipient', formData.recipient);
    formDataToSend.append('content', formData.content);

    // Добавляем файлы в FormData
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
          'Authorization': token,
        },
        body: formDataToSend,
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        alert('Документы успешно отправлены!');
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
      } else {
        setError(result.error || 'Ошибка при отправке документов');
      }
    } catch (err) {
      setLoading(false);
      setError('Произошла ошибка: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/doctoral-register');
  };

  const fileFields = [
    { name: 'malumotnoma', label: "Ma'lumotnoma" },
    { name: 'photo', label: "Nomzodning elektron shakldagi foto-surati" },
    { name: 'passport', label: "Passport nusxasi" },
    { name: 'kengashBayyonomma', label: "Institut Ilmiy Kengashi yigilishi bayyonommasidan ko'chirma" },
    { name: 'dekanatTaqdimnoma', label: "Dekanat va Kafedra taqdimnomasi" },
    { name: 'sinovNatijalari', label: "Birinchi bosqichda Tarix, Chet tili va Informatika fanlaridan erishgan sinov natijalari qaydnomasi(elektron)" },
    { name: 'ilmiyIshlar', label: "Ilmiy ishlar Ro'yhati" },
    { name: 'annotatsiya', label: "Ilmiy (ijodiy) ishlarning annotatsiyasi" },
    { name: 'maqolalar', label: "Ilmiy maqolalar nusxasi" },
    { name: 'xulosa', label: "Talabaning ilmiy izlasnishi tog'risida kafedra mudiri va ilmiy rahbar xulosasi" },
    { name: 'testBallari', label: "Talabaning kirish test sinovlarida to'plagan ballari" },
    { name: 'tarjimaiXol', label: "Talabaning tarjimai xoli" },
    { name: 'reytingDaftarcha', label: "Reyting daftarcha" },
    { name: 'guvohnoma', label: "Muallif guvohnomasi" },
    { name: 'yutuqlar', label: "Yutuqlar" },
    { name: 'boshqa', label: "Boshqa" },
  ];

  return (
    <CabinetContainer>
      <ContentWrapper>
        {/* Левый столбец: Информация о пользователе */}
        <LeftColumn>
          <Typography variant="h6" fontWeight={600} color={colors.textPrimary} mb={2}>
            Личная информация
          </Typography>
          <Box mb={2}>
            <Typography variant="body2" color={colors.textPrimary} fontWeight={500}>
              Имя
            </Typography>
            <Typography variant="body1" color={colors.textPrimary}>
              {user.firstName}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="body2" color={colors.textPrimary} fontWeight={500}>
              Фамилия
            </Typography>
            <Typography variant="body1" color={colors.textPrimary}>
              {user.lastName}
            </Typography>
          </Box>
          <Box mb={2}>
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

        {/* Правый столбец: Форма отправки */}
        <RightColumn>
          <Typography variant="h6" fontWeight={600} color={colors.textPrimary} mb={2}>
            Отправить документы
          </Typography>
          {error && (
            <Typography
              align="center"
              color={colors.error}
              sx={{ mb: 2, fontSize: 13 }}
            >
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
              renderValue={(selected) => (selected ? selected : 'Кому отправить')}
            >
              <MenuItem value="" disabled>
                Кому отправить
              </MenuItem>
              <MenuItem value="admin@example.com">Администратору</MenuItem>
              <MenuItem value="support@example.com">Поддержке</MenuItem>
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
              sx={{ mt: 2 }}
            />
            <Box mt={2} mb={2}>
              <Typography variant="body2" color={colors.textPrimary} fontWeight={500} mb={1}>
                Файл
              </Typography>
              <StyledInput
                type="file"
                name="file"
                onChange={handleChange}
                fullWidth
              />
              <Typography variant="caption" color={colors.textPrimary} mt={1}>
                {formData.file ? formData.file.name : 'Файл не выбран'}
              </Typography>
            </Box>

            {fileFields.map((field) => (
              <Box key={field.name} mt={2} mb={2}>
                <Typography variant="body2" color={colors.textPrimary} fontWeight={500} mb={1}>
                  {field.label}
                </Typography>
                <StyledInput
                  type="file"
                  name={field.name}
                  onChange={handleChange}
                  fullWidth
                />
                <Typography variant="caption" color={colors.textPrimary} mt={1}>
                  {formData[field.name] ? formData[field.name].name : 'Файл не выбран'}
                </Typography>
              </Box>
            ))}

            <SubmitButton fullWidth type="submit" disabled={loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Отправить'}
            </SubmitButton>
          </form>
        </RightColumn>
      </ContentWrapper>
    </CabinetContainer>
  );
};

export default Cabinet;