
import React, { useState, useRef, Component } from 'react';
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
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ListIcon from '@mui/icons-material/List';
import DownloadIcon from '@mui/icons-material/Download';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';

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
  maxWidth: '800px',
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
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#FFFFFF',
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

const DownloadButton = styled(Button)({
  backgroundColor: colors.primary,
  color: '#FFFFFF',
  padding: '10px 24px',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: 600,
  textTransform: 'none',
  marginTop: '16px',
  width: '100%',
  '&:hover': {
    backgroundColor: '#0D2A44',
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

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBox>
          <ErrorIcon sx={{ color: colors.error, mr: 1 }} />
          <Typography color={colors.error} fontSize={14}>
            Хатолик юз берди: {this.state.error?.message || 'Номаълум хатолик.'}
          </Typography>
        </ErrorBox>
      );
    }
    return this.props.children;
  }
}

const requiredKeywords = [
  'ANNOTATSIYA',
  'KIRISH',
  'ILMIY TADQIQOT ISHI MAVZUSI BO‘YICHA ANALITIK TAHLIL',
  'UMUMIY XULOSA VA TAVSIYALAR',
  'FOYDANILGAN ADABIYOTLAR',
  'ILOVALAR',
  'XULOSA',
];

const Testing = () => {
  const [dissertationText, setDissertationText] = useState('');
  const [result, setResult] = useState(null);
  const [description, setDescription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPDFButton, setShowPDFButton] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Extract text from PDF
  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(' ') + ' ';
      }
      return text;
    } catch (error) {
      throw new Error(`PDF файлни ўқишда хатолик: ${ error.message } `);
    }
  };

  // Extract text from DOCX
  const extractTextFromDOCX = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      throw new Error(`DOCX файлни ўқишда хатолик: ${ error.message } `);
    }
  };

  // Limit text to 50 words
  const limitTo50Words = (text) => {
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    if (words.length > 50) {
      return words.slice(0, 50).join(' ') + '...';
    }
    return words.join(' ');
  };

  // Handle file selection
  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      setError('');
      setResult(null);
      setDescription(null);
      setShowPDFButton(false);

      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        text = await extractTextFromDOCX(file);
      } else {
        setError('Фақат PDF ёки DOC/DOCX файллар қўллаб-қувватланади!');
        return;
      }
      setDissertationText(text);
    } catch (error) {
      setError(error.message);
    }
  };

  // Analyze dissertation
  const checkDissertation = async () => {
    if (!dissertationText) {
      setError('Илтимос, файл юкланг ёки матн киритинг!');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async processing

      // Check keywords
      const missingKeywords = [];
      const foundKeywords = [];
      requiredKeywords.forEach((keyword) => {
        if (dissertationText.includes(keyword)) {
          foundKeywords.push(keyword);
        } else {
          missingKeywords.push(keyword);
        }
      });

      // Extract conclusion
      let conclusionText = '';
      if (foundKeywords.includes('XULOSA') && dissertationText.includes('UMUMIY XULOSA VA TAVSIYALAR')) {
        const umumiyXulosaIndex = dissertationText.indexOf('UMUMIY XULOSA VA TAVSIYALAR');
        const textAfterUmumiyXulosa = dissertationText
          .slice(umumiyXulosaIndex + 'UMUMIY XULOSA VA TAVSIYALAR'.length)
          .trim();
        conclusionText = limitTo50Words(textAfterUmumiyXulosa);
      }

      // Prepare description
      const wordCount = dissertationText.split(/\s+/).filter((word) => word.length > 0).length;
      const charCount = dissertationText.length;
      const keywordCount = foundKeywords.length;
      const limitedText = limitTo50Words(dissertationText);

      setDescription({
        wordCount,
        charCount,
        keywordCount,
        totalKeywords: requiredKeywords.length,
        limitedText,
      });

      // Set results
      setResult({ missingKeywords, foundKeywords, conclusionText });
      setShowPDFButton(true);
    } catch (error) {
      setError(`Текширишда хатолик: ${ error.message } `);
    } finally {
      setIsLoading(false);
    }
  };

  // Download PDF
  const downloadPDF = async () => {
    try {
      setIsLoading(true);
      const doc = new jsPDF();
      let y = 20;

      // Add title
      doc.setFontSize(16);
      doc.text('Dissertatsiya Tekshiruvi Natijalari', 20, y);
      y += 10;

      // Add keyword results
      doc.setFontSize(12);
      doc.text('Kalit so‘zlar holati:', 20, y);
      y += 10;
      if (result) {
        const resultText = result.missingKeywords.length === 0
          ? 'Hurmatli doktorant, ilmiy ish bo‘yicha barcha mezonlar mavjud!'
          : 'Hurmatli doktorant, sizda ushbu mezon(lar) bo‘yicha ilmiy ish dissertatsiyada mavjud emas, bartaraf etib qayta urinib ko‘ring!';
        doc.text(resultText, 20, y);
        y += 10;

        result.foundKeywords.forEach((kw) => {
          doc.text(`${ kw } - mavjud`, 20, y);
          if (kw === 'XULOSA' && result.conclusionText) {
            y += 7;
            doc.text(`Xulosa: ${ result.conclusionText } `, 20, y);
          }
          y += 7;
        });

        result.missingKeywords.forEach((kw) => {
          doc.text(`${ kw } - mavjud emas`, 20, y);
          y += 7;
        });
      }

      // Add description
      y += 10;
      doc.text('Dissertatsiya haqida umumiy ma’lumot:', 20, y);
      y += 10;
      if (description) {
        doc.text(`So‘zlar soni: ${ description.wordCount } `, 20, y);
        y += 7;
        doc.text(`Belgilar soni: ${ description.charCount } `, 20, y);
        y += 7;
        doc.text(`Topilgan kalit so‘zlar soni: ${ description.keywordCount }/${description.totalKeywords}`, 20, y);
y += 7;
doc.text(`Dissertatsiya mazmuni: ${description.limitedText}`, 20, y);
      }

// Save PDF
doc.save('dissertation_analysis.pdf');
    } catch (error) {
  setError(`PDF файлни яратишда хатолик: ${error.message}`);
} finally {
  setIsLoading(false);
}
  };

