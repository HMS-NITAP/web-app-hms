import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';
import { getRoutesForUser, SIDEBAR_COLLAPSED_KEY } from '../../config/config';
import NavItems from './NavItems';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true',
  );

  const { token } = useSelector((state) => state.Auth);
  const { user } = useSelector((state) => state.Profile);

  const location = useLocation();
  const navigate = useNavigate();

  if (!token || !user) return null;

  const toggleCollapsed = () => {
    setCollapsed((previous) => {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(!previous));
      return !previous;
    });
  };

  const routeHandler = (route) => {
    if (route.path === location.pathname) return;
    navigate(route.path);
  };

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 h-full bg-(--chrome-bg) border-r border-white/10 text-white shadow-md transition-[width] duration-200 ${
        collapsed ? 'w-18' : 'w-68'
      }`}
    >
      <div
        style={{ height: 'var(--header-height)' }}
        className={`flex items-center shrink-0 border-b border-white/10 ${collapsed ? 'justify-center px-0' : 'px-[1.15rem]'}`}
      >
        {!collapsed && <span className="font-bold text-yellow-400 text-lg whitespace-nowrap">HMS NIT AP</span>}
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`p-2 rounded text-white/70 hover:text-white hover:bg-white/10 cursor-pointer transition-colors duration-150 ${
            collapsed ? '' : 'ml-auto'
          }`}
        >
          {collapsed ? <FaAnglesRight /> : <FaAnglesLeft />}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-1">
        <NavItems
          routes={getRoutesForUser(token, user)}
          pathname={location.pathname}
          onSelect={routeHandler}
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
