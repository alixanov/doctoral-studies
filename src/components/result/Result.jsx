import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Fade,
  Card,
  CardContent,
  Chip,
  useMediaQuery,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// PDF.js инициализация с совместимыми версиями
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// Custom theme with the new primary color rgb(19, 53, 84)
const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(19, 53, 84)',
      light: 'rgba(19, 53, 84, 0.2)',
      dark: 'rgb(10, 30, 48)',
      contrastText: '#ffffff',
    },
    background: {
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    error: {
      main: '#d32f2f',
    },
    success: {
      main: '#2e7d32',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
  },
});

// Стилизованные компоненты
const Input = styled('input')({
  display: 'none',
});

const UploadButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 500,
  background: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    background: theme.palette.primary.dark,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const AnalyzeButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 500,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const ResultCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: 8,
  boxShadow: theme.shadows[2],
}));

// Конфигурация для анализа
const ANALYSIS_CONFIG = {
  keywords: ['тадқиқот', 'таҳлил', 'усул', 'натижалар', 'методология'],
  sections: [
    { name: 'кириш', label: 'Кириш' },
    { name: 'хужжа', label: 'Хужжа' },
    { name: 'адабиётлар', label: 'Адабиётлар рўйхати', alt: 'манбалар' },
    { name: 'методология', label: 'Методология', alt: 'усуллар' },
  ],
  minTextLength: 1000,
};

