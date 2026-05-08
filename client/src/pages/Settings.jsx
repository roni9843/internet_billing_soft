import { Plus, Trash2, Save, GripVertical, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import API_BASE_URL from '../api';


const NestedOptionBuilder = ({ options, onChange, depth = 0 }) => {
    const addOption = () => {
        const newOpts = [...options, { label: '', children: [] }];
        onChange(newOpts);
    };

    const updateOption = (index, label) => {
        const newOpts = [...options];
        newOpts[index].label = label;
        onChange(newOpts);
    };

    const removeOption = (index) => {
        const newOpts = options.filter((_, i) => i !== index);
        onChange(newOpts);
    };

    const updateChildren = (index, children) => {
        const newOpts = [...options];
        newOpts[index].children = children;
        onChange(newOpts);
    };

    return (
        <div className={`space-y-3 ${depth > 0 ? 'ml-6 pl-4 border-l border-gray-800' : ''}`}>
            {options.map((opt, index) => (
                <div key={index} className="space-y-3">
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={opt.label}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Level ${depth + 1} Option`}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                        />
                        <button 
                            onClick={() => removeOption(index)}
                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    
                    <div className="ml-2">
                        <NestedOptionBuilder 
                            options={opt.children || []} 
                            onChange={(newChildren) => updateChildren(index, newChildren)}
                            depth={depth + 1}
                        />
                        {depth < 3 && ( // Limit depth for usability
                            <button 
                                onClick={() => updateChildren(index, [...(opt.children || []), { label: '', children: [] }])}
                                className="mt-1 text-[10px] font-bold text-gray-500 hover:text-blue-400 uppercase flex items-center gap-1"
                            >
                                <Plus size={10} /> Add Sub-Option to "{opt.label || '...'}"
                            </button>
                        )}
                    </div>
                </div>
            ))}
            <button 
                onClick={addOption}
                className={`flex items-center gap-2 text-xs font-bold ${depth === 0 ? 'text-blue-500 hover:text-blue-400' : 'text-gray-400 hover:text-white'} transition-colors`}
            >
                <Plus size={14} /> Add {depth === 0 ? 'Main Option' : 'Sub-Option'}
            </button>
        </div>
    );
};


const Settings = () => {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/fields`)
            .then(res => res.json())
            .then(data => {
                setFields(data);
                setLoading(false);
            });
    }, []);

    const addField = () => {
        const newField = {
            label: '',
            name: '',
            type: 'text',
            required: false,
            options: []
        };
        setFields([...fields, newField]);
    };

    const removeField = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
    };

    const updateField = (index, key, value) => {
        const newFields = [...fields];
        newFields[index][key] = value;
        
        // Auto-generate name from label if name is empty and key is label
        if (key === 'label') {
            const baseName = value.toLowerCase().replace(/[^a-z0-9]/g, '_');
            // Only update name if it was empty or auto-generated before
            const existingName = newFields[index].name;
            if (!existingName || existingName.startsWith(baseName.substring(0, 3))) {
                newFields[index].name = baseName;
            }
        }
        
        setFields(newFields);
    };


    const addOption = (fieldIndex) => {
        const newFields = [...fields];
        if (!newFields[fieldIndex].options) newFields[fieldIndex].options = [];
        newFields[fieldIndex].options.push('');
        setFields(newFields);
    };

    const updateOption = (fieldIndex, optionIndex, value) => {
        const newFields = [...fields];
        newFields[fieldIndex].options[optionIndex] = value;
        setFields(newFields);
    };

    const removeOption = (fieldIndex, optionIndex) => {
        const newFields = [...fields];
        newFields[fieldIndex].options.splice(optionIndex, 1);
        setFields(newFields);
    };

    const handleSave = async () => {
        // Enforce unique names before saving
        const seen = new Set();
        const updatedFields = fields.map(f => {
            let baseName = f.name || 'field';
            let name = baseName;
            let counter = 1;
            while (seen.has(name)) {
                name = `${baseName}_${counter}`;
                counter++;
            }
            seen.add(name);
            return { ...f, name };
        });

        try {
            const response = await fetch(`${API_BASE_URL}/api/fields/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFields)
            });
            if (response.ok) {
                setFields(updatedFields);
                alert('Fields saved successfully with unique IDs!');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const isDuplicate = (name, index) => {
        return fields.some((f, i) => f.name === name && i !== index);
    };

    if (loading) return <div className="p-8 text-center">Loading settings...</div>;

    return (
        <div className="space-y-8 pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <SettingsIcon className="text-blue-500" />
                        Settings
                    </h1>
                    <p className="text-gray-400">Configure your dynamic client input fields.</p>
                </div>
                <button 
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-900/20"
                >
                    <Save size={20} />
                    Save & Fix Conflicts
                </button>
            </header>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 lg:p-8">
                <h2 className="text-xl font-bold mb-6">Client Input Fields Builder</h2>
                
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={index} className={`bg-gray-800/50 border ${isDuplicate(field.name, index) ? 'border-red-500' : 'border-gray-700'} rounded-2xl p-4 md:p-6 relative group animate-in slide-in-from-top-2 duration-300`}>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">Field Label</label>
                                    <input 
                                        type="text"
                                        value={field.label}
                                        onChange={(e) => updateField(index, 'label', e.target.value)}
                                        placeholder="e.g. Phone Number"
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Field ID {isDuplicate(field.name, index) && <span className="text-red-500">(Dup!)</span>}
                                    </label>
                                    <input 
                                        type="text"
                                        value={field.name}
                                        onChange={(e) => updateField(index, 'name', e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_'))}
                                        placeholder="field_id"
                                        className={`w-full bg-gray-900 border ${isDuplicate(field.name, index) ? 'border-red-500' : 'border-gray-700'} rounded-xl px-4 py-2.5 text-blue-400 text-xs font-mono outline-none`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">Type</label>
                                    <select 
                                        value={field.type}
                                        onChange={(e) => updateField(index, 'type', e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    >


                                        <option value="text">Text</option>
                                        <option value="number">Number</option>
                                        <option value="email">Email</option>
                                        <option value="select">Dropdown (Select)</option>
                                        <option value="nested_select">Nested Menu Selection</option>
                                        <option value="date">Date</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <input 
                                        type="checkbox"
                                        checked={field.required}
                                        onChange={(e) => updateField(index, 'required', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-300">Required?</span>
                                </div>
                                <div className="flex justify-end">
                                    <button 
                                        onClick={() => removeField(index)}
                                        className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {field.type === 'nested_select' && (
                                <div className="mt-6 p-6 bg-gray-950/50 rounded-2xl border border-gray-700 space-y-4">
                                    <label className="text-xs font-bold text-blue-500 uppercase tracking-widest">Nested Options Builder</label>
                                    <NestedOptionBuilder 
                                        options={field.nestedOptions || []} 
                                        onChange={(newOpts) => updateField(index, 'nestedOptions', newOpts)} 
                                    />
                                </div>
                            )}

                            {field.type === 'select' && (

                                <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 space-y-3">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Dropdown Options</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {field.options?.map((opt, optIdx) => (
                                            <div key={optIdx} className="flex gap-2">
                                                <input 
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => updateOption(index, optIdx, e.target.value)}
                                                    placeholder={`Option ${optIdx + 1}`}
                                                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm"
                                                />
                                                <button onClick={() => removeOption(index, optIdx)} className="text-gray-500 hover:text-red-400">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => addOption(index)}
                                        className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add Option
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button 
                    onClick={addField}
                    className="mt-8 w-full py-4 border-2 border-dashed border-gray-700 rounded-2xl text-gray-500 hover:text-blue-400 hover:border-blue-400/50 hover:bg-blue-400/5 transition-all flex items-center justify-center gap-2 font-bold"
                >
                    <Plus size={20} />
                    Add New Field
                </button>
            </div>
        </div>
    );
};

export default Settings;
