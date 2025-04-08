import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Color palette
const colors = {
  armyGreen: '#3D4A26',
  camouflage: '#6B7554',
  khaki: '#A8A14E',
  black: '#1C2526',
  militaryGray: '#4A5557',
  accent: '#A32929',
  white: '#EDEDED',
};

// Generate ID and rank
const generateUserId = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  return `${randomLetter}${randomNumbers}`;
};

const generateRandomRank = () => {
  const ranks = ['Recruit', 'Private', 'Sergeant', 'Captain', 'General'];
  return ranks[Math.floor(Math.random() * ranks.length)];
};

// Styled components
const RegisterContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: '70px auto',
  padding: '12px',
  borderRadius: 16,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '24px',
    marginTop: 100,
  },
}));

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
});

const FormGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: `${colors.militaryGray}cc`,
    color: colors.white,
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 500,
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: `${colors.khaki}80`,
    },
    '&:hover fieldset': {
      borderColor: colors.khaki,
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.accent,
      boxShadow: `0 0 8px ${colors.accent}50`,
    },
  },
  '& .MuiInputBase-input': {
    color: colors.white,
    padding: '14px 16px',
  },
  '& .MuiInputLabel-root': {
    color: `${colors.khaki}cc !important`,
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 500,
    transition: 'all 0.3s ease',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: `${colors.accent} !important`,
  },
});

const SubmitButton = styled(Button)({
  padding: '14px',
  backgroundColor: colors.accent,
  color: colors.white,
  borderRadius: 8,
  fontSize: 16,
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1.2px',
  border: 'none',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: colors.armyGreen,
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${colors.armyGreen}80`,
  },
});

const Register = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    birthDate: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      birthDate: date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      ...formData,
      id: generateUserId(),
      rank: generateRandomRank(),
    };

    localStorage.setItem('userData', JSON.stringify(newUser));
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));

    setIsAuthenticated(true);
    navigate('/cabinet');
  };

  return (
    <RegisterContainer>
      <Typography
        variant="h4"
        align="center"
        sx={{
          mb: 4,
          fontWeight: 700,
          color: colors.white,
          fontFamily: "'Montserrat', sans-serif",
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          background: `linear-gradient(90deg, ${colors.accent}, ${colors.khaki})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Registration
      </Typography>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <StyledTextField
            variant="outlined"
            id="username"
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
            fullWidth
          />
        </FormGroup>

        <FormGroup>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={formData.birthDate}
              onChange={handleDateChange}
              renderInput={(params) => <StyledTextField {...params} fullWidth />}
              required
              slotProps={{
                textField: {
                  sx: {
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.armyGreen, // Army green on hover
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.accent, // Red when focused
                      boxShadow: `0 0 8px ${colors.accent}50`,
                    },
                    '& .MuiInputLabel-root': {
                      color: colors.khaki, // Army khaki label color
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.accent, // Label turns red on focus
                    },
                  },
                },
                popper: {
                  sx: {
                    '& .MuiIconButton-root': {
                      color: colors.accent, // Red color for calendar icon
                      '&:hover': {
                        backgroundColor: `${colors.armyGreen}50`, // Army green hover effect
                      },
                    },
                  },
                },
              }}
            />

            
          </LocalizationProvider>
        </FormGroup>

        <SubmitButton type="submit">Register</SubmitButton>
      </Form>
    </RegisterContainer>
  );
};

export default Register;
