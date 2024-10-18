import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { registerUser } from '../api';

const { Title } = Typography;

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = { name, email, password };
      await registerUser(userData);
      alert('Registration successful!');
    } catch (error) {
      alert(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card">
        <Title level={3} style={{ textAlign: 'center' }}>הרשמה לחשבון חדש</Title>
        <Form
          name="register_form"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            label="שם מלא"
            name="name"
            rules={[{ required: true, message: 'אנא הזן את שמך המלא!' }]}
          >
            <Input
              type="text"
              placeholder="הזן את שמך המלא"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Item>

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
            <Button type="primary" htmlType="submit" loading={loading} className="register-button">
              הירשם
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;