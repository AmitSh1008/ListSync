import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { loginUser } from '../api';

const { Title } = Typography;

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('amit@gmail.com');
  const [password, setPassword] = useState('Amitla100806');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = { email, password };
      const response = await loginUser(userData);
      setToken(response); // response should contain { token, userId }
      alert('Login successful!');
    } catch (error) {
      alert(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={3} style={{ textAlign: 'center' }}>התחבר לחשבון</Title>
        <Form
          name="login_form"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            label="אימייל"
            name="email"
            rules={[{ required: true, message: 'אנא הזן כתובת אימייל!' }]}
          >
            <Input
              type="email"
              placeholder="הזן את כתובת האימייל שלך"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Item>

          <Form.Item
            label="סיסמה"
            name="password"
            rules={[{ required: true, message: 'אנא הזן סיסמה!' }]}
          >
            <Input.Password
              placeholder="הזן את הסיסמה שלך"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="login-button">
              התחבר
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;