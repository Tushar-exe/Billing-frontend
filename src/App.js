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

function App() {
  return (
    <>
    <BrowserRouter>
        
        <div className="app-wrapper d-flex flex-column min-vh-100">
          <Header/>
          <Navbar/>
          <div className="d-flex flex-grow-1">

          <div className="container flex-grow-1">
            <Sidebar/>
          <Routes>
          {/* Define your routes here */}
          <Route path="/"element={<HomeComponent></HomeComponent>}/>
          <Route path="/associations" element={<Association></Association>} />
          <Route path="/reports" element={<Report></Report>} />
          <Route path="/users_list" element={<User></User>} />
          <Route path="/user_form" element={<UserForm></UserForm>}/>
          <Route path="/qos" element={<Qos></Qos>}/>
          <Route path="/accounts" element={<Account></Account>}/>
          <Route path="/ldap" element={<Ldap></Ldap>}/>
          <Route path='/ldap/options'element={<Ldapoptions></Ldapoptions>}/>
          <Route path="/qos/add" element={<AddNewQos></AddNewQos>}/>
          <Route path="/accounts/add" element={<AccountWithQos></AccountWithQos>}/>
          <Route path="/ldap_update" element={<LdapUserUpdater></LdapUserUpdater>}/>
          <Route path="/slurm/options" element={<Slurmoptions></Slurmoptions>}/>
          <Route path="/quick-setup" element={<QuickUserSetup></QuickUserSetup>}/>
          <Route path='/ldap/user-ldiff'element={<UserLdiff></UserLdiff>}/>
          <Route path='/ldap/group-ldiff'element={<GroupLdiff></GroupLdiff>}/>
          <Route path='/ldap/logs'element={<LdapLog></LdapLog>}/>
          <Route path='/ldap/uid/logs' element={<UserUIDLog></UserUIDLog>}/>
          <Route path='/ldap/gid/logs' element={<UserGIDLog></UserGIDLog>}/>
          <Route path='/slurm/slurmdbd-log' element={<SlurmdbdLog></SlurmdbdLog>}/>
          <Route path='/slurm/slurmctld-log' element={<SlurmctldLog></SlurmctldLog>}/>
          <Route path='/billing' element={<GenerateBill></GenerateBill>}/>
          </Routes>
          </div>
          </div>

          <Footer/>
        </div>
    </BrowserRouter>
    </>
  );
}

export default App;



