import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ChatTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin: 0;
`;

const SignOutButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Message = styled.div`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 16px 20px;
  border-radius: 20px;
  background: ${props => props.$isUser 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'rgba(255, 255, 255, 0.95)'
  };
  color: ${props => props.$isUser ? 'white' : '#333'};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  line-height: 1.5;
`;

const MessageTime = styled.div`
  font-size: 12px;
  color: ${props => props.$isUser ? 'rgba(255, 255, 255, 0.8)' : '#999'};
  margin-top: 8px;
  text-align: ${props => props.$isUser ? 'right' : 'left'};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin-top: 20px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    background: white;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const LoadingBubble = styled.div`
  max-width: 70%;
  padding: 16px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #667eea;
    animation: loading 1.4s ease-in-out infinite;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
  
  @keyframes loading {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  
  h3 {
    font-size: 24px;
    margin-bottom: 8px;
    color: white;
  }
  
  p {
    font-size: 16px;
    margin-bottom: 16px;
  }
`;

const BASE_URL = 'https://localhost:7073';

const Chat = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatInfo, setChatInfo] = useState(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatInfo();
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatInfo = async () => {
    try {
      const response = await fetch(`${BASE_URL}/chats`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '6131',
        },
      });

      if (response.ok) {
        const chats = await response.json();
        const chat = chats.find(c => c.id === chatId);
        setChatInfo(chat);
      }
    } catch (error) {
      console.error('Failed to fetch chat info:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${BASE_URL}/chats/${chatId}/messages`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '6131',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const response = await fetch(`${BASE_URL}/chats/${chatId}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '6131',
        },
        body: JSON.stringify({
          answer: messageText
        }),
      });

      if (response.ok) {
        const aiResponse = await response.json();
        
        // Add user message
        const userMessage = {
          value: messageText,
          senderType: "User",
          createdAt: new Date().toISOString()
        };
        
        // Add AI response
        const aiMessage = {
          value: aiResponse.answer,
          senderType: "Ai",
          createdAt: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, userMessage, aiMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderLeft>
            <BackButton onClick={handleBack}>← Back</BackButton>
            <ChatTitle>Loading...</ChatTitle>
          </HeaderLeft>
          <SignOutButton onClick={signOut}>Sign Out</SignOutButton>
        </Header>
        <ChatContainer>
          <EmptyState>
            <p>Loading chat...</p>
          </EmptyState>
        </ChatContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={handleBack}>← Back</BackButton>
          <ChatTitle>
            {chatInfo ? `${chatInfo.name} - ${chatInfo.technology} (${chatInfo.grade})` : 'Chat'}
          </ChatTitle>
        </HeaderLeft>
        <SignOutButton onClick={signOut}>Sign Out</SignOutButton>
      </Header>
      
      <ChatContainer>
        <MessagesContainer>
          {messages.length === 0 && !sending ? (
            <EmptyState>
              <h3>Start Your Coaching Session</h3>
              <p>Ask a question or share what you'd like to learn about {chatInfo?.technology}!</p>
            </EmptyState>
          ) : (
            <>
              {messages.map((message, index) => (
                <Message key={index} $isUser={message.senderType === "User"}>
                  <div>
                    <MessageBubble $isUser={message.senderType === "User"}>
                      {message.value}
                    </MessageBubble>
                    <MessageTime $isUser={message.senderType === "User"}>
                      {formatTime(message.createdAt)}
                    </MessageTime>
                  </div>
                </Message>
              ))}
              
              {sending && (
                <LoadingMessage>
                  <LoadingBubble>
                    CoachAI is thinking
                    <LoadingDots>
                      <span></span>
                      <span></span>
                      <span></span>
                    </LoadingDots>
                  </LoadingBubble>
                </LoadingMessage>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        
        <form onSubmit={handleSendMessage}>
          <InputContainer>
            <MessageInput
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              disabled={sending}
            />
            <SendButton type="submit" disabled={sending || !newMessage.trim()}>
              Send
            </SendButton>
          </InputContainer>
        </form>
      </ChatContainer>
    </Container>
  );
};

export default Chat;