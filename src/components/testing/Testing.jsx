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

// pdf.js worker-ини инициализациялаш
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
        throw new Error('Қўллаб-қувватланмаган файл формати');
      }
    } catch (err) {
      throw new Error(`Файлни ўқишда хатолик: ${err.message}`);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Илтимос, файл юкланг!');
      return;
    }

    setError('');
    try {
      const text = await extractTextFromFile(file);

      // Матнни таҳлил қилиш
      const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
      const charCount = text.length;
      const paragraphs = text.split('\n\n').filter((p) => p.trim().length > 0).length;
      const hasIntroduction = /кириш|введение|introduction/i.test(text);
      const hasConclusion = /якун|заключение|conclusion/i.test(text);
      const hasReferences = /адабиётлар|литература|references|список литературы/i.test(text);
      const keywords = ['тадқиқот', 'методология', 'таҳлил', 'натижалар', 'муҳокама'];
      const foundKeywords = keywords.filter((keyword) => text.toLowerCase().includes(keyword));

      // Тавсифни шакллантириш
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

      // Камчиликларни текшириш
      const issuesList = [];
      if (wordCount < 1000) {
        issuesList.push('Матн диссертация учун жуда қисқа. Ҳажмини кўпайтириш тавсия этилади.');
      }
      if (!hasIntroduction) {
        issuesList.push('"Кириш" бўлими йўқ. Кириш қисмида тадқиқотнинг мақсади ва вазифалари аник баён этилиши керак.');
      }
      if (!hasConclusion) {
        issuesList.push('"Якун" бўлими йўқ. Якун қисмида тадқиқот натижалари хулоса қилиниши керак.');
      }
      if (!hasReferences) {
        issuesList.push('Фойдаланилган адабиётлар рўйхати йўқ. Диссертацияда ишлатилган манбаларга хаволалар бўлиши керак.');
      }
      if (foundKeywords.length < 3) {
        issuesList.push('Тадқиқотга оид калит сўзлар етарли эмас. Матнда "тадқиқот", "методология", "таҳлил" каби терминлар бўлиши керак.');
      }
      if (paragraphs < 10) {
        issuesList.push('Параграфлар сони етарли эмас. Диссертация яхши структураланган бўлиши керак.');
      }
      setIssues(issuesList);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Диссертацияни текшириш
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Диссертация файлини юкланг (.txt, .pdf, .doc, .docx):
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
          Таҳлил қилиш
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
            Таҳлил натижалари
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography><strong>Матн ҳажми:</strong> {description.wordCount} сўз, {description.charCount} белги</Typography>
            <Typography><strong>Параграфлар сони:</strong> {description.paragraphs}</Typography>
            <Typography>
              <strong>Топилган калит сўзлар:</strong>{' '}
              {description.foundKeywords.length > 0 ? description.foundKeywords.join(', ') : 'Йўқ'}
            </Typography>
            <Typography><strong>Кириш бўлими мавжудлиги:</strong> {description.hasIntroduction ? 'Ҳа' : 'Йўқ'}</Typography>
            <Typography><strong>Якун бўлими мавжудлиги:</strong> {description.hasConclusion ? 'Ҳа' : 'Йўқ'}</Typography>
            <Typography><strong>Адабиётлар рўйхати мавжудлиги:</strong> {description.hasReferences ? 'Ҳа' : 'Йўқ'}</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Камчиликлар
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
                <ListItemText primary="Камчиликлар аникланмади." />
              </ListItem>
            )}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default Testing;