const NavItems = ({ routes, pathname, onSelect, collapsed = false }) => {
  return routes
    .filter((route) => !route.hidden)
    .map((route, index) => {
      const isActive = pathname === route.path;
      return (
        <div
          key={index}
          onClick={() => onSelect(route)}
          title={collapsed ? route.label : undefined}
          className={`text-[15px] flex gap-[0.9rem] items-center py-[0.6rem] hover:cursor-pointer border-l-4 transition-colors duration-150 ${
            isActive
              ? 'border-yellow-400 bg-white/15 text-white font-bold'
              : 'border-transparent text-white/80 hover:bg-white/10 hover:text-white font-semibold'
          } ${collapsed ? 'justify-center px-0' : 'px-[1.15rem]'}`}
        >
          <div className={`shrink-0 ${isActive ? 'text-yellow-400' : 'text-[#caf0f8]'}`}>{route.icon}</div>
          {!collapsed && <div className="truncate">{route.label}</div>}
        </div>
      );
    });
};

export default NavItems;
