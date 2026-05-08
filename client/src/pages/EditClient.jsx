import { useState, useEffect } from 'react';
import { UserCheck, Save, ArrowLeft, ChevronRight } from 'lucide-react';

const CascadingDropdowns = ({ options, value, onChange, label }) => {
    const selections = typeof value === 'string' ? value.split(' > ') : [];
    const handleSelect = (depth, selectedLabel) => {
        const newSelections = selections.slice(0, depth);
        if (selectedLabel) newSelections.push(selectedLabel);
        onChange(newSelections.join(' > '));
    };
    const renderDropdowns = (currentOptions, depth = 0) => {
        if (!currentOptions || currentOptions.length === 0) return null;
        const currentSelection = selections[depth] || '';
        const selectedOpt = currentOptions.find(o => o.label === currentSelection);
        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                        {depth === 0 ? label : `Sub-option for ${selections[depth-1]}`}
                    </label>
                    <select
                        value={currentSelection}
                        onChange={(e) => handleSelect(depth, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                        <option value="">Select Option</option>
                        {currentOptions.map((opt, i) => (
                            <option key={i} value={opt.label}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                {selectedOpt && selectedOpt.children && selectedOpt.children.length > 0 && (
                    <div className="animate-in slide-in-from-top-1 duration-200">
                        {renderDropdowns(selectedOpt.children, depth + 1)}
                    </div>
                )}
            </div>
        );
    };
    return renderDropdowns(options);
};

import { useNavigate, useParams } from 'react-router-dom';

const EditClient = () => {
    const [fieldConfigs, setFieldConfigs] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:5000/api/fields').then(res => res.json()),
            fetch(`http://localhost:5000/api/clients`).then(res => res.json())
        ]).then(([fieldsData, clientsData]) => {
            setFieldConfigs(fieldsData);
            const client = clientsData.find(c => c._id === id);
            if (client) {
                setFormData(client.data);
            }
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [id]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert('Client updated successfully!');
                navigate('/clients');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading client data...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <UserCheck className="text-blue-500" />
                        Edit Client
                    </h1>
                </div>
            </header>

            <form 
                onSubmit={handleSubmit} 
                autoComplete="off"
                className="bg-gray-900 border border-gray-800 rounded-3xl p-6 lg:p-10 shadow-2xl space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fieldConfigs.map((field, index) => {
                        const fieldName = field.name || `field_${index}`;
                        return (
                            <div key={field._id || index} className={`space-y-2 ${field.type === 'select' ? 'md:col-span-2' : ''}`}>
                                <label className="text-sm font-semibold text-gray-300">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>
                                
                                {field.type === 'select' ? (
                                    <select
                                        required={field.required}
                                        value={formData[fieldName] || ''}
                                        onChange={(e) => handleChange(fieldName, e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    >
                                        <option value="">Select {field.label}</option>
                                        {field.options?.map((opt, i) => (
                                            <option key={i} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : field.type === 'nested_select' ? (
                                    <div className="md:col-span-2 bg-gray-950/30 p-4 rounded-2xl border border-gray-800/50">
                                        <CascadingDropdowns 
                                            options={field.nestedOptions}
                                            value={formData[fieldName] || ''}
                                            onChange={(val) => handleChange(fieldName, val)}
                                            label={field.label}
                                        />
                                    </div>
                                ) : (

                                    <input
                                        type={field.type}
                                        required={field.required}
                                        name={fieldName}
                                        value={formData[fieldName] || ''}
                                        onChange={(e) => handleChange(fieldName, e.target.value)}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="pt-6 border-t border-gray-800">
                    <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Save size={22} />
                        Update Client
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditClient;
