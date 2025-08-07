import LoginComponent from "./LoginComponent";
import loginbg from '../Assets/loginbg.png';

const loginPageStyle = {
    minHeight: '100vh',
    width: '120%',
    background: `url(${loginbg}) center center/cover no-repeat, linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft:'-8%',
};

const LoginPage = () => (
    <div style={loginPageStyle}>
        <div className="d-flex align-items-center justify-content-center w-100" style={{ minHeight: '100vh', minWidth: '100vw' }}>
            <div className="animated-container d-flex align-items-center justify-content-center" style={{ marginTop: '-100px', width: '700px', height: '500px' }}>
                <LoginComponent />
            </div>
        </div>
    </div>
);

export { LoginPage };
