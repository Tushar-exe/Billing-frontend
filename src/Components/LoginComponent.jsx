//add dummy code 
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input } from 'antd';
// import '../Custom_css/LoginComponent.css'; 
import { useAuth } from '../AuthContext';

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const handleLogin = () => {
        if (username === 'admin' && password === 'admin') {
            login();
            navigate('/');
        } else {
            alert('Invalid credentials');
        }
    };
    
    return (
        <div className='animated-container mt-5' style={{ maxWidth: 350, margin: '80px auto', border: '1px solid #ccc', padding: 32, borderRadius: 8, backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Login</h2>
            <Form layout="vertical" onFinish={handleLogin}>
                <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
export default LoginComponent;
