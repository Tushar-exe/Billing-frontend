import { BrowserRouter } from 'react-router-dom';


import { AuthProvider } from './AuthContext';
// import { LoginPage } from './Components/LoginPage';
import AppLayout from './Components/AppLayout';


function App() {

  
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;



