import React from 'react';
import styled from 'styled-components';
import studey from "../../assets/AI Is Not Your Talent Strategy.jpg"
import lesson from "../../assets/ᴏꜰꜰɪᴄᴇ ɪɴᴛᴇʀɪᴏʀ.jpg"
import work from "../../assets/university.jpg"

// Функция для форматирования даты в формат ДД.ММ.ГГГГ
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Генерация данных с изображениями
const generateNewsData = () => {
  const today = new Date();
  return [
    {
      id: 1,
      title: 'Новые требования к диссертациям в 2025 году',
      date: formatDate(new Date(2025, 2, 15)), // 15 марта 2025
      description: 'Министерство образования и науки РФ опубликовало обновленные требования к оформлению докторских диссертаций, которые вступят в силу с 1 сентября 2025 года. Основные изменения касаются структуры работы, требований к уникальности текста (не менее 85%) и обязательного включения главы о практическом применении результатов исследования. Все диссертации должны быть поданы в электронном формате PDF/A с обязательной разметкой разделов.',
      image: studey,
      fullText: 'Полный текст новых требований включает 45 страниц и содержит детальные указания по оформлению каждого раздела диссертации. Особое внимание уделяется методологической части - теперь требуется четкое описание использованных методов с обоснованием их выбора. Также введены новые требования к списку литературы - не менее 60% источников должны быть опубликованы в последние 5 лет, а 30% - в международных рецензируемых журналах.'
    },
    {
      id: 2,
      title: 'Гранты для докторантов на 2025-2026 учебный год',
      date: formatDate(new Date(2025, 1, 28)), // 28 февраля 2025
      description: 'Российский научный фонд объявил о старте ежегодного конкурса на получение исследовательских грантов для докторантов. Общий фонд финансирования составляет 120 млн рублей. Гранты размером от 500 тыс. до 1,5 млн рублей будут распределены между 80 победителями. Заявки принимаются до 15 апреля 2025 года через личный кабинет на сайте фонда.',
      image: lesson,
      fullText: 'В этом году гранты будут распределены по 12 научным направлениям, причем особый акцент сделан на междисциплинарные исследования. Максимальный размер гранта (1,5 млн рублей) предусмотрен для проектов в области искусственного интеллекта и квантовых технологий. Обязательным условием является наличие публикации в журнале, индексируемом в Scopus или Web of Science. Экспертиза заявок продлится с 20 апреля по 20 июня, результаты будут объявлены 1 июля 2025 года.'
    },
    {
      id: 3,
      title: 'Международная конференция "Наука будущего"',
      date: formatDate(new Date(2025, 4, 10)), // 10 мая 2025
      description: 'С 10 по 12 сентября 2025 года в Москве пройдет VII Международная научная конференция для молодых исследователей. В программе - выступления ведущих ученых, мастер-классы по подготовке публикаций и круглые столы. Для участников предусмотрена возможность онлайн-подключения. Регистрация открыта до 1 августа.',
      image: work,
      fullText: 'Конференция соберет более 500 участников из 40 стран. Основные тематические направления: биотехнологии, наноматериалы, цифровая экономика и когнитивные науки. Планируются специальные секции для докторантов с возможностью презентации своих исследований перед международным экспертным советом. Лучшие работы будут опубликованы в сборнике конференции, индексируемом в Scopus. Организаторы предоставляют 50 грантов на покрытие расходов по проживанию для иногородних участников.'
    },
  ];
};

// Стили
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f6f5;
  min-height: 100vh;
`;

const Header = styled.h1`
  color: #143654;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const NewsCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
  }
`;

const NewsImage = styled.img`
  width: 100%;
  height: 230px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const NewsTitle = styled.h3`
  color: #143654;
  font-size: 1.5rem;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const NewsDate = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;

const NewsDescription = styled.p`
  color: #333;
  font-size: 1rem;
  line-height: 1.5;
`;

const ReviewerNews = () => {
  const newsData = generateNewsData();

  return (
    <Container>
      <Header>Новости для рецензентов и докторантов</Header>
      <Grid>
        {newsData.map((news) => (
          <NewsCard key={news.id}>
            <NewsImage src={news.image} alt={news.title} />
            <NewsTitle>{news.title}</NewsTitle>
            <NewsDate>{news.date}</NewsDate>
            <NewsDescription>{news.description}</NewsDescription>
          </NewsCard>
        ))}
      </Grid>
    </Container>
  );
};

export default ReviewerNews;
