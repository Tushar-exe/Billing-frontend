import { useState } from "react";
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { toast, ToastContainer } from 'react-toastify';

import "./LoginForm.css"; // Import your CSS file

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const base_url = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { username, password, rememberMe });
    setLoading(true);
    if (username === 'admin' && password === 'admin') {
      toast.success("Login successful");
      login();
      setLoading(false);
      navigate('/home');
    }
  };
  // const handleLogin = () => {
  //       setLoading(true);
  //       if(username==='admin'&& password==='admin') {
  //           toast.success("Login successful");
  //           login();
  //           setLoading(false);
  //           navigate('/home');
  //       }
  //   //     if(username !== '' && password !== '') {}
  //   //         axios.post(`${base_url}/auth/login/`, {
  //   //         username: username,
  //   //         password: password
  //   //         })
  //   //         .then(response => {
  //   //             console.log("Login successful:", response.data);
  //   //             toast.success("Login successful");
  //   //             login();
  //   //             setLoading(false);
  //   //             navigate('/home');

  //   //         })
  //   //         .catch(error => {
  //   //             console.error("Login failed:", error);
  //   //             navigate('/login');
  //   //             toast.error("Login failed. Please check your credentials."); 
  //   //             setLoading(false);  
  //   //         });            
  //   //     } 
  //   };




  return (
    <div className="login-container">
      <div className="login-bg"></div>
      <div className="login-wrapper">
            <div className="animated-container">

        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <Lock className="icon" color="white" />
            </div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your UMS account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username *</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password *</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </button>
              </div>
            </div>

            {/* <div className="form-footer">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <button type="button" className="link-button">Forgot password?</button>
            </div> */}

            <button type="submit" className="btn-primary">
              Sign In
              <ArrowRight className="arrow-icon" />
            </button>
          </form>

          {/* <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <button type="button" className="link-button">Contact Administrator</button>
            </p>
          </div> */}
        </div>
        </div>
      </div>
    </div>
    
  );
};

export default LoginForm;
