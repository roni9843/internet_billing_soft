import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Settings, Menu, X, CreditCard } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Bills', path: '/bills', icon: Receipt },
        { name: 'Clients', path: '/clients', icon: CreditCard }, // Reusing CreditCard or finding a better one
        { name: 'Settings', path: '/settings', icon: Settings },

    ];


    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button 
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Backdrop for Mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-gray-950/60 backdrop-blur-md z-40 lg:hidden transition-all duration-500"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-screen bg-gray-900/95 lg:bg-gray-900 border-r border-gray-800 text-white z-40
                transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) w-72 lg:w-64 backdrop-blur-xl lg:backdrop-blur-none
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 rotate-3">
                            <Receipt size={28} className="text-white -rotate-3" />
                        </div>

                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            BillManager
                        </h1>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                    ${isActive 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 translate-x-1' 
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white hover:translate-x-1'}
                                `}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 border-t border-gray-800 bg-gray-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff" alt="User" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">Admin User</p>
                            <p className="text-xs text-gray-500 truncate">admin@example.com</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
