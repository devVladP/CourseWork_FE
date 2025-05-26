import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Logo = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
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

const Main = styled.main`
  flex: 1;
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 24px;
`;

const NewChatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const NewChatTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const CreateButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  justify-self: start;
  
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

const ChatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ChatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ChatName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const ChatDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
`;

const ChatDetail = styled.span`
  font-size: 14px;
  color: #666;
`;

const ChatDate = styled.span`
  font-size: 12px;
  color: #999;
`;

const EmptyState = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin-top: 40px;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 4px;
  border-left: 3px solid #dc3545;
`;

const BASE_URL = 'https://localhost:7073';

const Dashboard = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    technology: '',
    grade: '',
    questionsAmount: 5
  });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

// Technology mapping for display purposes
  const technologyOptions = [
    { value: 'Java', label: 'Java' },
    { value: 'NET', label: '.NET' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'HTMLandCSS', label: 'HTML & CSS' },
    { value: 'Docker', label: 'Docker' },
    { value: 'CPlusPlus', label: 'C++' },
    { value: 'DevOps', label: 'DevOps' }
  ];

  const experienceLevelOptions = [
    { value: 'Trainee', label: 'Trainee' },
    { value: 'Junior', label: 'Junior' },
    { value: 'StrongJunior', label: 'Strong Junior' },
    { value: 'Middle', label: 'Middle' },
    { value: 'StrongMiddle', label: 'Strong Middle' },
    { value: 'Senior', label: 'Senior' }
  ];

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch(`${BASE_URL}/chats`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '6131',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'questionsAmount' ? parseInt(value) : value
    }));

    if (validationError) {
      setValidationError('');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Session name is required';
    }
    if (!formData.technology) {
      return 'Technology selection is required';
    }
    if (!formData.grade) {
      return 'Experience level selection is required';
    }
    return '';
  };

  const handleCreateChat = async (e) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }
    
    setCreating(true);
    setValidationError('');

    try {
      const response = await fetch(`${BASE_URL}/chats`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '6131',
        },
        body: JSON.stringify({
          ...formData,
          id: crypto.randomUUID()
        }),
      });

      if (response.ok) {
        await fetchChats();
        setFormData({
          name: '',
          technology: '',
          grade: '',
          questionsAmount: 5
        });
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
      setValidationError("Failed to create chat. Please try again");
    } finally {
      setCreating(false);
    }
  };

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <Header>
        <Logo>CoachAI</Logo>
        <UserMenu>
          <SignOutButton onClick={signOut}>Sign Out</SignOutButton>
        </UserMenu>
      </Header>
      
      <Main>
        <Section>
          <SectionTitle>Create New Chat</SectionTitle>
          <NewChatCard>
            <NewChatTitle>Start a new coaching session</NewChatTitle>
            <Form onSubmit={handleCreateChat}>
              <InputGroup>
                <Label>Session Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., React Interview Prep"
                  required
                />
              </InputGroup>
              
              <InputGroup>
                <Label>Technology</Label>
                <Select
                  name="technology"
                  value={formData.technology}
                  onChange={handleInputChange}
                  placeholder="e.g., React, Python, JavaScript"
                  required
                >
                  <option value="">Select technology</option>
                  {technologyOptions.map(tech => (
                    <option key={tech.value} value={tech.value}>
                      {tech.label}
                    </option>
                  ))}
                </Select>
              </InputGroup>
              
              <InputGroup>
                <Label>Experience Level</Label>
                <Select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select experience</option>
                  {experienceLevelOptions.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </Select>
              </InputGroup>
              
              <InputGroup>
                <Label>Questions Amount</Label>
                <Select
                  name="questionsAmount"
                  value={formData.questionsAmount}
                  onChange={handleInputChange}
                >
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={15}>15 questions</option>
                  <option value={20}>20 questions</option>
                </Select>
              </InputGroup>
            </Form>
             
            {validationError && (
              <ErrorMessage>{validationError}</ErrorMessage>
            )}
            
            <CreateButton type="submit" onClick={handleCreateChat} disabled={creating}>
              {creating ? 'Creating...' : 'Start Coaching Session'}
            </CreateButton>
          </NewChatCard>
        </Section>

        <Section>
          <SectionTitle>Your Coaching Sessions</SectionTitle>
          {loading ? (
            <EmptyState>Loading your sessions...</EmptyState>
          ) : chats.length > 0 ? (
            <ChatsGrid>
              {chats.map((chat) => (
                <ChatCard key={chat.id} onClick={() => handleChatClick(chat.id)}>
                  <ChatName>{chat.name}</ChatName>
                  <ChatDetails>
                    <ChatDetail><strong>Technology:</strong> {chat.technology}</ChatDetail>
                    <ChatDetail><strong>Level:</strong> {chat.grade}</ChatDetail>
                  </ChatDetails>
                  <ChatDate>Created {formatDate(chat.createdAt)}</ChatDate>
                </ChatCard>
              ))}
            </ChatsGrid>
          ) : (
            <EmptyState>
              No coaching sessions yet. Create your first session above!
            </EmptyState>
          )}
        </Section>
      </Main>
    </Container>
  );
};

export default Dashboard;