const App = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Извлечение текста из файла
  const extractTextFromFile = async (selectedFile) => {
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

    try {
      if (fileExtension === 'txt') {
        return await selectedFile.text();
      } else if (fileExtension === 'pdf') {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(' ') + '\n';
        }
        return text;
      } else if (fileExtension === 'doc' || fileExtension === 'docx') {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      } else {
        throw new Error('Қўллаб-қувватланмаган файл формати');
      }
    } catch (err) {
      throw new Error(`Файлни ўқишда хатолик: ${err.message}`);
    }
  };

  // Поиск автора
  const extractAuthor = (text) => {
    const authorPatterns = [
      /(?:Муаллиф|Докторант|Тайёрловчи|Исм):\s*([А-ЯЁа-яёҚқҒғҲҳ\s]+?)(?=\s*\n|\s*$|\s*[,.])/i,
      /^[А-ЯЁҚҒҲ][а-яёқғҳ]+\s+[А-ЯЁҚҒҲ][а-яёқғҳ]+(?=\s*\n)/,
      /(?:ФИО|Ф\.И\.О\.):\s*([А-ЯЁа-яёҚқҒғҲҳ\s]+?)(?=\s*\n|\s*$|\s*[,.])/i
    ];

    for (const pattern of authorPatterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return null;
  };

  // Анализ текста
  const analyzeTextContent = (text) => {
    const normalizedText = text.toLowerCase();
    const words = normalizedText.split(/\s+/).filter(Boolean);
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
    const summary = text.slice(0, 300) + (text.length > 300 ? '...' : '');

    const description = {
      wordCount: words.length,
      charCount: text.length,
      paragraphs: paragraphs.length,
      foundKeywords: ANALYSIS_CONFIG.keywords.filter(kw =>
        normalizedText.includes(kw.toLowerCase())
      ),
      sections: ANALYSIS_CONFIG.sections.reduce((acc, section) => {
        const hasMain = normalizedText.includes(section.name);
        const hasAlt = section.alt && normalizedText.includes(section.alt);
        acc[section.name] = hasMain || hasAlt;
        return acc;
      }, {}),
      summary,
      hasIntroduction: /кириш|введение|introduction/i.test(text),
      hasConclusion: /якун|заключение|conclusion/i.test(text),
      hasReferences: /адабиётлар|литература|references|список литературы/i.test(text),
    };

    const issues = [];
    if (text.length < ANALYSIS_CONFIG.minTextLength) {
      issues.push(`Матн диссертация учун жуда қисқа (${ANALYSIS_CONFIG.minTextLength} белгидан кам).`);
    }
    if (!description.sections['кириш'] && !description.hasIntroduction) {
      issues.push('"Кириш" бўлими йўқ. Кириш қисмида тадқиқотнинг мақсади ва вазифалари аник баён этилиши керак.');
    }
    if (!description.sections['хужжа'] && !description.hasConclusion) {
      issues.push('"Якун" бўлими йўқ. Якун қисмида тадқиқот натижалари хулоса қилиниши керак.');
    }
    if (!description.sections['адабиётлар'] && !description.hasReferences) {
      issues.push('Фойдаланилган адабиётлар рўйхати йўқ. Диссертацияда ишлатилган манбаларга хаволалар бўлиши керак.');
    }
    if (description.foundKeywords.length < 3) {
      issues.push('Тадқиқотга оид калит сўзлар етарли эмас. Матнда "тадқиқот", "методология", "таҳлил" каби терминлар бўлиши керак.');
    }
    if (paragraphs.length < 10) {
      issues.push('Параграфлар сони етарли эмас. Диссертация яхши структураланган бўлиши керак.');
    }
    if (!description.sections['методология']) {
      issues.push('Тадқиқот методологияси тавсифи йўқ.');
    }

    return { description, issues };
  };

  // Обработка выбора файла
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const allowedExtensions = ['txt', 'pdf', 'doc', 'docx'];
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
      setFile(selectedFile);
      setError('');
      setResult(null);
    } else {
      setError('Илтимос, қўллаб-қувватланган форматдаги файлни танланг (.txt, .pdf, .doc, .docx)');
      setFile(null);
    }
  };

  // Основная функция анализа
  const handleAnalyze = async () => {
    if (!file) {
      setError('Илтимос, файл юкланг!');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const text = await extractTextFromFile(file);
      const author = extractAuthor(text);
      const { description, issues } = analyzeTextContent(text);

      setResult({
        author,
        description,
        issues
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper
            elevation={3}
            sx={{
              p: isMobile ? 2 : 3,
              width: '100%',
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              align="center"
              gutterBottom
              sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 1 }}
            >
              Диссертация таҳлилчи
            </Typography>
            <Typography
              variant="body2"
              align="center"
              sx={{ mb: 2, color: theme.palette.text.secondary }}
            >
              Автоматик таҳлил учун диссертация файлини юкланг (.txt, .pdf, .doc, .docx)
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 2, justifyContent: 'center' }}>
              {/* Файл юклаш бўлими */}
              <label htmlFor="dissertationFile">
                <Input
                  accept=".txt,.pdf,.doc,.docx"
                  id="dissertationFile"
                  type="file"
                  onChange={handleFileChange}
                />
                <UploadButton
                  variant="contained"
                  component="span"
                  startIcon={<UploadFileIcon />}
                  size="small"
                >
                  {file ? 'Файлни ўзгартириш' : 'Файлни юкланг'}
                </UploadButton>
              </label>

              {/* Таҳлил тугмаси */}
              <AnalyzeButton
                variant="contained"
                color="primary"
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
                size="small"
              >
                {isAnalyzing ? (
                  <>
                    <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                    Таҳлил...
                  </>
                ) : (
                  'Таҳлил қилиш'
                )}
              </AnalyzeButton>
            </Box>

            {file && (
              <Typography
                variant="body2"
                align="center"
                sx={{ color: theme.palette.text.secondary, mb: 1 }}
              >
                Танланган файл: {file.name}
              </Typography>
            )}

            {/* Хатолик хабарномаси */}
            {error && (
              <Fade in={!!error}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Таҳлил натижалари */}
            {result && (
              <Fade in={!!result}>
                <ResultCard>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                      Таҳлил натижалари
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: theme.palette.text.primary }}>
                      {result.author
                        ? `Қадрли ${result.author}, диссертациянгизнинг таҳлил натижалари:`
                        : 'Қадрли докторант, диссертациянгизнинг таҳлил натижалари:'}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
                      {/* Тавсиф бўлими */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: theme.palette.primary.main }}>
                          Ҳужжат хусусиятлари
                        </Typography>
                        <Box sx={{ pl: 1, fontSize: '0.9rem' }}>
                          <Typography variant="body2">
                            <strong>Матн ҳажми:</strong> {result.description.wordCount} сўз, {result.description.charCount} белги
                          </Typography>
                          <Typography variant="body2">
                            <strong>Параграфлар:</strong> {result.description.paragraphs}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Калит сўзлар:</strong>{' '}
                            {result.description.foundKeywords.length > 0 ? (
                              <Box sx={{ display: 'inline-flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {result.description.foundKeywords.map((kw, index) => (
                                  <Chip
                                    key={index}
                                    label={kw}
                                    size="small"
                                    sx={{
                                      height: '20px',
                                      fontSize: '0.7rem',
                                      bgcolor: theme.palette.primary.light,
                                      color: theme.palette.primary.main
                                    }}
                                  />
                                ))}
                              </Box>
                            ) : (
                              'Аникланмади'
                            )}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Кириш:</strong> {result.description.hasIntroduction ? 'Мавжуд ✓' : 'Йўқ ✗'}
                            {' | '}
                            <strong>Якун:</strong> {result.description.hasConclusion ? 'Мавжуд ✓' : 'Йўқ ✗'}
                            {' | '}
                            <strong>Адабиётлар:</strong> {result.description.hasReferences ? 'Мавжуд ✓' : 'Йўқ ✗'}
                          </Typography>
                        </Box>
                      </Box>

                      {!isMobile && <Divider orientation="vertical" flexItem />}
                      {isMobile && <Divider sx={{ my: 1 }} />}

                      {/* Нуқсонлар бўлими */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: theme.palette.primary.main }}>
                          Аникланган нуқсонлар
                        </Typography>
                        <List dense disablePadding>
                          {result.issues.length > 0 ? (
                            result.issues.map((issue, index) => (
                              <ListItem key={index} sx={{ py: 0.5, pl: 1 }}>
                                <ListItemText
                                  primary={issue}
                                  primaryTypographyProps={{
                                    color: theme.palette.error.main,
                                    fontSize: '0.85rem'
                                  }}
                                />
                              </ListItem>
                            ))
                          ) : (
                            <ListItem sx={{ pl: 1 }}>
                              <ListItemText
                                primary="Қаторий нуқсонлар аникланмади."
                                primaryTypographyProps={{
                                  color: theme.palette.success.main,
                                  fontSize: '0.85rem'
                                }}
                              />
                            </ListItem>
                          )}
                        </List>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 1, pl: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>
                        <strong>Қисқача тавсиф:</strong> {result.description.summary}
                      </Typography>
                    </Box>
                  </CardContent>
                </ResultCard>
              </Fade>
            )}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;