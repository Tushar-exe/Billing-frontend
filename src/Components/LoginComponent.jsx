//add dummy code 
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input } from 'antd';
// import '../Custom_css/LoginComponent.css'; 
import { useAuth } from '../AuthContext';
import axios from 'axios';
import { Spinner, Toast } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading,setLoading] = useState(false);
        const base_url = process.env.REACT_APP_BACKEND_URL;

    const handleLogin = () => {
        setLoading(true);
        if(username==='admin'&& password==='admin') {
            toast.success("Login successful");
            login();
            setLoading(false);
            navigate('/home');
        }
    //     if(username !== '' && password !== '') {}
    //         axios.post(`${base_url}/auth/login/`, {
    //         username: username,
    //         password: password
    //         })
    //         .then(response => {
    //             console.log("Login successful:", response.data);
    //             toast.success("Login successful");
    //             login();
    //             setLoading(false);
    //             navigate('/home');
                
    //         })
    //         .catch(error => {
    //             console.error("Login failed:", error);
    //             navigate('/login');
    //             toast.error("Login failed. Please check your credentials."); 
    //             setLoading(false);  
    //         });            
    //     } 
    };
    
    return (
        <div>
            {/* {loading && (
        <div className="text-center mt-10">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2">Signing in... Please wait</div>
        </div>
      )} */}
            <div className='animated-container mt-5'>
                <div style={{ height:'350px' , width:'350px', margin: '80px auto', border: '1px solid #ccc', padding: 32, borderRadius: 8, backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Login</h2>
            <Form layout="vertical" onFinish={handleLogin}>
                <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </Form.Item>
            </Form>
            </div>
        </div>
        
        <ToastContainer/>
        
        </div>
        
    );
}
export default LoginComponent;

