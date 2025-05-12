
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Input,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Fade,
  ListItemIcon,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ListIcon from '@mui/icons-material/List';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Initialize pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// Color palette
const colors = {
  primary: '#113452', // Deep blue
  secondary: '#E8ECEF', // Light gray
  accent: '#2E7D32', // Forest green
  error: '#C62828', // Deep red
  warning: '#F57C00', // Orange
  text: '#263238', // Dark gray
  lightText: '#607D8B', // Muted gray
  highlight: '#D6E4FF', // Light blue
  borderColor: '#90CAF9', // Soft blue
};

// Styled components
const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: '0 auto',
  minHeight: 'calc(100vh - 64px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: colors.secondary,
  width: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const UploadButton = styled(Button)({
  backgroundColor: colors.primary,
  color: '#FFFFFF',
  padding: '10px 24px',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#0D2A44',
  },
  '&:disabled': {
    backgroundColor: '#B0BEC5',
  },
  transition: 'all 0.3s ease',
});

const AnalyzeButton = styled(Button)({
  backgroundColor: colors.accent,
  color: '#FFFFFF',
  padding: '12px 32px',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  marginTop: '24px',
  width: '100%',
  '&:hover': {
    backgroundColor: '#1B5E20',
  },
  '&:disabled': {
    backgroundColor: '#B0BEC5',
  },
  transition: 'all 0.3s ease',
});

