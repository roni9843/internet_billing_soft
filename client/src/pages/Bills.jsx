import { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, Download } from 'lucide-react';

const Bills = () => {
    const [bills, setBills] = useState([]);

    useEffect(() => {
        // Fetch from API
        fetch('http://localhost:5000/api/bills')
            .then(res => res.json())
            .then(data => setBills(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-white">My Bills</h1>
                <div className="flex items-center gap-3">
                    <button className="p-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-colors">
                        <Download size={20} />
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2">
                        <Plus size={20} />
                        Add Bill
                    </button>
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search bills..." 
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors">
                            <Filter size={18} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Title</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Due Date</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {bills.length > 0 ? bills.map((bill) => (
                                <tr key={bill._id} className="hover:bg-gray-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-white">{bill.title}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{bill.category}</td>
                                    <td className="px-6 py-4 font-bold text-white">৳{bill.amount}</td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {new Date(bill.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            bill.status === 'Paid' 
                                            ? 'bg-green-500/10 text-green-500' 
                                            : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                            {bill.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No bills found. Create one to get started!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Bills;
