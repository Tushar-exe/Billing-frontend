import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import Header from './Components/Header';
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

function App() {
  return (
    <>
    <AuthProvider>
    <BrowserRouter>
        <div className="app-wrapper d-flex flex-column min-vh-100">
          <Header/>
          <Navbar/>
          <div className="d-flex flex-grow-1">
          <div className="container flex-grow-1">
            <Sidebar/>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/" element={<HomeComponent />} />
            <Route path="/associations" element={<ProtectedRoute><Association /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/users_list" element={<ProtectedRoute><User /></ProtectedRoute>} />
            <Route path="/user_form" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
            <Route path="/qos" element={<ProtectedRoute><Qos /></ProtectedRoute>} />
            <Route path="/accounts" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/ldap" element={<ProtectedRoute><Ldap /></ProtectedRoute>} />
            <Route path="/ldap/options" element={<ProtectedRoute><Ldapoptions /></ProtectedRoute>} />
            <Route path="/qos/add" element={<ProtectedRoute><AddNewQos /></ProtectedRoute>} />
            <Route path="/accounts/add" element={<ProtectedRoute><AccountWithQos /></ProtectedRoute>} />
            <Route path="/ldap_update" element={<ProtectedRoute><LdapUserUpdater /></ProtectedRoute>} />
            <Route path="/slurm/options" element={<ProtectedRoute><Slurmoptions /></ProtectedRoute>} />
            <Route path="/quick-setup" element={<ProtectedRoute><QuickUserSetup /></ProtectedRoute>} />
            <Route path="/ldap/user-ldiff" element={<ProtectedRoute><UserLdiff /></ProtectedRoute>} />
            <Route path="/ldap/group-ldiff" element={<ProtectedRoute><GroupLdiff /></ProtectedRoute>} />
            <Route path="/ldap/logs" element={<ProtectedRoute><LdapLog /></ProtectedRoute>} />
            <Route path="/ldap/uid/logs" element={<ProtectedRoute><UserUIDLog /></ProtectedRoute>} />
            <Route path="/ldap/gid/logs" element={<ProtectedRoute><UserGIDLog /></ProtectedRoute>} />
            <Route path="/slurm/slurmdbd-log" element={<ProtectedRoute><SlurmdbdLog /></ProtectedRoute>} />
            <Route path="/slurm/slurmctld-log" element={<ProtectedRoute><SlurmctldLog /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><GenerateBill /></ProtectedRoute>} />
          </Routes>
          </div>
          </div>
          <Footer/>
        </div>
    </BrowserRouter>
    </AuthProvider>
    </>
  );
}

export default App;



