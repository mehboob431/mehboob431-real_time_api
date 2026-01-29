import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiShopware } from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { links } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();
  const [openIndex, setOpenIndex] = useState(null); // State to track open submenu index

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  // Toggle function for individual sidebar item
  const toggleOpen = (index) => {
    if (openIndex === index) {
      setOpenIndex(null); // Close the currently open submenu
    } else {
      setOpenIndex(index); // Open the clicked submenu
    }
  };

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
              <SiShopware /> <span>ST-ServePOS</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-6 dark:text-white">
            {links.map((item, index) => (
              <div key={item.title} className="sidebar-item">
                <div className="flex justify-between items-center p-5 sidebar-title">
                  <span onClick={() => toggleOpen(index)}>
                    {item.icon && <i className={item.icon}></i>}
                    {item.title}
                  </span>
                  <i className="bi-chevron-down toggle-btn" onClick={() => toggleOpen(index)}></i>
                </div>
                {openIndex === index && (
                  // Render submenu only if openIndex matches current index
                  <div>
                    {item.links.map((link) => (
                      <NavLink
                        className="sidebar-content"
                        to={`/${link.name}`}
                        key={link.name}
                        onClick={handleCloseSideBar}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? currentColor : '',
                        })}
                        className={({ isActive }) => (isActive ? activeLink : normalLink)}
                      >
                        {link.icon}
                        <span className="capitalize">{link.name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )
      }
    </div >
  );
};

export default Sidebar;
