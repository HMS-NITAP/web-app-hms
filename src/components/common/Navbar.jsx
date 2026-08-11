import { useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaRightToBracket } from 'react-icons/fa6';
import { getRoutesForUser } from '../../config/config';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutModal from './LogoutModal';
import NavItems from './NavItems';
import ClgLogo from '../../assets/logo/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const {token} = useSelector((state) => state.Auth);
  const {user} = useSelector((state) => state.Profile);

  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const isSidebarVisible = Boolean(token && user);

  const toggleDrawer = () => setIsOpen((prev) => !prev);

  const routeHandler = (route) => {
    setIsOpen(false);
    if(route.path === pathname) return;
    navigate(route.path);
  }

  return (
    <>
      <div style={{ height: 'var(--header-height)' }} className="relative w-full shrink-0 px-4 flex items-center bg-[var(--chrome-bg)] border-b border-white/10 text-white shadow-md">
        <div className={`cursor-pointer ${isSidebarVisible ? 'lg:hidden' : ''}`} onClick={toggleDrawer}>
          <AiOutlineMenu size={24} />
        </div>

        <img src={ClgLogo} className='absolute left-1/2 -translate-x-1/2 h-[90%]' />

        {
          token && user && (
            <button
                className="ml-auto cursor-pointer hover:scale-105 duration-200 flex items-center gap-2 text-lg font-medium tracking-wide hover:text-red-400 transition focus:outline-none"
                onClick={() => setShowLogoutModal(true)}
              >
                <FaRightToBracket size={22} />
            </button>
          )
        }
      </div>

      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="left"
        className="text-white overflow-y-auto"
        style={{ backgroundColor: 'var(--chrome-bg)' }}
      >
        <div className="py-2">
          <h2 className="text-xl mb-2 pb-2 text-yellow-400 font-bold text-center border-b border-white/10">HMS NIT AP</h2>
          <div>
            <NavItems
              routes={getRoutesForUser(token, user)}
              pathname={pathname}
              onSelect={routeHandler}
            />
          </div>
        </div>
      </Drawer>

      <LogoutModal logoutModalVisible={showLogoutModal} setLogoutModalVisible={setShowLogoutModal} />
    </>
  );
};

export default Navbar;
