import React from 'react'
import { FaUser } from 'react-icons/fa'
import './sidebar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './sidebar.css'

export const Header = () => {
    const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/');
    localStorage.removeItem('role')
  };
  return (
    <div style={{backgroundColor:"#eeeeee", height:'8vh'}} className='d-flex flex-column justify-content-center '>
        <div className="d-flex flex-row justify-content-around ">
            <div>
                Company name
            </div>
            <div>
                <div class="deleteButton">
                <FaUser/>
                  <div class="tooltip" onClick={handleLogout}>Logout</div>
                </div>
            </div>
        </div> 
    </div>
  )
}
