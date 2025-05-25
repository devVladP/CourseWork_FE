import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 32px;
  font-size: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  
  &::placeholder {
    color: #999;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
  
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

const LinkText = styled.p`
  text-align: center;
  margin-top: 24px;
  color: #666;
  
  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
`;

const SuccessMessage = styled.div`
  background: #efe;
  color: #363;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
`;

const ValidationMessage = styled.div`
  background: #fff3cd;
  color: #856404;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  margin-top: 4px;
`;

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailValidation, setEmailValidation] = useState('');
  const [passwordValidation, setPasswordValidation] = useState('');
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const latinRegex = /^[a-zA-Z0-9@._-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email.length === 0) return '';
    if (email.length < 6) return 'Email must be at least 6 characters';
    if (email.length > 30) return 'Email must be less than 30 characters';
    if (!latinRegex.test(email)) return 'Email can only contain Latin characters, numbers, @, . _ -';
    if (!emailRegex.test(email)) return 'Please enter a valid email format';
    
    return '';
  };

  const validatePassword = (password) => {
    const latinRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (password.length === 0) return '';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password.length > 30) return 'Password must be less than 30 characters';
    if (!latinRegex.test(password)) return 'Password can only contain Latin characters and allowed symbols';
    if (!hasLetter) return 'Password must contain at least one letter';
    if (!hasNumber) return 'Password must contain at least one number';
    
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (confirmPassword.length === 0) return '';
    if (password && confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailValidation(validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordValidation(validatePassword(value));
    setConfirmPasswordValidation(validateConfirmPassword(confirmPassword, value));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordValidation(validateConfirmPassword(value, password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);

    if (emailError || passwordError || confirmPasswordError) {
      setError('Please fix the validation errors above');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container>
        <Card>
          <SuccessMessage>
            Account created successfully! Redirecting to sign in...
          </SuccessMessage>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Title>CoachAI</Title>
        <Subtitle>Create your account and start learning with AI coaching.</Subtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              required
            />
            {emailValidation && <ValidationMessage>{emailValidation}</ValidationMessage>}
          </InputGroup>
          
          <InputGroup>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              required
            />
            {passwordValidation && <ValidationMessage>{passwordValidation}</ValidationMessage>}
          </InputGroup>
          
          <InputGroup>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm your password"
              required
            />
            {confirmPasswordValidation && <ValidationMessage>{confirmPasswordValidation}</ValidationMessage>}
          </InputGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Form>
        
        <LinkText>
          Already have an account? <Link to="/signin">Sign in here</Link>
        </LinkText>
      </Card>
    </Container>
  );
};

export default SignUp;