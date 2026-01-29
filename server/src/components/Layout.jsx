import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <div className="flex relative dark:bg-main-dark-bg">
        <div className="w-64 dark:bg-secondary-dark-bg">
          <Sidebar />
        </div>

        <div className="flex-1">
          <div className="fixed md:static navbar w-full z-50">
            <Navbar />
          </div>

          <div className="mt-16 p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
