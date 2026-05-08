import { Users, UserPlus, Search, Trash2, MoreHorizontal } from 'lucide-react';
import API_BASE_URL from '../api';

import { Link } from 'react-router-dom';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [fieldConfigs, setFieldConfigs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`${API_BASE_URL}/api/clients`).then(res => res.json()),
            fetch(`${API_BASE_URL}/api/fields`).then(res => res.json())
        ]).then(([clientsData, fieldsData]) => {
            setClients(clientsData);
            setFieldConfigs(fieldsData);
            setLoading(false);
        });
    }, []);

    const deleteClient = async (id) => {
        if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/clients/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setClients(clients.filter(c => c._id !== id));
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading clients...</div>;

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Users className="text-blue-500" />
                        Clients
                    </h1>
                    <p className="text-gray-400">Manage your clients and their information.</p>
                </div>
                <Link 
                    to="/add-client"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                >
                    <UserPlus size={20} />
                    Add Client
                </Link>
            </header>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-gray-800">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search clients..." 
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50 text-gray-500 text-xs uppercase font-bold tracking-widest">
                            <tr>
                                {fieldConfigs.map(field => (
                                    <th key={field._id} className="px-6 py-4">{field.label}</th>
                                ))}
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {clients.length > 0 ? clients.map((client) => (
                                <tr key={client._id} className="hover:bg-gray-800/30 transition-colors group">
                                    {fieldConfigs.map(field => (
                                        <td key={field._id} className="px-6 py-4 text-gray-300 font-medium">
                                            {client.data[field.name] || '-'}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link 
                                            to={`/edit-client/${client._id}`}
                                            className="inline-flex p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                        >
                                            <Search size={18} />
                                        </Link>
                                        <button 
                                            onClick={() => deleteClient(client._id)}
                                            className="inline-flex p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={fieldConfigs.length + 1} className="px-6 py-20 text-center text-gray-500">
                                        No clients found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-800">
                    {clients.length > 0 ? clients.map((client) => (
                        <div key={client._id} className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    {fieldConfigs.slice(0, 2).map(field => (
                                        <div key={field._id}>
                                            <p className="text-[10px] uppercase font-bold text-gray-500">{field.label}</p>
                                            <p className="text-white font-semibold">{client.data[field.name] || '-'}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Link 
                                        to={`/edit-client/${client._id}`}
                                        className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"
                                    >
                                        <Search size={18} />
                                    </Link>
                                    <button 
                                        onClick={() => deleteClient(client._id)}
                                        className="p-2 bg-red-500/10 text-red-400 rounded-lg"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                {fieldConfigs.slice(2).map(field => (
                                    <div key={field._id}>
                                        <p className="text-[10px] uppercase font-bold text-gray-500">{field.label}</p>
                                        <p className="text-gray-300 text-sm truncate">{client.data[field.name] || '-'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )) : (
                        <div className="p-10 text-center text-gray-500">
                            No clients found.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Clients;
