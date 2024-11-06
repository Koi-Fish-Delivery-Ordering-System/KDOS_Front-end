import React from 'react';
import { Card, Typography, Button, Divider, Layout, Row, Col } from 'antd';
import '../../css/news.css';
import Navbar2 from './navbar2';

const { Title, Text } = Typography;
const { Content, Sider } = Layout;

const newsArticles = [
  {
    title: "Breaking News: Koi Fish Update",
    date: "Nov 6, 2024",
    description: "Stocks continue to rise amidst economic uncertainty. Investors are closely watching the markets...",
    image: "https://tse2.mm.bing.net/th?id=OIP.9yqZqj2iVeo7-NbwS66WRAHaEz&pid=Api&P=0&h=220"
  },
  {
    title: "Technology: AI Advancements",
    date: "Nov 6, 2024",
    description: "AI continues to revolutionize the tech industry with new breakthroughs and applications...",
    image: "http://wallpapercave.com/wp/Q0saKpk.jpg"
  },
  {
    title: "Technology: AI Advancements",
    date: "Nov 6, 2024",
    description: "AI continues to revolutionize the tech industry with new breakthroughs and applications...",
    image: "https://tse4.mm.bing.net/th?id=OIP.Le2ZIpg9XTlTq6IVuE0B_QHaEm&pid=Api&P=0&h=220 "
  },
  {
    title: "Technology: AI Advancements",
    date: "Nov 6, 2024",
    description: "AI continues to revolutionize the tech industry with new breakthroughs and applications...",
    image: "https://tse4.mm.bing.net/th?id=OIP.Le2ZIpg9XTlTq6IVuE0B_QHaEm&pid=Api&P=0&h=220 "
  },
  {
    title: "Technology: AI Advancements",
    date: "Nov 6, 2024",
    description: "AI continues to revolutionize the tech industry with new breakthroughs and applications...",
    image: "https://tse4.mm.bing.net/th?id=OIP.Le2ZIpg9XTlTq6IVuE0B_QHaEm&pid=Api&P=0&h=220 "
  }
  // Add more articles as needed
];

const recentNews = [
  "Local News: Community Updates",
  "Sports: Championship Highlights",
  "Economy: Inflation Rates",
  "Health: Tips for Winter Wellness",
];

export default function NewsPage() {
  return (
    <>
      <Navbar2 />
      <Layout className="news-layout" style={{ backgroundColor: '#f0f2f5' }}>
        <Layout className="news-container" style={{ padding: '20px' }}>
          <Sider width={300} className="news-sidebar" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px' }}>
            <Title level={3} className="sidebar-title" style={{ color: '#333' }}>Recent News</Title>
            <ul className="sidebar-list">
              {recentNews.map((item, index) => (
                <li key={index}>
                  <Button type="link" className="sidebar-link" style={{ color: '#1890ff' }}>{item}</Button>
                </li>
              ))}
            </ul>
          </Sider>
          <Content className="news-content">
            <Row gutter={[16, 16]}>
              {newsArticles.map((article, index) => (
                <Col xs={24} sm={12} md={12} lg={8} key={index}>
                  <Card
                    hoverable
                    cover={<img alt={article.title} src={article.image} style={{ borderRadius: '8px' }} width={300} height={300} />}
                    className="news-card"
                    style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
                  >
                    <Title level={4} style={{ color: '#1890ff' }}>{article.title}</Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>{article.date}</Text>
                    <Divider />
                    <Text>{article.description}</Text>
                    <Button type="link" className="read-more" style={{ fontWeight: 'bold' }}>Read More</Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
