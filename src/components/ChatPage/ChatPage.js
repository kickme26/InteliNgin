import { useState, useEffect } from 'react';
import { Layout, Input, Button, message, ConfigProvider, Space } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import './ChatPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createStyles } from 'antd-style';

const { Header, Footer, Content } = Layout;

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const ChatPage = () => {
  const { name, interviewId } = useParams();
  const navigate = useNavigate();
  const { styles } = useStyle();
  const [messages, setMessages] = useState([{ text: 'Hello! Are you ready to start the interview? Just say "hi" or "let\'s go!" to begin!', sender: 'system' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [timer, setTimer] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post('http://superkingsoft.com/demo/crud_api/admin.php?action=userCompleteDetail', {
          userid: name,
        });
        const userDetails = response.data;
        const testDetails = userDetails.chat_with_AI[0];

        if (testDetails) {
          setUserData({
            userid: userDetails.name,
            level_number: testDetails.level_number,
            level_name: testDetails.level_name,
            hr_name: testDetails.hr_name,
            scheduled_time: testDetails.scheduled_time,
            skills: testDetails.skills,
            interview_detail_id: interviewId,
            interview_table: userDetails.interview_table || [],
          });
          console.log("Interview Detail ID:", interviewId);
        } else {
          throw new Error('No test details found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        message.error('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, [name, interviewId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    const setVoice = () => {
      const voices = speechSynthesis.getVoices();
      const femaleVoices = voices.filter(voice => voice.name.includes('Female'));
      
      if (femaleVoices.length > 0) {
        utterance.voice = femaleVoices[0]; // Select the first female voice
      } else {
        console.warn('No female voice found, using default.');
        utterance.voice = voices[0]; // Fallback to the first available voice
      }
    };
  
    // Check if voices are already loaded
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        setVoice();
        window.speechSynthesis.speak(utterance);
      };
    } else {
      setVoice();
      window.speechSynthesis.speak(utterance);
    }
  };
  

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, userMessage]);

      const trimmedInput = input.trim();
      setInput('');

      setIsTyping(true);
      const response = await getResponseFromBackend(trimmedInput);
      simulateTyping(response);
    }
  };

  const getResponseFromBackend = async (userInput) => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/get-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userInput, userData }),
      });
      const data = await response.json();
      return data.response || 'Sorry, there was an error processing your request.';
    } catch (error) {
      console.error('Error in fetching response:', error);
      return 'Sorry, there was an error processing your request.';
    }
  };

  const simulateTyping = (response) => {
    const typingDelay = 1000; 
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text: response, sender: 'system' }]);
      speak(response);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleFinishTest = async () => {
    if (!userData) {
      message.error('User data not available');
      return;
    }

    const chatInterviewDetail = userData.interview_table.find(interview => interview.level_name === "chat");
    if (!chatInterviewDetail) {
      message.error('No chat interview detail found');
      return;
    }

    try {
      const interviewDetailId = userData.interview_detail_id; 
      const interviewDetails = {
        userid: userData.userid,
        status: "completed",
        interview_detail_id: interviewDetailId,
        level_name: userData.level_name,
      };
      await axios.post('http://superkingsoft.com/demo/crud_api/user.php?action=updateTestStatus', interviewDetails);
      message.success('Test status updated successfully!');
      navigate(`/userhome/${name}`);
    } catch (error) {
      console.error('Error updating test status:', error);
      message.error('Failed to update test status');
    }
  };

  const formatTimer = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <Layout className="layout">
<Header className="layout-header">
  <div className="header-item header-avatar">
    <ProfileAvatar name={sessionStorage.getItem('username')} />
  </div>
  <div className="header-item header-label">
    <span className="header-label-text">Tech Talk Session</span>
  </div>
  <div className="header-item header-timer">
    <div className="timer-box">
      <span className="timer-text">{formatTimer(timer)}</span>
    </div>
  </div>
  <div className="header-item">
    <ConfigProvider button={{ className: styles.linearGradientButton }}>
      <Space>
        <Button type="primary" size="large" icon={<AntDesignOutlined />} onClick={handleFinishTest}>
          Finish Test
        </Button>
      </Space>
    </ConfigProvider>
  </div>
</Header>

      <Content className="layout-content">
        <div className="chat-background">
          <div className="floating-ball large" />
          <div className="floating-ball small" />
        </div>
        <div className="chat-container">
          <div className="chat-content">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'system-message'}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <div className="dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
          </div>
          <div className="chat-input-container">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleSend}
              placeholder="Type a message..."
              className="chat-input"
              style={{ flex: 1 }} 
            />
            <Button type="primary" onClick={handleSend} className="chat-send-button" style={{ flex: '0 0 30%' }}>
              Send
            </Button>
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        <div>AI Chat Application ©2024</div>
      </Footer>
    </Layout>
  );
};

export default ChatPage;
