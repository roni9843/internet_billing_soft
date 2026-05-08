import { useState, useEffect } from 'react';
import { TrendingUp, Receipt, Clock, CheckCircle } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        paid: 0,
        amount: 0
    });

    // Mock data for now, you can connect this to your API later
    useEffect(() => {
        setStats({
            total: 12,
            pending: 5,
            paid: 7,
            amount: 4500
        });
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-blue-500/5 group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                    <Icon size={24} className={color.replace('bg-', 'text-')} />
                </div>
                <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                    <TrendingUp size={14} /> +12%
                </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{value}</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
                    <p className="text-gray-400">Here's what's happening with your bills today.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2 w-fit">
                    <Receipt size={20} />
                    Create New Bill
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Bills" value={stats.total} icon={Receipt} color="bg-blue-500" />
                <StatCard title="Pending" value={stats.pending} icon={Clock} color="bg-yellow-500" />
                <StatCard title="Paid" value={stats.paid} icon={CheckCircle} color="bg-green-500" />
                <StatCard title="Total Amount" value={`৳${stats.amount}`} icon={TrendingUp} color="bg-purple-500" />
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        Recent Activity
                    </h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:bg-gray-800 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Receipt size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Electricity Bill - April</p>
                                        <p className="text-xs text-gray-400">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white">৳1200</p>
                                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500">Pending</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden group shadow-2xl shadow-blue-900/20">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-4">Upgrade to Pro</h2>
                        <p className="text-blue-100 mb-8 leading-relaxed">Get advanced insights and manage unlimited bills with our Pro plan.</p>
                        <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                            Learn More
                        </button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <TrendingUp size={120} />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
