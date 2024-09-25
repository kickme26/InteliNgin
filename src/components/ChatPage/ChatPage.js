import React, { useState } from 'react';
import { Layout, Input, Button } from 'antd';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import CountdownTimer from '../CountdownTimer/CountdownTimer';
import './ChatPage.css';

const { Header, Footer, Sider, Content } = Layout;

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { text: 'Welcome to the chat! How can I assist you today?', sender: 'system' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      console.log('Sending user message:', userMessage); // Log the message being sent
      setMessages([...messages, userMessage]);
  
      console.log('User input before fetching response:', input); // Log the user input
  
      const response = await getResponseFromBackend(input);
      console.log('Received response from backend:', response); // Log the response received
  
      simulateTyping(response);
      setInput(''); // Clear the input field
    } else {
      console.warn('Input is empty. Not sending request.'); // Log when input is empty
    }
  };
  
  // D:\Workspace\Inception\cbotapp\src\components\ChatPage\ChatPage.js
const getResponseFromBackend = async (userInput) => {
  try {
    console.log('Sending request to backend with input:', userInput); // Log the input being sent

    const response = await fetch('http://localhost:5000/api/chat/get-response', { // Ensure this URL matches the backend route
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: userInput }), // Log the request body
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Response from backend:', data); // Log the response from backend

    if (data.response) {
      return data.response; // Ensure we're returning the correct field
    } else {
      console.error('Unexpected response format:', data); // Log unexpected response formats
      return "Sorry, there was an error processing your request.";
    }
  } catch (error) {
    console.error('Error fetching response:', error); // Log any errors that occur
    return "Sorry, there was an error processing your request.";
  }
};


  const simulateTyping = (response) => {
    const typingDelay = Math.min(Math.max(response.length * 50, 2000), 8000); // 2 to 8 seconds delay
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: '', sender: 'system', isTyping: true } // Add a placeholder for typing effect
    ]);

    setTimeout(() => {
      console.log('System response displayed:', response); // Log the system's response that will be displayed
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1), // Remove the placeholder
        { text: response, sender: 'system' } // Add the actual response
      ]);
    }, typingDelay);
  };

  return (
    <Layout className="layout">
      <Sider className="layout-sider" breakpoint="lg" collapsedWidth="0">
        <div className="sidebar-menu">
          <ul>
            <li>Menu Item 1</li>
            <li>Menu Item 2</li>
            <li>Menu Item 3</li>
          </ul>
        </div>
      </Sider>
      <Layout>
        <Header className="layout-header">
          <div className="header-item header-timer">
            <CountdownTimer />  {/* Timer component */}
          </div>
          <div className="header-item header-label">
            <span className="header-label-text">Chat Page</span>
          </div>
          <div className="header-item header-avatar">
            <ProfileAvatar name={sessionStorage.getItem('username')} />
          </div>
        </Header>
        <Content className="layout-content">
          <div className="chat-container">
            <div className="chat-content">
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'system-message'} ${msg.isTyping ? 'typing' : ''}`}
                  >
                    {msg.isTyping ? 'Typing...' : msg.text}
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
              />
              <Button
                type="primary"
                onClick={handleSend}
                className="chat-send-button"
              >
                Send
              </Button>
            </div>
          </div>
        </Content>
        <Footer className="layout-footer">Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default ChatPage;
