import React from 'react';
import styled from 'styled-components';

// Функция для форматирования даты в формат ДД.ММ.ГГГГ
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Генерация мок-данных с динамическими датами
const generateNewsData = () => {
  const today = new Date();
  return [
    {
      id: 1,
      title: 'Новые требования к диссертациям в 2025 году',
      date: formatDate(today),
      description: 'Минобрнауки обновило требования к оформлению докторских диссертаций...',
    },
    {
      id: 2,
      title: 'Гранты для докторантов',
      date: formatDate(new Date(today.setDate(today.getDate() - 2))),
      description: 'Объявлен конкурс на получение грантов для исследований...',
    },
    {
      id: 3,
      title: 'Конференция по научным исследованиям',
      date: formatDate(new Date(today.setDate(today.getDate() - 2))),
      description: 'Приглашаем докторантов на международную конференцию...',
    },
  ];
};

// Мок-данные
const newsData = generateNewsData();

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
  margin-bottom: 20px;
  text-align: center;

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

  &:hover {
    transform: translateY(-5px);
  }
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
  return (
    <Container>
      <Header>Новости для рецензентов и докторантов</Header>
      <Grid>
        {newsData.map((news) => (
          <NewsCard key={news.id}>
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