import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Input,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Настройка pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const Testing = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState(null);
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState('');

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
        throw new Error('Неподдерживаемый формат файла');
      }
    } catch (err) {
      throw new Error(`Ошибка при чтении файла: ${err.message}`);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Пожалуйста, загрузите файл!');
      return;
    }

    setError('');
    try {
      const text = await extractTextFromFile(file);

      // Анализ текста
      const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
      const charCount = text.length;
      const paragraphs = text.split('\n\n').filter((p) => p.trim().length > 0).length;
      const hasIntroduction = /введение|introduction/i.test(text);
      const hasConclusion = /заключение|conclusion/i.test(text);
      const hasReferences = /литература|references|список литературы/i.test(text);
      const keywords = ['исследование', 'методология', 'анализ', 'результаты', 'обсуждение'];
      const foundKeywords = keywords.filter((keyword) => text.toLowerCase().includes(keyword));

      // Формирование описания
      const desc = {
        wordCount,
        charCount,
        paragraphs,
        foundKeywords,
        hasIntroduction,
        hasConclusion,
        hasReferences,
      };
      setDescription(desc);

      // Проверка недостатков
      const issuesList = [];
      if (wordCount < 1000) {
        issuesList.push('Текст слишком короткий для диссертации. Рекомендуется увеличить объем.');
      }
      if (!hasIntroduction) {
        issuesList.push('Отсутствует раздел "Введение". Введение должно четко описывать цель и задачи исследования.');
      }
      if (!hasConclusion) {
        issuesList.push('Отсутствует раздел "Заключение". Заключение должно подводить итоги исследования.');
      }
      if (!hasReferences) {
        issuesList.push('Отсутствует список литературы. Диссертация должна содержать ссылки на использованные источники.');
      }
      if (foundKeywords.length < 3) {
        issuesList.push('Недостаточно ключевых слов, связанных с исследованием. Убедитесь, что текст включает термины, такие как "исследование", "методология", "анализ".');
      }
      if (paragraphs < 10) {
        issuesList.push('Недостаточное количество параграфов. Диссертация должна быть хорошо структурирована.');
      }
      setIssues(issuesList);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Проверка диссертации
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Загрузите диссертацию (.txt, .pdf, .doc, .docx):
        </Typography>
        <Input
          type="file"
          inputProps={{ accept: '.txt,.pdf,.doc,.docx' }}
          onChange={(e) => setFile(e.target.files[0])}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleAnalyze}
          fullWidth
          disabled={!file}
          sx={{ backgroundColor: '#173957', '&:hover': { backgroundColor: '#0f2a44' } }}
        >
          Анализировать
        </Button>
      </Box>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {description && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Результаты анализа
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography><strong>Объем текста:</strong> {description.wordCount} слов, {description.charCount} символов</Typography>
            <Typography><strong>Количество параграфов:</strong> {description.paragraphs}</Typography>
            <Typography>
              <strong>Найденные ключевые слова:</strong>{' '}
              {description.foundKeywords.length > 0 ? description.foundKeywords.join(', ') : 'Отсутствуют'}
            </Typography>
            <Typography><strong>Наличие введения:</strong> {description.hasIntroduction ? 'Да' : 'Нет'}</Typography>
            <Typography><strong>Наличие заключения:</strong> {description.hasConclusion ? 'Да' : 'Нет'}</Typography>
            <Typography><strong>Наличие списка литературы:</strong> {description.hasReferences ? 'Да' : 'Нет'}</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Недостатки
          </Typography>
          <List>
            {issues.length > 0 ? (
              issues.map((issue, index) => (
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
        </Paper>
      )}
    </Container>
  );
};

export default Testing;