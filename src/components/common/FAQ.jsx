import React, { useState } from 'react';
import { Input, Button, Typography, Divider } from 'antd';
import '../../css/FAQ.css'
import Navbar2 from './navbar2';

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    { question: "What is your return policy?", answer: "You can return any item within 30 days of purchase." },
    { question: "How do I track my order?", answer: "You will receive a tracking number via email once your order has shipped." },
    { question: "Do you ship internationally?", answer: "Yes, we ship to many countries worldwide." },
    { question: "What payment methods do you accept?", answer: "We accept credit cards, PayPal, and Apple Pay." }
  ];

  const featuredArticles = [
    "What's the Status of My Delivery?",
    "How to Get Help with An Delivery",
    "How to Contact a Shop",
    "How to Find the Best Delivery for You on KDOS",
    "How Do I Update My Shipping Address?",
    "Tips for Place Delivery Safely on KDOS"
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar2 />
      <div className="faq-container">
        <Typography.Title level={1} className="faq-title">How can we help?</Typography.Title>
        <Input
          placeholder="Type your question"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="faq-search-input"
        />
        <p className="faq-help-text">Having problems with an order? Reach out to the seller with a help request.</p>
        <Button type="primary" className="faq-help-button">Get help with an order</Button>

        <Divider />

        <Typography.Title level={2} className="faq-title">Frequently Asked Questions</Typography.Title>
        <div className="faq-list">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="faq-item-card">
              <Typography.Title level={4} className="faq-question">{faq.question}</Typography.Title>
              <p className="faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>

        <Divider />


        <Typography.Title level={2} className="faq-title">Featured Articles</Typography.Title>
        <div className="faq-articles">
          {featuredArticles.map((article, index) => (
            <div key={index} className="faq-article-card">
              <Typography.Title level={4} className="faq-article-title">{article}</Typography.Title>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
