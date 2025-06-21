import React, { useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { AiOutlineMenu } from 'react-icons/ai';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => setIsOpen((prev) => !prev);

  return (
    <>
      <div className="w-full h-14 px-4 flex justify-between items-center backdrop-blur-md bg-black/40 border-b border-white/10 text-white shadow-md">
        <div className="cursor-pointer" onClick={toggleDrawer}>
          <AiOutlineMenu size={24} />
        </div>

        <div className="text-lg font-medium tracking-wide">Profile</div>
      </div>

      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="left"
        className="bg-zinc-900 text-white"
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <ul className="space-y-2 text-black">
            <li className="hover:text-amber-400 cursor-pointer">Home</li>
            <li className="hover:text-amber-400 cursor-pointer">Profile</li>
            <li className="hover:text-amber-400 cursor-pointer">Settings</li>
          </ul>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
