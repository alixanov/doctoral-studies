import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
  display: 'none',
});

const App = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);

  // Проверка загрузки библиотек
  useEffect(() => {
    const checkLibraries = () => {
      if (typeof window.pdfjsLib !== 'undefined' && typeof window.mammoth !== 'undefined') {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        setLibrariesLoaded(true);
        console.log('Библиотеки pdf.js и mammoth.js загружены');
      } else {
        console.log('Ожидание загрузки библиотек...');
        setTimeout(checkLibraries, 100);
      }
    };
    checkLibraries();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log('Файл выбран:', selectedFile);
    setFile(selectedFile);
  };

  const analyzeText = (fullText) => {
    console.log('Анализ текста...');
    let author = null;
    let issues = [];
    let description = {
      wordCount: 0,
      charCount: 0,
      paragraphs: 0,
      foundKeywords: [],
      hasIntroduction: false,
      hasConclusion: false,
      hasReferences: false,
      summary: '',
    };

    // Поиск имени автора
    const authorMatch = fullText.match(/(?:Автор|Докторант|Подготовил|Имя):\s*([А-ЯЁа-яё\s]+?)(?=\s*\n|\s*$|\s*[,.])/i);
    if (authorMatch) {
      author = authorMatch[1].trim();
      console.log('Имя автора:', author);
    }

    // Описание диссертации
    const words = fullText.split(/\s+/).filter(Boolean);
    description.wordCount = words.length;
    description.charCount = fullText.length;
    description.paragraphs = fullText.split(/\n\s*\n/).filter(Boolean).length;
    description.summary = words.slice(0, 100).join(' ') + (words.length > 100 ? '...' : '');

    // Проверка ключевых слов
    const keywords = ['исследование', 'анализ', 'метод', 'результаты'];
    description.foundKeywords = keywords.filter(kw => fullText.toLowerCase().includes(kw.toLowerCase()));

    // Проверка наличия разделов
    description.hasIntroduction = fullText.toLowerCase().includes('введение');
    description.hasConclusion = fullText.toLowerCase().includes('заключение');
    description.hasReferences = fullText.toLowerCase().includes('литература') || fullText.toLowerCase().includes('источники');

    // Проверка недостатков
    if (!description.hasReferences) {
      issues.push('Отсутствует раздел ссылок или литературы.');
    }
    if (!description.hasIntroduction) {
      issues.push('Отсутствует введение.');
    }
    if (!description.hasConclusion) {
      issues.push('Отсутствует заключение.');
    }
    if (fullText.length < 1000) {
      issues.push('Текст диссертации слишком короткий.');
    }
    if (!fullText.toLowerCase().includes('методология') && !fullText.toLowerCase().includes('методы')) {
      issues.push('Отсутствует описание методологии исследования.');
    }

    setResult({ author, issues, description });
    console.log('Результаты установлены:', { author, issues, description });
    setIsAnalyzing(false);
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert('Пожалуйста, выберите файл диссертации (PDF, DOC или DOCX).');
      return;
    }
    if (!librariesLoaded) {
      alert('Библиотеки ещё не загружены. Пожалуйста, подождите.');
      return;
    }

    console.log('Кнопка "Анализировать" нажата');
    setIsAnalyzing(true);

    try {
      const fileType = file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'doc';
      let fullText = '';

      const fileReader = new FileReader();

      if (fileType === 'pdf') {
        fileReader.onload = async () => {
          try {
            console.log('Чтение PDF...');
            const typedArray = new Uint8Array(fileReader.result);
            const pdf = await window.pdfjsLib.getDocument(typedArray).promise;
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              fullText += textContent.items.map(item => item.str).join(' ') + ' ';
            }
            console.log('Текст PDF извлечён:', fullText.slice(0, 100));
            analyzeText(fullText);
          } catch (error) {
            console.error('Ошибка при обработке PDF:', error);
            alert('Ошибка при обработке PDF: ' + error.message);
            setIsAnalyzing(false);
          }
        };
        fileReader.readAsArrayBuffer(file);
      } else {
        fileReader.onload = async () => {
          try {
            console.log('Чтение DOC/DOCX...');
            const arrayBuffer = fileReader.result;
            const result = await window.mammoth.extractRawText({ arrayBuffer });
            fullText = result.value;
            console.log('Текст DOC/DOCX извлечён:', fullText.slice(0, 100));
            analyzeText(fullText);
          } catch (error) {
            console.error('Ошибка при обработке DOC/DOCX:', error);
            alert('Ошибка при обработке DOC/DOCX: ' + error.message);
            setIsAnalyzing(false);
          }
        };
        fileReader.readAsArrayBuffer(file);
      }

      fileReader.onerror = () => {
        console.error('Ошибка при чтении файла');
        alert('Ошибка при чтении файла.');
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error('Общая ошибка:', error);
      alert('Произошла ошибка: ' + error.message);
      setIsAnalyzing(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: '800px', width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Проверка диссертации
        </Typography>
        <Box sx={{ mb: 3 }}>
          <label htmlFor="dissertationFile">
            <Input accept=".pdf,.doc,.docx" id="dissertationFile" type="file" onChange={handleFileChange} />
            <Button variant="outlined" component="span" fullWidth sx={{ py: 1.5 }}>
              Загрузить диссертацию (PDF, DOC, DOCX)
            </Button>
          </label>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAnalyze}
          disabled={!file || isAnalyzing || !librariesLoaded}
          sx={{ py: 1.5 }}
        >
          {isAnalyzing ? 'Анализ...' : 'Анализировать'}
        </Button>
        {result && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Результат анализа
            </Typography>
            <Typography sx={{ mb: 2, fontWeight: 'medium' }}>
              {result.author
                ? `Уважаемый ${result.author}, вот результаты анализа вашей диссертации:`
                : 'Уважаемый докторант, вот результаты анализа вашей диссертации:'}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography><strong>Объем текста:</strong> {result.description.wordCount} слов, {result.description.charCount} символов</Typography>
              <Typography><strong>Количество параграфов:</strong> {result.description.paragraphs}</Typography>
              <Typography>
                <strong>Найденные ключевые слова:</strong>{' '}
                {result.description.foundKeywords.length > 0 ? result.description.foundKeywords.join(', ') : 'Отсутствуют'}
              </Typography>
              <Typography><strong>Наличие введения:</strong> {result.description.hasIntroduction ? 'Да' : 'Нет'}</Typography>
              <Typography><strong>Наличие заключения:</strong> {result.description.hasConclusion ? 'Да' : 'Нет'}</Typography>
              <Typography><strong>Наличие списка литературы:</strong> {result.description.hasReferences ? 'Да' : 'Нет'}</Typography>
              <Typography><strong>Краткое описание:</strong> {result.description.summary}</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Недостатки
            </Typography>
            <List>
              {result.issues.length > 0 ? (
                result.issues.map((issue, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={issue} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="Недостатки не обнаружены." />
                </ListItem>
              )}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default App;