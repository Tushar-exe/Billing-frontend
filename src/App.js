import { BrowserRouter, Routes, Route, redirect, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';

import Report from './Components/Report'
import User from './Components/User';
import Qos from './Components/Qos';
import Account from './Components/Account';
import Ldap from './Components/Ldap';
import UserForm from './Components/UserForm';
import AddNewQos from './Components/AddNewQos';
import Sidebar from './Components/Sidebar';
import Association from './Components/Association';
import AccountWithQos from './Components/AccountWithQos';
import LdapUserUpdater from './Components/LdapUserUpdater';

import Footer from './Components/Footer';
import Slurmoptions from './Components/Slurmoptions';
import Ldapoptions from './Components/Ldapoptions';
import QuickUserSetup from './Components/QuickUserSetup';
import UserLdiff from './Components/UserLdiff';
import GroupLdiff from './Components/GroupLdiff';
import LdapLog from './Components/Ldaplog';
import UserUIDLog from './Components/UserUidLog';
import UserGIDLog from './Components/UserGidLog';
import SlurmdbdLog from './Components/SlurmdbdLog';
import SlurmctldLog from './Components/SlurmctldLogs';
import HomeComponent from './Components/HomeComponent';
import GenerateBill from './Components/GenerateBill';
import LoginComponent from './Components/LoginComponent';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
// import { LoginPage } from './Components/LoginPage';
import LoginForm from './Components/login/LoginForm'
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



