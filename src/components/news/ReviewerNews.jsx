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

// Маълумотларни генерация қилиш
const generateNewsData = () => {
  const today = new Date();
  return [
    {
      id: 1,
      title: '2025 йилда диссертацияларга қўйиладиган янги талаблар',
      date: formatDate(new Date(2025, 2, 15)), // 15 март 2025
      description: 'РФ Таълим ва фан министрлиги 2025 йил 1 сентябрдан кучга кирадиган докторлик диссертацияларини расмийлаштириш бўйича янги талабларни эълон қилди. Асосий ўзгаришлар ишнинг тузилиши, матннинг уникаллигига (камда 85%) ва тадкиқот натижаларини амалий қўлланиши бўйича бобни мажбурий киритишга оид. Барча диссертациялар PDF/A форматида электрон тарзда тақдим этилиши керак.',
      image: studey,
      fullText: 'Янги талабларнинг тўлиқ матни 45 саҳифани ташкил этади ва диссертациянинг ҳар бир бобини расмийлаштириш бўйича батафсил кўрсатмаларни ўз ичига олади. Методологик қисмга алоҳида эътибор берилган - энди фойдаланилган усулларнинг аник тавсифи ва уларни танлашнинг асослари талаб этилади. Шунингдек, адабиётлар рўйхатига янги талаблар киритилган - камда 60% манбалар сўнгги 5 йилда, 30% эса халқаро журналларда нашр этилиши керак.'
    },
    {
      id: 2,
      title: '2025-2026 ўқув йили учун докторантларга грантлар',
      date: formatDate(new Date(2025, 1, 28)), // 28 февраль 2025
      description: 'Россия илмий фонди докторантлар учун илмий грантларни олиш бўйича йиллик танловни бошладигини эълон қилди. Жами маблағ 120 млн сўмни ташкил этади. 500 мингдан 1,5 млн сўмгача бўлган грантлар 80 та ғолиб ўртасида тақсимланади. Аризалар 2025 йил 15 апрелгача фонднинг веб-сайти орқали қабул қилинади.',
      image: lesson,
      fullText: 'Бу йил грантлар 12 та илмий йўналиш бўйича тақсимланади, айникса фанлараро тадкиқотларга алоҳида эътибор берилган. Энг катта грант микдори (1,5 млн сўм) сунъий интеллект ва квант технологиялари соҳасидаги лойиҳалар учун белгиланган. Ариза берувчининг Scopus ёки Web of Science базасига кирувчи журналда мақоласи бўлиши мажбурий шарт. Аризаларни экспертиза қилиш 20 апрельдан 20 июнгача давом этади, натижалар 2025 йил 1 июлда эълон қилинади.'
    },
    {
      id: 3,
      title: '"Келажак фанлари" халқаро конференцияси',
      date: formatDate(new Date(2025, 4, 10)), // 10 май 2025
      description: '2025 йил 10-12 сентябр кунлари Москвада ёш тадкиқотчилар учун VII Халқаро илмий конференция бўлиб ўтади. Дастурда етакчи олимларнинг маърузалари, нашрларга тайёрлаш бўйича машғулотлар ва круглый столлар кўзда тутилган. Иштирокчилар учун онлайн уланиш имконияти белгиланган. Рўйхатдан ўтиш 1 августгача давом этади.',
      image: work,
      fullText: 'Конференцияга 40 та мамлакатдан 500 дан ортик иштирокчи тўпланади. Асосий тематик йўналишлар: биотехнологиялар, наноматериаллар, рақамли иқтисод ва когнитив фанлар. Докторантлар учун халқаро экспертлар кўзгуси олдида ўз тадкиқотларини тақдим этиш имкониятини берадиган махсус секциялар ташкил этилган. Энг яхши ишлар Scopus базасига кирувчи конференция тўпламида нашр этилади. Ташкилотчилар томонидан чет эллик иштирокчилар учун 50 та грант белгиланган.'
    },
  ];
};

// Стиллар
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
      <Header>Рецензентлар ва докторантлар учун янгиликлар</Header>
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