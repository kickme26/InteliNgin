import React, { useState } from 'react';
import { Layout, Input, Button } from 'antd';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import CountdownTimer from '../CountdownTimer/CountdownTimer';
import './ChatPage.css';

const { Header, Footer, Content } = Layout;

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { text: 'Welcome to the chat! How can I assist you today?', sender: 'system' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages([...messages, userMessage]);
      const response = await getResponseFromBackend(input);
      simulateTyping(response);
      setInput('');
    }
  };

  const getResponseFromBackend = async (userInput) => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/get-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userInput }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response || "Sorry, there was an error processing your request.";
    } catch (error) {
      return "Sorry, there was an error processing your request.";
    }
  };

  const simulateTyping = (response) => {
    const typingDelay = Math.min(Math.max(response.length * 50, 2000), 8000);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: '', sender: 'system', isTyping: true }
    ]);

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { text: response, sender: 'system' }
      ]);
    }, typingDelay);
  };

  return (
    <Layout className="layout">
      <Header className="layout-header">
        <div className="header-item header-timer">
          <CountdownTimer />
        </div>
        <div className="header-item header-label">
          <span className="header-label-text">Level 2: AI-Powered Tech Interview - Typing Challenges Await!</span>
        </div>
        <div className="header-item header-avatar">
          <ProfileAvatar name={sessionStorage.getItem('username')} />
        </div>
      </Header>
      <Content className="layout-content">
        <div className="chat-background">{/* This will now display the background image */}
          
          {/* Floating balls */}
          <div className="floating-ball large" />
          <div className="floating-ball small" />
        </div>
        <div className="chat-container">
          <div className="chat-content">
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'system-message'}`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
          <div className="chat-input-container">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleSend}
              placeholder="Type a message..."
              className="chat-input"
              size="large" // Larger input box
            />
            <Button
              type="primary"
              onClick={handleSend}
              className="chat-send-button"
              size="small" // Smaller button
            >
              Send
            </Button>
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>AI Chat Application ©2024</Footer>
    </Layout>
  );
};

export default ChatPage;
