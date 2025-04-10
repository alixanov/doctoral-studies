import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, Button, Input, Select, MenuItem } from '@mui/material';

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
  // background: colors.secondary,
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
    fontFamily: "'Inter', sans-serif",
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
  fontFamily: "'Inter', sans-serif",
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
  fontFamily: "'Inter', sans-serif",
  transition: 'all 0.3s ease',
  '&:hover': {
    background: colors.hover,
    transform: 'translateY(-1px)',
  },
});

const Cabinet = () => {
  // Получаем данные пользователя из localStorage
  const user = JSON.parse(localStorage.getItem('userData')) || {
    name: 'Иван Петров',
    email: 'ivan.petrov@example.com',
  };

  // Состояние для формы отправки
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Отправка данных:', formData);
    // Здесь можно добавить логику отправки данных
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
              Имя и фамилия
            </Typography>
            <Typography variant="body1" color={colors.textPrimary}>
              {user.name}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="body2" color={colors.textPrimary} fontWeight={500}>
              Email
            </Typography>
            <Typography variant="body1" color={colors.textPrimary}>
              {user.email}
            </Typography>
          </Box>
        </LeftColumn>

        {/* Правый столбец: Форма отправки */}
        <RightColumn>
          <Typography variant="h6" fontWeight={600} color={colors.textPrimary} mb={2}>
            Отправить письмо
          </Typography>
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

            {/* Новые поля для загрузки файлов */}
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

            <SubmitButton fullWidth type="submit">
              Отправить
            </SubmitButton>
          </form>
        </RightColumn>
      </ContentWrapper>
    </CabinetContainer>
  );
};

export default Cabinet;