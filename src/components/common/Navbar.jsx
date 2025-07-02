import React, { useState, useEffect } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaRightToBracket } from 'react-icons/fa6';
import { adminRoutes, authRoutes, officialRoutes, studentRoutes, USER_ROLES } from '../../config/config';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutModal from './LogoutModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const {token} = useSelector((state) => state.Auth);
  const {user} = useSelector((state) => state.Profile);

  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;

  const toggleDrawer = () => setIsOpen((prev) => !prev);

  const routeHandler = (route) => {
    setIsOpen(false);
    if(route.path === pathname) return;
    navigate(route.path);
  }

  const ResponsiveDrawer = ({ isOpen, onClose, children }) => {
    const [drawerWidth, setDrawerWidth] = useState('70%');
  
    useEffect(() => {
      const updateWidth = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 768) {
          setDrawerWidth('400px'); // md and above
        } else {
          setDrawerWidth('70%');   // below md
        }
      };
  
      updateWidth(); // Set initially
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }, []);
  
    return (
      <Drawer
        open={isOpen}
        onClose={onClose}
        direction="left"
        style={{ width: drawerWidth }}
        className="bg-zinc-900 text-white overflow-y-auto"
      >
        {children}
      </Drawer>
    );
  };

  return (
    <>
      <div style={{ height: 'var(--header-height)' }} className="w-full px-4 flex justify-between items-center backdrop-blur-md bg-black/40 border-b border-white/10 text-white shadow-md">
        <div className="cursor-pointer" onClick={toggleDrawer}>
          <AiOutlineMenu size={24} />
        </div>

        {
          token && user && (
            <button
              className="cursor-pointer flex items-center gap-2 text-lg font-medium tracking-wide hover:text-red-400 transition focus:outline-none"
              onClick={() => setShowLogoutModal(true)}
            >
              <FaRightToBracket size={22} />
            </button>
          )
        }
      </div>

      <ResponsiveDrawer isOpen={isOpen} onClose={toggleDrawer}>
      <div className="py-[0.5rem]">
          <h2 className="text-xl mb-4 text-blue-600 font-bold text-center">HMS NIT AP</h2>
          <div>
            {
              !token && (
                authRoutes.map((route) => {
                  if(route.hidden){
                    return null;
                  }else{
                    return (
                      <div onClick={() => routeHandler(route)} className='text-black text-[16px] flex gap-[1rem] px-[1.5rem] items-center py-[0.5rem] hover:cursor-pointer' style={{ backgroundColor: pathname === route.path ? "rgba(59, 130, 246, 0.1)" : "white"}}>
                        <div className='text-blue-600'>{route.icon}</div>
                        <div className='font-semibold'>{route.label}</div>
                      </div>
                    )
                  }
                }
                )
              )
            }

            {/* ADMIN ROUTES */}
            {
              token && user && user.accountType == USER_ROLES.ADMIN && (
                adminRoutes.map((route) => {
                  if(route.hidden){
                    return null;
                  }else{
                    return (
                      <div onClick={() => routeHandler(route)} className='text-black text-[16px] flex gap-[1rem] px-[1.5rem] items-center py-[0.5rem] hover:cursor-pointer' style={{ backgroundColor: pathname === route.path ? "rgba(59, 130, 246, 0.1)" : "white"}}>
                        <div className='text-blue-600'>{route.icon}</div>
                        <div className='font-semibold'>{route.label}</div>
                      </div>
                    )
                  }
                }
                )
              )
            }

            {/* STUDENT ROUTES */}
            {
              token && user && user.accountType == USER_ROLES.STUDENT && (
                studentRoutes.map((route) => {
                  if(route.hidden){
                    return null;
                  }else{
                    return (
                      <div onClick={() => routeHandler(route)} className='text-black text-[16px] flex gap-[1rem] px-[1.5rem] items-center py-[0.5rem] hover:cursor-pointer' style={{ backgroundColor: pathname === route.path ? "rgba(59, 130, 246, 0.1)" : "white"}}>
                        <div className='text-blue-600'>{route.icon}</div>
                        <div className='font-semibold'>{route.label}</div>
                      </div>
                    )
                  }
                }
                )
              )
            }

            {/* OFFICIAL ROUTES */}
            {
              token && user && user.accountType == USER_ROLES.OFFICIAL && (
                officialRoutes.map((route) => {
                  if(route.hidden){
                    return null;
                  }else{
                    return (
                      <div onClick={() => routeHandler(route)} className='text-black text-[16px] flex gap-[1rem] px-[1.5rem] items-center py-[0.5rem] hover:cursor-pointer' style={{ backgroundColor: pathname === route.path ? "rgba(59, 130, 246, 0.1)" : "white"}}>
                        <div className='text-blue-600'>{route.icon}</div>
                        <div className='font-semibold'>{route.label}</div>
                      </div>
                    )
                  }
                }
                )
              )
            }
            
          </div>
        </div>
      </ResponsiveDrawer>

      <LogoutModal logoutModalVisible={showLogoutModal} setLogoutModalVisible={setShowLogoutModal} />
    </>
  );
};

export default Navbar;
