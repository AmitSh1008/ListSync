import React, { useState } from 'react';
import { Form, Input, Button, Typography, ConfigProvider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { loginUser, registerUser } from '../api';
import '../Styles/Authentication.css';

const { Title, Paragraph } = Typography;

function Authentication(props) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpForm] = Form.useForm();
  const [signInForm] = Form.useForm();

  // Default values for sign-up form
  const signUpInitialValues = {
    name: 'Amit',
    email: 'blah@gmail.com',
    password: 'Amitla100806'
  };

  // Default values for sign-in form
  const signInInitialValues = {
    email: 'amit@gmail.com',
    password: 'Amitla100806',
  };

  const handleSignIn = async (values) => {
    try {
      const response = await loginUser(values);
      props.setUserInfo(response);
    } catch (error) {
      alert(error.message || 'התחברות נכשלה');
    }
  };

  const handleSignUp = async (values) => {
    try {
      await registerUser(values);
      setIsSignUp(false);
    } catch (error) {
      alert(error.message || 'הרשמה נכשלה');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    signUpForm.resetFields();
    signInForm.resetFields();
  };

  return (
    <ConfigProvider direction="rtl">
      <div className="auth-container">
        <div className={`auth-card ${isSignUp ? 'sign-up-mode' : ''}`}>
          <div className="forms-container">
            <div className="signin-signup">
              <Form 
                form={signInForm} 
                onFinish={handleSignIn} 
                className={`auth-form ${isSignUp ? 'hidden' : ''}`}
                initialValues={signInInitialValues}
              >
                <Title level={2}>התחבר</Title>
                <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'אנא הכנס כתובת אימייל תקינה' }]}>
                  <Input prefix={<MailOutlined />} placeholder="אימייל" id="signin-email" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'אנא הכנס סיסמה' }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="סיסמה" id="signin-password" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="auth-button">התחבר</Button>
                </Form.Item>
              </Form>

              <Form 
                form={signUpForm} 
                onFinish={handleSignUp} 
                className={`auth-form ${isSignUp ? '' : 'hidden'}`}
                initialValues={signUpInitialValues}
              >
                <Title level={2}>צור חשבון</Title>
                <Form.Item name="name" rules={[{ required: true, message: 'אנא הכנס שם' }]}>
                  <Input prefix={<UserOutlined />} placeholder="שם" id="signup-name" />
                </Form.Item>
                <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'אנא הכנס כתובת אימייל תקינה' }]}>
                  <Input prefix={<MailOutlined />} placeholder="אימייל" id="signup-email" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, min: 8, message: 'סיסמה חייבת להכיל לפחות 8 תווים' }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="סיסמה" id="signup-password" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="auth-button">הרשם</Button>
                </Form.Item>
              </Form>
            </div>
          </div>

          <div className="panels-container">
            <div className="panel left-panel">
            <div className="content">
                <Title level={2}>כבר רשום?</Title>
                <Paragraph>התחבר כדי להמשיך את המסע שלך איתנו</Paragraph>
                <Button onClick={toggleMode} className="auth-button-ghost">התחבר</Button>
              </div>
            </div>
            <div className="panel right-panel">
              <div className="content">
                <Title level={2}>חדש כאן?</Title>
                <Paragraph>הצטרף אלינו ותתחיל את המסע שלך איתנו</Paragraph>
                <Button onClick={toggleMode} className="auth-button-ghost">הרשם</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Authentication;