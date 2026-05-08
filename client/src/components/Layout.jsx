import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-gray-950 text-white">
            <Sidebar />
            <main className="flex-1 lg:ml-64 min-h-screen transition-all duration-300">
                <div className="p-4 lg:p-10 pt-20 lg:pt-10 animate-in fade-in duration-500">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default Layout;
