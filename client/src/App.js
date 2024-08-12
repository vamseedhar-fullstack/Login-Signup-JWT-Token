// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import  {Superadmin}   from './superadmin/superadmin';
import { Loginpage } from './components/loginpage';
import  {Masteradmin}  from './masteradmin/masteradmin';
import  {Employee}  from './employee/employee';
import Login from './components/Login';
import { Dashboard } from './masteradmin/dashboard';


const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Loginpage/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Superadmin" element={<Superadmin/>} />
          <Route path="/employee" element={<Employee/>} />
          <Route path="/masteradmin" element={<Masteradmin/>} />
          <Route path="/Dashboard" element={<Dashboard/>} />
       </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