return (
  <ErrorBoundary>
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
              PDF ёки DOC/DOCX файлни юкланг
            </Typography>
          </Box>
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            inputRef={fileInputRef}
            fullWidth
            sx={{
              border: `1px solid ${colors.borderColor}`,
              borderRadius: '8px',
              padding: '8px',
              backgroundColor: '#FFFFFF',
              '&:hover': {
                borderColor: colors.primary,
                boxShadow: `0 0 8px ${colors.borderColor}`,
              },
              '& input': {
                cursor: 'pointer',
              },
            }}
          />
        </Box>

        {dissertationText && (
          <Box mb={3}>
            <Typography fontWeight={600} fontSize={15} color={colors.text} mb={1}>
              Файлдан олинган матн
            </Typography>
            <TextField
              multiline
              rows={6}
              value={dissertationText}
              onChange={(e) => setDissertationText(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: colors.borderColor,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.primary,
                  },
                },
              }}
            />
          </Box>
        )}

        <AnalyzeButton
          onClick={checkDissertation}
          disabled={isLoading}
          startIcon={isLoading ? null : <PlayArrowIcon />}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Текшириш'}
        </AnalyzeButton>

        {showPDFButton && (
          <DownloadButton
            onClick={downloadPDF}
            disabled={isLoading}
            startIcon={<DownloadIcon />}
          >
            PDF юклаб олиш
          </DownloadButton>
        )}

        {result && (
          <Fade in={true} timeout={600}>
            <ResultBox>
              <Typography fontWeight={600} fontSize={16} color={colors.text} mb={2}>
                Калит сўзлар ҳолати
              </Typography>

              {result.missingKeywords.length === 0 ? (
                <Box display="flex" alignItems="center" mb={2}>
                  <CheckCircleIcon sx={{ color: colors.accent, mr: 1 }} />
                  <Typography color={colors.accent} fontWeight={600} fontSize={14}>
                    Ҳурматли докторант, илмий иш бўйича барча мезонлар мавжуд!
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box display="flex" alignItems="center" mb={1}>
                    <ErrorIcon sx={{ color: colors.error, mr: 1 }} />
                    <Typography color={colors.error} fontWeight={600} fontSize={14}>
                      Ҳурматли докторант, сизда ушбу мезон(лар) бўйича илмий иш диссертацияда мавжуд эмас, бартараф этиб қайта уриниб кўринг!
                    </Typography>
                  </Box>
                  <List dense sx={{ pl: 4, mb: 2, color: colors.error }}>
                    {result.missingKeywords.map((keyword) => (
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

              {result.foundKeywords.length > 0 && (
                <>
                  <Box display="flex" alignItems="center" mt={2} mb={1}>
                    <ListIcon sx={{ color: colors.accent, mr: 1 }} />
                    <Typography fontWeight={600} fontSize={14} color={colors.text}>
                      Топилган калит сўзлар:
                    </Typography>
                  </Box>
                  <List dense sx={{ pl: 4, color: colors.accent }}>
                    {result.foundKeywords.map((keyword) => (
                      <ListItem key={keyword} disablePadding>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ fontSize: 16, color: colors.accent }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <>
                              {keyword}
                              {keyword === 'XULOSA' && result.conclusionText && (
                                <Typography
                                  component="span"
                                  fontSize={14}
                                  color={colors.lightText}
                                  display="block"
                                >
                                  Хулоса: {result.conclusionText}
                                </Typography>
                              )}
                            </>
                          }
                          primaryTypographyProps={{ fontSize: 14 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </ResultBox>
          </Fade>
        )}

        {description && (
          <Fade in={true} timeout={600}>
            <ResultBox>
              <Typography fontWeight={600} fontSize={16} color={colors.text} mb={2}>
                Диссертация ҳақида умумий маълумот
              </Typography>
              <Typography fontSize={14} color={colors.text} mb={1}>
                Сўзлар сони: {description.wordCount}
              </Typography>
              <Typography fontSize={14} color={colors.text} mb={1}>
                Белгилар сони: {description.charCount}
              </Typography>
              <Typography fontSize={14} color={colors.text} mb={1}>
                Топилган калит сўзлар сони: {description.keywordCount}/{description.totalKeywords}
              </Typography>
              <Typography fontSize={14} color={colors.text}>
                Диссертация мазмуни: {description.limitedText}
              </Typography>
            </ResultBox>
          </Fade>
        )}
      </StyledPaper>
    </Container>
  </ErrorBoundary>
);
};

export default Testing;