const ErrorBox = styled(Box)({
  backgroundColor: '#FFEBEE',
  padding: '12px',
  borderRadius: '8px',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${ colors.error } `,
});

const ResultBox = styled(Box)({
  backgroundColor: colors.highlight,
  padding: '20px',
  borderRadius: '10px',
  marginTop: '20px',
  border: `1px solid ${ colors.borderColor } `,
  transition: 'opacity 0.5s ease',
});

const Testing = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Extract text from file
  const extractTextFromFile = async (selectedFile) => {
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

    try {
      if (fileExtension === 'pdf') {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(' ') + ' ';
        }
        return text;
      } else if (fileExtension === 'docx') {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      } else {
        throw new Error('Фақат PDF ёки DOCX файллар қўллаб-қувватланади');
      }
    } catch (err) {
      throw new Error(`Файлни ўқишда хатолик: ${ err.message } `);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setDescription(null);
    }
  };

  // Analyze dissertation
  const handleAnalyze = async () => {
    if (!file) {
      setError('Илтимос, файл юкланг!');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const text = await extractTextFromFile(file);
      const cleanedText = text.replace(/\s+/g, ' ').trim();
      const textLower = cleanedText.toLowerCase();

      // Keyword analysis
      const keywords = [
        'Annotatsiya',
        'Kirish',
        'Xulosa',
        'Yakun',
        'ILMIY TADQIQOT ISHI MAVZUSI BO‘YICHA ANALITIK TAHLIL',
        'UMUMIY XULOSA VA TAVSIYALAR',
        'FOYDANILGAN ADABIYOTLAR',
        'ILOVALAR',
      ];
      const keywordResults = keywords.map((keyword) => ({
        keyword,
        found: new RegExp(`\\b${ keyword.replace(/['‘’]/g, "['‘’]").replace(/\s+/g, '\\s*') } \\b`, 'i').test(
          textLower
        ),
      }));

      // Count "BOB" occurrences
      const bobCount = (cleanedText.match(/\bBOB\b/g) || []).length;
      const bobResult = { keyword: 'BOB', found: bobCount > 0 };

      // Word count
      const wordCount = cleanedText.split(/\s+/).filter((word) => word.length > 0).length;

      // Prepare description
      const allKeywordsFound = keywordResults.every((result) => result.found) && bobResult.found;
      const missingKeywords = keywordResults
        .filter((result) => !result.found)
        .map((result) => result.keyword)
        .concat(bobResult.found ? [] : ['BOB']);
      const foundKeywords = keywordResults
        .filter((result) => result.found)
        .map((result) => result.keyword)
        .concat(bobResult.found ? ['BOB'] : []);

      setDescription({
        wordCount,
        bobCount,
        allKeywordsFound,
        missingKeywords,
        foundKeywords,
        textLength: cleanedText.length,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <StyledPaper>
        <Box display="flex" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={700} color={colors.primary}>
            Диссертация текшируви
          </Typography>
        </Box>

        {error && (
          <ErrorBox>
            <ErrorIcon sx={{ color: colors.error, mr: 1 }} />
            <Typography color={colors.error} fontSize={14}>
              {error}
            </Typography>
          </ErrorBox>
        )}

        <Box mb={3}>
          <Box display="flex" alignItems="center" mb={1}>
            <UploadFileIcon sx={{ color: colors.primary, mr: 1 }} />
            <Typography fontWeight={600} fontSize={15} color={colors.text}>
              PDF ёки DOCX файлни юкланг
            </Typography>
          </Box>
          <Input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            fullWidth
            sx={{
              border: `1px solid ${ colors.borderColor } `,
              borderRadius: '8px',
              padding: '8px',
              backgroundColor: '#FFFFFF',
              '&:hover': {
                borderColor: colors.primary,
                boxShadow: `0 0 8px ${ colors.borderColor } `,
              },
              '& input': {
                cursor: 'pointer',
              },
            }}
          />
        </Box>

        <AnalyzeButton onClick={handleAnalyze} disabled={loading || !file} startIcon={loading ? null : <PlayArrowIcon />}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Текшириш'}
        </AnalyzeButton>

        {description && (
          <Fade in={true} timeout={600}>
            <ResultBox>
              <Typography fontWeight={600} fontSize={16} color={colors.text} mb={2}>
                Диссертация тавсифи
              </Typography>

              {description.allKeywordsFound ? (
                <Box display="flex" alignItems="center" mb={2}>
                  <CheckCircleIcon sx={{ color: colors.accent, mr: 1 }} />
                  <Typography color={colors.accent} fontWeight={600} fontSize={14}>
                    Ҳурматли Докторант, сизда талаб этилган тавсифлар бор
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box display="flex" alignItems="center" mb={1}>
                    <ErrorIcon sx={{ color: colors.error, mr: 1 }} />
                    <Typography color={colors.error} fontWeight={600} fontSize={14}>
                      Ҳурматли Докторант, қуйидаги калит сўзлар ёки иборалар топилмади:
                    </Typography>
                  </Box>
                  <List dense sx={{ pl: 4, mb: 2, color: colors.error }}>
                    {description.missingKeywords.map((keyword) => (
                      <ListItem key={keyword} disablePadding>
                        <ListItemText
                          primary={keyword}
                          primaryTypographyProps={{ fontSize: 14 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              <Typography fontSize={14} color={colors.text} mb={1}>
                Умумий сўзлар сони: {description.wordCount}
              </Typography>
              <Typography fontSize={14} color={colors.text} mb={1}>
                "BOB" сўзи сони: {description.bobCount}
              </Typography>

              {description.foundKeywords.length > 0 && (
                <>
                  <Box display="flex" alignItems="center" mt={2} mb={1}>
                    <ListIcon sx={{ color: colors.accent, mr: 1 }} />
                    <Typography fontWeight={600} fontSize={14} color={colors.text}>
                      Топилган калит сўзлар ва иборалар:
                    </Typography>
                  </Box>
                  <List dense sx={{ pl: 4, color: colors.accent }}>
                    {description.foundKeywords.map((keyword) => (
                      <ListItem key={keyword} disablePadding>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ fontSize: 16, color: colors.accent }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={keyword}
                          primaryTypographyProps={{ fontSize: 14 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              <Typography fontSize={12} color={colors.lightText} mt={2}>
                Извлеченный матн узунлиги: {description.textLength} белги
              </Typography>
            </ResultBox>
          </Fade>
        )}
      </StyledPaper>
    </Container>
  );
};

export default Testing;
