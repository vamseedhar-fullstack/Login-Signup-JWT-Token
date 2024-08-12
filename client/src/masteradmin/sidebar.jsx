import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isFeatShowVisible, setFeatShowVisible] = useState(false);
  const [isServShowVisible, setServShowVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const sidebarRef = useRef(null);

  const handleSidebarToggle = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleFeatToggle = (event) => {
    event.preventDefault();
    setFeatShowVisible(!isFeatShowVisible);
  };

  const handleServToggle = (event) => {
    event.preventDefault();
    setServShowVisible(!isServShowVisible);
  };

  const handleActiveIndex = (index) => {
    setActiveIndex(index);
    setSidebarVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="sidebar-btn" onClick={handleSidebarToggle}>
        <span className="material-symbols-outlined">menu</span>
      </div>

      <nav ref={sidebarRef} className={`sidebar-nav ${isSidebarVisible ? 'show' : ''}`}>
        <div className="sidebar-text">Master Admin</div>
        <ul>
          <li className={activeIndex === 0 ? 'active' : ''} onClick={() => handleActiveIndex(0)}>
            <div className='bigbig d-flex flex-row justify-content-start'>
                <div className='icononh'>
                    <i class="material-symbols-outlined">dashboard</i>
                </div>
                <div className='sidebarlink'>
                    <Link to="/dashboard" onClick={() => setSidebarVisible(false)} className='linklink'>Dashboard</Link>
                </div>
            </div>
          </li>
          <li>
            {/* <Link to="" className="sidebar-feat-btn" onClick={handleFeatToggle}>
              Features
              <FontAwesomeIcon icon={faCaretDown} className={`first ${isFeatShowVisible ? 'rotate' : ''}`} />
            </Link> */}
            <div className='bigbig d-flex flex-row justify-content-start'>
                <div className='icononh'>
                    <i class="material-symbols-outlined">dashboard</i>
                </div>
                <div className='sidebarlink'>
                    <Link to="#" onClick={handleFeatToggle} className='linklink'>Features <FontAwesomeIcon icon={faCaretDown} className={`first ${isFeatShowVisible ? 'rotate' : ''}`} /></Link>
                </div>
            </div>
            <ul className={`sidebar-feat-show ${isFeatShowVisible ? 'show' : ''}`}>
              <li className={activeIndex === 1 ? 'active' : ''} onClick={() => handleActiveIndex(1)}>
                <div className='bigbigg d-flex flex-row justify-content-start'>
                <div className='icononhh'>
                    <i class="material-symbols-outlined">dashboard</i>
                </div>
                <div className='sidebarlink'>
                    <Link to="/features/pages" onClick={() => setSidebarVisible(false)} className='linklink'>Pages</Link>
                </div>
            </div>
              </li>
              <li className={activeIndex === 2 ? 'active' : ''} onClick={() => handleActiveIndex(2)}>
                <a href="#" onClick={(event) => {
                  event.preventDefault();
                  setActiveIndex(2);
                  setSidebarVisible(false);
                }}>Elements</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#" className="sidebar-serv-btn" onClick={handleServToggle}>
              Services
              <FontAwesomeIcon icon={faCaretDown} className={`second ${isServShowVisible ? 'rotate' : ''}`} />
            </a>
            <ul className={`sidebar-serv-show ${isServShowVisible ? 'show1' : ''}`}>
              <li className={activeIndex === 3 ? 'active' : ''} onClick={() => handleActiveIndex(3)}>
                <a href="#" onClick={(event) => {
                  event.preventDefault();
                  setActiveIndex(3);
                  setSidebarVisible(false);
                }}>App Design</a>
              </li>
              <li className={activeIndex === 4 ? 'active' : ''} onClick={() => handleActiveIndex(4)}>
                <a href="#" onClick={(event) => {
                  event.preventDefault();
                  setActiveIndex(4);
                  setSidebarVisible(false);
                }}>Web Design</a>
              </li>
            </ul>
          </li>
          <li className={activeIndex === 5 ? 'active' : ''} onClick={() => handleActiveIndex(5)}>
            <div className='bigbig d-flex flex-row justify-content-start'>
                <div className='icononh'>
                    <i class="material-symbols-outlined">dashboard</i>
                </div>
                <div className='sidebarlink'>
                    <Link to="/Portfolio" onClick={() => setSidebarVisible(false)} className='linklink'>Portfolio</Link>
                </div>
            </div>
          </li>
          <li className={activeIndex === 6 ? 'active' : ''} onClick={() => handleActiveIndex(6)}>
            <a href="#" onClick={(event) => {
              event.preventDefault();
              setActiveIndex(6);
              setSidebarVisible(false);
            }}>Overview</a>
          </li>
          <li className={activeIndex === 7 ? 'active' : ''} onClick={() => handleActiveIndex(7)}>
            <a href="#" onClick={(event) => {
              event.preventDefault();
              setActiveIndex(7);
              setSidebarVisible(false);
            }}>Shortcuts</a>
          </li>
          <li className={activeIndex === 8 ? 'active' : ''} onClick={() => handleActiveIndex(8)}>
            <a href="#" onClick={(event) => {
              event.preventDefault();
              setActiveIndex(8);
              setSidebarVisible(false);
            }}>Feedback</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
