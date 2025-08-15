// App.js



// import all your other components...
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Navbar from '../Components/Navbar';

import Report from '../Components/Report'
import User from '../Components/User';
import Qos from '../Components/Qos';
import Account from '../Components/Account';
import Ldap from '../Components/Ldap';
import UserForm from '../Components/UserForm';
import AddNewQos from '../Components/AddNewQos';
import Sidebar from '../Components/Sidebar';
import Association from '../Components/Association';
import AccountWithQos from '../Components/AccountWithQos';
import LdapUserUpdater from '../Components/LdapUserUpdater';

import Footer from '../Components/Footer';
import Slurmoptions from '../Components/Slurmoptions';
import Ldapoptions from '../Components/Ldapoptions';
import QuickUserSetup from '../Components/QuickUserSetup';
import UserLdiff from '../Components/UserLdiff';
import GroupLdiff from '../Components/GroupLdiff';
import LdapLog from '../Components/Ldaplog';
import UserUIDLog from '../Components/UserUidLog';
import UserGIDLog from '../Components/UserGidLog';
import SlurmdbdLog from '../Components/SlurmdbdLog';
import SlurmctldLog from '../Components/SlurmctldLogs';
import HomeComponent from '../Components/HomeComponent'
import GenerateBill from '../Components/GenerateBill';
import LoginComponent from '../Components/LoginComponent';

import ProtectedRoute from '../ProtectedRoute';
// import { LoginPage } from './Components/LoginPage';
import LoginForm from '../Components/login/LoginForm'



function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-wrapper app-container min-vh-100">
      <Navbar />

      <div className="mt-5 my-auto">
        <div>
          {/* {!isLoginPage && <Sidebar />} */}

          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/home" element={<HomeComponent />} />
            <Route path="/slurm/associations" element={<ProtectedRoute><Association /></ProtectedRoute>} />
            <Route path="/slurm/users_list" element={<ProtectedRoute><User /></ProtectedRoute>} />
            <Route path="/slurm/user_form" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
            <Route path="/slurm/qos" element={<ProtectedRoute><Qos /></ProtectedRoute>} />
            <Route path="/slurm/accounts" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/slurm/qos/add" element={<ProtectedRoute><AddNewQos /></ProtectedRoute>} />
            <Route path="/slurm/slurmdbd-log" element={<ProtectedRoute><SlurmdbdLog /></ProtectedRoute>} />
            <Route path="/slurm/slurmctld-log" element={<ProtectedRoute><SlurmctldLog /></ProtectedRoute>} />
            <Route path="/slurm/accounts/add" element={<ProtectedRoute><AccountWithQos /></ProtectedRoute>} />
            <Route path="/slurm/options" element={<ProtectedRoute><Slurmoptions /></ProtectedRoute>} />
            <Route path="/ldap" element={<ProtectedRoute><Ldap /></ProtectedRoute>} />
            <Route path="/ldap/options" element={<ProtectedRoute><Ldapoptions /></ProtectedRoute>} />
            <Route path="/ldap/users" element={<ProtectedRoute><LdapUserUpdater /></ProtectedRoute>} />
            <Route path="/quick-setup" element={<ProtectedRoute><QuickUserSetup /></ProtectedRoute>} />
            <Route path="/ldap/user-ldiff" element={<ProtectedRoute><UserLdiff /></ProtectedRoute>} />
            <Route path="/ldap/group-ldiff" element={<ProtectedRoute><GroupLdiff /></ProtectedRoute>} />
            <Route path="/ldap/logs" element={<ProtectedRoute><LdapLog /></ProtectedRoute>} />
            <Route path="/ldap/uid/logs" element={<ProtectedRoute><UserUIDLog /></ProtectedRoute>} />
            <Route path="/ldap/gid/logs" element={<ProtectedRoute><UserGIDLog /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><GenerateBill /></ProtectedRoute>} />
            <Route path="/billing/reports" element={<ProtectedRoute><Report /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AppLayout;