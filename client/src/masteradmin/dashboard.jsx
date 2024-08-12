import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import Sidebar from './sidebar'
import { Header } from './header'
import './sidebar.css'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
       if (!token) {
      navigate('/');
    } 
  }, []);
  
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/');
    } else {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
      setRole(decoded.role);
      if (decoded.role !== 'masteradmin') {
        navigate('/');
      }
    }
  }, []);
  return (
    <div>
      <Sidebar/>
      <Header/>
        <div>
            <div className="sidebar-content">
            <p>Username:{username}</p>
            <p>Role:{role}</p>
            </div>
        </div>
    </div>
  )
}
